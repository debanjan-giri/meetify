import bcrypt from "bcrypt";
import { errResponse } from "./reqResRelated.js";
import mongoose from "mongoose";

// password related functions
export const createHash = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const inputValidation = (req, next, validateSchema) => {
  const { error, value } = validateSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    return errResponse(next, error?.details[0]?.message, 400);
  } else {
    return value;
  }
};

export const isValidId = (next, id) => {
  const sanitizedId = typeof id === "string" ? id.trim() : null;

  if (!sanitizedId || !mongoose.Types.ObjectId.isValid(sanitizedId)) {
    return errResponse(next, "Valid User ID is required", 400);
  }

  return sanitizedId;
};