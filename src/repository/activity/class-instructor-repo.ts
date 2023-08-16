import { logger } from "../../app/logger.ts";
import { ResponseError } from "../../error/response-error.ts";
import { pool } from "../../pool.ts";
import {
  DomainClassInstructorCreate,
  DomainClassInstructorDelete,
} from "../../ts/types/domain/class/class-instructor.js";

class ClassInstructorRepo {
  static collection: string = "insturctors";
  static save({ instructors }: DomainClassInstructorCreate) {
    try {
      pool.query().collection(this.collection).insertMany(instructors);
    } catch (error) {
      logger.error("add instructor error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }
  static delete({ instructorId, classId }: DomainClassInstructorDelete) {
    try {
      pool
        .query()
        .collection(this.collection)
        .deleteMany({
          instructorId: {
            $in: instructorId,
          },
          classId,
        });
    } catch (error) {
      logger.error("remove instructor error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }
}

export default ClassInstructorRepo;
