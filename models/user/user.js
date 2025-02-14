"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppConstants_1 = require("../../common/constants/AppConstants");
const DateUtils_1 = __importDefault(require("../../common/utils/DateUtils"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const ObjectId = mongoose_1.Types.ObjectId;
const UserSchema = new mongoose_1.Schema({
    first_name: { type: String, required: [true, "first name is required"] },
    last_name: { type: String, required: [true, "last name is required"] },
    middle_name: { type: String },
    email: { type: String, lowercase: true, index: true, unique: true, trim: true, required: [true, "email is required"] },
    password: { type: String, required: [true, "password is required"], select: false },
    phone: { type: String, unique: true, index: true, required: [true, "phone is required"], trim: true },
    phone_country_code: { type: String, default: AppConstants_1.DEFAULT_COUNTRY_CODE },
    gender: { type: String, lowercase: true, required: [true, "gender is required"], enum: Object.values(AppConstants_1.GENDER) },
    dob: { type: Date },
    profile_pic_url: { type: String, default: " " },
    ip_address: { type: String, default: " " },
    country_code: { type: String, default: " " },
    location: { type: String, default: "None" },
    profile_pic_thumbnail_url: { type: String },
    status: { type: String, default: AppConstants_1.USER_STATUS.PENDING, enum: Object.values(AppConstants_1.USER_STATUS) },
    is_active: { type: Boolean, default: false },
    last_active_at: { type: Date, default: new Date() },
    require_new_password: { type: Boolean, default: false },
    created_by: { type: ObjectId, ref: "User" },
    updated_by: { type: ObjectId, ref: "User" },
    deleted_by: { type: ObjectId, ref: "User" },
    referral_code: { type: String, required: true, lowercase: true, unique: true, trim: true },
    referred_by: { type: String, required: false, lowercase: true, trim: true, default: "None" },
    day_created: { type: Number },
    week_created: { type: Number },
    month_created: { type: Number },
    year_created: { type: Number },
    week_day_created: { type: String },
    hour_created: { type: Number },
    am_or_pm: { type: String },
    payoutInfo: {
        bank: {
            accountName: { type: String, default: AppConstants_1.BANK_DETAILS.ACCOUNT_NAME },
            accountNumber: { type: String, default: AppConstants_1.BANK_DETAILS.ACCOUNT_NUMBER },
            bicOrSwiftCode: { type: String, default: AppConstants_1.BANK_DETAILS.BIC_OR_SWIFT_CODE },
            bankName: { type: String, default: AppConstants_1.BANK_DETAILS.BANK_NAME },
            nationalCode: { type: String, default: AppConstants_1.BANK_DETAILS.NATIONAL_CODE },
            bankAddress: { type: String, default: AppConstants_1.BANK_DETAILS.BANK_ADDRESS },
        },
        crypto: [
            {
                symbol: String,
                address: String,
                network: String,
            },
        ],
    },
    social_media: [
        {
            facebook: String,
            twitter: String,
            linkedin: String
        }
    ]
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
UserSchema.virtual('full_name').get(function () {
    if (this.middle_name)
        return `${this.first_name} ${this.middle_name} ${this.last_name}`;
    return `${this.first_name} ${this.last_name}`;
});
UserSchema.virtual('phone_with_country_code').get(function () {
    const phoneWithoutZero = parseInt(this.phone);
    const phone = '+' + this.phone_country_code + phoneWithoutZero.toString();
    return phone;
});
UserSchema.methods.hideProtected = function () {
    this.password = undefined;
};
UserSchema.pre('save', function () {
    return new Promise((resolve, reject) => {
        const dateUtils = new DateUtils_1.default();
        if (this.isNew) {
            dateUtils.register(this);
        }
        resolve();
    });
});
UserSchema.plugin(mongoose_paginate_v2_1.default);
exports.default = (0, mongoose_1.model)("User", UserSchema);
//# sourceMappingURL=user.js.map