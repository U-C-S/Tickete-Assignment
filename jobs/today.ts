import { AVAILABLE_IDS, fetchAllInventory, fetchInventoryBetweenDates } from "../lib/Inventory";
import "dotenv/config";

const today = new Date();

fetchAllInventory(today);
