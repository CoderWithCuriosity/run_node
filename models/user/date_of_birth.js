"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppConstants_1 = require("../../common/constants/AppConstants");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ObjectId = mongoose_1.Types.ObjectId;
const DateOfBirthSchema = new mongoose_1.Schema({
    day: { type: Number, required: true },
    week: { type: Number, required: true },
    month: { type: Number, required: true },
    month_name: { type: String, required: true },
    year: { type: Number, required: true },
    week_day: { type: String, required: true },
    user: { type: ObjectId, required: true, ref: 'User' },
    status: { type: String, default: AppConstants_1.ITEM_STATUS.ACTIVE, enum: Object.values(AppConstants_1.ITEM_STATUS) }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
DateOfBirthSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = (0, mongoose_1.model)("DateOfBirth", DateOfBirthSchema);
//# sourceMappingURL=date_of_birth.js.map