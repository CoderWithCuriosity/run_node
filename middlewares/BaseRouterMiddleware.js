"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserService_1 = __importDefault(require("../services/user/UserService"));
const RequestService_1 = __importDefault(require("../services/RequestService"));
const BaseResponseHandler_1 = __importDefault(require("../controllers/basecontrollers/BaseResponseHandler"));
class BaseRouterMiddleware extends BaseResponseHandler_1.default {
    constructor(appRouter) {
        super();
        this.router = appRouter;
        this.userService = new UserService_1.default();
        this.requestService = new RequestService_1.default(this.router);
        this.initServices();
    }
}
exports.default = BaseRouterMiddleware;
//# sourceMappingURL=BaseRouterMiddleware.js.map