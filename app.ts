import fastifyCors from "@fastify/cors";
import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";

import prismaPlugin from "./prisma";
import { routes } from "./routes";
import fastifySchedule from "@fastify/schedule";
import { AsyncTask, SimpleIntervalJob } from "toad-scheduler";
import { fetchAllInventory } from "./lib/Inventory";

import "dotenv/config";

export default async function appFactory(fastify: FastifyInstance) {
  const app = fastify;

  return app;
}

export async function buildFastifyServer(opts: FastifyServerOptions = {}): Promise<FastifyInstance> {
  const app = fastify(opts);

  app.register(prismaPlugin);
  app.register(fastifyCors, {
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "*",
  });
  app.register(fastifySchedule);

  app.register(routes, { prefix: "/api/v1/experience" });
  app.get("/test", () => ({ hello: "world" }));

  await app.ready();
  app.scheduler.addSimpleIntervalJob(job);
  return app;
}

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
const job = new SimpleIntervalJob({ minutes: 15 }, InventorySyncTask, { preventOverrun: true });
