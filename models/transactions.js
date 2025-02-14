"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppConstants_1 = require("../common/constants/AppConstants");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ObjectId = mongoose_1.Types.ObjectId;
const TransactionSchema = new mongoose_1.Schema({
    user: { type: ObjectId, ref: 'User', required: true },
    account_type: { type: String, enum: Object.values(AppConstants_1.ACCOUNT_TYPE), required: true, default: 'main' },
    transaction_type: { type: String, enum: Object.values(AppConstants_1.TRANSACTION_TYPE), required: true, default: 'credit' },
    amount: { type: Number, required: true },
    transaction_status: { type: String, enum: Object.values(AppConstants_1.TRANSACTION_STATUS), default: 'pending' },
    status: { type: String, default: AppConstants_1.ITEM_STATUS.ACTIVE, enum: Object.values(AppConstants_1.ITEM_STATUS) },
    admin_comment: { type: String, lowercase: true, trim: true },
    payment_option: { type: String, enum: ["bank", "wallet"], lowercase: true, trim: true },
    selected_coin: { type: String, enum: ["usd", "usdt", "eth", "btc"], lowercase: true, trim: true },
    narration: { type: String, lowercase: true, trim: true, default: "deposit" },
    created_by: { type: ObjectId, ref: "User", required: true },
    updated_by: { type: ObjectId, ref: "User" },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});
TransactionSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = (0, mongoose_1.model)("Transaction", TransactionSchema);
//# sourceMappingURL=transactions.js.map