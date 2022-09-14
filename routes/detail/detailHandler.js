const responser = require("../../core/responser");
const logger = require("../../util/log");
const detailsService = require("../../services/detail");


module.exports.updatedetail = async (req, res, next) => {
  logger.info("START: update detail of employee");
  const data = await detailsService.updatedetail(req.params.userid,req.body, req.ip, req.useragent);
  logger.data("result ",data);
  return responser.send(200, "global", "G_E013", req, res, data);
};

module.exports.deletedetail = async (req, res, next) => {
    logger.info("START: delete detail of employee");
    const data = await detailsService.deletedetail(req.params.userid, req.ip, req.useragent);
    logger.data("result ",data);
    return responser.send(200, "global", "G_E014", req, res, {message: "employee deleted"});
  };

  module.exports.getdetail = async (req, res, next) => {
    logger.info("START: get details of employee");
    const data = await detailsService.getdetail(req.params.userid, req.ip, req.useragent);
    logger.data("result ",data);
    return responser.send(200, "global", "G_E015", req, res, data);
  };

  module.exports.getAll = async (req, res, next) => {
    logger.info("START: getAll details of employee");
    const data = await detailsService.getAll();
    logger.data("result ",data);
    return responser.send(200, "global", "G_E015", req, res, data);
  };