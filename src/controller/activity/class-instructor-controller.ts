import { NextFunction, Request, Response } from "express";
import { logger } from "../../app/logger.ts";
import ClassInstructorService from "../../service/activity/class-instructor-service.ts";
import ResponseJson from "../../helper/response.ts";

class ClassInstructorController {
  static async create(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const id = request.params.id;
      const result = await ClassInstructorService.create(request.body, id);
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("create instructors in a class error(controller)", error);
      next(error);
    }
  }
}

export default ClassInstructorController;
