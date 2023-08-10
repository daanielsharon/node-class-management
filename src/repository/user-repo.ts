import { ObjectId } from "mongodb";
import { pool } from "../pool.ts";
import { UserCreate, UserUpdate } from "../ts/interfaces/user.js";
import { logger } from "../app/logger.ts";
import { ResponseError } from "../error/response-error.ts";

const userDependency = ["students", "instructors"];
class UserRepo {
  static collection: string = "users";

  static get() {
    try {
      const res = pool.query().collection(this.collection).find({});
      return res;
    } catch (error) {
      logger.error("get users error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static getById(id: ObjectId) {
    try {
      const res = pool.query().collection(this.collection).findOne({
        _id: id,
      });

      return res;
    } catch (error) {
      logger.error("get user by id error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static getByEmail(email: string) {
    try {
      const res = pool.query().collection(this.collection).findOne({
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

  static save({ name, role, email }: UserCreate) {
    try {
      const res = pool.query().collection(this.collection).insertOne({
        name,
        role,
        email,
      });
      return res;
    } catch (error) {
      logger.error("create user error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static update(user: UserUpdate) {
    try {
      pool
        .query()
        .collection(this.collection)
        .updateOne(
          {
            _id: user.id,
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

  static delete(id: ObjectId) {
    try {
      pool.query().collection(this.collection).deleteOne({
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
