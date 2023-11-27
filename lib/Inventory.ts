import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { LeapApiResponse } from "../types/LeapApiResponse";

const AVAILABLE_IDS = [14, 15];

async function fetchInventoryBetweenDates(id: number, startDate: Date, endDate?: Date) {
  if (!endDate) endDate = startDate;

  let date = new Date(startDate);
  while (date <= endDate) {
    console.log(`Fetching inventory for product ${id} on ${date.toISOString().split("T")[0]}`);
    let inv = await fetchInventory(id, date.toISOString().split("T")[0]);
    date.setDate(date.getDate() + 1);
  }
}

interface IProductAtDate {
  id: number;
  date: string;
}

async function fetchAllInventory(startDate: Date, endDate?: Date) {
  if (!endDate) endDate = startDate;

  const availableIds = AVAILABLE_IDS; // in future, fetch from db
  const chunkSize = 30; //each chunk will have 30 items due to rate limit
  const chunks: IProductAtDate[][] = [];
  const OneChunk: IProductAtDate[] = [];

  let date = new Date(startDate);
  while (date <= endDate) {
    for (const id of availableIds) {
      if (OneChunk.length === chunkSize) {
        chunks.push(structuredClone(OneChunk)); // structured clone to avoid reference issues, works above node 17
        console.log(`Chunk full with ${OneChunk.length}, pushing to chunks - now ${chunks.length} chunks`);
        OneChunk.length = 0;
      }

      OneChunk.push({ id, date: date.toISOString().split("T")[0] });
      console.log(`+ added date ${date.toISOString().split("T")[0]} for product ${id}`);
    }

    date.setDate(date.getDate() + 1);
  }
  chunks.push(OneChunk);

  const prisma = new PrismaClient();

  // fetch inventory for each chunk
  for (const chunk of chunks) {
    console.log(
      `Executing chunk of ${chunk.length} items - chuck ${chunks.indexOf(chunk) + 1} of ${chunks.length}`
    );

    let x = await Promise.all(
      chunk.map((item) => {
        console.log(`Fetching inventory for product ${item.id} on ${item.date}`);
        return fetchInventory(item.id, item.date);
      })
    );

    Promise.all(x.map((inv, i) => StoreInventory(inv, chunk[i].id, prisma)));
  }
}

async function fetchInventory(id: number, date: string): Promise<LeapApiResponse> {
  try {
    let req = await axios.get<LeapApiResponse>(
      `https://leap-api.tickete.co/api/v1/inventory/${id}?date=${date}`,
      {
        headers: {
          "x-api-key": process.env.TICKETE_API_KEY,
        },
        validateStatus: (status) => status == 429 || status < 300,
      }
    );
    if (req.status == 429) {
      // @ts-ignore
      const resetTime = req.data.rateLimitState.reset;
      const now = Date.now();
      let diff = resetTime - now;
      console.log(`Rate limited, waiting ${diff / 1000} seconds...to fetch ${id} on ${date}`);
      await new Promise((resolve) => setTimeout(resolve, diff + 5000));
      return fetchInventory(id, date);
    }

    return req.data;
  } catch (e: any) {
    console.error(`Error fetching product ${id} on ${date}`);
    // console.error(e.message);
    throw e;
  }
}

async function StoreInventory(inventory: LeapApiResponse, id: number, prisma: PrismaClient) {
  if (inventory.length === 0 || !inventory) return;

  for (const slot of inventory) {
    try {
      await prisma.slots.create({
        data: {
          startDate: new Date(slot.startDate),
          startTime: slot.startTime,
          productId: id,
          providerSlotId: slot.providerSlotId,
          paxAvailability: {
            create: slot.paxAvailability.map((pax) => {
              return {
                max: pax.max,
                min: pax.min,
                remaining: pax.remaining,
                isPrimary: pax.isPrimary,
                price: {
                  connectOrCreate: {
                    create: {
                      currency: pax.price.currencyCode,
                      finalPrice: pax.price.finalPrice,
                      originalPrice: pax.price.originalPrice,
                    },
                    where: {
                      finalPrice_originalPrice: {
                        finalPrice: pax.price.finalPrice,
                        originalPrice: pax.price.originalPrice,
                      },
                    },
                  },
                },
                content: {
                  connectOrCreate: {
                    create: {
                      type: pax.type,
                      description: pax.description,
                      name: pax.name,
                    },
                    where: {
                      type_name_description: {
                        type: pax.type,
                        name: pax.name,
                        description: pax.description,
                      },
                    },
                  },
                },
              };
            }),
          },
        },
      });
    } catch (e: any) {
      console.error(`Error storing product ${id} on ${slot.startDate}`);
      console.error(e.message);
    }
  }
}

export { fetchInventoryBetweenDates, fetchAllInventory, AVAILABLE_IDS };
