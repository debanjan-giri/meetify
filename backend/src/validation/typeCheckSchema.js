import Joi from "joi";
import {
  contentTypeConst,
  expirationTypeConst,
  privacyTypeConst,
  requestypeConst,
  userTypeConst,
} from "../models/typeConstant.js";

export const isUserType = Joi.number()
  .valid(userTypeConst.ADMIN, userTypeConst.HR, userTypeConst.EMPLOYEE)
  .messages({
    "number.base": "User Type must be a number",
    "any.only": "User Type must be one of the following: EMPLOYEE, HR, ADMIN",
  });

export const isZeroOneType = Joi.number().valid(0, 1).messages({
  "number.base": " Type must be a number",
  "any.only": "Type must be one of the following: 0, 1",
});

export const isRequestype = Joi.number()
  .valid(
    requestypeConst.ACCEPT,
    requestypeConst.REJECT,
    requestypeConst.DELETE,
    requestypeConst.SEND
  )
  .messages({ 
    "number.base": "Connection Type must be a number",
    "any.only": "Connection Type must be one of the following: 0, 1, 2",
  });

export const isContentTypeConst = Joi.number()
  .valid(
    contentTypeConst.CONTENT,
    contentTypeConst.STATUS,
    contentTypeConst.CHALLENGE,
    contentTypeConst.HASHTAG
  )
  .messages({
    "number.base": "Connection Type must be a number",
    "any.only": "Connection Type must be one of the following: 0, 1, 2",
  });

export const isPrivacyTypeConst = Joi.number()
  .valid(
    privacyTypeConst.PUBLIC,
    privacyTypeConst.CONNECTION,
    privacyTypeConst.CUSTOM
  )
  .messages({
    "number.base": "Privacy Type must be a number",
    "any.only": "Privacy Type must be one of the following: 0, 1, 2",
  });

export const isExpirationTypeConst = Joi.number()
  .valid(
    expirationTypeConst.NONE,
    expirationTypeConst.SEVEN_DAYS,
    expirationTypeConst.THIRTY_DAYS
  )
  .messages({
    "number.base": "Privacy Type must be a number",
    "any.only": "Privacy Type must be one of the following: 0,7,30", 
  });

  export const isPollTypeConst = Joi.number().valid