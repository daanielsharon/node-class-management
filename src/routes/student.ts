import { Router } from "express";
import StudentController from "../controller/student-controller.ts";

export const student = Router();
const profile = Router();

student.use("/profile", profile);

// latest to earliest
profile.get("/", StudentController.getProfile);
profile.get("/:id", StudentController.getProfileById);

student.get("/", StudentController.get);
student.get("/:id", StudentController.getById);
