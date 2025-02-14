"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_privilege_1 = __importDefault(require("../../models/user/user_privilege"));
const DBService_1 = __importDefault(require("../DBService"));
class UserPrivilegeService extends DBService_1.default {
    constructor(populatedFields = []) {
        super(user_privilege_1.default, populatedFields);
    }
}
exports.default = UserPrivilegeService;
//# sourceMappingURL=UserPrivilegeService.js.map