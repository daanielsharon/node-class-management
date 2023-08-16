import { ObjectId } from "mongodb";
import { DomainClassOnly } from "./class/class.js";

export type DomainStudentId = {
  _id: ObjectId;
};

export type DomainStudent = DomainStudentId & {
  email: string;
  name: string;
};

type DomainStudentClass = DomainStudent & {
  classes: DomainClassOnly[];
};
