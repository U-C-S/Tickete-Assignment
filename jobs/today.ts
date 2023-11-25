import { AVAILABLE_IDS, fetchInventory } from "../lib/Inventory";
import "dotenv/config";

const today = new Date();

AVAILABLE_IDS.forEach((id) => {
  console.log(
    `Fetching inventory for product ${id} on ${
      today.toISOString().split("T")[0]
    }`
  );
  fetchInventory(id, today.toISOString().split("T")[0]);
});
