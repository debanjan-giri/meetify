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
  if (typeof id !== "string" || !id.trim()) {
    return errResponse(next, "Valid ID is required", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(id.trim())) {
    return errResponse(next, "Invalid ID format", 400);
  }
  return id.trim();
};

export const checkUserType = (next, userType) => {
  const validUserTypes = ["admin", "hr", "employee"];

  if (typeof userType !== "string" || !userType.trim()) {
    return errResponse(next, "Valid User Type is missing", 400);
  }

  return validUserTypes.includes(userType.trim());
};
