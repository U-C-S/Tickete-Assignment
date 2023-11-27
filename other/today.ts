import { fetchAllInventory } from "../lib/Inventory";
import "dotenv/config";

const today = new Date();

fetchAllInventory(today).then(() => {
  console.log("Done");
  process.exit(0);
});
