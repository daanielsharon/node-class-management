import InstructorRepo from "../repository/instructor-repo.js";
import Util from "../util/id.js";

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
    const newRes = Util.transformId([res]);
    return newRes[0];
  }
}

export default InstructorService;
