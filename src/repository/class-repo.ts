import { ObjectId } from "mongodb";
import { logger } from "../app/logger.js";
import { ResponseError } from "../error/response-error.js";
import { pool } from "../pool.js";
import { ClassCreate, ClassUpdate } from "../ts/interfaces/class.js";

const classDependency = ["students", "instructors"];

class ClassRepo {
  static collection: string = "classes";

  static get() {
    try {
      const res = pool.query().collection(this.collection).find({});
      return res;
    } catch (error) {
      logger.error("get class error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static getById(id: ObjectId) {
    try {
      const res = pool.query().collection("classes").findOne({
        _id: id,
      });

      return res;
    } catch (error) {
      logger.error("get class by id error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static save({ name, room, status, notes }: ClassCreate) {
    try {
      pool.query().collection(this.collection).insertOne({
        name,
        room,
        status,
        notes,
      });
    } catch (error) {
      logger.error("create class error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static update({ id, name, room, status, notes }: ClassUpdate) {
    try {
      pool.query().collection(this.collection).updateOne(
        {
          _id: id,
        },
        {
          $set: {
            name,
            room,
            status,
            notes,
          },
        }
      );
    } catch (error) {
      logger.error("update class error", error);
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
      logger.error("delete class error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }
}

export default ClassRepo;
