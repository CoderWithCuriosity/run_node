"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
class DateUtils {
    getMonth(date) {
        return date.getMonth() + 1;
    }
    getMonthName(date) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const month = date.getMonth();
        return monthNames[month];
    }
    getMinutes(date) {
        return date.getMinutes() + 1;
    }
    getSeconds(date) {
        return date.getSeconds() + 1;
    }
    getDay(date) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    }
    getDayByNumber(position) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[position - 1];
    }
    getWeek(date) {
        return (0, moment_1.default)(date).format('w');
    }
    addToDate(date, period, number) {
        //where period is minutes, days, hours, months, etc and number is the quantity to add
        return (0, moment_1.default)(date).add(number, period);
    }
    subtractFromDate(date, period, number) {
        //where period is minutes, days, hours, months, etc and number is the quantity to subtract
        return (0, moment_1.default)(date).subtract(number, period);
    }
    formatDate(date, format) {
        return (0, moment_1.default)(date, format);
    }
    getDateDifference(startDate, endDate, value) {
        return (0, moment_1.default)(endDate).diff((0, moment_1.default)(startDate), value);
    }
    register(data) {
        const currentDate = new Date();
        data.day_created = currentDate.getDate();
        data.week_created = this.getWeek(currentDate);
        data.month_created = this.getMonth(currentDate);
        data.year_created = currentDate.getFullYear();
        data.week_day_created = this.getDay(currentDate);
        data.hour_created = currentDate.getHours();
        data.am_or_pm = (0, moment_1.default)().format('A');
        return data;
    }
}
exports.default = DateUtils;
//# sourceMappingURL=DateUtils.js.map