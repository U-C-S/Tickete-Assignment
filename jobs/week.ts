import { AVAILABLE_IDS, fetchAllInventory, fetchInventoryBetweenDates } from "../lib/Inventory";
import "dotenv/config";

let today = new Date();

let afterAWeek = new Date();
afterAWeek.setDate(today.getDate() + 7);

fetchAllInventory(today, afterAWeek);
