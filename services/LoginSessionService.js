"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const login_session_1 = __importDefault(require("../models/login_session"));
const DBService_1 = __importDefault(require("./DBService"));
class LoginSessionService extends DBService_1.default {
    constructor(populatedFields = []) {
        super(login_session_1.default, populatedFields);
    }
}
exports.default = LoginSessionService;
//# sourceMappingURL=LoginSessionService.js.map