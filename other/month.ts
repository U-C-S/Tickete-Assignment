import { fetchAllInventory } from "../lib/Inventory";
import "dotenv/config";

(async () => {
  const today = new Date();

  let afterAMonth = new Date();
  afterAMonth.setDate(today.getDate() + 30);

  const startTime = new Date().getTime();
  console.log(`Started at time ${startTime}`);
  await fetchAllInventory(today, afterAMonth);
  const endTime = new Date().getTime();
  console.log(`Time taken: ${(endTime - startTime) / 1000}s`);
})();
