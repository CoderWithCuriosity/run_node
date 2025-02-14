"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppConstants_1 = require("../../common/constants/AppConstants");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ObjectId = mongoose_1.Types.ObjectId;
const WalletSchema = new mongoose_1.Schema({
    name: { type: String, trim: true, required: [true, "name field can't be empty"] },
    symbol: { type: String, trim: true, required: [true, "symbol field can't be empty"] },
    address: { type: String, trim: true, required: [true, "address field can't be empty"] },
    network: { type: String, trim: true, required: [true, "network field can't be empty"] },
    image: { type: String, trim: true },
    rank: { type: Number, trim: true },
    updated_by: { type: ObjectId, ref: "User" },
    status: { type: String, default: AppConstants_1.ITEM_STATUS.ACTIVE, enum: Object.values(AppConstants_1.ITEM_STATUS) },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});
WalletSchema.plugin(mongoose_paginate_v2_1.default);
const Wallet = (0, mongoose_1.model)("Wallet", WalletSchema);
exports.default = Wallet;
//# sourceMappingURL=wallet.js.map