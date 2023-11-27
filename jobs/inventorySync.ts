import { AsyncTask, SimpleIntervalJob } from "toad-scheduler";
import { fetchAllInventory } from "../lib/Inventory";

let counter = 0; // store this state in db

const InventorySyncTask = new AsyncTask("DailyTask", () => {
  const today = new Date();

  counter++;

  if (counter % 96 === 0) {
    //every 24hrs
    console.log("Monthly Inventory Fetching....");

    const afterAMonth = new Date();
    afterAMonth.setDate(today.getDate() + 30);

    return fetchAllInventory(today, afterAMonth);
  } else if (counter % 16 === 0) {
    //every 4hrs
    console.log("Weekly Inventory Fetching....");

    const afterAWeek = new Date();
    afterAWeek.setDate(today.getDate() + 7);

    return fetchAllInventory(today, afterAWeek);
  } else {
    // default and runs every 15mins
    console.log("Daily Inventory Fetching....");

    return fetchAllInventory(today);
  }
});

//every 15mins
const inventorySyncJob = new SimpleIntervalJob({ minutes: 15 }, InventorySyncTask, {
  preventOverrun: true,
  id: "invsync",
});

export { inventorySyncJob };
