"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("../../App");
const TransactionController_1 = __importDefault(require("../../controllers/user/TransactionController"));
const UserPrivilegeMiddleware_1 = __importDefault(require("../../middlewares/user/UserPrivilegeMiddleware"));
class UserRoutes {
    constructor(app) {
        this.app = app;
    }
    initializeRoutes() {
        const USER_PATH = "/user";
        const userPrivilegeMiddleware = new UserPrivilegeMiddleware_1.default(this.app, []);
        this.app.use(App_1.API_PATH + USER_PATH, userPrivilegeMiddleware.validatePrivileges);
        this.app.use(App_1.API_PATH + USER_PATH + "/transaction", TransactionController_1.default);
    }
}
exports.default = UserRoutes;
//# sourceMappingURL=UserRoutes.js.map