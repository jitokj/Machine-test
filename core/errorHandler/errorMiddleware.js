const AppError = require("./appError");
const logger = require("../../util/log");
const responser = require("../responser");

// statusCode, handler, messageCode, optionalMessage = null
const handleCastErrorDB = (err) => {
  const message = `${err.path}: ${err.value}.`;
  return new AppError(400, "global", "G_E002", message, true);
};

const handleDuplicateFieldsDB = (err) => {
  let message = err.errmsg.match(/(["'])(\\?.)*?\1/);
  if (message) {
    message = message[0];
  }
  logger.data("handleDuplicateFieldsDB regex value", message);
  return new AppError(400, "global", "G_E003", message, true);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = errors.join(". ");
  return new AppError(400, "global", "G_E004", message, true);
};

const handleJWTError = () => new AppError(401, "global", "G_E005");

const handleJWTExpiredError = () => new AppError(401, "global", "G_E006");

const sendError = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return responser.send(
      err.statusCode,
      err.handler,
      err.messageCode,
      req,
      res,
      err
    );

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    return responser.send(500, "global", "G_E001", req, res, err);
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  // let error = { ...err };
  let error = err;
  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
  sendError(error, req, res);
};
