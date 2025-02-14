"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationSocketService_1 = __importDefault(require("./services/socket/NotificationSocketService"));
class Socket {
    constructor(io) {
        io.on('connection', (socket) => {
            // console.log("connection to socket server");
            // console.log(socket.id);
            // socket.emit("connected", {socket: socket.id});
            const notificationSocket = new NotificationSocketService_1.default(io, socket);
            // socket.on('user', notificationSocket.connectUser);
        });
    }
}
//hello test
exports.default = Socket;
//# sourceMappingURL=Socket.js.map