import bcrypt from "bcrypt";
import { errResponse } from "./reqResRelated.js";
import mongoose from "mongoose";

export const createHash = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const inputValidation = (reqData, next, validateSchema) => {
  const { error, value } = validateSchema.validate(reqData, {
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
  const trimmedId = typeof id === "string" ? id.trim() : id;
  if (!trimmedId || !mongoose.Types.ObjectId.isValid(trimmedId)) {
    return errResponse(next, "Invalid ID format", 400);
  }
  return trimmedId;
};

export function getCleanHashTag(input) {
  if (typeof input !== "string" || !input.trim()) {
    return null;
  }
  const match = input.match(/^#[a-zA-Z0-9_]+/);
  return match ? match[0] : null;
}
