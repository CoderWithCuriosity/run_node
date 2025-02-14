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
const BaseController_1 = __importDefault(require("./basecontrollers/BaseController"));
const LoginSessionService_1 = __importDefault(require("../services/LoginSessionService"));
const AppConstants_1 = require("../common/constants/AppConstants");
const EmailService_1 = __importDefault(require("../common/utils/EmailService"));
const DateUtils_1 = __importDefault(require("../common/utils/DateUtils"));
const OtpService_1 = __importDefault(require("../services/OtpService"));
const UserPrivilegeService_1 = __importDefault(require("../services/user/UserPrivilegeService"));
const TransactionService_1 = __importDefault(require("../services/TransactionService"));
const DateOfBirthService_1 = __importDefault(require("../services/DateOfBirthService"));
const LocationUtils_1 = __importDefault(require("../common/utils/LocationUtils"));
class AuthController extends BaseController_1.default {
    constructor() {
        super();
        this.location = { region: "", city: "", country_name: "", country_calling_code: "", country_code: "", ip: "" };
        this.fetchLocation();
    }
    initializeServices() {
        this.loginSessionService = new LoginSessionService_1.default();
        this.emailService = new EmailService_1.default();
        this.dateUtils = new DateUtils_1.default();
        this.otpService = new OtpService_1.default();
        this.userPrivilegeService = new UserPrivilegeService_1.default();
        this.dateOfBirthService = new DateOfBirthService_1.default();
        this.transactionService = new TransactionService_1.default();
    }
    initializeMiddleware() {
    }
    initializeRoutes() {
        this.signUp();
        this.login();
        this.resetPassword();
        this.verifyOTP();
        this.loginOTP();
    }
    signUp() {
        this.router.post("/sign-up", this.userMiddleWare.validateEmail, this.userMiddleWare.validatePhone, this.userMiddleWare.validateMatchingPassword, this.userMiddleWare.hashNewPassword);
        this.router.post("/sign-up", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield this.appUtils.createMongooseTransaction();
            const { first_name, last_name, middle_name, email, password, phone, gender, dob, referred_by } = req.body;
            try {
                const userData = {
                    first_name: first_name,
                    last_name: last_name,
                    middle_name: middle_name,
                    email: email,
                    password: password,
                    referral_code: this.appUtils.getAlphaCode(7),
                    referred_by: referred_by,
                    ip_address: `${this.location.ip}`,
                    country_code: `${this.location.country_code}`,
                    phone: phone,
                    phone_country_code: this.location.country_calling_code,
                    location: `${this.location.city} | ${this.location.region} | ${this.location.country_name}`,
                    gender: gender,
                    dob: new Date(dob)
                };
                const user = yield this.userService.save(userData, session);
                const date_of_birth = this.dateOfBirthService.createDOB(dob, user._id);
                yield this.dateOfBirthService.save(date_of_birth, session);
                // create activation otp
                const expiryDate = this.dateUtils.addToDate(new Date(), "hours", AppConstants_1.OTP_EXPIRY_PERIOD);
                const otpData = {
                    expiry_date: expiryDate,
                    code: this.appUtils.generateOTP(),
                    user: user._id,
                    created_by: user._id
                };
                const otp = yield this.otpService.save(otpData, session);
                //login new user
                const uuid = this.appUtils.generateUUIDV4();
                const loginSessionData = {
                    uuid: uuid,
                    otp: otp._id,
                    user: user._id,
                    expiry_date: this.dateUtils.addToDate(new Date(), "days", AppConstants_1.TOKEN_EXPIRY_PERIOD)
                };
                const response = yield this.logUserIn(loginSessionData, user, session);
                //send activation email to new user
                const recipient = user.email;
                yield this.emailService.sendCode(recipient, AppConstants_1.EMAIL_ACTIVATION_SUBJECT, userData.first_name + " " + userData.last_name, otp.code);
                yield session.commitTransaction();
                this.sendSuccessResponse(res, response);
            }
            catch (error) {
                yield session.abortTransaction();
                this.sendErrorResponse(res, error, this.errorResponseMessage.ACCOUNT_CREATION_ERROR, 500, null);
            }
        }));
    }
    login() {
        this.router.post("/login", this.userMiddleWare.loadUserToRequestByEmail, this.userMiddleWare.checkUserStatus, this.userMiddleWare.validatePassword, this.userMiddleWare.logoutExistingSession);
        this.router.post("/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                const user = this.requestService.getUser();
                //deactivate existing OTPs
                const query = {
                    user: user._id,
                    status: AppConstants_1.ITEM_STATUS.ACTIVE,
                };
                yield this.otpService.updateMany(query, { status: AppConstants_1.ITEM_STATUS.DEACTIVATED }, session);
                // create new login otp
                //  const expiryDate =  this.dateUtils.addToDate(new Date(), "minutes", OTP_EXPIRY_PERIOD);
                //login user
                const uuid = this.appUtils.generateUUIDV4();
                const loginSessionData = {
                    uuid: uuid,
                    // otp: otp._id,
                    user: user._id,
                    expiry_date: this.dateUtils.addToDate(new Date(), "days", AppConstants_1.TOKEN_EXPIRY_PERIOD)
                };
                const response = yield this.logUserIn(loginSessionData, user, session);
                // await this.otpService.updateById(otp._id, {status: ITEM_STATUS.USED}, session);
                //send login otp to user email
                // const recipient = user.email;
                // await this.emailService.sendLoginOTP(recipient, EMAIL_LOGIN_OTP_SUBJECT, LOGIN_OTP_TEXT, otp.code);
                yield session.commitTransaction();
                yield this.emailService.sendLoginAlert(user.email, AppConstants_1.EMAIL_LOGIN_SUBJECT, user.first_name + " " + user.last_name);
                // this.sendSuccessResponse(res, {message: "Enter the login otp sent to your email to continue",email:recipient});
                this.sendSuccessResponse(res, response);
            }
            catch (error) {
                yield session.abortTransaction();
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_LOGIN, 500, null);
            }
        }));
    }
    verifyOTP() {
        this.router.patch("/verify-otp", this.userMiddleWare.loadUserToRequestByEmail);
        this.router.patch("/verify-otp", this.userMiddleWare.validateUserEmailVerificationStatus);
        this.router.patch("/verify-otp", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                const user = this.requestService.getUser();
                const query = {
                    code: req.body.code,
                    user: user._id,
                    status: AppConstants_1.ITEM_STATUS.ACTIVE,
                };
                const otp = yield this.otpService.findOne(query);
                if (!otp) {
                    const error = new Error("No OTP found!");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.INVALID_OTP, 400, user._id);
                }
                if (otp.expiry_date <= new Date()) {
                    const error = new Error("Expired OTP!");
                    yield this.otpService.updateById(otp._id, { status: AppConstants_1.ITEM_STATUS.EXPIRED });
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.INVALID_OTP, 400, user._id);
                }
                const uuid = this.appUtils.generateUUIDV4();
                const loginSessionData = {
                    uuid: uuid,
                    otp: otp._id,
                    user: user._id,
                    expiry_date: this.dateUtils.addToDate(new Date(), "days", AppConstants_1.TOKEN_EXPIRY_PERIOD)
                };
                const data = {
                    amount: 50,
                    user: user._id,
                    narration: "Sign Up Bonus",
                    account_type: "bonus",
                    transaction_type: "credit",
                    created_by: user._id,
                    transaction_status: AppConstants_1.TRANSACTION_STATUS.ACTIVE
                };
                const fund_bonus = yield this.transactionService.save(data);
                const response = yield this.logUserIn(loginSessionData, user, session);
                yield this.otpService.updateById(otp._id, { status: AppConstants_1.ITEM_STATUS.USED }, session);
                // update account status to ACTIVE
                yield this.userService.updateById(user._id, { status: AppConstants_1.USER_STATUS.ACTIVE });
                yield this.emailService.sendWelcomeEmail(user.email, AppConstants_1.EMAIL_WELCOME_SUBJECT, user.first_name + " " + user.last_name);
                yield this.emailService.sendTransactionAlertEmail(user.email, user.first_name + " " + user.last_name, fund_bonus);
                session.commitTransaction();
                this.sendSuccessResponse(res, response);
            }
            catch (error) {
                yield session.abortTransaction();
                // const errorUser = await this.requestService.getLoggedInUser()?._id;
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
    loginOTP() {
        this.router.patch("/login-otp", this.userMiddleWare.loadUserToRequestByEmail);
        this.router.patch("/login-otp", this.userMiddleWare.checkUserStatus);
        this.router.patch("/login-otp", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                const user = this.requestService.getUser();
                const query = {
                    code: req.body.code,
                    user: user._id,
                    status: AppConstants_1.ITEM_STATUS.ACTIVE,
                };
                const otp = yield this.otpService.findOne(query);
                let error = null;
                if (!otp)
                    error = new Error("No OTP found!");
                if (otp.expiry_date <= new Date()) {
                    error = new Error("Expired OTP!");
                    yield this.otpService.updateById(otp._id, { status: AppConstants_1.ITEM_STATUS.EXPIRED });
                }
                if (error)
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.INVALID_OTP, 400, user._id);
                const uuid = this.appUtils.generateUUIDV4();
                const loginSessionData = {
                    uuid: uuid,
                    otp: otp._id,
                    user: user._id,
                    expiry_date: this.dateUtils.addToDate(new Date(), "days", AppConstants_1.TOKEN_EXPIRY_PERIOD)
                };
                const response = yield this.logUserIn(loginSessionData, user, session);
                yield this.otpService.updateById(otp._id, { status: AppConstants_1.ITEM_STATUS.USED }, session);
                yield this.emailService.sendLoginAlert(user.email, AppConstants_1.EMAIL_LOGIN_SUBJECT, user.first_name + " " + user.last_name);
                session.commitTransaction();
                this.sendSuccessResponse(res, response);
            }
            catch (error) {
                yield session.abortTransaction();
                // const errorUser = this.requestService.getLoggedInUser()?._id;
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
    resetPassword() {
        this.router.patch("/password", this.userMiddleWare.loadUserToRequestByEmail, this.userMiddleWare.generatePassword, this.userMiddleWare.hashNewPassword);
        this.router.patch("/password", (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = this.requestService.getUser();
            const update = {
                password: req.body.password,
                require_new_password: true
            };
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                yield this.userService.updateById(user._id, update, session);
                yield this.emailService.sendCode(user.email, AppConstants_1.PASSWORD_RESET_SUBJECT, AppConstants_1.PASSWORD_RESET_TEXT, req.body.new_password);
                yield session.commitTransaction();
                this.sendSuccessResponse(res, { message: "Your password has been reset and the password has been set to your email" });
            }
            catch (error) {
                yield session.abortTransaction();
                const errorUser = (_a = this.requestService.getUser()) === null || _a === void 0 ? void 0 : _a._id;
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, errorUser);
            }
        }));
    }
    logUserIn(loginSessionData, user, session = null) {
        return new Promise((resolve, reject) => {
            this.loginSessionService.save(loginSessionData, session)
                .then((loginSession) => __awaiter(this, void 0, void 0, function* () {
                const token = this.appUtils.generateLoginToken(loginSession);
                const isAdmin = yield this.userPrivilegeService.findOne({ user: user._id, role: "admin" });
                //@ts-ignore
                user.hideProtected();
                let response;
                if (isAdmin == null) {
                    response = {
                        message: this.successResponseMessage.LOGIN_SUCCESSFUL,
                        user: user,
                        token: token
                    };
                }
                else {
                    response = {
                        message: this.successResponseMessage.LOGIN_SUCCESSFUL,
                        user: user,
                        token: token,
                        is_admin: true
                    };
                }
                if (user.status == AppConstants_1.USER_STATUS.SELF_DEACTIVATED) {
                    response.message = this.successResponseMessage.ACCOUNT_ACTIVATION_REQUIRED;
                }
                if (user.require_new_password) {
                    response.message = this.successResponseMessage.PASSWORD_UPDATE_REQUIRED;
                }
                if (user.status == AppConstants_1.USER_STATUS.PENDING) {
                    response.message = this.successResponseMessage.ACCOUNT_REVIEW_REQUIRED;
                }
                resolve(response);
            }))
                .catch((e) => {
                reject(e);
            });
        });
    }
    fetchLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const locationData = yield (0, LocationUtils_1.default)();
                if (locationData) {
                    this.location = locationData;
                    return this.location;
                }
                else {
                    // Handle the case where location data is not available
                    console.error("Location data is not available.");
                }
            }
            catch (error) {
                // Handle any errors that may occur during the fetch
                console.error("Error fetching location data:", error);
            }
        });
    }
}
exports.default = new AuthController().router;
//# sourceMappingURL=AuthController.js.map