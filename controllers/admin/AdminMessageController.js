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
const MessageService_1 = __importDefault(require("../../services/MessageService"));
class AdminMessageController extends BaseController_1.default {
    constructor() {
        super();
    }
    initializeServices() {
        this.messageService = new MessageService_1.default(["created_by", "updated_by"]);
    }
    initializeMiddleware() { }
    initializeRoutes() {
        this.deleteMessage();
        this.updateMessage();
        this.addNewMessage();
    }
    addNewMessage() {
        this.router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.requestService.getLoggedInUser();
            const { _id, message_body, message_subject, user: user_id } = req.body;
            const data = {
                message_body: message_body,
                user: user_id,
                message_subject: message_subject,
                created_by: user._id,
            };
            this.messageService.save(data)
                .then((message) => {
                //Send Email Notification Here
                return this.sendSuccessResponse(res, message, 201);
            })
                .catch((error) => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user._id);
            });
        }));
    }
    deleteMessage() {
        this.router.delete("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user_id = (yield this.requestService.getLoggedInUser())._id;
            const message = this.messageService.findOne({ id, created_by: user_id });
            if (!message) {
                const error = new Error("Unathorized access!");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 403, user_id);
            }
            this.messageService.updateById(id, { status: AppConstants_1.ITEM_STATUS.DELETED, created_by: user_id, updated_by: user_id })
                .then((product) => __awaiter(this, void 0, void 0, function* () {
                this.sendSuccessResponse(res, product);
            }))
                .catch((error) => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user_id);
            });
        }));
    }
    updateMessage() {
        this.router.patch("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user_id = (yield this.requestService.getLoggedInUser())._id;
            const id = req.params.id;
            const message = this.messageService.findOne({ id, created_by: user_id });
            if (!message) {
                const error = new Error("Unathorized access!");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 403, user_id);
            }
            const { _id, message_body, message_subject, status } = req.body;
            let update = { updated_by: user_id };
            if (message_body) {
                update = Object.assign(Object.assign({}, update), { message_body: message_body });
            }
            if (message_subject) {
                update = Object.assign(Object.assign({}, update), { message_subject: message_subject });
            }
            if (status) {
                update = Object.assign(Object.assign({}, update), { status: status });
            }
            this.messageService.updateById(id, update)
                .then((message) => {
                return this.sendSuccessResponse(res, message, 201);
            })
                .catch((error) => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user_id);
            });
        }));
    }
}
exports.default = new AdminMessageController().router;
//# sourceMappingURL=AdminMessageController.js.map