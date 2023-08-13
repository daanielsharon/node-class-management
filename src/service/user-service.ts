import { Request } from "express";
import { ResponseError } from "../error/response-error.ts";
import UserRepo from "../repository/user-repo.ts";
import {
  UserCreate,
  UserCreateResponse,
  UserLogin,
  UserUpdate,
} from "../ts/types/web/user.js";
import { validate } from "../validation/validation.ts";
import UserValidation from "../validation/user-validation.ts";

class UserService {
  static async register(request: Request): Promise<UserCreateResponse> {
    const { name, role, email }: UserCreate = validate(
      UserValidation.register,
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
  }

  static async login(request: Request): Promise<UserLogin | undefined> {
    const { email }: UserLogin = validate(UserValidation.login, request);

    const result = await UserRepo.getByEmail(email);

    if (result) {
      return { email: result.email };
    }

    throw new ResponseError(404, "no user found");
  }

  static get() {
    let response = UserRepo.get();

    response?.map((item) => ({
      id: item._id,
      email: item.email,
      name: item.name,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return response;
  }

  static async getById(id: string) {
    const res = await UserRepo.getById(id);

    if (res) {
      return {
        id: res._id,
        email: res.email,
        name: res.name,
      };
    }

    throw new ResponseError(404, "no user registered with this id");
  }

  static async update(request: Request, id: string) {
    const { name }: UserUpdate = validate(UserValidation.names, request);
  }
}

export default UserService;
