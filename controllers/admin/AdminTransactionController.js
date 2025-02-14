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
// import UserService from './../../services/user/UserService';
class AdminTransactionController extends BaseController_1.default {
    // private userService: UserService;
    constructor() {
        super();
    }
    initializeServices() {
        this.transactionService = new TransactionService_1.default(["created_by", "updated_by"]);
        this.emailService = new EmailService_1.default();
        // this.userService = new UserService()
    }
    initializeMiddleware() { }
    initializeRoutes() {
        this.deleteTransaction();
        this.approveTransaction();
        this.rejectTransaction();
        this.addNewTransaction();
        this.getAllTransaction();
    }
    addNewTransaction() {
        this.router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const { _id, account_type, transaction_type, user: user_id, amount, narration, admin_comment } = req.body;
            const data = {
                amount: amount,
                user: user_id,
                narration: narration,
                account_type: account_type,
                transaction_type: transaction_type,
                created_by: user._id,
                adminComment: admin_comment
            };
            const funded_user = yield this.userService.findOne({ _id: user_id });
            this.transactionService.save(data)
                .then((transaction) => __awaiter(this, void 0, void 0, function* () {
                if (account_type === AppConstants_1.ACCOUNT_TYPE.EARNING) {
                    return this.sendSuccessResponse(res, transaction, 201);
                }
                else {
                    yield this.emailService.sendTransactionAlertEmail(funded_user.email, funded_user.first_name + " " + funded_user.last_name, transaction);
                    return this.sendSuccessResponse(res, transaction, 201);
                }
            }))
                .catch((error) => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user._id);
            });
        }));
    }
    getAllTransaction() {
        this.router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            if (!user) {
                const error = Error("User not found");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500);
            }
            yield this.transactionService.find({})
                .then((transactions) => {
                return this.sendSuccessResponse(res, transactions, 200);
            })
                .catch((error) => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user._id);
            });
        }));
    }
    deleteTransaction() {
        this.router.delete("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield this.requestService.getLoggedInUser();
            const transaction = this.transactionService.findOne({ id, created_by: user._id });
            if (!transaction) {
                const error = new Error("Unathorized access!");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 403, user._id);
            }
            this.transactionService.updateById(id, { status: AppConstants_1.ITEM_STATUS.DELETED, created_by: user._id, updated_by: user._id })
                .then((transaction) => __awaiter(this, void 0, void 0, function* () {
                this.sendSuccessResponse(res, transaction);
            }))
                .catch((error) => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user._id);
            });
        }));
    }
    approveTransaction() {
        this.router.patch("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const id = req.params.id;
            const transaction = this.transactionService.findOne({ id, created_by: user._id });
            if (!transaction) {
                const error = new Error("Unathorized access!");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 403, user._id);
            }
            const update = { updated_by: user._id,
                transaction_status: AppConstants_1.TRANSACTION_STATUS.ACTIVE };
            yield this.transactionService.updateById(id, update)
                .then((transaction) => {
                return this.sendSuccessResponse(res, transaction, 201);
            })
                .catch((error) => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400, user._id);
            });
        }));
    }
    rejectTransaction() {
        this.router.patch("/decline/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const id = req.params.id;
            const transaction = this.transactionService.findOne({ id, created_by: user._id });
            if (!transaction) {
                const error = new Error("Unathorized access!");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 403, user._id);
            }
            const update = { updated_by: user._id,
                transaction_status: AppConstants_1.TRANSACTION_STATUS.REJECTED };
            yield this.transactionService.updateById(id, update)
                .then((transaction) => {
                return this.sendSuccessResponse(res, transaction, 201);
            })
                .catch((error) => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400, user._id);
            });
        }));
    }
    updateTransaction() {
        this.router.patch("update/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const id = req.params.id;
            const transaction = this.transactionService.findOne({ id, created_by: user._id });
            if (!transaction) {
                const error = new Error("Unathorized access!");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 403, user._id);
            }
            const { _id, account_type, admin_comment, amount, narration } = req.body;
            let update = { updated_by: user._id };
            if (amount) {
                update = Object.assign(Object.assign({}, update), { amount: amount });
            }
            if (account_type) {
                update = Object.assign(Object.assign({}, update), { account_type: account_type });
            }
            if (admin_comment) {
                update = Object.assign(Object.assign({}, update), { adminComment: admin_comment });
            }
            if (narration) {
                update = Object.assign(Object.assign({}, update), { narration: narration });
            }
            this.transactionService.updateById(id, update)
                .then((transaction) => {
                return this.sendSuccessResponse(res, transaction, 201);
            })
                .catch((error) => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400, user._id);
            });
        }));
    }
}
exports.default = new AdminTransactionController().router;
//# sourceMappingURL=AdminTransactionController.js.map