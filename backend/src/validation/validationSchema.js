import Joi from "joi";
import { userTypeConst } from "../models/typeConstant.js";

// data type
export const isNumber = Joi.number().required().messages({
  "number.base": "Number must be a number",
  "any.required": "Number is required",
});

export const isBoolean = Joi.boolean().required().messages({
  "boolean.base": "Boolean must be a boolean",
  "any.required": "Boolean is required",
});

export const isString = Joi.string().required().messages({
  "string.base": "String must be a string",
  "any.required": "String is required",
});

export const isUrl = Joi.string().uri().messages({
  "string.uri": "URL must be a valid URL",
});

// type check
export const isUserTypeInclude = Joi.number()
  .valid(...Object.values(userTypeConst))
  .messages({
    "number.base": "User Type must be a number",
    "any.only": "User Type must be one of the following: EMPLOYEE, HR, ADMIN",
  });

// data
export const isName = Joi.string().min(3).required().messages({
  "string.empty": "Name is required",
  "any.required": "Name is required",
});

export const isCompany = Joi.string().min(3).required().messages({
  "string.empty": "Company is required",
  "any.required": "Company is required",
});

export const isEmail = Joi.string().email().required().messages({
  "string.email": "Email must be a valid email address",
  "string.empty": "Email is required",
  "any.required": "Email is required",
});

export const isPassword = Joi.string().min(6).required().messages({
  "string.base": "Password must be a string",
  "string.empty": "Password cannot be empty",
  "string.min": "Password must be at least 6 characters long",
  "any.required": "Password is required",
});

export const isdateOfBirth = Joi.date()
  .min("1900-01-01")
  .max("2023-12-31")
  .required()
  .messages({
    "date.base": "Date of birth must be a valid date",
    "any.required": "Date of birth is required",
  });

export const isBio = Joi.string().min(10).max(100).messages({
  "string.empty": "Bio cannot be empty",
  "string.min": "Bio must be at least 10 characters long",
  "string.max": "Bio cannot exceed 100 characters",
});

export const isDesignation = Joi.string().min(2).max(50).messages({
  "string.min": "Designation must be at least 2 characters long",
  "string.max": "Designation cannot exceed 50 characters",
});

export const isTitle = Joi.string().required().messages({
  "string.empty": "Title is required",
  "any.required": "Title is required",
});

export const isDescription = Joi.string().messages({
  "string.empty": "Description is required",
  "any.required": "Description is required",
});

export const isHashTag = Joi.string()
  .pattern(/^#\w+(\s\w+){2,}$/, "hashtag")
  .messages({
    "string.pattern.name": "Hashtag must start with #",
  });
