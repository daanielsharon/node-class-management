import { pool } from "../pool";

class StudentRepo {
  static getName() {
    pool.query().collection("students").find();
  }
}

export default StudentRepo;
