import { buildFastifyServer } from "./app";

// IIFE
(async () => {
  let x = await buildFastifyServer({
    logger: true,
  });
  x.listen({ port: parseInt(process.env.PORT || "4000") }, (err, address) => {
    if (err) {
      console.error(err);
    }
  });
})();
