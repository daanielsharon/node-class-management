import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ResponseError } from "../error/response-error.ts";
import ResponseJson from "../helper/response.ts";
import { Code } from "../ts/types/response.js";

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    ResponseJson.unknown(res, err.status as Code, { error: err.message });
  } else {
    ResponseJson[500];
  }
};
