import { ResponseError } from "../error/response-error.ts";
import StudentRepo from "../repository/student-repo.ts";
import Util from "../util/id.ts";

class StudentService {
  static async get() {
    const res = await StudentRepo.get();
    return res;
  }

  static async getById(id: string) {
    console.log("executed service");

    const res = await StudentRepo.getById(id);
    if (res) {
      const newRes = Util.transformId([res]);
      return newRes[0];
    }

    throw new ResponseError(404, "no student found");
  }

  static async getProfile() {
    const res = await StudentRepo.getProfile();
    if (res) {
      const newRes = Util.transformId(res);
      return newRes;
    }
  }

  static async getProfileById(id: string) {
    const res = await StudentRepo.getProfileById(id);
    if (res) {
      const newRes = Util.transformId(res);
      return newRes[0];
    }

    throw new ResponseError(404, "no student found");
  }
}

export default StudentService;
