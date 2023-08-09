import { Router } from "express";
import UserController from "../controller/user-controller.ts";

export const user = Router();
user.post("/register", UserController.register);
