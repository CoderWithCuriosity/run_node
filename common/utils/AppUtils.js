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
const randomstring_1 = __importDefault(require("randomstring"));
const bcrypt = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const mongoose_1 = __importDefault(require("mongoose"));
class AppUtils {
    generateUUIDV4() {
        return (0, uuid_1.v4)();
    }
    static generateUUIDV4Static() {
        return (0, uuid_1.v4)();
    }
    getCode(length = 6, capitalize = false) {
        if (process.env.ENVIRONMENT == 'dev') {
            return "password";
        }
        const options = {
            length: length,
            readable: true,
            charset: "alphanumeric",
        };
        if (capitalize) {
            options.capitalization = "uppercase";
        }
        return randomstring_1.default.generate(options);
    }
    generateOTP(length = 6) {
        if (process.env.ENVIRONMENT == 'dev') {
            return "123456";
        }
        return this.getCode(length);
    }
    getNumberCode(length = 6) {
        const options = {
            length: length,
            charset: "numeric"
        };
        return randomstring_1.default.generate(options);
    }
    getAlphaCode(length = 6, capitalize = false) {
        const options = {
            length: length,
            charset: 'alphabetic'
        };
        if (capitalize) {
            options.capitalization = "uppercase";
        }
        return randomstring_1.default.generate(options);
    }
    generateLoginToken(loginSession) {
        const data = { user: loginSession.user, uuid: loginSession.uuid, id: loginSession._id };
        const token = jsonwebtoken_1.default.sign({ data: data }, process.env.JWT_PRIVATE_KEY, { expiresIn: process.env.JWT_EXPIRY });
        return token;
    }
    verifyToken(token, callback) {
        jsonwebtoken_1.default.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
            if (err) {
                console.log("Error - ", err);
            }
            callback(err, decoded);
        });
    }
    // public async verifyToken(token: string): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         Jwt.verify(token, process.env.JWT_PRIVATE_KEY!, (err: any, decoded: any) => {
    //             console.log("Token => ", token)
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(decoded);
    //             }
    //         });
    //     });
    // }
    createDefaultPassword() {
        return (process.env.ENVIRONMENT === "dev") ? "password" : this.getCode();
    }
    hashData(data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const salt = yield bcrypt.genSalt(12);
                const hash = bcrypt.hash(data, salt);
                resolve(hash);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    getTokenFromRequest(req) {
        const payload = req.headers.authorization || "";
        let jwt = "";
        if (payload) {
            if (payload.split(" ").length > 1) {
                jwt = payload.split(" ")[1];
                return jwt;
            }
        }
        return jwt;
    }
    createMongooseTransaction() {
        return new Promise((resolve, reject) => {
            let session;
            mongoose_1.default.startSession()
                .then(_session => {
                session = _session;
                session.startTransaction();
            })
                .then(() => {
                resolve(session);
            })
                .catch((error) => {
                reject(error);
            });
        });
    }
}
exports.default = AppUtils;
//# sourceMappingURL=AppUtils.js.map