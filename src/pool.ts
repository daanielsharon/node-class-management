import { Db, MongoClient } from "../node_modules/mongodb/mongodb";
import { logger } from "./app/logger";

type Connection = {
  username: string | undefined;
  password: string | undefined;
  port: string | undefined;
  database: string | undefined;
};

class Pool {
  uri: string | null = null;
  client: MongoClient | null = null;

  async connect({
    username,
    password,
    port,
    database,
  }: Connection): Promise<void> {
    this.uri = `mongodb+srv://${username}:${password}@localhost:${port}/${database}`;
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
