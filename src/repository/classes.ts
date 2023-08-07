import { ObjectId } from "mongodb";
import { logger } from "../app/logger.ts";
import { ResponseError } from "../error/response-error.ts";
import { pool } from "../pool.ts";

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
}

export default ClassRepo;
