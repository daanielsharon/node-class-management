import { Request } from "express";
import { ResponseError } from "../error/response-error.ts";
import ClassRepo from "../repository/class-repo.ts";
import { ClassCreateUpdate } from "../ts/types/web/class/class.js";
import Util from "../util/id.ts";
import ClassValidation from "../validation/class-validation.ts";
import { validate } from "../validation/validation.ts";

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

  static async save(request: Request) {
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
