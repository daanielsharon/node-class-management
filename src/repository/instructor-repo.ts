import { ObjectId } from "mongodb";
import { logger } from "../app/logger.ts";
import { ResponseError } from "../error/response-error.ts";
import { DomainInstructor } from "../ts/types/domain/instructor.js";
import { CurrentCollection } from "../ts/enum/collection.ts";
import { pool } from "../pool.ts";

class InstructorRepo {
  static collection: string = CurrentCollection[CurrentCollection.users];

  static async get() {
    try {
      const res = await pool
        .query()
        .collection<DomainInstructor>(this.collection)
        .find(
          {
            role: "instructor",
          },
          {
            projection: {
              _id: 1,
              email: 1,
              name: 1,
            },
          }
        )
        .toArray();

      return res;
    } catch (error) {
      logger.error("get instructor error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async getById(id: string) {
    try {
      const res = await pool
        .query()
        .collection<DomainInstructor>(this.collection)
        .findOne(
          {
            _id: new ObjectId(id),
            role: "instructor",
          },
          {
            projection: {
              _id: 1,
              email: 1,
              name: 1,
            },
          }
        );
      return res;
    } catch (error) {
      logger.error("get instructor by id", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async validateId(id: ObjectId[]) {
    try {
      const res = await pool
        .query()
        .collection(this.collection)
        .aggregate([
          {
            $match: {
              _id: {
                $in: id,
              },
              role: "instructor",
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ])
        .toArray();
      return res;
    } catch (error) {
      logger.error("validate id error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }
}

export default InstructorRepo;
