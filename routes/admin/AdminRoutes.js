"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("../../App");
const AppConstants_1 = require("../../common/constants/AppConstants");
const UserPrivilegesController_1 = __importDefault(require("../../controllers/UserPrivilegesController"));
const UserPrivilegeMiddleware_1 = __importDefault(require("../../middlewares/user/UserPrivilegeMiddleware"));
const AdminTransactionController_1 = __importDefault(require("../../controllers/admin/AdminTransactionController"));
const AdminUserController_1 = __importDefault(require("../../controllers/admin/AdminUserController"));
const AdminWalletController_1 = __importDefault(require("../../controllers/admin/AdminWalletController"));
class AdminRoutes {
    constructor(app) {
        this.app = app;
    }
    initializeRoutes() {
        const ADMIN_PATH = "/admin";
        const userPrivilegeMiddleware = new UserPrivilegeMiddleware_1.default(this.app, [AppConstants_1.USER_ROLES.ADMIN, AppConstants_1.USER_ROLES.SUPER_ADMIN]);
        this.app.use(App_1.API_PATH + ADMIN_PATH, userPrivilegeMiddleware.validatePrivileges);
        this.app.use(App_1.API_PATH + ADMIN_PATH + "/privileges", UserPrivilegesController_1.default);
        this.app.use(App_1.API_PATH + ADMIN_PATH + "/transaction", AdminTransactionController_1.default);
        this.app.use(App_1.API_PATH + ADMIN_PATH + "/user", AdminUserController_1.default);
        this.app.use(App_1.API_PATH + ADMIN_PATH + "/wallet", AdminWalletController_1.default);
    }
}
exports.default = AdminRoutes;
//# sourceMappingURL=AdminRoutes.js.map