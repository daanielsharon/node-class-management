import { Router } from "express";
import ClassController from "../controller/class-controller.ts";
import { classInstructorRouter } from "./activity/class-instructor.ts";
import { classStudentRouter } from "./activity/class-student.ts";

export const classRouter = Router();

classRouter.use("/:id/students", classStudentRouter);
classRouter.use("/:id/instructors", classInstructorRouter);

classRouter.route("/").get(ClassController.get).post(ClassController.create);
classRouter
  .route("/:id")
  .get(ClassController.getById)
  .put(ClassController.update)
  .delete(ClassController.delete);
