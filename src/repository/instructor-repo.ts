import { ObjectId } from "mongodb";
import { logger } from "../app/logger.ts";
import { ResponseError } from "../error/response-error.ts";
import { pool } from "../pool.js";

class InstructorRepo {
  static collection: string = "users";

  static get() {
    try {
      const res = pool.query().collection(this.collection).find({
        role: "instructor",
      });

      return res;
    } catch (error) {
      logger.error("get instructor error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static getById(id: ObjectId) {
    try {
      const res = pool.query().collection(this.collection).findOne({
        _id: id,
        role: "instructor",
      });
      return res;
    } catch (error) {
      logger.error("get instructor by id", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }
}

export default InstructorRepo;
