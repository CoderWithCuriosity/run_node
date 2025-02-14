"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPrivilegeMiddleware = void 0;
const AppConstants_1 = require("../../common/constants/AppConstants");
const UserPrivilegeService_1 = __importDefault(require("../../services/user/UserPrivilegeService"));
const BaseRouterMiddleware_1 = __importDefault(require("../BaseRouterMiddleware"));
class UserPrivilegeMiddleware extends BaseRouterMiddleware_1.default {
    constructor(appRouter, privileges = []) {
        super(appRouter);
        this.validatePrivileges = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const query = {
                user: user._id,
                role: { $in: this.userRoles },
                status: AppConstants_1.ITEM_STATUS.ACTIVE,
            };
            this.userPrivilegeService
                .findOne(query)
                .then((userPrivilege) => {
                if (userPrivilege && userPrivilege._id) {
                    next();
                }
                else {
                    const error = new Error("Invalid permission. Only " +
                        this.userRoles.toString() +
                        " is allowed");
                    this.sendErrorResponse(res, error, this.errorResponseMessage.INVALID_PERMISSION, 403, user._id);
                }
            })
                .catch((err) => {
                this.sendErrorResponse(res, err, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user._id);
            });
        });
        this.validateSuperAdminPrivilege = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const query = {
                user: user._id,
                role: AppConstants_1.USER_ROLES.SUPER_ADMIN,
                status: AppConstants_1.ITEM_STATUS.ACTIVE,
            };
            this.userPrivilegeService
                .findOne(query)
                .then((userPrivilege) => {
                if (userPrivilege && userPrivilege._id) {
                    next();
                }
                else {
                    const error = new Error("Invalid permission. Only super admin is allowed");
                    this.sendErrorResponse(res, error, this.errorResponseMessage.INVALID_PERMISSION, 403, user._id);
                }
            })
                .catch((err) => {
                this.sendErrorResponse(res, err, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user._id);
            });
        });
        this.validateHRAdminPrivilege = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const query = {
                user: user._id,
                role: { $in: [AppConstants_1.USER_ROLES.ADMIN, AppConstants_1.USER_ROLES.SUPER_ADMIN] },
                status: AppConstants_1.ITEM_STATUS.ACTIVE,
            };
            this.userPrivilegeService
                .findOne(query)
                .then((userPrivilege) => {
                if (userPrivilege && userPrivilege._id) {
                    next();
                }
                else {
                    const error = new Error("Invalid permission. Only HR admins are allowed");
                    this.sendErrorResponse(res, error, this.errorResponseMessage.INVALID_PERMISSION, 403, user._id);
                }
            })
                .catch((err) => {
                this.sendErrorResponse(res, err, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user._id);
            });
        });
        this.userRoles = privileges;
    }
    initServices() {
        this.userPrivilegeService = new UserPrivilegeService_1.default();
    }
}
exports.UserPrivilegeMiddleware = UserPrivilegeMiddleware;
exports.default = UserPrivilegeMiddleware;
//# sourceMappingURL=UserPrivilegeMiddleware.js.map