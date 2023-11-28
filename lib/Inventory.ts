import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { ISlotLeapResponse, LeapApiResponse } from "../types/LeapApiResponse";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const AVAILABLE_IDS = [14, 15];

interface IProductAtDate {
  id: number;
  date: string;
}

const prisma = new PrismaClient();

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
        OneChunk.length = 0;
      }

      OneChunk.push({ id, date: date.toISOString().split("T")[0] });
    }

    date.setDate(date.getDate() + 1);
  }

  chunks.push(OneChunk);

  for (const chunk of chunks) {
    console.log(`✨ Executing ${chunks.indexOf(chunk) + 1} of ${chunks.length} chunks...`);

    await Promise.all(
      chunk.map(async (item) => {
        let inv = await fetchInventory(item.id, item.date);
        return StoreInventory(inv, item.id, prisma);
      })
    );
  }
}

async function fetchInventory(id: number, date: string): Promise<LeapApiResponse> {
  try {
    console.log(`--> Fetching inventory for product ${id} on ${date}`);

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

      console.log(`--> ⚠️ Rate limited; waiting ${diff / 1000} seconds...to fetch ${id} ${date}`);
      await new Promise((resolve) => setTimeout(resolve, diff + 2000)); // add 2sec to be safe

      return fetchInventory(id, date);
    }

    return req.data;
  } catch (e: any) {
    console.error(`❌ Error fetching product ${id}-${date}`);
    throw e;
  }
}

async function StoreInventory(inventory: LeapApiResponse, id: number, prisma: PrismaClient) {
  if (inventory.length === 0 || !inventory) return;

  const StoreQuery = async (slot: ISlotLeapResponse) => {
    await prisma.slots.upsert({
      where: {
        productId_providerSlotId: {
          productId: id,
          providerSlotId: slot.providerSlotId,
        },
      },
      update: {}, //in future, update the remaining count
      create: {
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
  };

  for (const slot of inventory) {
    try {
      await StoreQuery(slot);
    } catch (e: any) {
      // Handle a race condition, hence retry the query.
      // explanation: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#remarks-17
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        console.error(`--> ❌ Failed to store product ${id}-${slot.startDate}, retrying...`);
        await StoreQuery(slot);
        console.log(`--> ✅ Stored product ${id}-${slot.startDate}`);
      } else {
        console.error(`❌ Error storing product ${id}-${slot.startDate}`);
        throw e;
      }
    }
  }
}

export { fetchAllInventory };
