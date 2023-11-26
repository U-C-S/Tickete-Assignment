import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { LeapApiResponse } from "../types/LeapApiResponse";

const AVAILABLE_IDS = [14, 15];

async function fetchInventoryBetweenDates(
  id: number,
  startDate: Date,
  endDate?: Date
) {
  if (!endDate) endDate = startDate;

  const prisma = new PrismaClient();

  let date = new Date(startDate);
  while (date <= endDate) {
    console.log(
      `Fetching inventory for product ${id} on ${
        date.toISOString().split("T")[0]
      }`
    );
    let inv = await fetchInventory(id, date.toISOString().split("T")[0]);
    date.setDate(date.getDate() + 1);
    await StoreInventory(inv, id, prisma);
  }
}

async function fetchInventory(id: number, date: string) {
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
      console.log(
        `Rate limited, waiting ${diff / 1000} seconds...to fetch ${id} on ${date}`
      );
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

async function StoreInventory(
  inventory: LeapApiResponse,
  id: number,
  prisma: PrismaClient
) {
  if (inventory.length === 0 || !inventory) return;

  for (const slot of inventory) {
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
                    type: pax.type,
                  },
                },
              },
            };
          }),
        },
      },
    });
  }
}

export { fetchInventoryBetweenDates, AVAILABLE_IDS };
