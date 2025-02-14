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
const UserService_1 = __importDefault(require("../user/UserService"));
class NotificationSocketService {
    constructor(io, socket) {
        this.saveChat = (newChat) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.chatService.save(newChat);
                const chats = yield this.chatService.paginate({ status: "active" }, 10);
                console.log(chats);
                this.io.emit("chats", chats);
            }
            catch (error) {
                console.error(error);
            }
        });
        this.io = io;
        this.socket = socket;
        this.chatService = new UserService_1.default();
    }
}
exports.default = NotificationSocketService;
//# sourceMappingURL=NotificationSocketService.js.map