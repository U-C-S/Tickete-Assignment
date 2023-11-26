import { AVAILABLE_IDS, fetchInventoryBetweenDates } from "../lib/Inventory";
import "dotenv/config";

const today = new Date();

AVAILABLE_IDS.forEach((id) => {
  fetchInventoryBetweenDates(id, today);
});
