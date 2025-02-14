"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppConstants_1 = require("../common/constants/AppConstants");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ObjectId = mongoose_1.Types.ObjectId;
const MessageSchema = new mongoose_1.Schema({
    user: { type: ObjectId, ref: 'User', required: true },
    status: { type: String, default: AppConstants_1.ITEM_STATUS.ACTIVE, enum: Object.values(AppConstants_1.ITEM_STATUS) },
    message_body: { type: String, required: true },
    message_subject: { type: String, required: true },
    is_read: { type: Boolean, required: true, default: false },
    created_by: { type: ObjectId, ref: "User", required: true },
    updated_by: { type: ObjectId, ref: "User" },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});
MessageSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = (0, mongoose_1.model)("Message", MessageSchema);
//# sourceMappingURL=message.js.map