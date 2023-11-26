import { FastifyInstance } from "fastify";

export async function routes(fastify: FastifyInstance) {
  fastify.get("/:id/slots", async (req, res) => {
    const { id } = req.params as { id: string };
    const { date } = req.query as { date: string };

    let slots = await fastify.prisma.slots.findMany({
      where: {
        productId: parseInt(id),
        startDate: new Date(date),
      },
      include: {
        paxAvailability: {
          include: {
            price: true,
          },
        },
      },
    });

    return slots;
  });

  fastify.get("/:id/dates", async (req, res) => {
    const { id } = req.params as { id: string };
    const today = new Date();

    let dates = await fastify.prisma.slots.findMany({
      select: {
        startDate: true,
      },
      distinct: ["startDate"],
      where: {
        productId: parseInt(id),
        startDate: {
          gte: today,
          lte: new Date(
            today.getFullYear(),
            today.getMonth() + 2,
            today.getDate()
          ),
        },
      },
    });

    const intlx = new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      formatMatcher: "best fit",
    });

    return dates.map((date) => intlx.format(date.startDate));
  });
}
