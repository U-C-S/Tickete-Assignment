import { FastifyInstance } from "fastify";

export default async function syncOpsRoutes(fastify: FastifyInstance) {
  fastify.get("/pause", () => {
    fastify.scheduler.stop();
    return { message: "paused" };
  });
  fastify.get("/resume", () => {
    fastify.scheduler.startById("invsync");
    return { message: "resumed" };
  });
  fastify.get("/status", () => {
    return { status: fastify.scheduler.getById("invsync").getStatus() };
  });
}
