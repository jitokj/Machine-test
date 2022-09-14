const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paginate = require("mongoose-paginate-v2");
const bcrypt = require("bcryptjs");

const logger = require("../util/log");

const nameMinLength = 1;
const nameMaxLength = 100;
const emailMaxLength = 256;

const UserSchema = mongoose.Schema({
  accountType: {
    type: String,
    enum: ["user", "admin"],
    required: true,
    default: "user",
  },
  name: {
    type: String,
    required: true,
    minLength: [
      nameMinLength,
      `{VALUE} is too short, minimum length is ${nameMinLength}`,
    ],
    maxLength: [
      nameMaxLength,
      `{VALUE} is too long, maximum length is ${nameMaxLength}`,
    ],
  },
  email: {
    type: String,
    lowercase: true,
    maxLength: [
      emailMaxLength,
      `{VALUE} is too long, maximum length is ${emailMaxLength}`,
    ],
  },
  password: { type: String },
  DateofJoin: { type: Date, required: true },
  // access level should be assigned to admin -> super,etc..
  accessLevel: [{ type: Schema.Types.String }],
  Status: {
    type: Number,
    required: true,
    default: 1, //1:active, 2:inactive, 3:deleted
  },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
  createdBy: { type: String, required: true, default: "system" },
  updatedBy: { type: String, required: true, default: "system" },
  createdAgent: Object,
  updatedAgent: Object,
});

UserSchema.index({ Status: 1 });
UserSchema.index({ accountType: 1 });
UserSchema.index({ createdOn: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ name: 1 });

UserSchema.plugin(paginate);

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  logger.data(candidatePassword, userPassword);
  return await bcrypt.compare(candidatePassword, userPassword);
};

const user = mongoose.model("user", UserSchema);
module.exports = user;
