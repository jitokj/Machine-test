const logger = require("../util/log");
const messageCode = require("../error-code");
const { isStatusCode } = require("./utils");


const getMessage = (handler, locale, code) => {
  return messageCode[handler][locale][code];
};

const successResponse = (
  handler,
  messageCode,
  req,
  data,
  extras,
  success
) => {
  let responseData = {
    status: "success",
    message: getMessage(handler, req.headers.locale || "en", messageCode),
    messageCode,
    success,
    data,
  };
  if (Array.isArray(data)) responseData.totals = { count: data.length };
  if (extras) {
    if (Array.isArray(extras))
      throw new Error("Extra data needs to be a non array object");
    if (typeof extras == "object") {
      responseData = { ...responseData, ...extras };
    }
  }
  logger.info(`Success || ${messageCode} || ${handler} || ${req.originalUrl}`);
  return responseData;
};

const errorResponse = (handler, messageCode, req, error) => {
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  // Response Data for the client request
  let response = {
    status: "error",
    message: messageCode
      ? getMessage(handler, req.headers.locale || "en", messageCode)
      : "Unknown Error",
    messageCode,
  };
  if (error.isOperational) {
    // If mergeOptional is true, then merge translated error Message and Optional Parameters
    if (error.mergeOptional) {
      response.message = response.message + " : " + error.optionalMessage;
    } else {
      response.errorDetails = error.optionalMessage;
    }
  }
  if (error.dynamicMessage) {
    response.message = error.dynamicMessage;
    response.errorDetails = error.data;
  }
  return response;
};

module.exports.send = (
  statusCode,
  handler,
  messageCode,
  req,
  res,
  data,
  extras = null,
  success = true
) => {
  let responseData;
  statusCode = isStatusCode(statusCode) ? statusCode : 500;
  if (`${statusCode}`.startsWith("2"))
    responseData = successResponse(
      handler,
      messageCode,
      req,
      data,
      extras,
      success
    );
  if (`${statusCode}`.startsWith("4") || `${statusCode}`.startsWith("5"))
    responseData = errorResponse(handler, messageCode, req, data);
  res.status(statusCode).send(responseData);
};

module.exports.globalErrorHandler = (req, res, err) => {
  this.send(500, "global", "G_E001", req, res, err);
};
