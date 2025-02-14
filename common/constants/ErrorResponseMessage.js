"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppConstants_1 = require("./AppConstants");
class ErrorResponseMessage {
    constructor() {
        this.ERROR = {
            response_code: 1,
            message: "An error occurred",
        };
        this.USER_NOT_FOUND = {
            response_code: 2,
            message: "User not found",
        };
        this.DUPLICATE_EMAIL = {
            response_code: 3,
            message: "This email already exist, please try a different email",
        };
        this.DUPLICATE_PHONE = {
            response_code: 4,
            message: "This phone number already exist, please try a different phone number",
        };
        this.UNABLE_TO_SAVE = {
            response_code: 5,
            message: "Unable to save",
        };
        this.UNABLE_TO_COMPLETE_REQUEST = {
            response_code: 6,
            message: "Unable to complete request",
        };
        this.INVALID_REQUEST = {
            response_code: 7,
            message: "Invalid request",
        };
        this.INVALID_LOGIN = {
            response_code: 8,
            message: "Invalid details were provided",
        };
        this.ACCOUNT_BLOCKED = {
            response_code: 9,
            message: "Account may have been blocked or suspended. Please contact support.",
        };
        this.INVALID_TOKEN = {
            response_code: 10,
            message: "Unable to verify token",
        };
        this.UPDATE_NOT_PERMITTED = {
            response_code: 11,
            message: "This update is not permitted",
        };
        this.ACCOUNT_ACTIVATION_REQUIRED = {
            response_code: 12,
            message: "Account activation required",
        };
        this.ID_EXISTS = {
            response_code: 13,
            message: "ID exists",
        };
        this.ALREADY_ACTIVATED = {
            response_code: 14,
            message: "Account already activated",
        };
        this.SESSION_EXPIRED = {
            response_code: 15,
            message: "Session expired. Please login again",
        };
        this.EMAIL_REQUIRED = {
            response_code: 16,
            message: "Email is required",
        };
        this.PHONE_REQUIRED = {
            response_code: 17,
            message: "Phone is required",
        };
        this.PASSWORD_REQUIRED = {
            response_code: 18,
            message: "Password is required",
        };
        this.USERNAME_REQUIRED = {
            response_code: 19,
            message: "Username is required",
        };
        this.CONTACT_ADMIN = {
            response_code: 20,
            message: "An error occurred, please contact admin",
        };
        this.UNABLE_TO_LOGIN = {
            response_code: 21,
            message: "Unable to login",
        };
        this.INVALID_TOKEN_USER = {
            response_code: 22,
            message: "Invalid user session. Please login again",
        };
        this.PASSWORD_MISMATCH = {
            response_code: 23,
            message: "Passwords do not match",
        };
        this.PASSWORD_UPDATE_REQUIRED = {
            response_code: 24,
            message: "Password update is required for this account",
        };
        this.INVALID_SESSION = {
            response_code: 25,
            message: "Invalid login session ID",
        };
        this.INVALID_SESSION_USER = {
            response_code: 26,
            message: "Unable to validate user from login session",
        };
        this.INVALID_PERMISSION = {
            response_code: 27,
            message: "Sorry you do not have permission to perform this action",
        };
        this.INVALID_ROLE = {
            response_code: 28,
            message: "The user role you are assigning to this user is invalid",
        };
        this.INVALID_EMAIL = {
            response_code: 29,
            message: "Invalid email address format",
        };
        this.FILE_NOT_FOUND = {
            response_code: 30,
            message: "We couldn't fnd the file you are uploading",
        };
        this.INVALID_PHOTO_TYPE = {
            response_code: 31,
            message: "Invalid photo type (extension). Only jpeg and png files are allowed",
        };
        this.FILE_SIZE_LIMIT = {
            response_code: 32,
            message: "The size of this file is larger than the accepted limit",
        };
        this.UPLOAD_ERROR = {
            response_code: 33,
            message: "Error uploading file. Please try again",
        };
        this.EXISTING_REQUEST = {
            response_code: 34,
            message: "There is an already existing request waiting for approval",
        };
        this.ACCOUNT_CREATION_ERROR = {
            response_code: 36,
            message: "An error occurred while creating your account, please try again",
        };
        this.INVALID_OTP = {
            response_code: 37,
            message: "the otp entered is either invalid or has expired",
        };
        this.TOKEN_EXPIRED = {
            response_code: 38,
            message: "Token expired. Please login again",
        };
        this.SHORT_PASSWORD = {
            response_code: 39,
            message: "Password is too short! Must be longer than " + AppConstants_1.PASSWORD_LENGTH,
        };
        this.INCOMPLETE_REQUEST_PAYLOAD = {
            response_code: 40,
            message: "Incomplete request payload",
        };
        this.CATEGORY_ALREADY_EXISTS = {
            response_code: 41,
            message: "Opps! This product category already exists",
        };
        // Add more Error Objects
        this.ACCOUNT_REVIEW_REQUIRED = {
            response_code: 42,
            message: "Your account is in review. You will receive an update via email. Thank you!",
        };
        this.ACCOUNT_SUSPENDED = {
            response_code: 43,
            message: "Your account is suspended. You will receive an update via email.",
        };
        this.INSUFFICIENT_BALANCE = {
            response_code: 43,
            message: "Insufficient main balance.",
        };
        this.LESS_THAN_WITHDRAWABLE_AMOUNT = {
            response_code: 44,
            message: "amount can't be less than " + AppConstants_1.MINIMUIM_WITHDRAWABLE_BALANCE,
        };
        this.ITEM_NOT_FOUND = {
            response_code: 45,
            message: "item not found",
        };
        this.INVESTMENT_NOT_ACTIVE = {
            response_code: 46,
            message: "investment already liquidated",
        };
    }
    missingFieldMessage(input) {
        return {
            response_code: 0,
            message: input + " is required",
        };
    }
    resourceNotFoundMessage(input) {
        return {
            response_code: 35,
            message: input + " was not found",
        };
    }
}
exports.default = ErrorResponseMessage;
//# sourceMappingURL=ErrorResponseMessage.js.map