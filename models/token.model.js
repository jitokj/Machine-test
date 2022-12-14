const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserModel = require('./user.model');

var TokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    jwtToken: { type: String },
    refreshToken: { type: String },
    createdByIp: { type: String },
    Status: {
        type: Number, required: true, default: 0 //0:active, 1:inactive
    },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
    requestData: Object
});

TokenSchema.index({ user: 1, Status:1 });

module.exports = mongoose.model("token", TokenSchema);
