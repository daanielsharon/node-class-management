import { app } from "./app/web.ts";
import { pool } from "./pool.ts";
import "dotenv/config";

const port: number = 3000;

pool
  .connect({
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    port: process.env.MONGO_PORT,
  })
  .then(() =>
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    })
  );
