import { Request } from "express";
import { ResponseError } from "../error/response-error.js";
import ClassRepo from "../repository/class-repo.js";
import { ClassCreateUpdate } from "../ts/types/web/class/class.js";
import Util from "../util/id.js";
import ClassValidation from "../validation/class/class-validation.js";
import { validate } from "../validation/validation.js";

class ClassService {
  static async get() {
    const res = await ClassRepo.get();
    if (res) {
      const newRes = Util.transformId(res);
      return newRes;
    }
  }

  static async getById(id: string) {
    const res = await ClassRepo.getById(id);
    if (res && res.length > 0) {
      const newRes = Util.transformId(res);
      return newRes[0];
    }

    throw new ResponseError(404, "class not found");
  }

  static async create(request: Request) {
    const { name, room, status, schedule, notes }: ClassCreateUpdate = validate(
      ClassValidation.saveUpdate,
      request
    );

    const res = await ClassRepo.save({
      name,
      room,
      status,
      schedule,
      notes,
    });

    if (res) {
      return {
        name,
        room,
        status,
        schedule,
        notes,
      };
    }
  }

  static async update(request: Request, id: string) {
    const { name, room, status, schedule, notes }: ClassCreateUpdate = validate(
      ClassValidation.saveUpdate,
      request
    );

    const classAvailable = await ClassRepo.getById(id);

    if (!classAvailable) {
      throw new ResponseError(404, "class not found");
    }

    const res = await ClassRepo.update(
      {
        name,
        room,
        status,
        schedule,
        notes,
      },
      id
    );

    if (res) {
      return {
        name,
        room,
        status,
        schedule,
        notes,
      };
    }
  }

  static async delete(id: string) {
    const classAvailable = await ClassRepo.getById(id);
    if (!classAvailable) {
      throw new ResponseError(404, "class not found");
    }

    await ClassRepo.delete(id);
  }
}

export default ClassService;
