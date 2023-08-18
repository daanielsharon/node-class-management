import { ObjectId } from "mongodb";
import { logger } from "../../app/logger.ts";
import { ResponseError } from "../../error/response-error.ts";
import { pool } from "../../pool.ts";
import {
  DomainClassStudent,
  DomainClassStudentCreate,
} from "../../ts/types/domain/class/class-student.js";
import { ClassStudentDelete } from "../../ts/types/web/class/class-student.js";
import { CurrentCollection } from "../../ts/enum/collection.ts";

class ClassStudentRepo {
  static collection: string = CurrentCollection[CurrentCollection.students];

  static async get(classId: string) {
    try {
      const res = await pool
        .query()
        .collection<{ _id: ObjectId }>(this.collection)
        .aggregate([
          {
            $match: {
              classId: new ObjectId(classId),
            },
          },
          {
            $addFields: {
              _id: "$studentId",
            },
          },
          {
            $project: {
              _id: 1,
              studentId: 0,
              classId: 0,
            },
          },
        ])
        .toArray();
      return res;
    } catch (error) {
      logger.error("get students in a class error");
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async save({ students }: DomainClassStudentCreate) {
    try {
      const res = await pool
        .query()
        .collection<DomainClassStudent>(this.collection)
        .insertMany(students);
      return res;
    } catch (error) {
      logger.error("add student to a class error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async getNumberOfStudents(classId: string) {
    try {
      const res: number = await pool
        .query()
        .collection(this.collection)
        .countDocuments({
          _id: new ObjectId(classId),
        });

      return res;
    } catch (error) {
      logger.error("get number of students in a class error", error);
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
      logger.error("remove students in a class error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }
}

export default ClassStudentRepo;
