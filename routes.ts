import { FastifyInstance } from "fastify";

export async function routes(fastify: FastifyInstance) {
  fastify.get("/:id/slots", async (req, res) => {});

  fastify.get("/:id/dates", async (req, res) => {
    const { id } = req.params as { id: string };
    

  });
}
