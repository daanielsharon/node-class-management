import { error } from "console";
import { ResponseError } from "../error/response-error.ts";
import UserRepo from "../repository/user-repo.ts";
import { UserCreate, UserLogin } from "../ts/interfaces/user.js";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation.ts";
import { validate } from "../validation/validation.ts";
import { Request } from "express";

class UserService {
  static register(request: Request): UserCreate {
    const { name, role, email }: UserCreate = validate(
      registerUserValidation,
      request
    );

    const getUser = UserRepo.getByEmail(email);
    if (getUser) {
      throw new ResponseError(
        400,
        "user with this email is already registered"
      );
    }

    UserRepo.save({ name, role, email });
    return { name, role, email };
  }

  static login(request: Request) {
    const { email }: UserLogin = validate(loginUserValidation, request);

    const result = UserRepo.getByEmail(email);

    if (result) {
      return result;
    }

    throw new ResponseError(404, "no user found");
  }
}

export default UserService;
