import { Router } from "express";
import { students } from "./student.ts";
import { instructors } from "./instructor.ts";

export const v1 = Router();
v1.use("/students", students);
v1.use("/instructors", instructors);
