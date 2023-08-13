import { Db, MongoClient } from "mongodb";

export interface ConnectionPool {
  uri: string | null;
  client: MongoClient | null;
  connect(
    username: string | undefined,
    password: string | undefined,
    port: string | undefined
  ): Promise<void>;
  close(): void;
  query(name: string = "management"): Db;
}
