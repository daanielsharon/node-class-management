import { Router } from "express";
import ClassStudentController from "../../controller/activity/class-student-controller.ts";

export const classStudentRouter = Router({ mergeParams: true });

classStudentRouter
  .route("/")
  .post(ClassStudentController.create)
  .delete(ClassStudentController.delete);
