const responser = require("../../core/responser");
const logger = require("../../util/log");
const authService = require("../../services/auth");

module.exports.login = async (req, res, next) => {
  logger.info("START: Login API Handler");
  const user = await authService.login(req.body, req.ip, req.useragent);
  return responser.send(200, "global", "G_E007", req, res, user);
};

module.exports.logout = async (req, res, next) => {
  logger.info("START: logout api");
  let reqData = JSON.parse(req.body);
  await authService.logout (reqData);
  return responser.send(200, "global", "G_E008", req, res, {message: "logout successfull"});
};
