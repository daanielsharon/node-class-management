import { ObjectId } from "mongodb";
import { pool } from "../pool.ts";
import { logger } from "../app/logger.ts";
import { ResponseError } from "../error/response-error.ts";

class StudentRepo {
  static collection: string = "users";

  static get() {
    try {
      const res = pool.query().collection(this.collection).find({
        role: "student",
      });
      return res;
    } catch (error) {
      logger.error("get students error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static getById(id: ObjectId) {
    try {
      const res = pool.query().collection(this.collection).findOne({
        _id: id,
        role: "student",
      });

      return res;
    } catch (error) {
      logger.error("get student by id error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static getProfile() {
    try {
      const res = pool
        .query()
        .collection(this.collection)
        .aggregate([
          {
            $lookup: {
              from: "students",
              localField: "_id",
              foreignField: "student_id",
              as: "classes",
            },
          },
        ]);

      return res;
    } catch (error) {
      logger.error("get student profile", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static getProfileById(id: ObjectId) {
    try {
      const res = pool
        .query()
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              _id: id,
            },
          },
          {
            $lookup: {
              from: "students",
              localField: "_id",
              foreignField: "student_id",
              as: "classes",
            },
          },
        ]);

      return res;
    } catch (error) {
      logger.error("get profile by id", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }
}

export default StudentRepo;
