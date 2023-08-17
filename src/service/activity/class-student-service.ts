import { Request } from "express";
import { ObjectId } from "mongodb";
import { ResponseError } from "../../error/response-error.ts";
import ClassStudentRepo from "../../repository/activity/class-student-repo.ts";
import ClassRepo from "../../repository/class-repo.ts";
import StudentRepo from "../../repository/student-repo.ts";
import { ClassStudent } from "../../ts/types/web/class/class-student.js";
import Util from "../../util/id.ts";
import ClassStudentValidation from "../../validation/class/class-student-validation.ts";
import { validate } from "../../validation/validation.ts";

class ClassStudentService {
  static async create(request: Request, classId: string) {
    const { students }: ClassStudent = validate(
      ClassStudentValidation.save,
      request
    );
    const classAvailable = await ClassRepo.getById(classId);

    if (classAvailable && classAvailable.length === 0)
      throw new ResponseError(404, "class not found");

    const studentObjectId = Util.toObjectId(students);

    const studentAvailable = await StudentRepo.validateId(studentObjectId);

    if (studentAvailable && studentAvailable.length !== 0) {
      const realStudents = studentAvailable.filter((item) =>
        studentObjectId.forEach((el) => {
          item._id == el;
        })
      );

      if (realStudents.length > 0)
        throw new ResponseError(
          400,
          `These student ids don't exist ${realStudents.join(",")}`
        );

      const newStudents = {
        students: studentObjectId.map((item) => ({
          studentId: item,
          classId: new ObjectId(classId),
        })),
      };

      const res = await ClassStudentRepo.save(newStudents);

      if (res) {
        return {
          students,
        };
      }
    } else {
      throw new ResponseError(400, "These students are not yet available!");
    }
  }
}

export default ClassStudentService;
