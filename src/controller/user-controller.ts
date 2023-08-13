import { NextFunction, Request, Response } from "express";
import { logger } from "../app/logger.ts";
import ResponseJson from "../helper/response.ts";
import UserService from "../service/user-service.ts";

class UserController {
  static async register(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const result = await UserService.register(request.body);
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("register user error (controller)", error);
      next(error);
    }
  }

  static async login(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await UserService.login(request.body);
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("login user error (controller)", error);
      next(error);
    }
  }

  static async get(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await UserService.get();
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("get user error(controller)", error);
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
      const result = await UserService.getById(id);
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("get user by id error(controller)", error);
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
      const result = await UserService.update(request.body, id);
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("update user by id error (controller)", error);
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
      await UserService.delete(id);
      response.status(200).json({
        code: 200,
        status: "OK",
      });
    } catch (error) {
      logger.error("delete user by id error (controller)", error);
      next(error);
    }
  }
}

export default UserController;
