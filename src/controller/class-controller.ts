import { NextFunction, Request, Response } from "express";
import { logger } from "../app/logger.ts";
import ClassService from "../service/class-service.ts";
import ResponseJson from "../helper/response.ts";

class ClassController {
  static async get(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await ClassService.get();
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("get class error(controller)", error);
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
      const result = await ClassService.getById(id);
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("get class by id error(controller)", error);
      next(error);
    }
  }

  static async save(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await ClassService.save(request.body);
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("create class error(controller)", error);
      next(error);
    }
  }

  static async update(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const id = request.params.id;
      const result = await ClassService.update(request.body, id);
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("update class error(controller)", error);
      next(error);
    }
  }

  static async delete(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const id = request.params.id;
      await ClassService.delete(id);

      response.status(200).json({
        code: 200,
        status: "OK",
      });
    } catch (error) {
      logger.error("delete class error(controller)", error);
      next(error);
    }
  }
}

export default ClassController;
