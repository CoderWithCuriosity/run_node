"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_PATH = exports.apiVersion = void 0;
const express_1 = __importDefault(require("express"));
const Cors_1 = __importDefault(require("./common/utils/Cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const AdminRoutes_1 = __importDefault(require("./routes/admin/AdminRoutes"));
const UserRoutes_1 = __importDefault(require("./routes/user/UserRoutes"));
const UserRoutes_2 = __importDefault(require("./routes/public/UserRoutes"));
const AppRoutes_1 = __importDefault(require("./routes/AppRoutes"));
const AuthController_1 = __importDefault(require("./controllers/AuthController"));
const AuthMiddleware_1 = __importDefault(require("./middlewares/AuthMiddleware"));
// import fileUpload from "express-fileupload";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.apiVersion = process.env.API_VERSION;
exports.API_PATH = `/api/${exports.apiVersion}`;
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.plugInMiddlewares();
        this.plugInRoutes();
    }
    plugInMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        // this.app.use(fileUpload({useTempFiles: true, tempFileDir: "/tmp/"}));
        this.app.use((0, Cors_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use((0, compression_1.default)());
    }
    plugInRoutes() {
        const authMiddleware = new AuthMiddleware_1.default(this.app);
        const adminRoutes = new AdminRoutes_1.default(this.app);
        const appRoutes = new AppRoutes_1.default(this.app);
        const privateUserRoute = new UserRoutes_1.default(this.app);
        const userRoutes = new UserRoutes_2.default(this.app);
        this.app.get(exports.API_PATH + "/health", (req, res) => {
            const response = "Build successful " + new Date().toUTCString();
            res.status(200).send(response);
        });
        this.app.use(exports.API_PATH + "/auth", AuthController_1.default);
        //load other public/non-secured routes
        userRoutes.initializeRoutes();
        //Load Authentication MiddleWare
        this.app.use(authMiddleware.authGuard);
        //Load secured routes
        appRoutes.initializeRoutes();
        adminRoutes.initializeRoutes();
        privateUserRoute.initializeRoutes();
    }
}
exports.default = new App().app;
//# sourceMappingURL=App.js.map