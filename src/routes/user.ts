import { Router } from "express";
import UserController from "../controller/user-controller.ts";

export const userRouter = Router();
userRouter
  .route("/:id")
  .get(UserController.getById)
  .patch(UserController.update)
  .delete(UserController.delete);
userRouter.get("/", UserController.get);
userRouter.post("/register", UserController.register);
userRouter.post("/login", UserController.login);
