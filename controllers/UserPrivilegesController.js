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
const BaseController_1 = __importDefault(require("./basecontrollers/BaseController"));
const AppConstants_1 = require("../common/constants/AppConstants");
const UserPrivilegeService_1 = __importDefault(require("../services/user/UserPrivilegeService"));
class UserPrivilegesController extends BaseController_1.default {
    constructor() {
        super();
    }
    initializeServices() {
        this.userPrivilegeService = new UserPrivilegeService_1.default(["created_by", "updated_by", "user"]);
    }
    initializeMiddleware() {
    }
    initializeRoutes() {
        this.add();
        this.view();
        this.list();
        this.remove();
    }
    add() {
        this.router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { role, user_id } = req.body;
            if (!role || !user_id) {
                return res.status(401).send({ message: "Role and UserId are required" });
            }
            const user = yield this.requestService.getLoggedInUser();
            try {
                const newPrivilege = {
                    role: role,
                    user: user_id,
                    created_by: user._id,
                    updated_by: user._id,
                    status: AppConstants_1.ITEM_STATUS.ACTIVE, // Set the status as needed
                };
                const savedPrivilege = yield this.userPrivilegeService.save(newPrivilege);
                if (savedPrivilege) {
                    return this.sendSuccessResponse(res, savedPrivilege);
                }
            }
            catch (error) {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user._id);
            }
        }));
    }
    remove() {
        this.router.delete("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield this.requestService.getLoggedInUser();
            this.userPrivilegeService.findById(id)
                .then((privilege) => __awaiter(this, void 0, void 0, function* () {
                try {
                    privilege.status = AppConstants_1.ITEM_STATUS.DEACTIVATED;
                    privilege.updated_by = user._id;
                    privilege = yield privilege.save();
                    this.sendSuccessResponse(res, privilege);
                }
                catch (error) {
                    throw error;
                }
            }))
                .catch(error => {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, user._id);
            });
        }));
    }
    view() {
        this.router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errorUser = yield this.requestService.getLoggedInUser();
            const id = req.params.id;
            this.userPrivilegeService.findByIdAndPopulate(id)
                .then(userPrivilege => {
                this.sendSuccessResponse(res, userPrivilege);
            })
                .catch(error => {
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, errorUser._id);
            });
        }));
    }
    list() {
        this.router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errorUser = yield this.requestService.getLoggedInUser();
            this.userPrivilegeService.find({ status: AppConstants_1.ITEM_STATUS.ACTIVE })
                .then(userPrivileges => {
                this.sendSuccessResponse(res, userPrivileges);
            })
                .catch(error => {
                this.sendErrorResponse(res, error, this.errorResponseMessage.UNABLE_TO_COMPLETE_REQUEST, 500, errorUser._id);
            });
        }));
    }
}
exports.default = new UserPrivilegesController().router;
//# sourceMappingURL=UserPrivilegesController.js.map