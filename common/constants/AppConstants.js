"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MINIMUIM_WITHDRAWABLE_BALANCE = exports.INVESTMENT_DATA_PLANS = exports.INVESTMENT_PLANS = exports.TRANSACTION_STATUS = exports.TRANSACTION_TYPE = exports.ACCOUNT_TYPE = exports.EMAIL_FOOTER1 = exports.COMPANY_INFO = exports.BANK_DETAILS = exports.DEPOSIT_WALLET = exports.USER_ROLES = exports.COMPLIANCE_LEVEL = exports.DOCUMENT_STATUS = exports.BIT = exports.GENDER = exports.ITEM_STATUS = exports.USER_STATUS = exports.RISK_LEVELS = exports.PAGINATOR_CUSTOM_LABELS = exports.PASSWORD_LENGTH = exports.TOKEN_EXPIRY_PERIOD = exports.TRANSACTION_OTP_EXPIRY_PERIOD = exports.OTP_EXPIRY_PERIOD = exports.LOGIN_OTP_SUBJECT = exports.LOGIN_OTP_TEXT = exports.PASSWORD_RESET_SUBJECT = exports.PASSWORD_RESET_TEXT = exports.EMAIL_TRANSACTION_OTP_SUBJECT = exports.EMAIL_LOGIN_OTP_SUBJECT = exports.EMAIL_PASSWORD_CHANGED_SUBJECT = exports.EMAIL_LOGIN_SUBJECT = exports.EMAIL_WELCOME_SUBJECT = exports.EMAIL_ACTIVATION_SUBJECT = exports.EMAIL_VERIFICATION_TEXT = exports.DEFAULT_COUNTRY_CODE = exports.LOGIN_SESSION_LABEL = exports.IPINFO_TOKEN = exports.USER_PRIVILEGE_LABEL = exports.LOGGED_IN_USER_LABEL = exports.USER_LABEL = void 0;
exports.USER_LABEL = "user";
exports.LOGGED_IN_USER_LABEL = "loggedInUser";
exports.USER_PRIVILEGE_LABEL = "user_privilege";
exports.IPINFO_TOKEN = "6e51c3f1e25d7e";
exports.LOGIN_SESSION_LABEL = "login_session";
exports.DEFAULT_COUNTRY_CODE = "1";
exports.EMAIL_VERIFICATION_TEXT = "A new account has been created on Assets Bit with this email.\n Enter the code below to verify your el";
exports.EMAIL_ACTIVATION_SUBJECT = "Assets Bit account activation";
exports.EMAIL_WELCOME_SUBJECT = "Welcome to Assets Bit - Your Journey Begins Here!";
exports.EMAIL_LOGIN_SUBJECT = "Account Login Alert 🚨";
exports.EMAIL_PASSWORD_CHANGED_SUBJECT = "Password Changed Successful 🚨";
exports.EMAIL_LOGIN_OTP_SUBJECT = "Your Login OTP for Assets Bit";
exports.EMAIL_TRANSACTION_OTP_SUBJECT = "Your Transaction OTP for Assets Bit";
exports.PASSWORD_RESET_TEXT = "The password for your account has been reset. Use the temporary password below to login and change your password. \n If you didn't make this request, please change your password as someone already knows your current password";
exports.PASSWORD_RESET_SUBJECT = "Account password reset";
exports.LOGIN_OTP_TEXT = "There is a login attempt on your account, enter the otp below to continue if you are the one.";
exports.LOGIN_OTP_SUBJECT = "Account Login OTP";
exports.OTP_EXPIRY_PERIOD = 10;
exports.TRANSACTION_OTP_EXPIRY_PERIOD = 15;
exports.TOKEN_EXPIRY_PERIOD = 10;
exports.PASSWORD_LENGTH = 5;
exports.PAGINATOR_CUSTOM_LABELS = Object.freeze({
    totalDocs: "count",
    docs: "data",
    limit: "itemsPerPage",
    page: "currentPage",
    nextPage: "next",
    prevPage: "prev",
    totalPages: "pageCount",
    pagingCounter: "pagingCounter",
    meta: "paginator",
});
exports.RISK_LEVELS = Object.freeze({
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
    SEVERE: 3,
    MAX: 4,
});
exports.USER_STATUS = Object.freeze({
    PENDING: "pending",
    ACTIVE: "active",
    IN_REVIEW: "in review",
    SELF_DEACTIVATED: "self deactivated",
    DELETED: "deleted",
    SUSPENDED: "suspended",
    DEACTIVATED: "deactivated",
    HIDDEN: "hidden",
});
exports.ITEM_STATUS = Object.freeze({
    OPEN: "open",
    CREATED: "created",
    PENDING: "pending",
    IN_REVIEW: "in review",
    ACTIVE: "active",
    DEACTIVATED: "deactivated",
    DELETED: "deleted",
    ARCHIVED: "archived",
    SUSPENDED: "suspended",
    HIDDEN: "hidden",
    CLOSED: "closed",
    APPROVED: "approved",
    REJECTED: "rejected",
    USED: "used",
    SkIPPED: "skipped",
    EXPIRED: "expired",
});
exports.GENDER = Object.freeze({
    MALE: "male",
    FEMALE: "female",
    NOT_SAY: "I will rather not say",
    OTHER: "other",
});
exports.BIT = Object.freeze({
    OFF: 0,
    ON: 1,
});
exports.DOCUMENT_STATUS = Object.freeze({
    CREATED: "created",
    VALIDATED: "validated",
    REJECTED: "rejected",
    APPROVED: "approved",
    DELETED: "deleted",
    ARCHIVED: "archived",
    IN_REVIEW: "in review",
});
exports.COMPLIANCE_LEVEL = Object.freeze({
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
});
exports.USER_ROLES = Object.freeze({
    ADMIN: "admin",
    SUPER_ADMIN: "super admin",
    STARTER_USER: "starter user",
});
///////////// NEW CONSTANTS//////////////////
exports.DEPOSIT_WALLET = {
    BTC: { symbol: "BTC", address: "b1XyWW34Vbtc", Network: "btc" },
    ETH: { symbol: "ETH", address: "0x0basxeth", Network: "eth" },
    USDT: { symbol: "USDT", address: "0x0usdt", Network: "tron" },
};
exports.BANK_DETAILS = {
    ACCOUNT_NAME: "John Doe",
    ACCOUNT_NUMBER: "123456",
    BIC_OR_SWIFT_CODE: "555",
    BANK_NAME: "Bank Name",
    NATIONAL_CODE: "National code",
    BANK_ADDRESS: "Address",
};
exports.COMPANY_INFO = {
    EMAIL: "support@assetsbit.com",
    PHONE: "(+143) 456-7890",
    STREET: "10 Brayford Square",
    CITY: "London",
    COUNTRY: "UK, E1 0SG",
    NAME: "Assets Bit"
};
exports.EMAIL_FOOTER1 = `<div style="background-color: #0a1342; color: #919191; text-align: center; padding: 1px; font-size: 36%">
<span>Contact us: ${exports.COMPANY_INFO.EMAIL} | Phone: ${exports.COMPANY_INFO.PHONE}</span><br/>
<span>Address: ${exports.COMPANY_INFO.STREET}, ${exports.COMPANY_INFO.CITY}, ${exports.COMPANY_INFO.COUNTRY}</span><br/>
<div style="border-top: 1px solid gray; padding-top: 2px;">&copy; ${new Date().getFullYear()} Assets Bit. All rights reserved.</div>
</div>`;
exports.ACCOUNT_TYPE = Object.freeze({
    MAIN: "main",
    INVESTMENT: "investment",
    BONUS: "bonus",
    EARNING: "earning"
});
exports.TRANSACTION_TYPE = Object.freeze({
    CREDIT: "credit",
    DEBIT: "debit"
});
exports.TRANSACTION_STATUS = Object.freeze({
    REJECTED: "rejected",
    APPROVED: "approved",
    ACTIVE: 'active',
    DELETED: "deleted",
    PENDING: "pending"
});
exports.INVESTMENT_PLANS = Object.freeze({
    STARTER: "starter",
    DIAMOND: "diamond",
    SILVER: "silver",
    GOLD: "gold",
    MASTER: "master",
    ULTIMATE: "ultimate",
    CANNABIS: "cannabis",
    ESTATE: "estate",
    IRA: "ira"
});
exports.INVESTMENT_DATA_PLANS = [
    { plan: "starter", percent: 10.0, min_amount: 75, max_amount: 1000, duration_in_sec: 1296000, referral_bonus: 5.0 },
    { plan: "diamond", percent: 12.0, min_amount: 1001, max_amount: 5000, duration_in_sec: 1036800, referral_bonus: 5.0 },
    { plan: "silver", percent: 15.0, min_amount: 5001, max_amount: 10000, duration_in_sec: 864000, referral_bonus: 5.0 },
    { plan: "gold", percent: 20.0, min_amount: 10001, max_amount: 100000, duration_in_sec: 604800, referral_bonus: 5.0 },
    { plan: "ira", percent: 17.50, min_amount: 70000, max_amount: 100000, duration_in_sec: 126144000, referral_bonus: 5.0 } //4 yr
];
exports.MINIMUIM_WITHDRAWABLE_BALANCE = 15;
//# sourceMappingURL=AppConstants.js.map