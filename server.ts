import { buildFastifyServer } from "./app";
import "dotenv/config";

const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;
const port = parseInt(process.env.PORT || "4000");

// IIFE
(async function () {
  let server = await buildFastifyServer({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          ignore: "pid,hostname",
          translateTime: "HH:MM:ss",
        },
      },
    },
  });

  server.listen({ host, port }, (err, address) => {
    if (err) {
      console.error(err);
    }
  });
})();
