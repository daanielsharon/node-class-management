import { NextFunction, Request, Response } from "express";
import StudentService from "../service/student-service.ts";
import { logger } from "../app/logger.ts";
import ResponseJson from "../helper/response.ts";

class StudentController {
  static async get(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await StudentService.get();
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("get student error (controller)", error);
      next(error);
    }
  }

  static async getById(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const result = await StudentService.getById(request.params.id);
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("get student by id error (controller)", error);
      next(error);
    }
  }

  static async getProfile(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      console.log("executed get profile");
      const result = await StudentService.getProfile();
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("get student profile error (controller)", error);
      next(error);
    }
  }

  static async getProfileById(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const result = await StudentService.getProfileById(request.params.id);
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("get student profile by id error (controller)", error);
      next(error);
    }
  }
}

export default StudentController;
