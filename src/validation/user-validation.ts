import Joi from "joi";

const registerUserValidation = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  role: Joi.any().validate(["student", "instructor"]),
});

const loginUserValidation = Joi.object({
  email: Joi.string().email().required(),
});

export { registerUserValidation, loginUserValidation };
