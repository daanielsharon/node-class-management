import { logger } from "../../app/logger.ts";
import { ResponseError } from "../../error/response-error.ts";
import { pool } from "../../pool.ts";
import {
  ClassStudentCreate,
  ClassStudentDelete,
} from "../../ts/interfaces/class.js";

type ClassStudent = {
  students: ClassStudentCreate;
};

class ClassStudentRepo {
  static collection: string = "students";
  static addStudent({ students }: ClassStudent) {
    try {
      pool.query().collection(this.collection).insertMany(students);
    } catch (error) {
      logger.error("add student error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static removeStudent({ studentId, classId }: ClassStudentDelete) {
    try {
      pool
        .query()
        .collection(this.collection)
        .deleteMany({
          studentId: {
            $in: studentId,
          },
          classId,
        });
    } catch (error) {
      logger.error("remove student error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }
}

export default ClassStudentRepo;
