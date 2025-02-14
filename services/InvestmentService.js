"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const investments_1 = __importDefault(require("../models/investments"));
const DBService_1 = __importDefault(require("./DBService"));
class InvestmentService extends DBService_1.default {
    constructor(populatedFields = []) {
        super(investments_1.default, populatedFields);
    }
}
exports.default = InvestmentService;
//# sourceMappingURL=InvestmentService.js.map