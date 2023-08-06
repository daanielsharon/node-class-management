import { Router } from "express";
import { students } from "./student";
import { instructors } from "./instructor";

export const v1 = Router();
v1.use("/students", students);
v1.use("/instructors", instructors);
