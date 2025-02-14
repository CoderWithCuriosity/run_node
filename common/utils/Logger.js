"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
require("winston-mongodb");
class Logger {
    logError(error, userId) {
        winston_1.default.add(new winston_1.default.transports.Console({
            format: winston_1.default.format.prettyPrint(),
        }));
        winston_1.default.add(
        // @ts-ignore
        new winston_1.default.transports.MongoDB({
            db: process.env.MONGODB_URI,
            options: {
                dbName: "show-mart-logs",
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        }));
        if (process.env.ENVIRONMENT == "prod") {
            // winston.add(
            //     new winston.transports.File({
            //         filename: "Error Logs.log",
            //         format: winston.format.prettyPrint(),
            //     })
            // );  
        }
        winston_1.default.log({
            level: "error",
            message: error.message,
            metadata: { error, user: userId },
            time_stamp: new Date()
        });
    }
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map