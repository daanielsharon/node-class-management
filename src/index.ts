import { app } from "./app/web.ts";
import { pool } from "./pool";
import "dotenv/config";

const port: number = 3000;

pool
  .connect({
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    port: process.env.MONGO_PORT,
    database: process.env.MONGO_DATABASE,
  })
  .then(() =>
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    })
  );
