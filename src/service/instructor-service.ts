import { ResponseError } from "../error/response-error.ts";
import InstructorRepo from "../repository/instructor-repo.ts";

class InstructorService {
  static async get() {
    const res = await InstructorRepo.get();
    if (res) {
      return res;
    }
  }

  static async getById(id: string) {
    const res = await InstructorRepo.getById(id);

    if (res) {
      return res;
    }

    throw new ResponseError(404, "instructor not found");
  }
}

export default InstructorService;
