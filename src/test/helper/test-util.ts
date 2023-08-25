import "dotenv/config";
import { pool } from "../../pool.ts";

const randomNumber = Math.floor(Math.random() * 1_000);
const dbName = `management${randomNumber}`;

class TestPool {
  async connect() {
    pool.name = dbName;
    await pool.connect(
      process.env.MONGO_USERNAME,
      process.env.MONGO_PASSWORD,
      process.env.MONGO_PORT
    );
  }

  async disconnect() {
    await pool.close();
  }

  async drop() {
    await pool.drop();
  }
}

export const testPool = new TestPool();
