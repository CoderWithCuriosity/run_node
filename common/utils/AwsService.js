"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
class AwsService {
    constructor() {
        this.s3 = new aws_sdk_1.S3({
            region: process.env.AWS_S3_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
            }
        });
    }
    uploadFile(file) {
        return new Promise((resolve, reject) => {
            this.s3.upload(file).promise()
                .then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}
exports.default = AwsService;
//# sourceMappingURL=AwsService.js.map