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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DBService_1 = __importDefault(require("../DBService"));
const user_1 = __importDefault(require("../../models/user/user"));
class UserService extends DBService_1.default {
    constructor(populatedFields = []) {
        super(user_1.default, populatedFields);
    }
    getSafeUserData(user) {
        // @ts-ignore
        const _a = user.toJSON(), { password } = _a, rest = __rest(_a, ["password"]);
        return rest;
    }
    getNumberOfReferrals(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // First, query the user document to get the referral code
                const user = yield user_1.default.findById(userId);
                const referralCode = user === null || user === void 0 ? void 0 : user.referral_code;
                // Now, use the referral code in the aggregation query
                const totalReferrals = yield user_1.default.aggregate([
                    {
                        $match: {
                            referred_by: referralCode, // Find users where the "referred_by" field matches the user's referral code
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalCount: { $sum: 1 }, // Count the matching users
                        },
                    },
                ]);
                // Extract the total count from the aggregation result
                const count = totalReferrals.length > 0 ? totalReferrals[0].totalCount : 0;
                return count;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=UserService.js.map