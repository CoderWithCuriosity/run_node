"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../../common/utils/Logger"));
const mongoose_1 = __importDefault(require("mongoose"));
const ErrorResponseMessage_1 = __importDefault(require("../../common/constants/ErrorResponseMessage"));
const SucessResponseMessage_1 = __importDefault(require("../../common/constants/SucessResponseMessage"));
class BaseResponseHandler {
    constructor() {
        this.errorResponseMessage = new ErrorResponseMessage_1.default();
        this.successResponseMessage = new SucessResponseMessage_1.default();
        this.loggerService = new Logger_1.default();
    }
    sendErrorResponse(res, err, responseMessage, statusCode, userId) {
        let status = 400;
        let response;
        if (err instanceof mongoose_1.default.Error.ValidationError) {
            response = {
                message: err.message,
                success: false,
                error_code: -1
            };
        }
        else if (this.isDuplicateKeyError(err)) {
            //Extract the duplicate field from the error message
            const start = err.message.indexOf("index: ");
            const end = err.message.indexOf(" dup key:");
            const duplicateKey = err.message.slice(start + 7, end);
            const field = duplicateKey.slice(0, duplicateKey.lastIndexOf("_"));
            response = {
                message: "Duplicate value for " + field,
                success: false,
                error_code: -2
            };
        }
        else {
            response = {
                message: responseMessage.message,
                success: false,
                error_code: responseMessage.response_code
            };
            status = statusCode;
            this.loggerService.logError(err, userId);
        }
        res.status(status).json(response);
    }
    sendSuccessResponse(res, data = {}, statusCode = 200) {
        const response = {
            success: true,
            data: data
        };
        res.status(statusCode).json(response);
    }
    isDuplicateKeyError(error) {
        if (error.message.includes("E11000 duplicate key error collection"))
            return true;
        return false;
    }
}
exports.default = BaseResponseHandler;
//# sourceMappingURL=BaseResponseHandler.js.map