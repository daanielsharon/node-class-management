import { ResponseError } from "../error/response-error.ts";
import InstructorRepo from "../repository/instructor-repo.ts";
import Util from "../util/id.ts";

class InstructorService {
  static async get() {
    const res = await InstructorRepo.get();
    if (res) {
      const newRes = Util.transformId(res);
      return newRes;
    }
  }

  static async getById(id: string) {
    const res = await InstructorRepo.getById(id);

    if (res) {
      const newRes = Util.transformId([res]);
      return newRes[0];
    }

    throw new ResponseError(404, "instructor not found");
  }
}

export default InstructorService;
