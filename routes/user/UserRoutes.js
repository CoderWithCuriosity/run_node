"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("../../App");
const TransactionController_1 = __importDefault(require("../../controllers/user/TransactionController"));
const InvestmentController_1 = __importDefault(require("../../controllers/user/InvestmentController"));
class UserRoutes {
    constructor(app) {
        this.app = app;
    }
    initializeRoutes() {
        const PRIVATE_USER_PATH = "/private/user";
        //  const userPrivilegeMiddleware = new UserPrivilegeMiddleware(this.app, [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.STARTER_USER]);
        //  this.app.use(API_PATH + PRIVATE_USER_PATH, userPrivilegeMiddleware.validatePrivileges);
        this.app.use(App_1.API_PATH + PRIVATE_USER_PATH + "/transaction", TransactionController_1.default);
        this.app.use(App_1.API_PATH + PRIVATE_USER_PATH + "/investment", InvestmentController_1.default);
    }
}
exports.default = UserRoutes;
//# sourceMappingURL=UserRoutes.js.map