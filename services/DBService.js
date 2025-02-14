"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppConstants_1 = require("../common/constants/AppConstants");
class DBService {
    constructor(Model, populatedPaths) {
        this.Model = Model;
        this.populatedFields = populatedPaths;
    }
    saveMany(data, session = null) {
        return this.Model.insertMany(data, { session: session });
    }
    save(data, session = null) {
        const model = new this.Model(data);
        return model.save({ session: session });
    }
    updateOrCreateNew(query, data, session = null, selectFields = []) {
        const finalQuery = query.status ? query : Object.assign(query, { status: { $ne: AppConstants_1.ITEM_STATUS.DELETED } });
        return this.Model.findOneAndUpdate(finalQuery, data, { new: true, upsert: true })
            .session(session)
            .select(selectFields)
            .exec();
    }
    count(query = {}) {
        //@ts-ignore
        const finalQuery = query.status ? query : Object.assign(query, { status: { $ne: AppConstants_1.ITEM_STATUS.DELETED } });
        return new Promise((resolve, reject) => {
            this.Model.countDocuments(finalQuery)
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    find(query = {}, sort = null, limit = 300, session = null, selectFields = []) {
        //@ts-ignore
        const finalQuery = query.status ? query : Object.assign(query, { status: { $ne: AppConstants_1.ITEM_STATUS.DELETED } });
        return new Promise((resolve, reject) => {
            this.Model.find(finalQuery)
                .session(session)
                .limit(limit)
                .sort(sort || { updated_at: -1 })
                .select(selectFields)
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    findDeleted(query = {}, sort = null) {
        const finalQuery = Object.assign(query, { status: AppConstants_1.ITEM_STATUS.DELETED });
        return new Promise((resolve, reject) => {
            this.Model.find(finalQuery)
                .sort(sort || { updated_at: -1 })
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    deleteOne(query = {}) {
        return new Promise((resolve, reject) => {
            this.Model.deleteOne(query)
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    findAndPopulate(query = {}, sort = null, limit = 300, session = null, selectFields = []) {
        //@ts-ignore
        const finalQuery = query.status ? query : Object.assign(query, { status: { $ne: AppConstants_1.ITEM_STATUS.DELETED } });
        return new Promise((resolve, reject) => {
            this.Model.find(finalQuery)
                .session(session)
                .limit(limit)
                .populate(this.populatedFields)
                .sort(sort || { updated_at: -1 })
                .select(selectFields)
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    paginate(query = {}, limit = 300, page = 1, selectFields = []) {
        //@ts-ignore
        const finalQuery = query.status ? query : Object.assign(query, { status: { $ne: AppConstants_1.ITEM_STATUS.DELETED } });
        const options = {
            select: selectFields,
            page: page,
            limit: limit,
            customLabels: AppConstants_1.PAGINATOR_CUSTOM_LABELS
        };
        return new Promise((resolve, reject) => {
            // @ts-ignore
            this.Model.paginate(finalQuery, options)
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    paginateAndPopulate(query = {}, limit = 300, sort = null, page = 1, selectFields = []) {
        //@ts-ignore
        const finalQuery = query.status ? query : Object.assign(query, { status: { $ne: AppConstants_1.ITEM_STATUS.DELETED } });
        const options = {
            select: selectFields,
            page: page,
            limit: limit,
            sort: sort || { updated_at: -1 },
            customLabels: AppConstants_1.PAGINATOR_CUSTOM_LABELS,
            populate: this.populatedFields
        };
        return new Promise((resolve, reject) => {
            // @ts-ignore
            this.Model.paginate(finalQuery, options)
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    findById(id, session = null, selectFields = []) {
        return new Promise((resolve, reject) => {
            this.Model.findById(id)
                .session(session)
                .select(selectFields)
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    findByIdAndPopulate(id, session = null, selectFields = []) {
        return new Promise((resolve, reject) => {
            this.Model.findById(id).session(session)
                .populate(this.populatedFields)
                .session(session)
                .select(selectFields)
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    findOne(query = {}, session = null, selectFields = []) {
        //@ts-ignore
        const finalQuery = query.status ? query : Object.assign(query, { status: { $ne: AppConstants_1.ITEM_STATUS.DELETED } });
        return new Promise((resolve, reject) => {
            this.Model.findOne(finalQuery)
                .session(session)
                .select(selectFields)
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    findOneAndPopulate(query = {}, session = null, selectFields = []) {
        //@ts-ignore
        const finalQuery = query.status ? query : Object.assign(query, { status: { $ne: AppConstants_1.ITEM_STATUS.DELETED } });
        return new Promise((resolve, reject) => {
            this.Model.findOne(finalQuery)
                .populate(this.populatedFields)
                .session(session)
                .select(selectFields)
                .then((data) => {
                resolve(data);
            })
                .catch((e) => {
                reject(e);
            });
        });
    }
    updateById(id, data, session = null, selectFields = []) {
        return this.Model.findByIdAndUpdate(id, data, { new: true })
            .session(session)
            .select(selectFields)
            .exec();
    }
    updateOne(query, data, session = null, selectFields = []) {
        const finalQuery = query.status ? query : Object.assign(query, { status: { $ne: AppConstants_1.ITEM_STATUS.DELETED } });
        return this.Model.findOneAndUpdate(finalQuery, data, { new: true })
            .session(session)
            .select(selectFields)
            .exec();
    }
    updateMany(query, data, session = null, selectFields = []) {
        const finalQuery = query.status ? query : Object.assign(query, { status: { $ne: AppConstants_1.ITEM_STATUS.DELETED } });
        return this.Model.updateMany(finalQuery, data)
            .session(session)
            .select(selectFields)
            .exec();
    }
}
exports.default = DBService;
//# sourceMappingURL=DBService.js.map