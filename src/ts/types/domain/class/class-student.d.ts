import { ObjectId } from "mongodb";

type DomainClassId = {
  classId: ObjectId;
};

type DomainClassStudent = DomainClassId & {
  studentId: ObjectId;
};

export type DomainClassStudentCreate = {
  students: DomainClassStudent[];
};
