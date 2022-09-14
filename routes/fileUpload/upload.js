const responser = require("../../core/responser");
const logger = require("../../util/log");
const uploadService = require("../../services/upload");

module.exports.fileUpload = async (req, res, next) => {
  logger.info("START: Login API Handler");
  const data = await uploadService.upload(req.file, req.ip, req.useragent);
  logger.data("result ", data);
  return responser.send(200, "global", "G_E012", req, res, {});
};
