import { ObjectId } from "mongodb";

interface UserCreate {
  name: string;
  role: string;
}

interface UserUpdate {
  id: ObjectId;
  name: string;
}

export { UserCreate, UserUpdate };
