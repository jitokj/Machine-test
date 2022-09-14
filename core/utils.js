module.exports.isStatusCode = (statusCode) => {
    return this.isNumeric(statusCode) && statusCode >= 100 && statusCode < 600;
  };