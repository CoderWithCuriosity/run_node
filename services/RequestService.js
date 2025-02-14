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
Object.defineProperty(exports, "__esModule", { value: true });
class RequestService {
    constructor(router) {
        this.router = router;
        this.router.use((req, res, next) => {
            this.request = req;
            this.response = res;
            next();
        });
    }
    addToDataBag(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response.locals[key] = value;
        });
    }
    getFromDataBag(key) {
        return this.response.locals[key];
    }
    getUser() {
        return this.response.locals.user;
    }
    getLoggedInUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.response.locals.loggedInUser;
        });
    }
    setCurrentUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.response.locals.loggedInUser = user;
        });
    }
    getLoginSession() {
        return this.response.locals.login_session;
    }
}
exports.default = RequestService;
//# sourceMappingURL=RequestService.js.map