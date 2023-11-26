import { AVAILABLE_IDS, fetchInventory } from "../lib/Inventory";
import "dotenv/config";

const today = new Date();

// fetch inventory for all next 30 days
AVAILABLE_IDS.forEach((id) => {
  for (let i = 1; i <= 30; i++) {
    let date = new Date();
    date.setDate(date.getDate() + i);
    console.log(
      `Fetching inventory for product ${id} on ${date.toISOString().split("T")[0]}`
    );
    fetchInventory(id, date.toISOString().split("T")[0]);
  }
});


