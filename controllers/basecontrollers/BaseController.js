"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-empty-function */
const express_1 = __importDefault(require("express"));
const AppUtils_1 = __importDefault(require("../../common/utils/AppUtils"));
const UserMiddleware_1 = __importDefault(require("../../middlewares/user/UserMiddleware"));
const UserService_1 = __importDefault(require("../../services/user/UserService"));
const RequestService_1 = __importDefault(require("../../services/RequestService"));
const BaseResponseHandler_1 = __importDefault(require("./BaseResponseHandler"));
const Logger_1 = __importDefault(require("../../common/utils/Logger"));
const UploadMiddleware_1 = __importDefault(require("./../../middlewares/UploadMiddleware"));
class BaseAccountController extends BaseResponseHandler_1.default {
    constructor() {
        super();
        this.router = express_1.default.Router();
        this.appUtils = new AppUtils_1.default();
        this.userService = new UserService_1.default();
        this.userMiddleWare = new UserMiddleware_1.default(this.router);
        this.requestService = new RequestService_1.default(this.router);
        this.uploadMiddleware = new UploadMiddleware_1.default(this.router);
        this.logger = new Logger_1.default();
        this.initializeServices();
        this.initializeMiddleware();
        this.initializeRoutes();
    }
    logError(err, userId) {
        this.logger.logError(err, userId);
    }
    getSafeUserData(user) {
        return this.userService.getSafeUserData(user);
    }
}
exports.default = BaseAccountController;
//# sourceMappingURL=BaseController.js.map