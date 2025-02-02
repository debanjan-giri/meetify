import argon2 from "argon2";
import mongoose from "mongoose";
import { errMiddleware } from "./reqResFunction.js";

export const createHash = async ({ next, password }) => {
  try {
    const timeCost = process.env.NODE_ENV === "prod" ? 4 : 2;
    const memoryCost = process.env.NODE_ENV === "prod" ? 8192 : 4096;
    return await argon2.hash(password, { timeCost, memoryCost });
  } catch (error) {
    return errMiddleware({
      next,
      error,
    });
  }
};

export const verifyHash = async ({ next, hashedPassword, password }) => {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (error) {
    return errMiddleware({
      next,
      error : "Invalid credentials",
    });
  }
};

export const inputValidation = ({ data = {}, next = {}, schema = {} }) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    return errMiddleware({
      next,
      error: error.details[0].message,
    });
  }
  return value;
};

//
export const isValidId = (next, id) => {
  const trimmedId = typeof id === "string" ? id.trim() : null;
  if (!trimmedId || !mongoose.Types.ObjectId.isValid(trimmedId)) {
    return setErrMessage(next, "Invalid ID format", 400);
  }
  return trimmedId;
};

export function getExpirationDate(expireType) {
  return new Date(Date.now() + expireType * 24 * 60 * 60 * 1000);
}

export function removeEmptyValues(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  );
}
