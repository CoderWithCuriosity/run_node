"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppConstants_1 = require("../common/constants/AppConstants");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ObjectId = mongoose_1.Types.ObjectId;
const InvestmentSchema = new mongoose_1.Schema({
    user: { type: ObjectId, ref: 'User', required: true },
    plan: { type: String, required: true, enum: Object.values(AppConstants_1.INVESTMENT_PLANS) },
    amount: { type: Number, required: true },
    capital: { type: Number, required: true },
    transaction_type: { type: String, required: true, enum: ["credit", "debit"] },
    maturityDate: { type: Date, required: true },
    status: { type: String, default: AppConstants_1.ITEM_STATUS.ACTIVE, enum: Object.values(AppConstants_1.ITEM_STATUS) },
    isMatured: { type: Boolean, default: false }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});
InvestmentSchema.plugin(mongoose_paginate_v2_1.default);
const Investment = (0, mongoose_1.model)("Investment", InvestmentSchema);
exports.default = Investment;
//# sourceMappingURL=investments.js.map