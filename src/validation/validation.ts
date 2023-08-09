import Joi from "joi";
import { ResponseError } from "../error/response-error.ts";
import { Request } from "express";

const validate = (schema: Joi.ObjectSchema<any>, request: Request): any => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (result.error) {
    throw new ResponseError(400, result.error.message);
  }

  return result.value;
};

export { validate };
