import { logger } from "../../app/logger.ts";
import { ResponseError } from "../../error/response-error.ts";
import { pool } from "../../pool.ts";
import {
  DomainClassStudent,
  DomainClassStudentCreate,
} from "../../ts/types/domain/class/class-student.js";
import { ClassStudentDelete } from "../../ts/types/web/class/class-student.js";

class ClassStudentRepo {
  static collection: string = "students";
  static async save({ students }: DomainClassStudentCreate) {
    try {
      const res = await pool
        .query()
        .collection<DomainClassStudent>(this.collection)
        .insertMany(students);
      return res;
    } catch (error) {
      logger.error("add student error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async delete({ studentId, classId }: ClassStudentDelete) {
    try {
      const res = await pool
        .query()
        .collection(this.collection)
        .deleteMany({
          studentId: {
            $in: studentId,
          },
          classId,
        });

      return res;
    } catch (error) {
      logger.error("remove student error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }
}

export default ClassStudentRepo;
