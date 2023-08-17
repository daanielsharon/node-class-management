import { Router } from "express";
import ClassInstructorController from "../../controller/activity/class-instructor-controller.ts";

export const classInstructorRouter = Router({ mergeParams: true });

classInstructorRouter
  .route("/")
  .post(ClassInstructorController.create)
  .delete(ClassInstructorController.delete);
