import { ObjectId } from "mongodb";
import { type } from "os";

type UserCreate = {
  name: string;
  role: string;
  email: string;
};

type UserCreateRepo = UserCreate & {
  _id: ObjectId;
};

type UserLogin = {
  email: string;
};

type UserUpdate = {
  name: string;
};

export { UserCreate, UserCreateRepo, UserLogin, UserUpdate };
