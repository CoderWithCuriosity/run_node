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
exports.AuthMiddleware = void 0;
const App_1 = require("../App");
const AppUtils_1 = __importDefault(require("../common/utils/AppUtils"));
const BaseRouterMiddleware_1 = __importDefault(require("./BaseRouterMiddleware"));
const AppConstants_1 = require("../common/constants/AppConstants");
const AppConstants_2 = require("../common/constants/AppConstants");
const LoginSessionService_1 = __importDefault(require("../services/LoginSessionService"));
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthMiddleware extends BaseRouterMiddleware_1.default {
    constructor(appRouter) {
        super(appRouter);
        this.authGuard = (req, res, next) => {
            const payload = req.headers.authorization || '';
            let jwt = '';
            if (payload) {
                if (payload.split(" ").length > 1) {
                    jwt = payload.split(" ")[1];
                }
                else {
                    jwt = payload;
                }
            }
            this.appUtils.verifyToken(jwt, (error, decoded) => __awaiter(this, void 0, void 0, function* () {
                let loginSession;
                try {
                    const data = (yield decoded.data) || {};
                    const query = { uuid: data.uuid, _id: data.id, user: data.user, status: AppConstants_2.BIT.ON };
                    if (error) {
                        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                            yield this.loginSessionService.updateOne(query, { expired: true, status: AppConstants_2.BIT.OFF });
                            return this.sendErrorResponse(res, error, this.errorResponseMessage.TOKEN_EXPIRED, 401, null);
                        }
                        return this.sendErrorResponse(res, error, this.errorResponseMessage.INVALID_TOKEN, 401, null);
                    }
                    else {
                        loginSession = yield this.loginSessionService.findOneAndPopulate(query);
                        if (loginSession === null || loginSession === void 0 ? void 0 : loginSession._id) {
                            if (loginSession.expiry_date <= new Date()) {
                                yield this.loginSessionService.updateOne(query, { expired: true, status: AppConstants_2.BIT.OFF });
                                const error = new Error("Session expired");
                                return this.sendErrorResponse(res, error, this.errorResponseMessage.SESSION_EXPIRED, 401, loginSession.user._id);
                            }
                            const user = loginSession.user;
                            const isPasswordUpdate = (req.url === App_1.API_PATH + "/me/password" && req.method === "PATCH");
                            if (user.require_new_password && !isPasswordUpdate) {
                                const error = new Error("Password update required");
                                return this.sendErrorResponse(res, error, this.errorResponseMessage.PASSWORD_UPDATE_REQUIRED, 401, user._id);
                            }
                            this.requestService.addToDataBag(AppConstants_1.LOGGED_IN_USER_LABEL, user);
                            this.requestService.addToDataBag(AppConstants_2.LOGIN_SESSION_LABEL, loginSession);
                            const isAccountActivation = req.url === App_1.API_PATH + "/me/activate" && req.method === "PATCH" ?
                                req.url === App_1.API_PATH + "/me/activate" && req.method === "PATCH" :
                                req.url === App_1.API_PATH + "/me/resend-activation-otp" && req.method === "POST";
                            if (isAccountActivation)
                                return next();
                            this.checkUserStatus(res, next);
                        }
                        else {
                            const error = new Error("User session not found");
                            const errorUser = loginSession ? loginSession.user._id : null;
                            return this.sendErrorResponse(res, error, this.errorResponseMessage.INVALID_TOKEN_USER, 401, errorUser);
                        }
                    }
                }
                catch (error) {
                    const errorUser = loginSession ? loginSession.user._id : null;
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 401, errorUser);
                }
            }));
        };
    }
    initServices() {
        this.appUtils = new AppUtils_1.default();
        this.loginSessionService = new LoginSessionService_1.default(["user"]);
    }
    // public authGuard = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const payload = req.headers.authorization || '';
    //         let jwt = '';
    //         if (payload) {
    //             if (payload.split(" ").length > 1) {
    //                 jwt = payload.split(" ")[1];
    //             } else {
    //                 jwt = payload;
    //             }
    //         }
    //         const { error, decoded } = await this.verifyToken(jwt);
    //         if (error) {
    //             if (error instanceof TokenExpiredError) {
    //                 await this.handleTokenExpired(req, res);
    //             } else {
    //                 await this.handleInvalidToken(res, error);
    //             }
    //         } else {
    //             await this.handleValidToken(req, res, next, decoded);
    //         }
    //     } catch (error:any) {
    //         const errorUser = error.loginSession ? error.loginSession.user._id : null;
    //         return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 401, errorUser);
    //     }
    // }
    // private async verifyToken(jwt: string) {
    //     try {
    //         const decoded = await this.appUtils.verifyToken(jwt);
    //         return { error: null, decoded };
    //     } catch (error) {
    //         return { error, decoded: null };
    //     }
    // }
    handleTokenExpired(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.decoded.data || {};
            const query = { uuid: data.uuid, _id: data.id, user: data.user, status: AppConstants_2.BIT.ON };
            yield this.loginSessionService.updateOne(query, { expired: true, status: AppConstants_2.BIT.OFF });
            const error = new Error("Token Expired!");
            return this.sendErrorResponse(res, error, this.errorResponseMessage.TOKEN_EXPIRED, 401, null);
        });
    }
    handleInvalidToken(res, error) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendErrorResponse(res, error, this.errorResponseMessage.INVALID_TOKEN, 401, null);
        });
    }
    handleValidToken(req, res, next, decoded) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = decoded.data || {};
            const query = { uuid: data.uuid, _id: data.id, user: data.user, status: AppConstants_2.BIT.ON };
            const loginSession = yield this.loginSessionService.findOneAndPopulate(query);
            //  console.log("loginSession => ",loginSession)
            if (loginSession === null || loginSession === void 0 ? void 0 : loginSession._id) {
                if (loginSession.expiry_date <= new Date()) {
                    yield this.loginSessionService.updateOne(query, { expired: true, status: AppConstants_2.BIT.OFF });
                    const error = new Error("Session Expired!");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.SESSION_EXPIRED, 401, null);
                }
                const user = loginSession.user;
                const isPasswordUpdate = (req.url === App_1.API_PATH + "/me/password" && req.method === "PATCH");
                // console.log("loginSession?._id => ",loginSession.user)
                //@ts-ignore
                if ((user === null || user === void 0 ? void 0 : user.require_new_password) && !isPasswordUpdate) {
                    const error = new Error("Password Update Required!");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.PASSWORD_UPDATE_REQUIRED, 401, null);
                }
                yield this.requestService.setCurrentUser(user);
                yield this.requestService.addToDataBag(AppConstants_1.LOGGED_IN_USER_LABEL, user);
                yield this.requestService.addToDataBag(AppConstants_2.LOGIN_SESSION_LABEL, loginSession);
                const isAccountActivation = req.url === App_1.API_PATH + "/me/activate" && req.method === "PATCH" ? req.url === App_1.API_PATH + "/me/activate" && req.method === "PATCH" :
                    req.url === App_1.API_PATH + "/me/resend-activation-otp" && req.method === "POST";
                if (isAccountActivation)
                    return next();
                yield this.checkUserStatus(res, next);
            }
            else {
                //@ts-ignore
                const errorUser = loginSession ? loginSession.user._id : null;
                throw { message: "User session not found", loginSession, errorUser };
            }
        });
    }
    checkUserStatus(res, next) {
        const user = this.requestService.getFromDataBag(AppConstants_1.LOGGED_IN_USER_LABEL) || {};
        const status = user.status;
        switch (status) {
            case AppConstants_1.USER_STATUS.ACTIVE: {
                return next();
            }
            case AppConstants_1.USER_STATUS.PENDING: {
                return this.sendErrorResponse(res, new Error("Account is Pending"), this.errorResponseMessage.ACCOUNT_ACTIVATION_REQUIRED, 403, user._id);
            }
            case AppConstants_1.USER_STATUS.SELF_DEACTIVATED: {
                return this.sendErrorResponse(res, new Error("Account is self deactivated"), this.errorResponseMessage.ACCOUNT_ACTIVATION_REQUIRED, 403, user._id);
            }
            case AppConstants_1.USER_STATUS.SUSPENDED: {
                return this.sendErrorResponse(res, new Error("Account is suspended"), this.errorResponseMessage.ACCOUNT_SUSPENDED, 403, user._id);
            }
            case AppConstants_1.USER_STATUS.IN_REVIEW: {
                return this.sendErrorResponse(res, new Error("Account is in review"), this.errorResponseMessage.ACCOUNT_REVIEW_REQUIRED, 403, user._id);
            }
            case AppConstants_1.USER_STATUS.DEACTIVATED: {
                return this.sendErrorResponse(res, new Error("Account blocked"), this.errorResponseMessage.ACCOUNT_BLOCKED, 403, user._id);
            }
            case undefined:
            case "":
            case null: {
                return this.sendErrorResponse(res, new Error("Invalid user status"), this.errorResponseMessage.CONTACT_ADMIN, 403, user._id);
            }
            default: return this.sendErrorResponse(res, new Error("Account status is " + status), this.errorResponseMessage.CONTACT_ADMIN, 400, user._id);
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
exports.default = AuthMiddleware;
//# sourceMappingURL=AuthMiddleware.js.map