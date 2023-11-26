import { AVAILABLE_IDS, fetchInventoryBetweenDates } from "../lib/Inventory";
import "dotenv/config";

const today = new Date();

AVAILABLE_IDS.forEach(async (id) => {
  let today = new Date();

  let afterAMonth = new Date();
  afterAMonth.setDate(today.getDate() + 30);

  await fetchInventoryBetweenDates(id, today, afterAMonth);
});
