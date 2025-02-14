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
const BaseController_1 = __importDefault(require("../basecontrollers/BaseController"));
const AppConstants_1 = require("../../common/constants/AppConstants");
const TransactionService_1 = __importDefault(require("../../services/TransactionService"));
const EmailService_1 = __importDefault(require("./../../common/utils/EmailService"));
const MessageService_1 = __importDefault(require("../../services/MessageService"));
class AdminUserController extends BaseController_1.default {
    constructor() {
        super();
    }
    initializeServices() {
        this.transactionService = new TransactionService_1.default();
        this.messageService = new MessageService_1.default();
        this.emailService = new EmailService_1.default();
    }
    initializeMiddleware() { }
    initializeRoutes() {
        this.getAllUsersInfo();
        this.approveUser();
        this.updateUserStatus();
        this.deleteUser();
        this.getUserInfo();
        this.emailUser();
    }
    getAllUsersInfo() {
        this.router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            try {
                if (!user._id) {
                    const error = new Error("Logged in user not found");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.SESSION_EXPIRED, 404, user._id);
                }
                // Fetch all users
                const allUsers = yield this.userService.find({});
                const message_count = yield this.messageService.count();
                // Iterate through allUsers and add additional information for each user
                const usersWithAdditionalInfo = yield Promise.all(allUsers.map((user) => __awaiter(this, void 0, void 0, function* () {
                    // Fetch and calculate additional information for each user
                    const main_balance = yield this.transactionService.getMainBalance(user._id);
                    const total_withdrawal = yield this.transactionService.getTotalWithdrawal(user._id);
                    const total_deposit = yield this.transactionService.getTotalDeposit(user._id);
                    const total_deposit_from_investment = yield this.transactionService.getTotalDepositFromInvestment(user._id);
                    const total_bouns = yield this.transactionService.getTotalBonus(user._id);
                    const total_credit_into_investment_account = yield this.transactionService.getTotalInvestmentCredit(user._id);
                    const total_referrer = yield this.userService.getNumberOfReferrals(user._id);
                    // Return the user object with additional information
                    return Object.assign(Object.assign({}, user.toObject()), { main_balance: main_balance, total_withdrawal: total_withdrawal, total_bouns: total_bouns, total_deposit: total_deposit, total_investment_revenue: total_deposit_from_investment, total_investment_capital: total_credit_into_investment_account, total_referred: total_referrer, message_count: message_count });
                })));
                return this.sendSuccessResponse(res, usersWithAdditionalInfo, 200);
            }
            catch (error) {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400, user._id);
            }
        }));
    }
    getUserInfo() {
        this.router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user_id = (yield this.requestService.getLoggedInUser())._id;
            const id = req.params.id;
            try {
                if (!user_id) {
                    const error = new Error("logged in user not found");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.SESSION_EXPIRED, 404, user_id);
                }
                const user = yield this.userService.findById(id);
                if (!user) {
                    const error = new Error("user not found");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.USER_NOT_FOUND, 404, user_id);
                }
                // Calculate additional information for the specific user
                const main_balance = yield this.transactionService.getMainBalance(user._id);
                const total_withdrawal = yield this.transactionService.getTotalWithdrawal(user._id);
                const total_deposit = yield this.transactionService.getTotalDeposit(user._id);
                const total_deposit_from_investment = yield this.transactionService.getTotalDepositFromInvestment(user._id);
                const total_bouns = yield this.transactionService.getTotalBonus(user._id);
                const total_credit_into_investment_account = yield this.transactionService.getTotalInvestmentCredit(user._id);
                const total_referrer = yield this.userService.getNumberOfReferrals(user._id);
                // Include the additional information in the user object
                const userWithAdditionalInfo = Object.assign(Object.assign({}, user.toObject()), { main_balance: main_balance, total_withdrawal: total_withdrawal, total_bouns: total_bouns, total_deposit: total_deposit, total_investment_revenue: total_deposit_from_investment, total_investment_capital: total_credit_into_investment_account, total_referred: total_referrer });
                return this.sendSuccessResponse(res, userWithAdditionalInfo, 200);
            }
            catch (error) {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400, user_id);
            }
        }));
    }
    approveUser() {
        this.router.patch("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user_id = (yield this.requestService.getLoggedInUser())._id;
            const id = req.params.id;
            try {
                if (!user_id) {
                    const error = new Error("logged in user not found");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.SESSION_EXPIRED, 404, user_id);
                }
                const update = {
                    updated_by: user_id,
                    status: AppConstants_1.ITEM_STATUS.ACTIVE
                };
                const updatedUser = yield this.userService.updateById(id, update);
                if (updatedUser) {
                    const data = {
                        amount: 50,
                        user: updatedUser._id,
                        narration: "Sign Up Bonus",
                        account_type: "bonus",
                        transaction_type: "credit",
                        created_by: user_id,
                        transaction_status: AppConstants_1.TRANSACTION_STATUS.ACTIVE
                    };
                    const fund_bonus = yield this.transactionService.save(data);
                    if (!fund_bonus) {
                        return this.sendErrorResponse(res, new Error("bonus failed"), this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400);
                    }
                    yield this.emailService.sendWelcomeEmail(updatedUser.email, AppConstants_1.EMAIL_WELCOME_SUBJECT, updatedUser.first_name + " " + updatedUser.last_name);
                    yield this.emailService.sendTransactionAlertEmail(updatedUser.email, updatedUser.first_name + " " + updatedUser.last_name, fund_bonus);
                    return this.sendSuccessResponse(res, updatedUser, 201);
                }
            }
            catch (error) {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400, user_id);
            }
        }));
    }
    updateUserStatus() {
        this.router.patch("update-account/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user_id = (yield this.requestService.getLoggedInUser())._id;
            const id = req.params.id;
            try {
                if (!user_id) {
                    const error = new Error("logged in user not found!");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.SESSION_EXPIRED, 403, user_id);
                }
                const { _id, status } = req.body;
                let update = { updated_by: user_id };
                if (status) {
                    update = Object.assign(Object.assign({}, update), { status: status });
                }
                const user = yield this.userService.updateById(id, update);
                if (user) {
                    return this.sendSuccessResponse(res, user, 201);
                }
            }
            catch (error) {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400, user_id);
            }
        }));
    }
    deleteUser() {
        this.router.delete("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user_id = (yield this.requestService.getLoggedInUser())._id;
            try {
                if (!user_id) {
                    const error = new Error("logged in user not found!");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 403, user_id);
                }
                const deleteduser = yield this.userService.updateById(id, { status: AppConstants_1.ITEM_STATUS.DELETED, created_by: user_id, updated_by: user_id });
                if (deleteduser) {
                    this.sendSuccessResponse(res, deleteduser, 201);
                }
            }
            catch (error) {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user_id);
            }
        }));
    }
    emailUser() {
        this.router.post("/email/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { message, subject } = req.body;
            if (!message || !subject) {
                const error = new Error("missing payload");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.INCOMPLETE_REQUEST_PAYLOAD, 400);
            }
            try {
                const user_id = (yield this.requestService.getLoggedInUser())._id;
                if (!user_id) {
                    const error = new Error("logged in user not found!");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.USER_NOT_FOUND, 404, user_id);
                }
                const user = yield this.userService.findById(id);
                if (!user) {
                    const error = new Error("recipient user not found!");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.USER_NOT_FOUND, 404, user_id);
                }
                const data = {
                    user: user.id,
                    message_body: message,
                    message_subject: subject,
                    created_by: user_id,
                };
                const saved_message = yield this.messageService.save(data);
                if (saved_message) {
                    yield this.emailService.sendCustomEmailToUser(user.email, subject, message, user.first_name + " " + user.last_name);
                    this.sendSuccessResponse(res, { message: "email sent!" }, 201);
                }
            }
            catch (error) {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
        }));
    }
}
exports.default = new AdminUserController().router;
//# sourceMappingURL=AdminUserController.js.map