import { Db, MongoClient } from "mongodb";
import { logger } from "./app/logger.ts";
import { ConnectionPool } from "./ts/interfaces/connection.js";

class Pool implements ConnectionPool {
  uri: string | null = null;
  client: MongoClient | null = null;

  async connect(
    username: string | undefined,
    password: string | undefined,
    port: string | undefined
  ): Promise<void> {
    this.uri = `mongodb://${username}:${password}@localhost:${port}`;
    this.client = new MongoClient(this.uri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 500,
    });
    await this.client.connect();
    await this.client.db("management").command({ ping: 1 });
    logger.info(`connected to ${process.env.MONGO_DATABASE} database`);
  }

  close() {
    this.client?.close();
  }

  query(name: string = "management"): Db {
    return this.client!.db(name);
  }
}

export const pool = new Pool();
