import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySchedule from "@fastify/schedule";

import prismaPlugin from "./lib/prisma";
import slotRoutes from "./routes/slots";
import syncOpsRoutes from "./routes/syncOps";
import { inventorySyncJob } from "./jobs/inventorySync";

export async function buildFastifyServer(opts: FastifyServerOptions = {}): Promise<FastifyInstance> {
  const app = fastify(opts);

  app.register(fastifyCors, {
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "*",
  });
  app.register(prismaPlugin);
  app.register(fastifySchedule);

  app.get("/test", () => ({ hello: "world" }));
  app.register(slotRoutes, { prefix: "/api/v1/experience" });
  app.register(syncOpsRoutes, { prefix: "/api/v1/sync" });

  await app.ready();

  app.scheduler.addSimpleIntervalJob(inventorySyncJob);

  return app;
}
