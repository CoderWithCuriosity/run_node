"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
class Cors {
    static corsSettings() {
        const corsOptions = {
            origin: ["http://localhost:5173", "http://localhost:5174", "https://assetsbit.vercel.app", "https://assetsbit.com"],
            methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Date", "Content-Type", "Origin", "Authorization"],
            credentials: true,
            optionSuccessStatus: 200,
        };
        return (0, cors_1.default)(corsOptions);
    }
}
exports.default = Cors.corsSettings;
//# sourceMappingURL=Cors.js.map