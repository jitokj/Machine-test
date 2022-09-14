const bcrypt = require("bcryptjs");

module.exports.createHash = async (password) => {
  return await bcrypt.hash(password, 10);
};