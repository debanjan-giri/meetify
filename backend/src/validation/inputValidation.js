import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .when("skipNameValidation", {
      is: true, // If skipNameValidation is true, make name optional
      then: Joi.optional(),
      otherwise: Joi.required(), // Otherwise, name is required
    })
    .required()
    .messages({
      "string.empty": "Name is required",
      "any.required": "Name is required",
    }),
  company: Joi.string()
    .min(3)
    .when("skipCompanyValidation", {
      is: true, // If skipCompanyValidation is true, make company optional
      then: Joi.optional(),
      otherwise: Joi.required(), // Otherwise, company is required
    })
    .required()
    .messages({
      "string.empty": "Company is required",
      "any.required": "Company is required",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

export const detailsValidation = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  address: Joi.string().required().messages({
    "string.empty": "Address is required",
    "any.required": "Address is required",
  }),
});
