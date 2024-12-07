import bcrypt from "bcrypt";
import { errResponse } from "./reqResRelated.js";
import mongoose from "mongoose";
import { contentTypeConst, userTypeConst } from "../models/typeConstant.js";

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
  if (typeof id !== "string" || !id.trim()) {
    return errResponse(next, "Valid ID is required", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(id.trim())) {
    return errResponse(next, "Invalid ID format", 400);
  }
  return id.trim();
};

export function getCleanHashTag(input) {
  if (typeof input !== "string" || !input.trim()) {
    return null;
  }
  const match = input.match(/^#[a-zA-Z0-9_]+/);
  return match ? match[0] : null;
}
