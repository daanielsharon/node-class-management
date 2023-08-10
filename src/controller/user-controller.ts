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
    console.log("executed controller");
    try {
      const result = await UserService.login(request.body);
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("login user error (controller)", error);
      next(error);
    }
  }
}

export default UserController;
