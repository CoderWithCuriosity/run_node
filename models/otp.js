"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppConstants_1 = require("../common/constants/AppConstants");
const ObjectId = mongoose_1.Types.ObjectId;
const OtpSchema = new mongoose_1.Schema({
    expiry_date: { type: Date, required: true },
    code: { type: String, required: true },
    user: { type: ObjectId, ref: "User", required: true },
    status: { type: String, default: AppConstants_1.ITEM_STATUS.ACTIVE, enum: Object.values(AppConstants_1.ITEM_STATUS) },
    created_by: { type: ObjectId, ref: "User" }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
exports.default = (0, mongoose_1.model)("Otp", OtpSchema);
//# sourceMappingURL=otp.js.map