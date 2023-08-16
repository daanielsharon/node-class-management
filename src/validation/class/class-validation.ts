import Joi from "joi";

class ClassValidation {
  static saveUpdate = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    room: Joi.number().min(1).required(),
    status: Joi.string().valid(
      ...["scheduled", "ongoing", "completed", "cancelled"]
    ),
    schedule: Joi.date().greater("now").required(),
    notes: Joi.string().min(1).max(100).allow(null),
  });
}

export default ClassValidation;
