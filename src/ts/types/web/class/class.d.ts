import { ObjectId } from "mongodb";
import { ClassStatus } from "../../../enum/class.js";

type ClassCreateUpdate = {
  name: string;
  room: number;
  status: string;
  schedule: Date;
  notes: string;
};

type ClassId = {
  classId: string;
};

export { ClassCreateUpdate, ClassUpdate, ClassStatus };
