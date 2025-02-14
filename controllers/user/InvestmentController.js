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
const InvestmentService_1 = __importDefault(require("../../services/InvestmentService"));
class UserInvestmentController extends BaseController_1.default {
    constructor() {
        super();
        // View a specific transaction by ID
        // viewTransaction() {
        //   this.router.get("/:id", (req: Request, res: Response) => {
        //     const transactionId = req.params.id;
        //     const user = this.requestService.getLoggedInUser();
        //     this.transactionService.findOne({user:user._id, _id:transactionId})
        //       .then((transaction) => {
        //         return this.sendSuccessResponse(res, transaction);
        //       })
        //       .catch((error: any) => {
        //         return this.sendErrorResponse(res,error,this.errorResponseMessage.ITEM_NOT_FOUND,404);
        //       });
        //   });
        // }
        // Filter transactions
        // filterTransaction() {
        //   this.router.get("/filter", (req: Request, res: Response) => {
        //     const user = this.requestService.getLoggedInUser();
        //     // You can implement filtering logic here based on request parameters
        //     // Example: Filter transactions by status
        //     const {status} = req.body as ITransaction
        //     const filter: any = {
        //       user: user._id,
        //       status: ITEM_STATUS.ACTIVE
        //     };
        //     // if (status) {
        //     //   filter.status = status;
        //     // }
        //     this.transactionService
        //       .find(filter)
        //       .then((filteredTransactions) => {
        //         return this.sendSuccessResponse(res, filteredTransactions);
        //       })
        //       .catch((error: any) => {
        //         return this.sendErrorResponse(
        //           res,
        //           error,
        //           this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST,
        //           500,
        //           user._id
        //         );
        //       });
        //   });
        // }
        // Calculate accrued amount based on plan and duration in days
        this.calculateAccruedAmount = (capital, plan, created_at, maturityDate) => {
            const selectedPlan = AppConstants_1.INVESTMENT_DATA_PLANS.find((p) => p.plan === plan);
            let accruedAmount = capital;
            const accruedData = { accruedAmount: 0, isMatured: false };
            // Calculate the duration in days
            const currentDate = new Date();
            const timeElapsedInSeconds = (currentDate.getTime() - created_at.getTime()) / 1000.0;
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
        this.transactionService = new TransactionService_1.default([
            "created_by",
            "updated_by",
            "category",
        ]);
        this.investmentService = new InvestmentService_1.default([
            "created_by",
            "updated_by"
        ]);
    }
    initializeMiddleware() { }
    initializeRoutes() {
        this.addNewInvestment();
        this.withdrawInvestment();
        // this.viewTransaction();
        this.listAllInvestments();
        // this.filterTransaction();
        this.reInvest();
    }
    addNewInvestment() {
        this.router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const loggedInUser = yield this.requestService.getLoggedInUser();
            const session = yield this.appUtils.createMongooseTransaction();
            const { _id, amount, plan } = req.body;
            const selected_plan = AppConstants_1.INVESTMENT_DATA_PLANS.find(item => item.plan === plan);
            //@ts-ignore
            const maturity_time_in_milliseconds = new Date().getTime() + (selected_plan === null || selected_plan === void 0 ? void 0 : selected_plan.duration_in_sec) * 1000;
            const newInvestmentData = {
                amount: amount,
                capital: amount,
                user: loggedInUser._id,
                plan: plan,
                maturityDate: new Date(maturity_time_in_milliseconds),
                transaction_type: AppConstants_2.TRANSACTION_TYPE.CREDIT,
                created_by: loggedInUser._id,
            };
            // Check the user's main balance
            const mainBalance = yield this.transactionService.getMainBalance(loggedInUser._id);
            console.log("main balance = ", mainBalance);
            if (mainBalance < amount) {
                session.abortTransaction();
                return this.sendErrorResponse(res, new Error("Insufficient fund"), this.errorResponseMessage.INSUFFICIENT_BALANCE, 400);
            }
            // Check the acceptable amount range for the selected plan 
            // @ts-ignore
            if ((selected_plan === null || selected_plan === void 0 ? void 0 : selected_plan.min_amount) > amount || amount > (selected_plan === null || selected_plan === void 0 ? void 0 : selected_plan.max_amount)) {
                // The 'amount' is outside the range [min_amount, max_amount]
                session.abortTransaction();
                return this.sendErrorResponse(res, new Error("Amount out of range"), {
                    response_code: 80,
                    message: `amount for ${selected_plan === null || selected_plan === void 0 ? void 0 : selected_plan.plan} must be between $${selected_plan === null || selected_plan === void 0 ? void 0 : selected_plan.min_amount} to $${selected_plan === null || selected_plan === void 0 ? void 0 : selected_plan.max_amount}`,
                }, 400);
            }
            // create investment credit for the loggedInUser
            const createdInvestment = yield this.investmentService.save(newInvestmentData, session);
            // debit main account of the loggedInUser
            const debitLoggedInUser = {
                amount: amount,
                user: loggedInUser._id,
                narration: `${plan} investment`,
                account_type: AppConstants_1.ACCOUNT_TYPE.INVESTMENT,
                transaction_status: AppConstants_1.TRANSACTION_STATUS.ACTIVE,
                transaction_type: "debit",
                created_by: loggedInUser._id,
            };
            yield this.transactionService.save(debitLoggedInUser, session);
            // credit the referral bonus to reffer's main account
            const referred_by = yield this.userService.findOne({ referred_by: loggedInUser.referred_by });
            //@ts-ignore
            const referral_bonus = ((selected_plan === null || selected_plan === void 0 ? void 0 : selected_plan.referral_bonus) / 100.00) * amount;
            if (referred_by) {
                const referralTransaction = {
                    amount: referral_bonus,
                    user: referred_by._id,
                    narration: 'referral commission',
                    account_type: AppConstants_1.ACCOUNT_TYPE.BONUS,
                    transaction_status: AppConstants_1.TRANSACTION_STATUS.ACTIVE,
                    transaction_type: "credit",
                    created_by: loggedInUser._id,
                };
                yield this.transactionService.save(referralTransaction);
            }
            if (createdInvestment) {
                session.commitTransaction();
                return this.sendSuccessResponse(res, createdInvestment, 201);
            }
            const error = new Error("Investment not created");
            return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400);
        }));
    }
    // A user should be able to liquidate their investment
    withdrawInvestment() {
        this.router.patch("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const investment_id = req.params.id;
            const session = yield this.appUtils.createMongooseTransaction();
            try {
                // Ensure that investment is still active
                const { status } = yield this.investmentService.findById(investment_id, session);
                if (status === AppConstants_1.ITEM_STATUS.EXPIRED) {
                    const error = new Error("Investment already expired");
                    yield session.abortTransaction();
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.INVESTMENT_NOT_ACTIVE, 400, user._id);
                }
                // Find the investment and set status to EXPIRED
                const { _id, maturityDate, plan, amount, created_at } = yield this.investmentService
                    .updateById(investment_id, { status: AppConstants_1.ITEM_STATUS.EXPIRED,
                    isMatured: true,
                    transaction_type: AppConstants_2.TRANSACTION_TYPE.DEBIT }, session);
                if (!_id) {
                    throw new Error("Investment not found");
                }
                // Calculate accrued amount based on capital, plan, and maturity date
                const accruedAmount = this.calculateAccruedAmount(amount, plan, created_at, maturityDate);
                // console.log("Accrued Amount -> ",accruedAmount)
                // Debit the investment account (you need to implement this part)
                // Credit user's 'investment' account
                const data = {
                    amount: accruedAmount.accruedAmount,
                    user: user._id,
                    account_type: AppConstants_1.ACCOUNT_TYPE.INVESTMENT,
                    status: AppConstants_1.TRANSACTION_STATUS.ACTIVE,
                    transaction_type: AppConstants_2.TRANSACTION_TYPE.CREDIT,
                    transaction_status: AppConstants_1.TRANSACTION_STATUS.ACTIVE,
                    narration: `Liquidated ${plan} investment`,
                    isMatured: accruedAmount.isMatured,
                    created_by: user._id,
                };
                // Save the transaction
                const transaction = yield this.transactionService.save(data, session);
                // Commit the transaction
                yield session.commitTransaction();
                return this.sendSuccessResponse(res, transaction, 201);
            }
            catch (error) {
                // Handle errors and rollback transaction if needed
                yield session.abortTransaction();
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400, user._id);
            }
            finally {
                // End the session
                session.endSession();
            }
        }));
    }
    // List all investments both active and expired
    listAllInvestments() {
        this.router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            try {
                const allInvestments = yield this.investmentService.find({ user: user._id });
                let accruedAmount;
                if (allInvestments) {
                    // Calculate a new amount for each active investment
                    const updatedInvestments = allInvestments.map((investment) => {
                        if (investment.status === AppConstants_1.ITEM_STATUS.ACTIVE) {
                            // Calculate the accrued amount based on your business logic
                            // Calculate accrued amount based on capital, plan, and maturity date
                            accruedAmount =
                                this.calculateAccruedAmount(investment.amount, investment.plan, investment.created_at, investment.maturityDate);
                            // Update the investment with the new accrued amount
                            investment.amount = accruedAmount.accruedAmount;
                        }
                        investment.isMatured = accruedAmount.isMatured;
                        return investment;
                    });
                    return this.sendSuccessResponse(res, updatedInvestments);
                }
                else {
                    const error = new Error("Error fetching investments");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400, user._id);
                }
            }
            catch (error) {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400, user._id);
            }
        }));
    }
    reInvest() {
        this.router.patch("/reinvest/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const loggedInUser = yield this.requestService.getLoggedInUser();
            const session = yield this.appUtils.createMongooseTransaction();
            const id = req.params.id;
            const findInvestment = yield this.investmentService.findOne({ _id: id, status: "active" }, session);
            const { _id, amount, plan } = findInvestment;
            const selected_plan = AppConstants_1.INVESTMENT_DATA_PLANS.find(item => item.plan === plan);
            //@ts-ignore
            const new_amount = amount + (amount * ((selected_plan === null || selected_plan === void 0 ? void 0 : selected_plan.percent) / 100.0));
            //@ts-ignore
            const maturity_time_in_milliseconds = new Date().getTime() + (selected_plan === null || selected_plan === void 0 ? void 0 : selected_plan.duration_in_sec) * 1000;
            const newInvestmentData = {
                //@ts-ignore
                amount: new_amount,
                capital: new_amount,
                user: loggedInUser._id,
                plan: plan,
                maturityDate: new Date(maturity_time_in_milliseconds),
                transaction_type: AppConstants_2.TRANSACTION_TYPE.CREDIT,
                created_by: loggedInUser._id,
                isMatured: false,
            };
            // Update Investment
            const updateInvestment = yield this.investmentService.updateById(_id, newInvestmentData, session);
            //   // credit the referral bonus to referer's main account
            // const referred_by = await this.userService.findOne({referred_by:loggedInUser.referred_by})
            // //@ts-ignore
            // const referral_bonus = (selected_plan?.referral_bonus/100.00)*amount;
            // if(referred_by){
            //   const referralTransaction = {
            //     amount: referral_bonus,
            //     user: referred_by._id,
            //     narration :  'referral commission',
            //     account_type: ACCOUNT_TYPE.BONUS,
            //     transaction_status: TRANSACTION_STATUS.ACTIVE,
            //     transaction_type: "credit",
            //     created_by: loggedInUser._id,
            //  };
            //  await this.transactionService.save(referralTransaction)
            // }
            if (updateInvestment) {
                session.commitTransaction();
                return this.sendSuccessResponse(res, updateInvestment, 200);
            }
            const error = new Error("Investment not created");
            return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 400);
        }));
    }
}
exports.default = new UserInvestmentController().router;
//# sourceMappingURL=InvestmentController.js.map