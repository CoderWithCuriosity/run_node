"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_1 = __importDefault(require("../models/user/wallet"));
const DBService_1 = __importDefault(require("./DBService"));
class WalletService extends DBService_1.default {
    constructor(populatedFields = []) {
        super(wallet_1.default, populatedFields);
    }
}
exports.default = WalletService;
//# sourceMappingURL=WalletService.js.map