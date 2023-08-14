import { ObjectId } from "mongodb";
import { DomainClassOnly } from "./class.js";

export type DomainStudent = {
  _id?: ObjectId;
  email: string;
  name: string;
};

type DomainStudentClass = DomainStudent & {
  classes: DomainClassOnly[];
};
