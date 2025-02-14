"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const App_1 = __importStar(require("./App"));
const Socket_1 = __importDefault(require("./Socket"));
dotenv_1.default.config();
const port = process.env.PORT;
const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const options = {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose_1.default.connect(MONGO_URI, options);
mongoose_1.default.connection.once("open", () => {
    console.log("Connected to MongoDB via Mongoose");
    const server = App_1.default.listen(port, () => {
        console.log(`Express is listening at http://localhost:${port}${App_1.API_PATH}`);
    });
    const io = require("socket.io")(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    new Socket_1.default(io);
});
mongoose_1.default.connection.on("error", (err) => console.error("Unable to connect to MongoDB via Mongoose\n" + err));
//# sourceMappingURL=index.js.map