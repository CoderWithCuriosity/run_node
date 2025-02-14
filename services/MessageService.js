"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = __importDefault(require("../models/message"));
const DBService_1 = __importDefault(require("./DBService"));
class MessageService extends DBService_1.default {
    constructor(populatedFields = []) {
        super(message_1.default, populatedFields);
    }
}
exports.default = MessageService;
//# sourceMappingURL=MessageService.js.map