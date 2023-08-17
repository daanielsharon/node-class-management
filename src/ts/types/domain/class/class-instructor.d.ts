import { ObjectId } from "mongodb";
import { DomainClassId } from "./class-student.js";

type DomainClassInstructor = DomainClassId & {
  instructorId: ObjectId;
};

export type DomainClassInstructorCreate = {
  instructors: DomainClassInstructor[];
};

export type DomainClassInstructorDelete = {
  instructorId: ObjectId[];
  classId: string;
};
