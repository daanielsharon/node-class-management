import { Request } from "express";
import { ResponseError } from "../error/response-error.ts";
import UserRepo from "../repository/user-repo.ts";
import { UserCreate, UserLogin, UserUpdate } from "../ts/types/web/user.ts";
import { validate } from "../validation/validation.ts";
import UserValidation from "../validation/user-validation.ts";
import Util from "../util/id.ts";

class UserService {
  static async register(request: Request): Promise<UserCreate> {
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

    await UserRepo.save({ name, role, email });

    return { name, role, email };
  }

  static async login(request: Request): Promise<UserLogin | undefined> {
    const { email }: UserLogin = validate(UserValidation.login, request);

    const result = await UserRepo.getByEmail(email);

    if (result) {
      return { email: result.email };
    }

    throw new ResponseError(404, "no user found");
  }

  static async get() {
    let response = await UserRepo.get();

    if (response) {
      const newResponse = Util.transformId(response);
      return newResponse;
    }
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

    const res = await UserRepo.getById(id);
    if (!res) throw new ResponseError(404, "no user found");

    const response = await UserRepo.update({ id, name });
    if (response) {
      return { name };
    }
  }

  static async delete(id: string) {
    const res = await UserRepo.getById(id);
    if (!res) throw new ResponseError(404, "no user found");

    await UserRepo.delete(id);
  }
}

export default UserService;
