import Joi from "joi";

class ClassInstructorValidation {
  static saveDelete = Joi.object({
    instructors: Joi.array()
      .items(Joi.string())
      .min(1)
      .max(2)
      .unique()
      .required(),
  });
}

export default ClassInstructorValidation;
