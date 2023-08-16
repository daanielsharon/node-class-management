import { Router } from "express";
import ClassController from "../controller/class-controller.ts";
import ClassStudentController from "../controller/activity/class-student-controller.ts";

export const classRouter = Router();

export const classStudentRouter = Router({ mergeParams: true });

classRouter.use("/:id/students", classStudentRouter);

classStudentRouter.route("/").post(ClassStudentController.create);

classRouter.route("/").get(ClassController.get).post(ClassController.create);
classRouter
  .route("/:id")
  .get(ClassController.getById)
  .put(ClassController.update)
  .delete(ClassController.delete);
