import { Router } from "express";
import { student } from "./student.ts";
import { instructor } from "./instructor.ts";
import { user } from "./user.ts";

export const v1 = Router();
v1.use("/students", student);
v1.use("/instructors", instructor);
v1.use("/users", user);
