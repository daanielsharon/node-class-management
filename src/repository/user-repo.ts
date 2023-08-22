import { ObjectId } from "mongodb";
import { logger } from "../app/logger.ts";
import { ResponseError } from "../error/response-error.ts";
import { pool } from "../pool.ts";
import { DomainUser, DomainUserUpdate } from "../ts/types/domain/user.js";
import { UserCreate } from "../ts/types/web/user.js";
import { CurrentCollection } from "../ts/enum/collection.ts";

const userDependency = ["students", "instructors"];

class UserRepo {
  static collection: string = CurrentCollection[CurrentCollection.users];
  static async get() {
    try {
      const res = await pool
        .query()
        .collection<DomainUser>(this.collection)
        .find(
          {},
          {
            projection: {
              _id: 1,
              name: 1,
              role: 1,
              email: 1,
            },
          }
        )
        .toArray();

      return res;
    } catch (error) {
      logger.error("get users error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async getById(id: string) {
    try {
      const res = await pool
        .query()
        .collection<DomainUser>(this.collection)
        .findOne({
          _id: new ObjectId(id),
        });

      return res;
    } catch (error) {
      logger.error("get user by id error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async getByEmail(email: string) {
    try {
      const res = await pool
        .query()
        .collection<DomainUser>(this.collection)
        .findOne({
          email,
        });

      return res;
    } catch (error) {
      logger.error("get by email error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async save({ name, role, email }: UserCreate) {
    try {
      const res = await pool
        .query()
        .collection<DomainUser>(this.collection)
        .insertOne({
          name,
          role,
          email,
          created_at: new Date(),
          updated_at: new Date(),
        });
      return res;
    } catch (error) {
      logger.error("create user error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async update(user: DomainUserUpdate) {
    try {
      const res = await pool
        .query()
        .collection(this.collection)
        .updateOne(
          {
            _id: new ObjectId(user.id),
          },
          {
            $set: {
              name: user.name,
            },
          }
        );
      return res;
    } catch (error) {
      logger.error("update user error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async delete(id: string) {
    try {
      await pool
        .query()
        .collection(this.collection)
        .deleteOne({
          _id: new ObjectId(id),
        });
    } catch (error) {
      logger.error("delete user error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }
}

export default UserRepo;
