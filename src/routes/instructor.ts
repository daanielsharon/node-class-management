import { Router } from "express";
import InstructorController from "../controller/instructor-controller.ts";

export const instructor = Router();
instructor.get("/", InstructorController.get);
instructor.get("/:id", InstructorController.getById);
