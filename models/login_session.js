"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppConstants_1 = require("../common/constants/AppConstants");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ObjectId = mongoose_1.Types.ObjectId;
const LoginSessionSchema = new mongoose_1.Schema({
    uuid: { type: String, unique: true, trim: true, required: true },
    otp: { type: ObjectId, ref: "Token" },
    user: { type: ObjectId, required: true, ref: 'User' },
    status: { type: Number, enum: Object.values(AppConstants_1.BIT), default: AppConstants_1.BIT.ON },
    expiry_date: { type: Date },
    logged_out: { type: Boolean, default: false },
    expired: { type: Boolean, default: false },
    os: { type: String },
    version: { type: String },
    device: { type: String }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
LoginSessionSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = (0, mongoose_1.model)("LoginSession", LoginSessionSchema);
//# sourceMappingURL=login_session.js.map