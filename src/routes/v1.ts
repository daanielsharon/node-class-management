import { Router } from "express";
import { students } from "./students.ts";
import { teachers } from "./teachers.ts";

export const v1 = Router();
v1.use("/students", students);
v1.use("/teachers", teachers);
