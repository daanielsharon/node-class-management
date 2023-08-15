import { Router } from "express";
import StudentController from "../controller/student-controller.ts";

export const studentRouter = Router();
const profileRouter = Router();

studentRouter.use("/profile", profileRouter);

// latest to earliest
profileRouter.get("/", StudentController.getProfile);
profileRouter.get("/:id", StudentController.getProfileById);

studentRouter.get("/", StudentController.get);
studentRouter.get("/:id", StudentController.getById);
