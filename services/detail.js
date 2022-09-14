const UserModel = require("../models/user.model");

module.exports.updatedetail = async (userid, reqBody, ip, useragent) => {
  // TODO: verify the reqBody
  const dataToUpdate = {
    ...reqBody,
    updatedBy: ip,
    Status: 1,
    updatedAgent: useragent,
  };
  const data = await UserModel.findByIdAndUpdate(userid, dataToUpdate);
  return data;
};
module.exports.deletedetail = async (userid, ip, useragent) => {
  const dataToUpdate = {
    updatedBy: ip,
    Status: 0,
    updatedAgent: useragent,
  };
  // changing the status to 0
  const data = await UserModel.findByIdAndUpdate(userid, dataToUpdate);
  return data;
};
module.exports.getdetail = async (userid, ip, useragent) => {
  const data = await UserModel.findOne(
    { _id: userid, Status: 1 },
    {
      email: 1,
      name: 1,
      accountType: 1,
      DateofJoin: 1,
    }
  );
  return data;
};
module.exports.getAll = async () => {
  const data = await UserModel.find(
    { Status: 1 },
    { email: 1, name: 1, accountType: 1, DateofJoin: 1 }
  );
  return data;
};
