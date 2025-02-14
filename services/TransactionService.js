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
const transactions_1 = __importDefault(require("../models/transactions"));
const investments_1 = __importDefault(require("../models/investments"));
const DBService_1 = __importDefault(require("./DBService"));
const AppConstants_1 = require("../common/constants/AppConstants");
class TransactionService extends DBService_1.default {
    constructor(populatedFields = []) {
        super(transactions_1.default, populatedFields);
    }
    /**
* Get the main balance for a user.
* @param userId - The ID of the user.
* @returns {Promise<number>} - The main balance.
*/
    getMainBalance(userId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Calculate the sum of all credit transactions for the user
                const creditTransactions = yield transactions_1.default.aggregate([
                    {
                        $match: {
                            user: userId,
                            account_type: { $in: ["main", "bonus", "investment", "earning"] },
                            transaction_type: AppConstants_1.TRANSACTION_TYPE.CREDIT,
                            transaction_status: AppConstants_1.TRANSACTION_STATUS.ACTIVE,
                            status: AppConstants_1.ITEM_STATUS.ACTIVE,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalCredits: { $sum: "$amount" },
                        },
                    },
                ]);
                // Calculate the sum of all debit transactions for the user
                const debitTransactions = yield transactions_1.default.aggregate([
                    {
                        $match: {
                            user: userId,
                            account_type: { $in: ["main", "bonus", "investment", "earning"] },
                            transaction_type: AppConstants_1.TRANSACTION_TYPE.DEBIT,
                            transaction_status: AppConstants_1.TRANSACTION_STATUS.ACTIVE,
                            status: AppConstants_1.ITEM_STATUS.ACTIVE,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalDebits: { $sum: "$amount" },
                        },
                    },
                ]);
                // Calculate the main balance by subtracting totalDebits from totalCredits
                const totalCredits = ((_a = creditTransactions[0]) === null || _a === void 0 ? void 0 : _a.totalCredits) || 0;
                const totalDebits = ((_b = debitTransactions[0]) === null || _b === void 0 ? void 0 : _b.totalDebits) || 0;
                const mainBalance = totalCredits - totalDebits;
                return mainBalance;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalDeposit(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Calculate the sum of all deposit transactions for the user
                const depositTransactions = yield transactions_1.default.aggregate([
                    {
                        $match: {
                            user: userId,
                            account_type: { $in: ["main"] },
                            transaction_type: AppConstants_1.TRANSACTION_TYPE.CREDIT,
                            transaction_status: AppConstants_1.TRANSACTION_STATUS.ACTIVE,
                            status: AppConstants_1.ITEM_STATUS.ACTIVE,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalDeposits: { $sum: "$amount" },
                        },
                    },
                ]);
                const totalDeposit = ((_a = depositTransactions[0]) === null || _a === void 0 ? void 0 : _a.totalDeposits) || 0;
                return totalDeposit;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalWithdrawal(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Calculate the sum of all withdrawal transactions for the user
                const withdrawalTransactions = yield transactions_1.default.aggregate([
                    {
                        $match: {
                            user: userId,
                            account_type: { $in: ["main"] },
                            transaction_type: AppConstants_1.TRANSACTION_TYPE.DEBIT,
                            transaction_status: AppConstants_1.TRANSACTION_STATUS.ACTIVE,
                            status: AppConstants_1.ITEM_STATUS.ACTIVE
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalWithdrawals: { $sum: "$amount" },
                        },
                    },
                ]);
                const totalWithdrawal = ((_a = withdrawalTransactions[0]) === null || _a === void 0 ? void 0 : _a.totalWithdrawals) || 0;
                return totalWithdrawal;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalBonus(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Calculate the sum of all bonus transactions for the user
                const bonusTransactions = yield transactions_1.default.aggregate([
                    {
                        $match: {
                            user: userId,
                            account_type: AppConstants_1.ACCOUNT_TYPE.BONUS,
                            transaction_type: AppConstants_1.TRANSACTION_TYPE.CREDIT,
                            transaction_status: AppConstants_1.TRANSACTION_STATUS.ACTIVE,
                            status: AppConstants_1.ITEM_STATUS.ACTIVE
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalBonuses: { $sum: "$amount" },
                        },
                    },
                ]);
                const totalBonus = ((_a = bonusTransactions[0]) === null || _a === void 0 ? void 0 : _a.totalBonuses) || 0;
                return totalBonus;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalDepositFromInvestment(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Calculate the sum of all investment credit transactions for the user
                const investmentCreditTransactions = yield transactions_1.default.aggregate([
                    {
                        $match: {
                            user: userId,
                            account_type: { $in: ["investment"] },
                            transaction_type: AppConstants_1.TRANSACTION_TYPE.CREDIT,
                            transaction_status: AppConstants_1.TRANSACTION_STATUS.ACTIVE,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalInvestmentCredits: { $sum: "$amount" },
                        },
                    },
                ]);
                const totalInvestmentCredit = ((_a = investmentCreditTransactions[0]) === null || _a === void 0 ? void 0 : _a.totalInvestmentCredits) || 0;
                return totalInvestmentCredit;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalInvestmentCredit(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Calculate the sum of all investment debit transactions for the user
                const investmentDebitTransactions = yield investments_1.default.aggregate([
                    {
                        $match: {
                            user: userId,
                            transaction_type: AppConstants_1.TRANSACTION_TYPE.CREDIT,
                            status: AppConstants_1.ITEM_STATUS.ACTIVE
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalInvestmentDebits: { $sum: "$amount" },
                        },
                    },
                ]);
                const totalInvestmentDebit = ((_a = investmentDebitTransactions[0]) === null || _a === void 0 ? void 0 : _a.totalInvestmentDebits) || 0;
                return totalInvestmentDebit;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalInvestmentDebit(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Calculate the sum of all investment debit transactions for the user
                const investmentDebitTransactions = yield investments_1.default.aggregate([
                    {
                        $match: {
                            user: userId,
                            transaction_type: AppConstants_1.TRANSACTION_TYPE.DEBIT,
                            status: AppConstants_1.ITEM_STATUS.EXPIRED,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalInvestmentDebits: { $sum: "$amount" },
                        },
                    },
                ]);
                const totalInvestmentDebit = ((_a = investmentDebitTransactions[0]) === null || _a === void 0 ? void 0 : _a.totalInvestmentDebits) || 0;
                return totalInvestmentDebit;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalEarningDeposit(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Calculate the sum of all deposit transactions for the user
                const depositTransactions = yield transactions_1.default.aggregate([
                    {
                        $match: {
                            user: userId,
                            account_type: { $in: ["earning"] },
                            transaction_type: AppConstants_1.TRANSACTION_TYPE.CREDIT,
                            transaction_status: AppConstants_1.TRANSACTION_STATUS.ACTIVE,
                            status: AppConstants_1.ITEM_STATUS.ACTIVE,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalDeposits: { $sum: "$amount" },
                        },
                    },
                ]);
                const totalEarningDeposit = ((_a = depositTransactions[0]) === null || _a === void 0 ? void 0 : _a.totalDeposits) || 0;
                return totalEarningDeposit;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getTotalEarningWithdrawal(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Calculate the sum of all withdrawal transactions for the user
                const withdrawalTransactions = yield transactions_1.default.aggregate([
                    {
                        $match: {
                            user: userId,
                            account_type: { $in: ["earning"] },
                            transaction_type: AppConstants_1.TRANSACTION_TYPE.DEBIT,
                            transaction_status: AppConstants_1.TRANSACTION_STATUS.ACTIVE,
                            status: AppConstants_1.ITEM_STATUS.ACTIVE
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalWithdrawals: { $sum: "$amount" },
                        },
                    },
                ]);
                const totalEarningWithdrawal = ((_a = withdrawalTransactions[0]) === null || _a === void 0 ? void 0 : _a.totalWithdrawals) || 0;
                return totalEarningWithdrawal;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = TransactionService;
//# sourceMappingURL=TransactionService.js.map