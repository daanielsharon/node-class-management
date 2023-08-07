import { Db, MongoClient } from "mongodb";
import { logger } from "./app/logger.ts";
import { Connection } from "./ts/types/connection.js";

class Pool {
  uri: string | null = null;
  client: MongoClient | null = null;

  async connect({ username, password, port }: Connection): Promise<void> {
    this.uri = `mongodb://${username}:${password}@localhost:${port}`;
    this.client = new MongoClient(this.uri);
    await this.client.connect();
    await this.client.db("management").command({ ping: 1 });
    logger.info(`connected to ${process.env.MONGO_DATABASE} database`);
  }

  async close() {
    this.client?.close();
  }

  query(name: string = "management"): Db {
    return this.client!.db(name);
  }
}

export const pool = new Pool();
