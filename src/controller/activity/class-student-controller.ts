import { NextFunction, Request, Response } from "express";
import { logger } from "../../app/logger.ts";
import ClassStudentService from "../../service/activity/class-student-service.ts";
import ResponseJson from "../../helper/response.ts";

class ClassStudentController {
  static async create(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const id = request.params.id;
      const result = await ClassStudentService.create(request.body, id);
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("create students in a class error ", error);
      next(error);
    }
  }
}

export default ClassStudentController;
