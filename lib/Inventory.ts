import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { LeapApiResponse } from "../types/LeapApiResponse";

const AVAILABLE_IDS = [14, 15];

async function fetchInventory(id: number, date: string) {
  try {
    let req = await axios.get(
      `https://leap-api.tickete.co/api/v1/inventory/${id}?date=${date}`,
      {
        headers: {
          "x-api-key": process.env.TICKETE_API_KEY,
        },
      }
    );
    let inventory = req.data as LeapApiResponse;
    await StoreInventory(inventory);
  } catch (e: any) {
    console.error(`Error fetching product ${id} on ${date}`);
    // console.error(e.message);
    throw e;
  }
}

async function StoreInventory(inventory: LeapApiResponse) {
  const prisma = new PrismaClient();

  if (inventory.length === 0 || !inventory) return;

  for (const slot of inventory) {
    await prisma.slots.create({
      data: {
        startDate: new Date(slot.startDate),
        startTime: slot.startTime,
        paxAvailability: {
          create: slot.paxAvailability.map((pax) => {
            return {
              max: pax.max,
              min: pax.min,
              remaining: pax.remaining,
              type: pax.type,
              description: pax.description,
              name: pax.name,
              price: {
                create: {
                  currency: pax.price.currencyCode,
                  finalPrice: pax.price.finalPrice,
                  originalPrice: pax.price.originalPrice,
                },
              },
            };
          }),
        },
      },
    });
  }
}

export { fetchInventory, AVAILABLE_IDS };
