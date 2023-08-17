import { Router } from "express";
import ClassController from "../controller/class-controller.ts";
import ClassStudentController from "../controller/activity/class-student-controller.ts";
import ClassInstructorController from "../controller/activity/class-instructor-controller.ts";

export const classRouter = Router();

const classStudentRouter = Router({ mergeParams: true });

const classInstructorRouter = Router({ mergeParams: true });

classRouter.use("/:id/students", classStudentRouter);

classRouter.use("/:id/instructors", classInstructorRouter);

classStudentRouter.route("/").post(ClassStudentController.create);

classInstructorRouter.route("/").post(ClassInstructorController.create);

classRouter.route("/").get(ClassController.get).post(ClassController.create);
classRouter
  .route("/:id")
  .get(ClassController.getById)
  .put(ClassController.update)
  .delete(ClassController.delete);
