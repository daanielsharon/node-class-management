import { ObjectId } from "mongodb";

enum ClassStatus {
  "scheduled",
  "ongoing",
  "completed",
  "cancelled",
}

interface ClassCreate {
  name: string;
  room: number;
  status: ClassStatus;
  notes: string;
}

interface ClassUpdate extends ClassCreate {
  id: ObjectId;
}

interface ClassId {
  classId: ObjectId;
}

interface ClassStudentCreate extends ClassId, Array<ClassStudentCreate> {
  studentId: ObjectId;
}

interface ClassStudentDelete extends ClassId {
  studentId: ObjectId[];
}

interface ClassInstructorCreate extends ClassId, Array<ClassInstructorCreate> {
  instructorId: ObjectId;
}

interface ClassInstructorDelete extends ClassId {
  instructorId: ObjectId[];
}

export {
  ClassCreate,
  ClassUpdate,
  ClassStatus,
  ClassStudentCreate,
  ClassStudentDelete,
  ClassInstructorCreate,
  ClassInstructorDelete,
};
