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
const AppConstants_2 = require("../../common/constants/AppConstants");
const AppConstants_3 = require("./../../common/constants/AppConstants");
class UserTransactionController extends BaseController_1.default {
    constructor() {
        super();
    }
    initializeServices() {
        this.transactionService = new TransactionService_1.default([
            "created_by",
            "updated_by",
            "category",
        ]);
    }
    initializeMiddleware() { }
    initializeRoutes() {
        this.withdrawalTransaction();
        this.viewTransaction();
        this.listAllTransactions();
        this.filterTransaction();
    }
    // A user should be able to withdraw from their main balance
    withdrawalTransaction() {
        this.router.post("/", this.userMiddleWare.checkUserStatus);
        this.router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const { amount, narration, payment_option, selected_coin } = req.body;
            // Check the user's main balance
            const mainBalance = yield this.transactionService.getMainBalance(user._id);
            if (mainBalance < amount) {
                return this.sendErrorResponse(res, new Error("Insufficient balance"), this.errorResponseMessage.INSUFFICIENT_BALANCE, 400);
            }
            // Check minimum withdrawal amount
            if (amount < AppConstants_3.MINIMUIM_WITHDRAWABLE_BALANCE) {
                return this.sendErrorResponse(res, new Error("Can't withdraw less than " + AppConstants_3.MINIMUIM_WITHDRAWABLE_BALANCE), this.errorResponseMessage.LESS_THAN_WITHDRAWABLE_AMOUNT, 400);
            }
            const data = {
                amount: amount,
                user: user._id,
                account_type: AppConstants_1.ACCOUNT_TYPE.MAIN,
                status: AppConstants_1.TRANSACTION_STATUS.PENDING,
                transaction_type: AppConstants_2.TRANSACTION_TYPE.DEBIT,
                narration: narration,
                payment_option: payment_option,
                selected_coin: selected_coin,
                created_by: user._id,
            };
            this.transactionService
                .save(data)
                .then((transaction) => {
                return this.sendSuccessResponse(res, transaction, 201);
            })
                .catch((error) => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user._id);
            });
        }));
    }
    // View a specific transaction by ID
    viewTransaction() {
        this.router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const transactionId = req.params.id;
            const user = yield this.requestService.getLoggedInUser();
            this.transactionService.findOne({ user: user._id, _id: transactionId })
                .then((transaction) => {
                return this.sendSuccessResponse(res, transaction);
            })
                .catch((error) => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.ITEM_NOT_FOUND, 404);
            });
        }));
    }
    // List all transactions
    listAllTransactions() {
        this.router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const transactionStatuses = [
                AppConstants_1.TRANSACTION_STATUS.ACTIVE,
                AppConstants_1.TRANSACTION_STATUS.REJECTED,
                AppConstants_1.TRANSACTION_STATUS.PENDING,
                AppConstants_1.TRANSACTION_STATUS.APPROVED,
            ];
            try {
                const allTransactions = yield this.transactionService
                    .find({ user: user._id, status: { $in: transactionStatuses } });
                if (allTransactions) {
                    return this.sendSuccessResponse(res, allTransactions);
                }
            }
            catch (error) {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400, user._id);
            }
        }));
    }
    // Filter transactions
    filterTransaction() {
        this.router.get("/filter", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            // You can implement filtering logic here based on request parameters
            // Example: Filter transactions by status
            const { status } = req.body;
            const filter = {
                user: user._id,
                status: AppConstants_1.ITEM_STATUS.ACTIVE
            };
            // if (status) {
            //   filter.status = status;
            // }
            yield this.transactionService
                .find(filter)
                .then((filteredTransactions) => {
                return this.sendSuccessResponse(res, filteredTransactions);
            })
                .catch((error) => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user._id);
            });
        }));
    }
}
exports.default = new UserTransactionController().router;
//# sourceMappingURL=TransactionController.js.map