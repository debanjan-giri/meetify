import bcrypt from "bcrypt";
import { errResponse } from "./reqResRelated.js";
import mongoose from "mongoose";
import { expireTypeConst } from "../models/typeConstant.js";

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
  const trimmedId = typeof id === "string" ? id.trim() : null;
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

export function getExpirationDate(expireType) {
  switch (expireType) {
    case expireTypeConst.SEVEN_DAYS:
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    case expireTypeConst.THIRTY_DAYS:
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    case expireTypeConst.NONE:
    default:
      return undefined;
  }
}

export function removeEmptyValues(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
}
