import { Request } from "express";
import { logger } from "../app/logger.ts";
import { ResponseError } from "../error/response-error.ts";
import UserRepo from "../repository/user-repo.ts";
import {
  UserCreate,
  UserCreateResponse,
  UserLogin,
} from "../ts/interfaces/user.js";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation.ts";
import { validate } from "../validation/validation.ts";

class UserService {
  static async register(
    request: Request
  ): Promise<UserCreateResponse | undefined> {
    try {
      const { name, role, email }: UserCreate = validate(
        registerUserValidation,
        request
      );

      const getUser = await UserRepo.getByEmail(email);
      if (getUser) {
        throw new ResponseError(
          400,
          "user with this email is already registered"
        );
      }

      const result = await UserRepo.save({ name, role, email });
      return { id: result!.insertedId, name, role, email };
    } catch (error) {
      logger.error("register user error (service)", error);
      if (error instanceof Error) {
        throw new ResponseError(400, error.message);
      }
    }
  }

  static async login(request: Request): Promise<UserLogin | undefined> {
    try {
      console.log("executeed");
      const { email } = validate(loginUserValidation, request);

      const result = await UserRepo.getByEmail(email);
      console.info("result", result);

      if (result) {
        return { email: result.email };
      }

      throw new ResponseError(404, "no user found");
    } catch (error) {
      logger.error("login error (service)", error);
      if (error instanceof Error) {
        throw new ResponseError(404, error.message);
      }
    }
  }
}

export default UserService;
