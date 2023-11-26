import { FastifyServerOptions } from "fastify";
import { buildFastifyServer } from "./app";

// let serverOpts: FastifyServerOptions = {
//   logger: {
//     info: ,
//   },
// };

// server
buildFastifyServer().listen(
  { port: parseInt(process.env.PORT || "4000") },
  (err, address) => {
    if (err) {
      console.error(err);
    }
  }
);
