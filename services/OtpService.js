"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otp_1 = __importDefault(require("../models/otp"));
const DBService_1 = __importDefault(require("./DBService"));
class OtpService extends DBService_1.default {
    constructor(populatedFields = []) {
        super(otp_1.default, populatedFields);
    }
}
exports.default = OtpService;
//# sourceMappingURL=OtpService.js.map