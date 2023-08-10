import { extend } from "joi";
import { ObjectId } from "mongodb";

interface UserCreate {
  name: string;
  role: string;
  email: string;
}

interface UserCreateRepo extends UserCreate {
  _id: ObjectId;
}

interface UserCreateResponse extends UserCreate {
  id: ObjectId;
}

interface UserLogin {
  email: string;
}

interface UserUpdate {
  id: ObjectId;
  name: string;
}

export {
  UserCreate,
  UserCreateRepo,
  UserCreateResponse,
  UserLogin,
  UserUpdate,
};
