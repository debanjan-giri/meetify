import Joi from "joi";
import {
  name,
  company,
  email,
  password,
  bio,
  dateOfBirth,
  designation,
  skills,
  photoUrl,
} from "./constantSchema.js";

export const registerValidation = Joi.object({
  name,
  company,
  email,
  password,
});

export const loginValidation = Joi.object({
  email,
  password,
});

export const updateDetailsValidation = Joi.object({
  name,
  bio,
  company,
  dateOfBirth,
  designation,
  skills,
  photoUrl,
});
