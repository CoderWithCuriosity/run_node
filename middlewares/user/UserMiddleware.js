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
const AppUtils_1 = __importDefault(require("../../common/utils/AppUtils"));
const BaseRouterMiddleware_1 = __importDefault(require("../BaseRouterMiddleware"));
const AppConstants_1 = require("../../common/constants/AppConstants");
const UserService_1 = __importDefault(require("../../services/user/UserService"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const LoginSessionService_1 = __importDefault(require("../../services/LoginSessionService"));
class UserMiddleware extends BaseRouterMiddleware_1.default {
    constructor(appRouter) {
        super(appRouter);
        this.loadUserToRequestByEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            if (!email) {
                const error = new Error("Email is required");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.EMAIL_REQUIRED, 400, null);
            }
            const emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "i");
            if (!emailRegex.test(email)) {
                const error = new Error("Invalid email address format");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.INVALID_EMAIL, 400, null);
            }
            try {
                const user = yield this.userService.findOneAndPopulate({ email: email });
                if (!user) {
                    return this.sendErrorResponse(res, new Error("User not found"), this.errorResponseMessage.INVALID_LOGIN, 400, null);
                }
                yield this.requestService.addToDataBag(AppConstants_1.USER_LABEL, user);
                next();
            }
            catch (error) {
                return this.sendErrorResponse(res, new Error("Error getting user"), this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, null);
            }
        });
        this.checkUserStatus = (req, res, next) => {
            const user = this.requestService.getFromDataBag(AppConstants_1.USER_LABEL) || {};
            const status = user.status;
            switch (status) {
                case AppConstants_1.USER_STATUS.PENDING: {
                    return this.sendErrorResponse(res, new Error("Account Pending"), this.errorResponseMessage.ACCOUNT_ACTIVATION_REQUIRED, 400, user._id);
                }
                case AppConstants_1.USER_STATUS.IN_REVIEW: {
                    return this.sendErrorResponse(res, new Error("Account in Review"), this.errorResponseMessage.ACCOUNT_REVIEW_REQUIRED, 400, user._id);
                }
                case AppConstants_1.USER_STATUS.ACTIVE: {
                    return next();
                }
                case AppConstants_1.USER_STATUS.SELF_DEACTIVATED: {
                    return next();
                }
                case AppConstants_1.USER_STATUS.SUSPENDED:
                case AppConstants_1.USER_STATUS.DEACTIVATED: {
                    return this.sendErrorResponse(res, new Error("Account blocked"), this.errorResponseMessage.ACCOUNT_BLOCKED, 400, user._id);
                }
                case undefined:
                case "":
                case null: {
                    return this.sendErrorResponse(res, new Error("Invalid user status"), this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400, user._id);
                }
                default: return this.sendErrorResponse(res, new Error("Account status is " + status), this.errorResponseMessage.CONTACT_ADMIN, 400, user._id);
            }
        };
        this.validateUserEmailVerificationStatus = (req, res, next) => {
            const user = this.requestService.getFromDataBag(AppConstants_1.USER_LABEL) || {};
            const status = user.status;
            switch (status) {
                case AppConstants_1.USER_STATUS.IN_REVIEW: {
                    return this.sendErrorResponse(res, new Error("Account in Review"), this.errorResponseMessage.ACCOUNT_REVIEW_REQUIRED, 400, user._id);
                }
                case AppConstants_1.USER_STATUS.PENDING: {
                    return next();
                }
                case AppConstants_1.USER_STATUS.ACTIVE: {
                    return this.sendErrorResponse(res, new Error("Account already approved"), this.errorResponseMessage.ALREADY_ACTIVATED, 400, user._id);
                }
                case AppConstants_1.USER_STATUS.SELF_DEACTIVATED: {
                    return next();
                }
                case AppConstants_1.USER_STATUS.SUSPENDED:
                case AppConstants_1.USER_STATUS.DEACTIVATED: {
                    return this.sendErrorResponse(res, new Error("Account blocked"), this.errorResponseMessage.ACCOUNT_BLOCKED, 400, user._id);
                }
                case undefined:
                case "":
                case null: {
                    return this.sendErrorResponse(res, new Error("Invalid user status"), this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400, user._id);
                }
                default: return this.sendErrorResponse(res, new Error("Account status is " + status), this.errorResponseMessage.CONTACT_ADMIN, 400, user._id);
            }
        };
        this.validateMatchingPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.body.new_password) {
                if (req.body.confirm_password != req.body.new_password) {
                    const error = new Error("Passwords do not match");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.PASSWORD_MISMATCH, 400, null);
                }
                if (req.body.new_password.length < 5) {
                    const error = new Error("Password is too short must be longer than " + AppConstants_1.PASSWORD_LENGTH);
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.SHORT_PASSWORD, 400, null);
                }
                next();
            }
            else {
                const error = new Error("No password provided");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.PASSWORD_REQUIRED, 400, null);
            }
        });
        this.hashNewPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.body.new_password) {
                req.body.password = yield this.appUtils.hashData(req.body.new_password);
                next();
            }
            else {
                const error = new Error("No password provided");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.PASSWORD_REQUIRED, 400, null);
            }
        });
        this.generatePassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const password = this.appUtils.getCode(8);
            req.body.new_password = password;
            req.body.confirm_password = password;
            next();
        });
        this.validatePasswordResetInput = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { password, new_password, confirm_password } = req.body;
            if (!password || !new_password || !confirm_password)
                return this.sendErrorResponse(res, new Error("Wrong password"), this.errorResponseMessage.INCOMPLETE_REQUEST_PAYLOAD, 400);
            next();
        });
        this.validatePassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = (yield this.requestService.getUser()) ? (yield this.requestService.getUser())._id : (yield this.requestService.getLoggedInUser())._id;
            this.userService.findById(userId, null, ["+password"])
                .then((user) => __awaiter(this, void 0, void 0, function* () {
                const valid = yield bcrypt_1.default.compare(req.body.password, user.password);
                if (!valid)
                    return this.sendErrorResponse(res, new Error("Wrong password"), this.errorResponseMessage.INVALID_LOGIN, 400, userId);
                next();
            }))
                .catch(error => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_LOGIN, 400, userId);
            });
        });
        this.logoutExistingSession = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            //this logs out the user from other devices who's session hasn't expired yet
            const user = this.requestService.getUser() ? this.requestService.getUser() : yield this.requestService.getLoggedInUser();
            try {
                const activeLoginSession = yield this.loginSessionService.findOne({ status: AppConstants_1.BIT.ON, user: user._id });
                if (activeLoginSession) {
                    if (activeLoginSession.expiry_date > new Date()) {
                        activeLoginSession.logged_out = true;
                        activeLoginSession.expiry_date = new Date();
                    }
                    else {
                        activeLoginSession.expired = true;
                    }
                    activeLoginSession.status = AppConstants_1.BIT.OFF;
                    yield activeLoginSession.save();
                }
                next();
            }
            catch (error) {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_LOGIN, 500, user._id);
            }
        });
        this.validateEmail = (req, res, next) => {
            const email = req.body.email;
            if (!email) {
                const error = new Error("Email is required");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.EMAIL_REQUIRED, 400, null);
            }
            const emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "i");
            if (!emailRegex.test(email)) {
                const error = new Error("Invalid email address format");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.INVALID_EMAIL, 400, null);
            }
            this.userService.findOne({ email: email })
                .then((user) => {
                if (user) {
                    const error = new Error("Email already exists");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.DUPLICATE_EMAIL, 400, null);
                }
                next();
            })
                .catch((err) => {
                this.sendErrorResponse(res, err, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, null);
            });
        };
        this.validatePhone = (req, res, next) => {
            const phone = req.body.phone;
            if (!phone) {
                const error = new Error("Phone number is required");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.PHONE_REQUIRED, 400, null);
            }
            this.userService.findOne({ phone: phone })
                .then((user) => {
                if (user) {
                    const error = new Error("Phone number already exists");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.DUPLICATE_PHONE, 400, null);
                }
                next();
            })
                .catch((err) => {
                this.sendErrorResponse(res, err, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, null);
            });
        };
    }
    initServices() {
        this.appUtils = new AppUtils_1.default();
        this.userService = new UserService_1.default();
        this.loginSessionService = new LoginSessionService_1.default();
    }
}
exports.default = UserMiddleware;
//# sourceMappingURL=UserMiddleware.js.map