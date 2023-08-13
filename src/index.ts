import { logger } from "./app/logger.ts";
import { app } from "./app/web.ts";
import { pool } from "./pool.ts";
import "dotenv/config";

const port: number = 8080;

pool
  .connect(
    process.env.MONGO_USERNAME,
    process.env.MONGO_PASSWORD,
    process.env.MONGO_PORT
  )
  .then(() =>
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    })
  )
  .catch((err) => logger.error(err.message));
