"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppConstants_1 = require("../../common/constants/AppConstants");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ObjectId = mongoose_1.Types.ObjectId;
const IRASchema = new mongoose_1.Schema({
    full_name: { type: String, required: [true, "full name is required"] },
    email: { type: String, lowercase: true, index: true, unique: true, trim: true, required: [true, "email is required"] },
    phone: { type: String, unique: true, index: true, required: [true, "phone is required"], trim: true },
    govt_id: { type: String },
    ssn: { type: String },
    status: { type: String, default: AppConstants_1.USER_STATUS.PENDING, enum: Object.values(AppConstants_1.USER_STATUS) },
    created_by: { type: ObjectId, ref: "User" },
    updated_by: { type: ObjectId, ref: "User" },
    deleted_by: { type: ObjectId, ref: "User" },
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
IRASchema.plugin(mongoose_paginate_v2_1.default);
exports.default = (0, mongoose_1.model)("Ira", IRASchema);
//# sourceMappingURL=ira_application.js.map