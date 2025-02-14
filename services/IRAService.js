"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ira_application_1 = __importDefault(require("../models/user/ira_application"));
const DBService_1 = __importDefault(require("./DBService"));
class IRAService extends DBService_1.default {
    constructor(populatedFields = []) {
        super(ira_application_1.default, populatedFields);
    }
}
exports.default = IRAService;
//# sourceMappingURL=IRAService.js.map