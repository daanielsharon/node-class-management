import { ObjectId } from "mongodb";
import { DomainStudent } from "../student.js";
import { DomainInstructor } from "../instructor.js";

export type DomainClass = {
  _id?: ObjectId;
  name: string;
  room: string;
  students: DomainStudent[];
  instructors: DomainInstructor[];
  status: string;
  schedule: Date;
  notes: string;
};

export type DomainClassOnly = {
  _id?: ObjectId;
  name: string;
  room: string;
  status: string;
  schedule: Date;
  notes: string;
};

export type DomainClassCreateUpdate = {
  _id?: ObjectId;
  name: string;
  room: number;
  status: string;
  schedule: Date;
  notes: string | null;
  created_at?: Date;
  updated_at?: Date;
};
