import { NextFunction, Request, Response } from "express";
import ResponseJson from "../helper/response.ts";
import InstructorService from "../service/instructor-service.ts";
import { logger } from "../app/logger.ts";

class InstructorController {
  static async get(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await InstructorService.get();
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("get instructor error(controller)", error);
      next(error);
    }
  }
  static async getById(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const id = request.params.id;
      const result = await InstructorService.getById(id);
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("get instructor by id error(controller)", error);
      next(error);
    }
  }
}

export default InstructorController;
