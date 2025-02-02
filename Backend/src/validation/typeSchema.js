import Joi from "joi";

export const isUserType = Joi.number()
  .valid(userTypeConst.ADMIN, userTypeConst.HR, userTypeConst.EMPLOYEE)
  .messages({
    "number.base": "User Type must be a number",
    "any.only": "User Type must be one of the following: EMPLOYEE, HR, ADMIN",
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
  .valid(privacyTypeConst.PUBLIC, privacyTypeConst.FRIENDS)
  .messages({
    "number.base": "Privacy Type must be a number",
    "any.only": "Privacy Type must be one of the following: 0, 1, 2",
  });

export const isExpireTypeConst = Joi.number()
  .valid(
    expireTypeConst.NONE,
    expireTypeConst.SEVEN_DAYS,
    expireTypeConst.THIRTY_DAYS
  )
  .messages({
    "number.base": "Privacy Type must be a number",
    "any.only": "Privacy Type must be one of the following: 0,7,30",
  });
