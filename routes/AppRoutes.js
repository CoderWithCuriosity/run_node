"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("../App");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const UserPrivilegeMiddleware_1 = __importDefault(require("../middlewares/user/UserPrivilegeMiddleware"));
class AppRoutes {
    constructor(app) {
        this.app = app;
    }
    initializeRoutes() {
        this.app.use(App_1.API_PATH + "/me", UserController_1.default);
        const APP_PATH = "/app";
        const adminPrivilegeMiddleware = new UserPrivilegeMiddleware_1.default(this.app, []);
        this.app.use(App_1.API_PATH + APP_PATH, adminPrivilegeMiddleware.validatePrivileges);
    }
}
exports.default = AppRoutes;
//# sourceMappingURL=AppRoutes.js.map