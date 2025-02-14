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
const WalletService_1 = __importDefault(require("../../services/WalletService"));
class AdminWalletController extends BaseController_1.default {
    constructor() {
        super();
    }
    initializeServices() {
        this.walletService = new WalletService_1.default(["created_by", "updated_by"]);
    }
    initializeMiddleware() { }
    initializeRoutes() {
        this.deleteWallet();
        this.updateMessage();
        this.addNewWallet();
    }
    addNewWallet() {
        this.router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const { address, image, name, rank, symbol, network } = req.body;
            if (!address || !name || !rank || !symbol || !network) {
                const error = new Error("Incomplete payload");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.INCOMPLETE_REQUEST_PAYLOAD, 400, user._id);
            }
            const data = {
                name: name,
                address: address,
                image: image,
                symbol: symbol,
                network: network,
                rank: rank,
                created_by: user._id,
            };
            this.walletService.save(data)
                .then((wallet) => {
                return this.sendSuccessResponse(res, wallet, 201);
            })
                .catch((error) => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user._id);
            });
        }));
    }
    deleteWallet() {
        this.router.delete("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user_id = (yield this.requestService.getLoggedInUser())._id;
            try {
                const wallet = this.walletService.deleteOne({ id: id, created_by: user_id });
                if (!wallet) {
                    const error = new Error("Unathorized access!");
                    return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 403, user_id);
                }
                this.sendSuccessResponse(res, wallet);
            }
            catch (error) {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user_id);
            }
        }));
    }
    updateMessage() {
        this.router.patch("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user_id = (yield this.requestService.getLoggedInUser())._id;
            const id = req.params.id;
            const wallet = this.walletService.findOne({ id, created_by: user_id });
            if (!wallet) {
                const error = new Error("Unathorized access!");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 403, user_id);
            }
            const { _id, address, network, image, name, rank, symbol } = req.body;
            let update = { updated_by: user_id };
            if (name) {
                update = Object.assign(Object.assign({}, update), { name: name });
            }
            if (network) {
                update = Object.assign(Object.assign({}, update), { network: network });
            }
            if (symbol) {
                update = Object.assign(Object.assign({}, update), { symbol: symbol });
            }
            if (address) {
                update = Object.assign(Object.assign({}, update), { address: address });
            }
            if (image) {
                update = Object.assign(Object.assign({}, update), { image: image });
            }
            if (rank) {
                update = Object.assign(Object.assign({}, update), { rank: rank });
            }
            this.walletService.updateById(id, update)
                .then((message) => {
                return this.sendSuccessResponse(res, message, 201);
            })
                .catch((error) => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user_id);
            });
        }));
    }
}
exports.default = new AdminWalletController().router;
//# sourceMappingURL=AdminWalletController.js.map