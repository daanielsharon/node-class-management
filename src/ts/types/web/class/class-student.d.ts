type ClassStudentCreate = ClassId & {
  studentId: ObjectId;
};

type ClassStudentDelete = ClassId & {
  studentId: ObjectId[];
};

type ClassInstructorCreate = ClassId & {
  instructorId: ObjectId;
};

type ClassInstructorDelete = ClassId & {
  instructorId: ObjectId[];
};

export type ClassStudent = {
  students: ClassStudentCreate[];
};
