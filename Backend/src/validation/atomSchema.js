import Joi from "joi";

export const isNumber = Joi.number().messages({
  "number.base": "Number must be a number",
  "any.required": "Number is required",
});

export const isBoolean = Joi.boolean().messages({
  "boolean.base": "Boolean must be a boolean",
  "any.required": "Boolean is required",
});

export const isId = Joi.string().trim().messages({
  "string.base": "ID must be a string",
  "any.required": "ID is required",
});
 
export const isString = Joi.string().trim().messages({
  "string.base": "String must be a string",
  "any.required": "String is required",
});

export const isUrl = Joi.string().trim().uri().messages({
  "string.uri": "URL must be a valid URL",
});

export const isName = Joi.string().trim().min(3).messages({
  "string.empty": "Name is required",
  "any.required": "Name is required",
});

export const isCompany = Joi.string().trim().min(3).messages({
  "string.empty": "Company is required",
  "any.required": "Company is required",
});

export const isEmail = Joi.string().trim().email().messages({
  "string.email": "Email must be a valid email address",
  "string.empty": "Email is required",
  "any.required": "Email is required",
});

export const isPassword = Joi.string().trim().min(6).messages({
  "string.base": "Password must be a string",
  "string.empty": "Password cannot be empty",
  "string.min": "Password must be at least 6 characters long",
  "any.required": "Password is required",
});

export const isDateOfBirth = Joi.date()
  .min("1900-01-01")
  .max("2023-12-31")

  .messages({
    "date.base": "Date of birth must be a valid date",
    "any.required": "Date of birth is required",
  });

export const isBio = Joi.string().trim().min(10).max(50).messages({
  "string.empty": "Bio cannot be empty",
  "string.min": "Bio must be at least 10 characters long",
  "string.max": "Bio cannot exceed 100 characters",
});

export const isDesignation = Joi.string().trim().min(2).max(50).messages({
  "string.min": "Designation must be at least 2 characters long",
  "string.max": "Designation cannot exceed 50 characters",
});

export const isTitle = Joi.string().trim().messages({
  "string.empty": "Title is required",
  "any.required": "Title is required",
});

export const isDescription = Joi.string().trim().messages({
  "string.empty": "Description is required",
  "any.required": "Description is required",
});

export const isBinaryType = Joi.number()
  .valid(0,1)
  .messages({
    "number.base": " Type must be a number",
    "any.only": "Type must be one of the following: 0, 1",
  });
