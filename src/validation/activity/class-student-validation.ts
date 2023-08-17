import Joi from "joi";

class ClassStudentValidation {
  static saveDelete = Joi.object({
    students: Joi.array()
      .items(Joi.string())
      .min(1)
      .max(32)
      .unique()
      .required(),
  });
}

export default ClassStudentValidation;
