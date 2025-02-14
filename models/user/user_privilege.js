"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppConstants_1 = require("../../common/constants/AppConstants");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ObjectId = mongoose_1.Types.ObjectId;
const UserPrivilegeSchema = new mongoose_1.Schema({
    user: { type: ObjectId, ref: "User", unique: true },
    role: { type: String, required: true, enum: Object.values(AppConstants_1.USER_ROLES) },
    created_by: { type: ObjectId, ref: "User" },
    updated_by: { type: ObjectId, ref: "User" },
    deleted_by: { type: ObjectId, ref: "User" },
    status: { type: String, default: AppConstants_1.ITEM_STATUS.ACTIVE, enum: Object.values(AppConstants_1.ITEM_STATUS) }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
UserPrivilegeSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = (0, mongoose_1.model)("UserPrivilege", UserPrivilegeSchema);
//# sourceMappingURL=user_privilege.js.map