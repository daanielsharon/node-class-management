import Joi from "joi";

class UserValidation {
  static register = Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid(...["student", "instructor"]),
  });

  static login = Joi.object({
    email: Joi.string().email().required(),
  });

  static names = Joi.object({
    email: Joi.string().email().required(),
  });
}

export default UserValidation;
