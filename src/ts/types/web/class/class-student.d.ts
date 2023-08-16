type ClassId = {
  classId: string;
};

type ClassStudentDelete = ClassId & {
  studentId: string[];
};

export type ClassStudent = {
  students: string[];
};
