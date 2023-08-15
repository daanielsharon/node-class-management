import { ObjectId } from "mongodb";
import { ClassStatus } from "../../../enum/class.js";

type ClassCreate = {
  name: string;
  room: number;
  status: ClassStatus;
  schedule: Date;
  notes: string;
};

type ClassUpdate = ClassCreate & {
  id: ObjectId;
};

type ClassId = {
  classId: ObjectId;
};

interface ClassStudentCreate extends ClassId, Array<ClassStudentCreate> {
  studentId: ObjectId;
}

type ClassStudentDelete = ClassId & {
  studentId: ObjectId[];
};

type ClassInstructorCreate = ClassId & {
  instructorId: ObjectId;
};

type ClassInstructorDelete = ClassId & {
  instructorId: ObjectId[];
};

export {
  ClassCreate,
  ClassUpdate,
  ClassStatus,
  ClassStudentCreate,
  ClassStudentDelete,
  ClassInstructorCreate,
  ClassInstructorDelete,
};
