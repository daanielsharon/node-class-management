import { Request } from "express";
import { ObjectId } from "mongodb";
import { ResponseError } from "../../error/response-error.ts";
import ClassStudentRepo from "../../repository/activity/class-student-repo.ts";
import ClassRepo from "../../repository/class-repo.ts";
import StudentRepo from "../../repository/student-repo.ts";
import { ClassStudent } from "../../ts/types/web/class/class-student.js";
import Util from "../../util/id.ts";
import ClassStudentValidation from "../../validation/activity/class-student-validation.ts";
import { validate } from "../../validation/validation.ts";
import ClassConfig from "../../config/class/class.ts";

class ClassStudentService {
  static async create(request: Request, classId: string) {
    const { students }: ClassStudent = validate(
      ClassStudentValidation.saveDelete,
      request
    );
    const classAvailable = await ClassRepo.getById(classId);

    if (classAvailable && classAvailable.length === 0)
      throw new ResponseError(404, "Class is not found");

    const inputObjectId = Util.toObjectId(students);

    const validationResult = (await StudentRepo.validateId(
      inputObjectId
    )) as Array<{ _id: ObjectId }>;

    if (validationResult && validationResult.length === 0)
      throw new ResponseError(
        400,
        `These students don't exist ${inputObjectId.join(",")}`
      );

    const fakeStudents = Util.findFakeId(inputObjectId, validationResult);

    if (fakeStudents.length > 0)
      throw new ResponseError(
        400,
        `These students don't exist ${fakeStudents.join(",")}`
      );

    const totalStudents = await ClassStudentRepo.getNumberOfStudents(classId);

    // maximum number of students 32
    if (totalStudents && totalStudents > ClassConfig.maxStudents) {
      throw new ResponseError(
        400,
        "Exceeding max number of students in a classs"
      );
    }

    const classStudents = await ClassStudentRepo.get(classId);

    if (classStudents && classStudents.length > 0) {
      const res = Util.matchId(inputObjectId, classStudents);
      if (res.length > 0)
        throw new ResponseError(
          400,
          `These students are already in the class ${inputObjectId.join(",")}`
        );
    }

    const newStudents = inputObjectId.map((item) => ({
      studentId: item,
      classId: new ObjectId(classId),
    }));

    const res = await ClassStudentRepo.save({ students: newStudents });

    if (res) {
      return {
        students,
      };
    }
  }

  static async delete(request: Request, classId: string) {
    const { students }: ClassStudent = validate(
      ClassStudentValidation.saveDelete,
      request
    );

    const classAvailable = await ClassRepo.getById(classId);

    if (classAvailable && classAvailable.length === 0)
      throw new ResponseError(404, "Class is not found");

    const inputObjectId = Util.toObjectId(students);

    const validationResult = (await StudentRepo.validateId(
      inputObjectId
    )) as Array<{ _id: ObjectId }>;

    if (validationResult && validationResult.length === 0)
      throw new ResponseError(
        400,
        `These students don't exist ${inputObjectId.join(",")}`
      );

    const fakeStudents = Util.findFakeId(inputObjectId, validationResult);

    if (fakeStudents.length > 0)
      throw new ResponseError(
        400,
        `These students don't exist ${fakeStudents.join(",")}`
      );

    await ClassStudentRepo.delete({
      classId,
      studentId: inputObjectId,
    });
  }
}

export default ClassStudentService;
