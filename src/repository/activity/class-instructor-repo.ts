import { ObjectId } from "mongodb";
import { logger } from "../../app/logger.ts";
import { ResponseError } from "../../error/response-error.ts";
import { pool } from "../../pool.ts";
import {
  DomainClassInstructorCreate,
  DomainClassInstructorDelete,
} from "../../ts/types/domain/class/class-instructor.js";

class ClassInstructorRepo {
  static collection: string = "insturctors";
  static async save({ instructors }: DomainClassInstructorCreate) {
    try {
      const res = await pool
        .query()
        .collection(this.collection)
        .insertMany(instructors);
      return res;
    } catch (error) {
      logger.error("add instructor error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async getNumberOfInstructors(classId: string) {
    try {
      const res: number = await pool
        .query()
        .collection(this.collection)
        .countDocuments({
          _id: new ObjectId(classId),
        });

      return res;
    } catch (error) {
      logger.error("get number of instructors error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async delete({ instructorId, classId }: DomainClassInstructorDelete) {
    try {
      const res = await pool
        .query()
        .collection(this.collection)
        .deleteMany({
          instructorId: {
            $in: instructorId,
          },
          classId: new ObjectId(classId),
        });
      return res;
    } catch (error) {
      logger.error("remove instructor error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }
}

export default ClassInstructorRepo;
