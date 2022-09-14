
//Other Imports
const logger = require("../util/log");
const tokenService = require("./token");
const AppError = require("../core/errorHandler/appError");

module.exports.login = async (reqBody, ip, useragent) => {
    const { email, password } = reqBody;
    if (!email || !password) throw new AppError(400, "global", "G_E016");
   const filter = {
      email,
      Status: 1,
    };
    // 2) Check if user exists && password is correct
    logger.info("Checking if user exist and password is correct");
    logger.data("User search filter applied");
    const user = await UserModel.findOne(
      filter,
      ` password email name`
    );
    logger.data("User info fetched");
  
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new AppError(400, "global", G_E016);
    }
    logger.info("User and Password check Success. Sending token to the user");
  
    // 3) If everything ok, send token to client
    return await tokenService.createLogin(user, ip, useragent);
  };

  module.exports.logout = async(reqData)=>{
    if (!reqData.refreshToken) throw new AppError(400, "global", "G_E009")
    const  token = reqData.refreshToken; 
    logger.data("refresh token", token);
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    if (!decoded) throw new AppError(400, "global", "G_E010");
      const userid = req.userid;
      let findRefreshToken = await tokenService.findToken({
        user: userid,
        refreshToken: token,
        Status: 0,
      });
      if (findRefreshToken) {
        logger.data("token in database", findRefreshToken);
        let udatedata = {
          Status: 1,
          updatedOn: new Date(),
        };
        logger.data("updating data", udatedata);
        await tokenService.updateToken(findRefreshToken._id, udatedata);
      }
    
  }
  