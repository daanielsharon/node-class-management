import { ObjectId } from "mongodb";

interface UserCreate {
  name: string;
  role: string;
  email: string;
}

interface UserLogin {
  email: string;
}

interface UserUpdate {
  id: ObjectId;
  name: string;
}

export { UserCreate, UserLogin, UserUpdate };
