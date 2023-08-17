import { ObjectId } from "mongodb";

type ClassId = {
  classId: string;
};

type ClassStudentDelete = ClassId & {
  studentId: ObjectId[];
};

export type ClassStudent = {
  students: string[];
};
