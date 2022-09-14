const jwt = require("jsonwebtoken");
const logger = require("../util/log");


module.exports.verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  try {
    if (!bearerHeader) throw new Error("authorization header not Found");
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    logger.data("token", bearerToken);
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
    logger.data("decoded", decoded);
    const createDateTimestamp = decoded.iat * 1000;
    const createdate = new Date(createDateTimestamp);
    logger.data("createdate", createdate);
    const expires = new Date(decoded.exp * 1000);
    logger.data("expires", expires);
      const userid = decoded.id;
      const query = {
        filter: {
          _id: userid,
        },
        projection: {
          _id: 1,
          name: 1,
          email: 1,
          accountType: 1,
          accessLevel: 1,
        },
      };
    const user = await UserModel.findOne(query.filter, query.projection);

    if (!user.length) throw new Error("User Does Not Exist");

      req.accountType = user.accountType;
      req.userid = userid;
      req.accessLevel = user?.accessLevel;
      req.user = user;
      next();
  } catch (error) {
    logger.error(`Authentication Failed, error: ${error.stack}`);
    res.status(401).send("Unauthorized"); // Return a 401 Unauthorized response
  }
};

module.exports.restrictTo = (...accessLevel) => {
  return (req, res, next) => {
    if (req.accountType == "admin" && accessLevel[0] == "any") return next();
    if (
      !(
        req.accountType == "admin" &&
        accessLevel.some((access) => req.user.accessLevel.includes(access))
      )
    ) {
      res.status(403).send({
        status: "error",
        message: "You do not have permission to perform this action",
      });
    } else {
      next();
    }
  };
};
