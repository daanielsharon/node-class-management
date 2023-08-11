import { ObjectId, WithId } from "mongodb";
import { pool } from "../pool.ts";
import { UserCreate, UserUpdate } from "../ts/interfaces/web/user.js";
import { logger } from "../app/logger.ts";
import { ResponseError } from "../error/response-error.ts";
import { DomainUser, DomainUserUpdate } from "../ts/interfaces/domain/user.js";

const userDependency = ["students", "instructors"];

class UserRepo {
  static collection: string = "users";

  static get() {
    try {
      const res = pool.query().collection<DomainUser>(this.collection).find({});
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
          _id: {
            $oid: id,
          },
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

  static update(user: DomainUserUpdate) {
    try {
      pool
        .query()
        .collection(this.collection)
        .updateOne(
          {
            _id: {
              $oid: user.id,
            },
          },
          {
            $set: {
              name: user.name,
            },
          }
        );
    } catch (error) {
      logger.error("update user error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async delete(id: ObjectId) {
    try {
      await pool.query().collection(this.collection).deleteOne({
        _id: id,
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
