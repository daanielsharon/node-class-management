import { Router } from "express";
import StudentController from "../controller/student-controller.ts";

export const student = Router();

student.get("/", StudentController.get);
student.get("/:id", StudentController.getById);

const profile = Router();
profile.get("/", StudentController.getProfile);
profile.get("/:id", StudentController.getProfileById);

student.use("/profile", profile);
