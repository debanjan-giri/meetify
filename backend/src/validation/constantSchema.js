import Joi from "joi";

export const name = Joi.string().min(3).required().messages({
  "string.empty": "Name is required",
  "any.required": "Name is required",
});

export const company = Joi.string().min(3).required().messages({
  "string.empty": "Company is required",
  "any.required": "Company is required",
});

export const email = Joi.string().email().required().messages({
  "string.email": "Email must be a valid email address",
  "string.empty": "Email is required",
  "any.required": "Email is required",
});

export const password = Joi.string().min(6).required().messages({
  "string.base": "Password must be a string",
  "string.empty": "Password cannot be empty",
  "string.min": "Password must be at least 6 characters long",
  "any.required": "Password is required",
});

export const dateOfBirth = Joi.date()
  .min("1900-01-01")
  .max("2023-12-31")
  .required()
  .messages({
    "date.base": "Date of birth must be a valid date",
    "any.required": "Date of birth is required",
  });

export const bio = Joi.string().min(10).max(100).messages({
  "string.empty": "Bio cannot be empty",
  "string.min": "Bio must be at least 10 characters long",
  "string.max": "Bio cannot exceed 100 characters",
});

export const designation = Joi.string().min(2).max(50).messages({
  "string.min": "Designation must be at least 2 characters long",
  "string.max": "Designation cannot exceed 50 characters",
});

export const skills = Joi.array()
  .items(Joi.string().min(2).max(10))
  .min(1)
  .max(10)
  .messages({
    "array.base": "Skills must be an array",
    "array.min": "At least one skill is required",
    "array.max": "You cannot specify more than 10 skills",
    "string.min": "Each skill must be at least 2 characters long",
    "string.max": "Each skill cannot exceed 30 characters",
  });

export const photoUrl = Joi.string().uri().messages({
  "string.uri": "Photo URL must be a valid URL",
});

export const text = Joi.string().required().messages({
  "string.empty": "Text is required",
  "any.required": "Text is required",
});
