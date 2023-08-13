import { Router } from "express";
import UserController from "../controller/user-controller.ts";

export const user = Router();
user.get("/", UserController.get);
user.get("/:id", UserController.getById);
user.post("/register", UserController.register);
user.post("/login", UserController.login);
user.patch("/:id", UserController.update);
user.delete("/:id", UserController.delete);
