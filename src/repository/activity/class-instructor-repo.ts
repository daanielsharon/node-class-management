import { logger } from "../../app/logger.ts";
import { ResponseError } from "../../error/response-error.ts";
import { pool } from "../../pool.ts";
import { ClassInstructor } from "../../ts/types/web/class/class-instructor.js";
import { ClassInstructorDelete } from "../../ts/types/web/class/class.js";

class ClassInstructorRepo {
  static collection: string = "insturctors";
  static addInstructor({ instructors }: ClassInstructor) {
    try {
      pool.query().collection(this.collection).insertMany(instructors);
    } catch (error) {
      logger.error("add instructor error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }
  static removeInstructor({ instructorId, classId }: ClassInstructorDelete) {
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
