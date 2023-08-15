import { Router } from "express";
import { studentRouter } from "./student.ts";
import { instructorRouter } from "./instructor.ts";
import { userRouter } from "./user.ts";
import { classRouter } from "./class.ts";

export const v1 = Router();
v1.use("/students", studentRouter);
v1.use("/instructors", instructorRouter);
v1.use("/users", userRouter);
v1.use("/classes", classRouter);
