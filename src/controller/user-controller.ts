import { NextFunction, Request, Response } from "express";
import { logger } from "../app/logger.ts";
import ResponseJson from "../helper/response.ts";
import UserService from "../service/user-service.ts";

class UserController {
  static register(request: Request, response: Response, next: NextFunction) {
    try {
      const result = UserService.register(request.body);
      ResponseJson[200](response, result);
    } catch (error) {
      logger.error("register user error", error);
      next(error);
    }
  }
}

export default UserController;
