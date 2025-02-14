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
const DateUtils_1 = __importDefault(require("../common/utils/DateUtils"));
const OtpService_1 = __importDefault(require("../services/OtpService"));
const EmailService_1 = __importDefault(require("../common/utils/EmailService"));
const multer_1 = __importDefault(require("multer"));
const TransactionService_1 = __importDefault(require("../services/TransactionService"));
const IRAService_1 = __importDefault(require("../services/IRAService"));
const InvestmentService_1 = __importDefault(require("../services/InvestmentService"));
const MessageService_1 = __importDefault(require("../services/MessageService"));
const WalletService_1 = __importDefault(require("../services/WalletService"));
const upload = (0, multer_1.default)({ dest: 'profile_photo/' });
class UserController extends BaseController_1.default {
    constructor() {
        super();
        // Calculate accrued amount based on plan and duration in days
        this.calculateAccruedAmount = (capital, plan, updated_at, maturityDate) => {
            const selectedPlan = AppConstants_1.INVESTMENT_DATA_PLANS.find((p) => p.plan === plan);
            let accruedAmount = capital;
            const accruedData = { accruedAmount: 0, isMatured: false };
            // Calculate the duration in days
            const currentDate = new Date();
            const timeElapsedInSeconds = (currentDate.getTime() - updated_at.getTime()) / 1000.0;
            //@ts-ignore
            const annualInterestRate = (selectedPlan === null || selectedPlan === void 0 ? void 0 : selectedPlan.percent) / 100.0;
            if (maturityDate <= currentDate) {
                // Investment has matured
                //  const yearsElapsed = timeElapsedInSeconds / (365 * 24 * 60 * 60); // Convert seconds to years
                accruedAmount = capital + ((capital * annualInterestRate));
                accruedData.accruedAmount = accruedAmount;
                accruedData.isMatured = true;
            }
            else {
                // Premature liquidation of investment
                //@ts-ignore
                const annualInterestRate = (selectedPlan === null || selectedPlan === void 0 ? void 0 : selectedPlan.percent) / 100.0;
                const timeRemainingInSeconds = (maturityDate.getTime() - currentDate.getTime()) / 1000.0;
                const investmentDurationInSeconds = (selectedPlan === null || selectedPlan === void 0 ? void 0 : selectedPlan.duration_in_sec) || 0;
                // Ensure timeRemainingInSeconds is positive to avoid negative accruedAmount
                if (timeRemainingInSeconds > 0) {
                    accruedAmount = capital + (capital * annualInterestRate * (timeElapsedInSeconds / investmentDurationInSeconds));
                    accruedData.accruedAmount = accruedAmount;
                }
                else {
                    //@ts-ignore
                    accruedAmount = capital + (capital * annualInterestRate);
                    accruedData.accruedAmount = accruedAmount;
                }
            }
            return accruedData;
        };
    }
    initializeServices() {
        this.loginSessionService = new LoginSessionService_1.default();
        this.dateUtils = new DateUtils_1.default();
        this.otpService = new OtpService_1.default();
        this.emailService = new EmailService_1.default();
        this.transactionService = new TransactionService_1.default();
        this.iraService = new IRAService_1.default();
        this.investmentService = new InvestmentService_1.default();
        this.messageService = new MessageService_1.default();
        this.walletService = new WalletService_1.default();
    }
    initializeMiddleware() {
    }
    initializeRoutes() {
        this.me();
        this.logout();
        this.updatePassword();
        this.activateAccount();
        this.resendActivationOTP();
        this.updateUserProfile();
        this.getAccountInfo();
        this.sendTransactionOTP();
        this.verifyTransactionOTP();
        this.createIraAccount();
        this.getAllUserMessage();
        this.getUserMessage();
        this.listWallets();
        this.getWallet();
        this.updateUserWallet();
    }
    me() {
        //returns the logged in user
        this.router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            this.sendSuccessResponse(res, user, 200);
        }));
    }
    activateAccount() {
        this.router.patch("/activate", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                const loggedInUser = yield this.requestService.getLoggedInUser();
                const query = {
                    code: req.body.code,
                    user: loggedInUser._id,
                    status: AppConstants_1.ITEM_STATUS.ACTIVE,
                };
                const otp = yield this.otpService.findOne(query);
                let error = null;
                if (!otp)
                    error = new Error("No OTP found!");
                else if (otp.expiry_date <= new Date()) {
                    error = new Error("Expired OTP!");
                    yield this.otpService.updateById(otp._id, { status: AppConstants_1.ITEM_STATUS.EXPIRED });
                }
                if (error)
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.INVALID_OTP, 400, loggedInUser._id);
                //activate user account
                const user = yield this.userService.updateById(otp.user, { status: AppConstants_1.USER_STATUS.ACTIVE }, session);
                yield this.otpService.updateById(otp._id, { status: AppConstants_1.ITEM_STATUS.USED }, session);
                session.commitTransaction();
                this.sendSuccessResponse(res, user);
            }
            catch (error) {
                yield session.abortTransaction();
                const errorUser = this.requestService.getLoggedInUser();
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, (yield errorUser)._id);
            }
        }));
    }
    resendActivationOTP() {
        this.router.post("/resend-activation-otp", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                const loggedInUser = yield this.requestService.getLoggedInUser();
                //deactivate existing OTPs
                const query = {
                    user: loggedInUser._id,
                    status: AppConstants_1.ITEM_STATUS.ACTIVE,
                };
                yield this.otpService.updateMany(query, { status: AppConstants_1.ITEM_STATUS.DEACTIVATED }, session);
                // create new otp
                const expiryDate = this.dateUtils.addToDate(new Date(), "minutes", AppConstants_1.OTP_EXPIRY_PERIOD);
                const otpData = {
                    expiry_date: expiryDate,
                    code: this.appUtils.generateOTP(),
                    user: loggedInUser._id,
                    created_by: loggedInUser._id
                };
                const otp = yield this.otpService.save(otpData, session);
                const recipient = loggedInUser.email;
                yield this.emailService.sendCode(recipient, AppConstants_1.EMAIL_ACTIVATION_SUBJECT, AppConstants_1.EMAIL_VERIFICATION_TEXT, otp.code);
                session.commitTransaction();
                this.sendSuccessResponse(res, { message: "Enter the activation otp sent to your email to continue" });
            }
            catch (error) {
                session.abortTransaction();
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, null);
            }
        }));
    }
    logout() {
        this.router.patch("/logout", (req, res) => __awaiter(this, void 0, void 0, function* () {
            let user = null;
            try {
                user = yield this.requestService.getLoggedInUser();
                const activeLoginSession = yield this.loginSessionService.findOne({ status: AppConstants_1.BIT.ON, user: user._id });
                if (activeLoginSession.expiry_date > new Date()) {
                    activeLoginSession.logged_out = true;
                    activeLoginSession.expiry_date = new Date();
                }
                else {
                    activeLoginSession.expired = true;
                }
                activeLoginSession.status = AppConstants_1.BIT.OFF;
                yield activeLoginSession.save();
                this.sendSuccessResponse(res, {}, 200);
            }
            catch (error) {
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user === null || user === void 0 ? void 0 : user._id);
            }
        }));
    }
    updatePassword() {
        this.router.patch("/password", this.userMiddleWare.validatePasswordResetInput, this.userMiddleWare.validatePassword, this.userMiddleWare.validateMatchingPassword, this.userMiddleWare.hashNewPassword);
        this.router.patch("/password", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const update = {
                password: req.body.password,
                require_new_password: false,
                status: AppConstants_1.USER_STATUS.ACTIVE
            };
            this.userService.updateById(user._id, update)
                .then(user => {
                this.requestService.addToDataBag("updated_user", user);
                next();
            })
                .catch(error => {
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user._id);
            });
        }));
        this.router.patch("/password", this.userMiddleWare.logoutExistingSession);
        this.router.patch("/password", (req, res) => {
            const user = this.requestService.getFromDataBag("updated_user");
            const uuid = this.appUtils.generateUUIDV4();
            const loginSessionData = {
                uuid: uuid,
                user: user._id,
                status: AppConstants_1.BIT.ON,
                expiry_date: this.dateUtils.addToDate(new Date(), "days", AppConstants_1.TOKEN_EXPIRY_PERIOD)
            };
            this.loginSessionService.save(loginSessionData)
                .then((loginSession) => __awaiter(this, void 0, void 0, function* () {
                const token = this.appUtils.generateLoginToken(loginSession);
                this.sendSuccessResponse(res, { user: user, token: token });
                yield this.emailService.sendChangedPasswordNotification(user.email, AppConstants_1.EMAIL_PASSWORD_CHANGED_SUBJECT, user.first_name);
            }))
                .catch((err) => {
                this.sendErrorResponse(res, err, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user._id);
            });
        });
    }
    updateUserProfile() {
        const formData = upload.single('profile_pic_url');
        this.router.patch("/update-profile", formData, this.uploadMiddleware.uploadPhoto);
        this.router.patch("/update-profile", this.userMiddleWare.loadUserToRequestByEmail, this.userMiddleWare.checkUserStatus);
        this.router.patch("/update-profile", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                const user = this.requestService.getUser();
                const profile_pic_url = this.requestService.getFromDataBag("profile_photo_url");
                const { payoutInfo, social_media } = req.body;
                // Create an object to hold the updated data
                const updatedData = { status: AppConstants_1.ITEM_STATUS.ACTIVE };
                // Check and update payoutInfo
                if (payoutInfo) {
                    const payoutInfoObject = JSON.parse(payoutInfo);
                    const updatedPayoutInfo = {};
                    // Update bankDetails if provided
                    if (payoutInfo === null || payoutInfo === void 0 ? void 0 : payoutInfo.bank) {
                        updatedPayoutInfo.bank = payoutInfoObject.bank;
                    }
                    // Update cryptoWallet if provided
                    if (payoutInfo === null || payoutInfo === void 0 ? void 0 : payoutInfo.crypto) {
                        updatedPayoutInfo.crypto = payoutInfoObject.crypto;
                    }
                    updatedData.payoutInfo = payoutInfoObject;
                }
                // Check and update social_media
                if (social_media) {
                    updatedData.social_media = JSON.parse(social_media);
                }
                // Check and update profile_pic_url
                if (profile_pic_url) {
                    updatedData.profile_pic_url = this.requestService.getFromDataBag("profile_photo_url");
                }
                // Save the updated user profile
                const updated_user = yield this.userService.updateById(user._id, updatedData, session);
                if (updated_user) {
                    yield session.commitTransaction();
                    this.sendSuccessResponse(res, { message: "Profile updated successfully", user: updated_user });
                }
            }
            catch (error) {
                yield session.abortTransaction();
                this.sendErrorResponse(res, error, this.errorResponseMessage.UPDATE_NOT_PERMITTED, 400);
            }
        }));
    }
    updateUserWallet() {
        this.router.patch("/update-user-wallet", this.userMiddleWare.loadUserToRequestByEmail, this.userMiddleWare.checkUserStatus);
        this.router.patch("/update-user-wallet", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                const user = this.requestService.getUser();
                const profile_pic_url = this.requestService.getFromDataBag("profile_photo_url");
                const { payoutInfo, social_media } = req.body;
                // Create an object to hold the updated data
                const updatedData = { status: AppConstants_1.ITEM_STATUS.ACTIVE };
                // Check and update payoutInfo
                if (payoutInfo) {
                    const payoutInfoObject = payoutInfo;
                    const updatedPayoutInfo = {};
                    // Update bankDetails if provided
                    if (payoutInfo === null || payoutInfo === void 0 ? void 0 : payoutInfo.bank) {
                        updatedPayoutInfo.bank = payoutInfoObject.bank;
                    }
                    // Update cryptoWallet if provided
                    if (payoutInfo === null || payoutInfo === void 0 ? void 0 : payoutInfo.crypto) {
                        updatedPayoutInfo.crypto = payoutInfoObject.crypto;
                    }
                    updatedData.payoutInfo = payoutInfoObject;
                }
                // Check and update social_media
                if (social_media) {
                    updatedData.social_media = JSON.parse(social_media);
                }
                // Check and update profile_pic_url
                if (profile_pic_url) {
                    updatedData.profile_pic_url = this.requestService.getFromDataBag("profile_photo_url");
                }
                // Save the updated user profile
                const updated_user = yield this.userService.updateById(user._id, updatedData, session);
                if (updated_user) {
                    yield session.commitTransaction();
                    this.sendSuccessResponse(res, { message: "Profile updated successfully", user: updated_user });
                }
            }
            catch (error) {
                yield session.abortTransaction();
                this.sendErrorResponse(res, error, this.errorResponseMessage.UPDATE_NOT_PERMITTED, 400);
            }
        }));
    }
    // getAccountInfo() {
    //     this.router.get("/account", async (req, res) => {
    //        const user = await this.requestService.getLoggedInUser()
    //        const session = await this.appUtils.createMongooseTransaction();
    //        try {
    //         // Get all account info
    //        const main_balance = await this.transactionService.getMainBalance(user._id)
    //        const total_withdrawal = await this.transactionService.getTotalWithdrawal(user._id)
    //        const total_deposit = await this.transactionService.getTotalDeposit(user._id)
    //        const total_deposit_from_investment = await this.transactionService.getTotalDepositFromInvestment(user._id)
    //        const total_bouns = await this.transactionService.getTotalBonus(user._id)
    //        const total_credit_into_investment_account = await this.transactionService.getTotalInvestmentCredit(user._id)
    //        const total_referrer = await this.userService.getNumberOfReferrals(user._id)
    //        //Get all transactions
    //        const transactionStatuses = [
    //         TRANSACTION_STATUS.ACTIVE,
    //         TRANSACTION_STATUS.REJECTED,
    //         TRANSACTION_STATUS.PENDING,
    //         TRANSACTION_STATUS.APPROVED,
    //       ];
    //        const allTransactions = await this.transactionService
    //     .find({ user: user._id, status: { $in: transactionStatuses } });
    //     // Get all Investments
    //     const allInvestments = await this.investmentService.find({ user: user._id });
    //     const message_count = await this.messageService.count({user:user._id})
    //     let updatedInvestments=null
    //     if (allInvestments) {
    //         // Calculate a new amount for each active investment
    //         updatedInvestments = allInvestments.map((investment) => {
    //           if (investment.status === ITEM_STATUS.ACTIVE) {
    //             // Calculate the accrued amount based on your business logic
    //             // Calculate accrued amount based on capital, plan, and maturity date
    //         const accruedData = 
    //         this.calculateAccruedAmount(investment.amount, investment.plan,investment.updated_at, investment.maturityDate);
    //             // Update the investment with the new accrued amount
    //             investment.amount = accruedData.accruedAmount;
    //             investment.isMatured = accruedData.isMatured
    //           }
    //           return investment;
    //         });
    //     // return this.sendSuccessResponse(res, updatedInvestments);
    //       } else {
    //         const error = new Error("Error fetching investments");
    //         return this.sendErrorResponse(res,error,this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400,user._id);
    //       }
    //         if (user) {
    //            await session.commitTransaction();
    //         return this.sendSuccessResponse(res,{ 
    //         account_info:
    //             {main_balance: main_balance,
    //             total_withdrawal:total_withdrawal,
    //             total_bonus: total_bouns,
    //             total_deposit : total_deposit,
    //             total_investment_revenue: total_deposit_from_investment,
    //             total_investment_capital: total_credit_into_investment_account,
    //             total_referred: total_referrer,
    //             message_count: message_count,
    //         },
    //         transactions: allTransactions,
    //         investments:updatedInvestments 
    //         } );
    //          }
    //        } catch (error: any) {
    //          await session.abortTransaction();
    //          this.sendErrorResponse(res,error,this.errorResponseMessage.UPDATE_NOT_PERMITTED,400);
    //        }
    //      });
    // }
    getAccountInfo() {
        this.router.get("/account", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                // Get all account info
                const main_balance = yield this.transactionService.getMainBalance(user._id);
                const total_withdrawal = yield this.transactionService.getTotalWithdrawal(user._id);
                const total_deposit = yield this.transactionService.getTotalDeposit(user._id);
                const total_deposit_from_investment = yield this.transactionService.getTotalDepositFromInvestment(user._id);
                const total_bouns = yield this.transactionService.getTotalBonus(user._id);
                const total_credit_into_investment_account = yield this.transactionService.getTotalInvestmentCredit(user._id);
                const total_referrer = yield this.userService.getNumberOfReferrals(user._id);
                const total_earning_credit = yield this.transactionService.getTotalEarningDeposit(user._id);
                const total_earning_debit = yield this.transactionService.getTotalEarningWithdrawal(user._id);
                //Get all transactions
                const transactionStatuses = [
                    AppConstants_1.TRANSACTION_STATUS.ACTIVE,
                    AppConstants_1.TRANSACTION_STATUS.REJECTED,
                    AppConstants_1.TRANSACTION_STATUS.PENDING,
                    AppConstants_1.TRANSACTION_STATUS.APPROVED,
                ];
                const accountType = [
                    AppConstants_1.ACCOUNT_TYPE.BONUS,
                    AppConstants_1.ACCOUNT_TYPE.INVESTMENT,
                    AppConstants_1.ACCOUNT_TYPE.MAIN,
                    // ACCOUNT_TYPE.EARNING,
                ];
                const allTransactions = yield this.transactionService
                    .find({ user: user._id, account_type: { $in: accountType }, status: { $in: transactionStatuses } });
                // Get all Investments
                const allInvestments = yield this.investmentService.find({ user: user._id });
                const message_count = yield this.messageService.count({ user: user._id });
                let updatedInvestments = null;
                let activeInvestmentAmount = 0.0;
                if (allInvestments) {
                    // Calculate a new amount for each active investment
                    updatedInvestments = allInvestments.map((investment) => {
                        if (investment.status === AppConstants_1.ITEM_STATUS.ACTIVE) {
                            // Calculate the accrued amount based on your business logic
                            // Calculate accrued amount based on capital, plan, and maturity date
                            const accruedData = this.calculateAccruedAmount(investment.amount, investment.plan, investment.updated_at, investment.maturityDate);
                            // Update the investment with the new accrued amount
                            investment.amount = accruedData.accruedAmount;
                            investment.isMatured = accruedData.isMatured;
                            if (investment.transaction_type === AppConstants_1.TRANSACTION_TYPE.CREDIT) {
                                activeInvestmentAmount = activeInvestmentAmount + accruedData.accruedAmount;
                            }
                        }
                        return investment;
                    });
                    // calculate the active investment amount
                    // return this.sendSuccessResponse(res, updatedInvestments);
                }
                else {
                    const error = new Error("Error fetching investments");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400, user._id);
                }
                if (user) {
                    yield session.commitTransaction();
                    return this.sendSuccessResponse(res, {
                        account_info: { main_balance: main_balance,
                            total_withdrawal: total_withdrawal,
                            total_bonus: total_bouns,
                            total_deposit: total_deposit,
                            total_investment_revenue: (total_deposit_from_investment) + (total_earning_credit - total_earning_debit),
                            total_investment_capital: total_credit_into_investment_account,
                            total_referred: total_referrer,
                            message_count: message_count,
                            active_accrued_amount: activeInvestmentAmount,
                        },
                        transactions: allTransactions,
                        investments: updatedInvestments
                    });
                }
            }
            catch (error) {
                yield session.abortTransaction();
                this.sendErrorResponse(res, error, this.errorResponseMessage.UPDATE_NOT_PERMITTED, 400);
            }
        }));
    }
    getAllUserMessage() {
        this.router.get("/messages", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                // Get all Messages
                const allMessages = yield this.messageService.find({ user: user._id });
                this.sendSuccessResponse(res, allMessages, 200);
            }
            catch (error) {
                yield session.abortTransaction();
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400);
            }
        }));
    }
    getUserMessage() {
        this.router.get("/messages/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const message_id = req.params.id;
            const user = yield this.requestService.getLoggedInUser();
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                // Get all Messages
                const getMessage = yield this.messageService.find({ user: user._id, _id: message_id });
                if (!getMessage) {
                    const error = new Error("No Message Found");
                    this.sendErrorResponse(res, error, this.errorResponseMessage.ITEM_NOT_FOUND, 400);
                }
                const updated_message = yield this.messageService.updateById(message_id, { is_read: true });
                this.sendSuccessResponse(res, updated_message, 200);
            }
            catch (error) {
                yield session.abortTransaction();
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400);
            }
        }));
    }
    listWallets() {
        this.router.get("/wallets", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            if (!user) {
                const error = new Error("User Not Found");
                this.sendErrorResponse(res, error, this.errorResponseMessage.ITEM_NOT_FOUND, 400);
            }
            // Get all Wallets
            const getWallets = yield this.walletService.find({});
            return this.sendSuccessResponse(res, getWallets, 200);
        }));
    }
    getWallet() {
        this.router.get("/wallets/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const wallet_id = req.params.id;
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                const getWallet = yield this.walletService.findOne({ _id: wallet_id });
                if (!getWallet) {
                    const error = new Error("No Wallet Found");
                    this.sendErrorResponse(res, error, this.errorResponseMessage.ITEM_NOT_FOUND, 404);
                }
                this.sendSuccessResponse(res, getWallet, 200);
            }
            catch (error) {
                yield session.abortTransaction();
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400);
            }
        }));
    }
    createIraAccount() {
        const formData = upload.single('govt_id');
        this.router.post("/ira-form", formData, this.uploadMiddleware.uploadGovtID);
        this.router.post("/ira-form", this.userMiddleWare.loadUserToRequestByEmail, this.userMiddleWare.checkUserStatus);
        this.router.post("/ira-form", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                const user = this.requestService.getUser();
                const govt_id = this.requestService.getFromDataBag("govt_id");
                const { email, full_name, phone, ssn } = req.body;
                // Create an object to hold the updated data
                const updatedData = {
                    status: AppConstants_1.ITEM_STATUS.ACTIVE,
                    email,
                    full_name,
                    phone,
                    ssn
                };
                // Check and uploaded govt_id
                if (govt_id) {
                    updatedData.govt_id = govt_id;
                }
                const ira_application = yield this.iraService.save(updatedData, session);
                if (ira_application) {
                    yield session.commitTransaction();
                    // await this.emailService.sendTransactionAlertEmail(user.email, user.first_name+" "+user.last_name, TRANSACTION_TYPE.DEBIT);
                    this.sendSuccessResponse(res, { message: "IRA/401k application completed. Check your email.", user: user._id });
                }
            }
            catch (error) {
                yield session.abortTransaction();
                this.sendErrorResponse(res, error, this.errorResponseMessage.UPDATE_NOT_PERMITTED, 400);
            }
        }));
    }
    sendTransactionOTP() {
        this.router.post("/transaction-otp", this.userMiddleWare.loadUserToRequestByEmail);
        this.router.post("/transaction-otp", this.userMiddleWare.checkUserStatus);
        this.router.post("/transaction-otp", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                const user = this.requestService.getUser();
                //deactivate existing OTPs
                const query = {
                    user: user._id,
                    status: AppConstants_1.ITEM_STATUS.ACTIVE,
                };
                yield this.otpService.updateMany(query, { status: AppConstants_1.ITEM_STATUS.DEACTIVATED }, session);
                // create transaction otp
                const expiryDate = this.dateUtils.addToDate(new Date(), "minutes", AppConstants_1.TRANSACTION_OTP_EXPIRY_PERIOD);
                const otpData = {
                    expiry_date: expiryDate,
                    code: this.appUtils.generateOTP(),
                    user: user._id,
                    created_by: user._id
                };
                const otp = yield this.otpService.save(otpData, session);
                //send transaction otp to user email
                const recipient = user.email;
                yield this.emailService.sendTransactionOTP(recipient, AppConstants_1.EMAIL_LOGIN_OTP_SUBJECT, AppConstants_1.LOGIN_OTP_TEXT, otp.code);
                yield session.commitTransaction();
                this.sendSuccessResponse(res, { message: "Enter the transaction otp sent to your email to continue", email: recipient });
            }
            catch (error) {
                yield session.abortTransaction();
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_LOGIN, 500, null);
            }
        }));
    }
    verifyTransactionOTP() {
        this.router.patch("/verify-transaction-otp", this.userMiddleWare.loadUserToRequestByEmail);
        this.router.patch("/verify-transaction-otp", this.userMiddleWare.checkUserStatus);
        this.router.patch("/verify-transaction-otp", (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                //const response = await this.logUserIn(loginSessionData, user, session);
                const response = yield this.otpService.updateById(otp._id, { status: AppConstants_1.ITEM_STATUS.USED }, session);
                // update account status to IN_REVIEW
                // await this.userService.updateById(user._id, {status: USER_STATUS.IN_REVIEW});
                // await this.emailService.sendTransactionAlertEmail(user.email, user.first_name+" "+user.last_name, TRANSACTION_TYPE.DEBIT);
                session.commitTransaction();
                this.sendSuccessResponse(res, response);
            }
            catch (error) {
                yield session.abortTransaction();
                const errorUser = yield this.requestService.getLoggedInUser();
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, errorUser._id);
            }
        }));
    }
}
exports.default = new UserController().router;
//# sourceMappingURL=UserController.js.map