import { AVAILABLE_IDS, fetchInventoryBetweenDates } from "../lib/Inventory";
import "dotenv/config";

const today = new Date();

AVAILABLE_IDS.forEach(async (id) => {
  let today = new Date();

  let afterAWeek = new Date();
  afterAWeek.setDate(today.getDate() + 7);

  await fetchInventoryBetweenDates(id, today, afterAWeek);
});
