const jwt = require("jsonwebtoken");
const logger = require("../util/log");
const TokenModel = require("../models/token.model");

module.exports.signToken = async (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: 1800 // expires in 30 min
  });
};

module.exports.tokenVerify = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};


module.exports.verify_token = async (token, options) => {
  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET, options);
    return decoded;
  } catch (err) {
    logger.error(err.message, err);
    throw err;
  }
};

module.exports.saveToken = async (insert) => {
  try {
    let token = new TokenModel(insert);
    return token.save();
  } catch (err) {
    logger.error(err.message, err);
    throw err.message;
  }
};

//find in token
module.exports.findToken = async (conditions) => {
  try {
    return await TokenModel.findOne(conditions).populate("user");
  } catch (err) {
    logger.error(err.message, err);
    throw err.message;
  }
};

//to update token
module.exports.updateToken = async (id, udatedata) => {
  try {
    return await TokenModel.findByIdAndUpdate(id, udatedata, { new: true });
  } catch (err) {
    logger.error(err.message);
    throw err.message;
  }
};

module.exports.createLogin = async (user, ip, useragent) => {
    const id = user._id;
    const payload = {
      user: id,
      jwtToken: this.signToken(id,),
      refreshToken: this.refreshToken(id),
      requestData: useragent,
      createdByIp: ip,
    };
    const token = await TokenModel.create(payload);
    logger.data("Generated token details", token);
    return {
      token: token.jwtToken,
      refreshToken: token.refreshToken,
      type: user?.accountType,
      email: user?.email,
      name: user?.name,
    };
  };
  
  module.exports.refreshToken = async (id) => {
    return jwt.sign({ id: id }, process.env.REFRESH_SECRET, {
      //expiresIn: 86400 // expires in 24 hours
      expiresIn: "30d",
      //expiresIn: "7d",
    });
  };
  
