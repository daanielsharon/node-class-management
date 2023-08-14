import { ObjectId } from "mongodb";

export type DomainInstructor = {
  _id?: ObjectId;
  email: string;
  name: string;
};
