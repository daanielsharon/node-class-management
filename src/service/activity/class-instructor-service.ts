import { Request } from "express";
import { ClassInstructor } from "../../ts/types/web/class/class-instructor.js";
import ClassInstructorValidation from "../../validation/activity/class-instructor-validation.ts";
import { validate } from "../../validation/validation.ts";
import ClassRepo from "../../repository/class-repo.ts";
import { ResponseError } from "../../error/response-error.ts";
import Util from "../../util/id.ts";
import ClassInstructorRepo from "../../repository/activity/class-instructor-repo.ts";
import InstructorRepo from "../../repository/instructor-repo.ts";
import { ObjectId } from "mongodb";
import ClassConfig from "../../config/class/class.ts";

class ClassInstructorService {
  static async create(request: Request, classId: string) {
    const { instructors }: ClassInstructor = validate(
      ClassInstructorValidation.saveDelete,
      request
    );

    const classAvailable = await ClassRepo.getById(classId);

    if (classAvailable && classAvailable.length === 0)
      throw new ResponseError(404, "Class is not found");

    const inputObjectId = Util.toObjectId(instructors);

    const validationResult = (await InstructorRepo.validateId(
      inputObjectId
    )) as ObjectId[];

    if (validationResult && validationResult.length === 0)
      throw new ResponseError(400, "These instructors don't exist!");

    const fakeInstructors = Util.findFakeId(inputObjectId, validationResult);

    if (fakeInstructors.length > 0)
      throw new ResponseError(
        400,
        `These instructors don't exist ${fakeInstructors.join(",")}`
      );

    const totalInstructors = await ClassInstructorRepo.getNumberOfInstructors(
      classId
    );

    if (totalInstructors && totalInstructors > ClassConfig.maxInstructors)
      throw new ResponseError(400, "Exceeding maximum number of instructors");

    const newInstructors = inputObjectId.map((inputId) => ({
      instructorId: inputId,
      classId: new ObjectId(classId),
    }));

    const res = await ClassInstructorRepo.save({
      instructors: newInstructors,
    });

    if (res) {
      return {
        instructors,
      };
    }
  }

  static async delete(request: Request, classId: string) {
    const { instructors }: ClassInstructor = validate(
      ClassInstructorValidation.saveDelete,
      request
    );

    const classAvailable = await ClassRepo.getById(classId);

    if (classAvailable && classAvailable.length === 0)
      throw new ResponseError(404, "Class is not found");

    const inputObjectId = Util.toObjectId(instructors);

    const validationResult = (await InstructorRepo.validateId(
      inputObjectId
    )) as ObjectId[];

    if (validationResult && validationResult.length === 0)
      throw new ResponseError(400, "These instructors don't exist!");

    const fakeInstructors = Util.findFakeId(inputObjectId, validationResult);

    if (fakeInstructors.length > 0)
      throw new ResponseError(
        400,
        `These instructors don't exist ${fakeInstructors.join(",")}`
      );

    await ClassInstructorRepo.delete({
      instructorId: inputObjectId,
      classId,
    });
  }
}

export default ClassInstructorService;
