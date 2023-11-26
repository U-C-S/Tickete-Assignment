import fastifyCors from "@fastify/cors";
import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";

import prismaPlugin from "./prisma";
import { routes } from "./routes";

export default async function appFactory(fastify: FastifyInstance) {
  const app = fastify;

  app.register(prismaPlugin);
  app.register(fastifyCors, {
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "*",
  });

  app.register(routes, { prefix: "/api/v1/experience" });
  app.get("/test", () => ({ hello: "world" }));

  return app;
}
export function buildFastifyServer(
  opts: FastifyServerOptions = {}
): FastifyInstance {
  const app = fastify(opts);
  app.register(appFactory);
  return app;
}
