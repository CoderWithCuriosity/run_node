"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DBService_1 = __importDefault(require("./DBService"));
const date_of_birth_1 = __importDefault(require("../models/user/date_of_birth"));
const DateUtils_1 = __importDefault(require("../common/utils/DateUtils"));
class DateOfBirthService extends DBService_1.default {
    constructor(populatedFields = []) {
        super(date_of_birth_1.default, populatedFields);
        this.dateUtils = new DateUtils_1.default();
    }
    createDOB(dob, user) {
        const date = new Date(dob);
        const dateOfBirth = {
            day: date.getDate(),
            week: this.dateUtils.getWeek(date),
            month: this.dateUtils.getMonth(date),
            month_name: this.dateUtils.getMonthName(date),
            year: date.getFullYear(),
            week_day: this.dateUtils.getDay(date),
            user: user
        };
        return dateOfBirth;
    }
}
exports.default = DateOfBirthService;
//# sourceMappingURL=DateOfBirthService.js.map