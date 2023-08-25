import { ResponseError } from "../error/response-error.ts";
import StudentRepo from "../repository/student-repo.ts";

class StudentService {
  static async get() {
    const res = await StudentRepo.get();
    if (res) {
      return res;
    }
  }

  static async getById(id: string) {
    const res = await StudentRepo.getById(id);
    if (res) {
      return res;
    }

    throw new ResponseError(404, "no student found");
  }

  static async getProfile() {
    const res = await StudentRepo.getProfile();
    if (res) {
      return res;
    }
  }

  static async getProfileById(id: string) {
    const res = await StudentRepo.getProfileById(id);
    if (res) {
      return res[0];
    }

    throw new ResponseError(404, "no student found");
  }
}

export default StudentService;
