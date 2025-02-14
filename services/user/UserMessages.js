"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = __importDefault(require("../../models/user/message"));
const DBService_1 = __importDefault(require("../DBService"));
class UserMessageService extends DBService_1.default {
    constructor(populatedFields = []) {
        super(message_1.default, populatedFields);
    }
}
exports.default = UserMessageService;
//# sourceMappingURL=UserMessages.js.map