import { Router } from "express";
import ClassController from "../controller/class-controller.ts";

export const classRouter = Router();
classRouter.route("/").get(ClassController.get).post(ClassController.save);
classRouter
  .route("/:id")
  .get(ClassController.getById)
  .put(ClassController.update)
  .delete(ClassController.delete);
