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
const BaseRouterMiddleware_1 = __importDefault(require("./BaseRouterMiddleware"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Jimp = require("jimp");
const AwsService_1 = __importDefault(require("../common/utils/AwsService"));
const cloudinary_1 = require("cloudinary"); // Import the Cloudinary SDK
class UploadMiddleware extends BaseRouterMiddleware_1.default {
    constructor(appRouter) {
        super(appRouter);
        this.validateImage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const loggedInUser = (yield this.requestService.getLoggedInUser())._id;
            //@ts-ignore
            const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.photo;
            if (!file) {
                const error = new Error("File not found");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.FILE_NOT_FOUND, 400, loggedInUser);
            }
            if (!this.isValidImageFormat(file)) {
                const error = new Error("invalid file type");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.INVALID_PHOTO_TYPE, 400, loggedInUser);
            }
            const mb = 1024 * 1024;
            const maxSize = 5 * mb;
            if (file.size > maxSize) {
                const error = new Error("File is too large");
                return this.sendErrorResponse(res, error, this.errorResponseMessage.FILE_SIZE_LIMIT, 400, loggedInUser);
            }
            next();
        });
        // public uploadPhoto = async (req: Request, res: Response, next: NextFunction) => {
        //     const loggedInUser = this.requestService.getLoggedInUser()._id;
        //     //@ts-ignore
        //     const file: any = req.files?.photo;        
        //     const uploadedFile = {
        //         url: "",
        //         thumbnail_url: "",
        //         mime_type: file.mimetype,
        //         size: file.size,
        //         extension: path.extname(file.name),
        //     }
        //     try {
        //         if (req.body.upload_main_image) {
        //             const fileName = req.params.id + "_" + Date.now() + "_" + file.name;
        //             const photo = {
        //                 temp_path: file.tempFilePath,
        //                 mime_type: file.mimetype
        //             }
        //             const uploadedPhoto:any = await this.uploadToStorage(photo, "main/" + fileName);
        //             uploadedFile.url = uploadedPhoto.Location;
        //         }
        //     } catch (error: any) {
        //         return this.sendErrorResponse(res, error, this.errorResponseMessage.UPLOAD_ERROR, 400, loggedInUser);
        //     }
        //     try {
        //         if (req.body.upload_thumbnail) {
        //             const fileName = req.params.id + "_" + Date.now() + "_" + "thumbnail_" + file.name;
        //             const thumbnail = await this.resizeImage(file, 200);
        //             const photo = {
        //                 temp_path: thumbnail.tempFilePath,
        //                 mime_type: thumbnail.mimetype
        //             }
        //             const uploadedPhoto:any = await this.uploadToStorage(photo, "thumbnail/" + fileName);
        //             uploadedFile.thumbnail_url = uploadedPhoto.Location;
        //         }
        //     } catch (error: any) {
        //         this.loggerService.logError(error, loggedInUser);
        //     }
        //     this.requestService.addToDataBag("file", uploadedFile);
        //     next();
        // }
        this.uploadPhoto = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const loggedInUser = (yield this.requestService.getLoggedInUser())._id;
            //@ts-ignore
            const file = req.file; // Corrected this line
            const uploadedFile = {
                profile_pic_url: "",
                thumbnail_url: "",
                mime_type: file.mimetype,
                size: file.size,
                extension: path_1.default.extname(file.originalname), // Use originalname to get the file extension
            };
            try {
                if (file) {
                    const fileName = loggedInUser + "_" + Date.now() + "_" + file.filename; // Use originalname for the file name
                    const photo = {
                        temp_path: file.path,
                        mime_type: file.mimetype
                    };
                    const uploadedPhoto = yield this.uploadToCloudinaryStorage(photo, fileName);
                    uploadedFile.profile_pic_url = uploadedPhoto.url;
                }
            }
            catch (error) {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UPLOAD_ERROR, 400, loggedInUser);
            }
            this.requestService.addToDataBag("profile_photo_url", uploadedFile.profile_pic_url);
            next();
        });
        this.uploadGovtID = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const loggedInUser = (yield this.requestService.getLoggedInUser())._id;
            //@ts-ignore
            const file = req.file; // Corrected this line
            const uploadedFile = {
                govt_id: "",
                mime_type: file.mimetype,
                size: file.size,
                extension: path_1.default.extname(file.originalname), // Use originalname to get the file extension
            };
            try {
                if (file) {
                    const fileName = loggedInUser + "_" + Date.now() + "_" + file.filename; // Use originalname for the file name
                    const photo = {
                        temp_path: file.path,
                        mime_type: file.mimetype
                    };
                    const uploadedID = yield this.uploadToCloudinaryStorage(photo, fileName);
                    uploadedFile.govt_id = uploadedID.url;
                }
            }
            catch (error) {
                return this.sendErrorResponse(res, error, this.errorResponseMessage.UPLOAD_ERROR, 400, loggedInUser);
            }
            this.requestService.addToDataBag("govt_id", uploadedFile.govt_id);
            next();
        });
        // private uploadToStorage = (file: any, key: string) => {
        //     return new Promise((resolve, reject) => {
        //         fs.readFile(file.temp_path, (err, stream) => {
        //             if (err) {
        //                 reject(err);
        //             } else {
        //                 const bucket = process.env.AWS_S3_BUCKET_NAME || "";
        //                 const fileData = {
        //                     Body: stream,
        //                     Bucket: bucket,
        //                     Key: "photos/" + key,
        //                     ContentType: file.mime_type
        //                 };
        //                 this.awsService.uploadFile(fileData)
        //                 .then(uploadedFile => {
        //                     resolve(uploadedFile);
        //                 })
        //                 .catch(error => {
        //                     reject(error);
        //                 })
        //             }
        //         });
        //     });
        // }
        this.uploadToCloudinaryStorage = (file, key) => {
            return new Promise((resolve, reject) => {
                fs_1.default.readFile(file.temp_path, (err, stream) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        reject(err);
                    }
                    else {
                        try {
                            // Configure Cloudinary with your cloud_name, api_key, and api_secret
                            cloudinary_1.v2.config({
                                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                                api_key: process.env.CLOUDINARY_API_KEY,
                                api_secret: process.env.CLOUDINARY_API_SECRET,
                            });
                            // Upload the file to Cloudinary
                            yield cloudinary_1.v2.uploader.upload(file.temp_path, {
                                resource_type: 'image',
                                public_id: 'photos/' + key,
                                folder: process.env.CLOUDINARY_FOLDER,
                                overwrite: true,
                                tags: [],
                                allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'], // Allowed file formats
                            }, (error, result) => {
                                if (error) {
                                    reject(error);
                                }
                                else {
                                    // Here, 'result' contains information about the uploaded image
                                    resolve(result);
                                }
                            });
                            // You can access the URL of the uploaded image as result.secure_url
                        }
                        catch (error) {
                            reject(error);
                        }
                    }
                }));
            });
        };
        this.isValidImageFormat = (file) => {
            const mimeType = file.mimetype;
            if (mimeType == "image/png" || mimeType == "image/jpeg" || mimeType == "image/jpg") {
                return true;
            }
            return false;
        };
        this.resizeImage = (file, fileSize) => {
            return new Promise((resolve, reject) => {
                Jimp.read(file.tempFilePath, (error, thumbnail) => {
                    if (error)
                        reject(error);
                    thumbnail
                        .resize(fileSize, Jimp.AUTO)
                        .quality(50)
                        .write(file.tempFilePath);
                    resolve(file);
                });
            });
        };
    }
    initServices() {
        this.awsService = new AwsService_1.default();
    }
}
exports.default = UploadMiddleware;
//# sourceMappingURL=UploadMiddleware.js.map