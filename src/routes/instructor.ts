import { Router } from "express";
import InstructorController from "../controller/instructor-controller.ts";

export const instructorRouter = Router();
instructorRouter.get("/", InstructorController.get);
instructorRouter.get("/:id", InstructorController.getById);
