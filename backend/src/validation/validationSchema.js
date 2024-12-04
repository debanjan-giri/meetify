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
  type,
  description,
  title,
  hashTag,
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

export const typeValidation = Joi.object({
  type,
});

export const createContentValidation = Joi.object({
  type,
  title,
  description,
  photoUrl: Joi.string().uri().messages({
    "string.uri": "Photo URL must be a valid URL",
  }),
  hashTag,
  challengeTitle: Joi.string(),
});
