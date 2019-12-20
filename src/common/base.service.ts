import { Document, Model, ModelPopulateOptions, QueryFindOneAndUpdateOptions, Types } from 'mongoose';

export abstract class BaseService<T extends Document> {
    constructor(private readonly model: Model<T>) { }
    get getMode(): Model<T> {
        return this.model;
    }

    findAll(conditions: any, projection?: any | null, populates?: ModelPopulateOptions[] | ModelPopulateOptions): Promise<T[]>  {
        const docsQuery = this.model.find(conditions, projection);
        return this.populates<T[]>(docsQuery, populates);
    }

    findOne(conditions: any, projection?: any, populates?: ModelPopulateOptions[] | ModelPopulateOptions): Promise<T | null> {
        const docsQuery = this.model.findOne(conditions, projection || {});
        return this.populates<T>(docsQuery, populates);
    }

    findById(id: any | string | number, projection: any = {}, options: {
        lean?: boolean;
        populates?: ModelPopulateOptions[] | ModelPopulateOptions;
        [key: string]: any;
    } = {}): Promise<T | null> {
        const { option, populates } = options;
        const docsQuery = this.model.findById(this.toObjectId(id), projection, option);
        return this.populates<T>(docsQuery, populates);
    }

    findOneAndUpdate(conditions: any, update: any, options: QueryFindOneAndUpdateOptions = { new: true }): Promise<T | null> {
        return this.model.findOneAndUpdate(conditions, update, options).exec();
    }

    findByIdAndUpdate(id: string, update: any, options: QueryFindOneAndUpdateOptions = { new: true }): Promise<T | null> {
        return this.model.findByIdAndUpdate(this.toObjectId(id), update, options).exec();
    }
    create(docs: Partial<T>): Promise<T> {
        return this.model.create(docs);
    }

    delete(id: string): Promise<any | null> {
        return this.model.findByIdAndRemove(this.toObjectId(id)).exec();
    }

    remove(conditions: any): Promise<any | null> {
        return this.model.findOneAndRemove(conditions).exec();
    }
    private toObjectId(id: string): Types.ObjectId {
        return Types.ObjectId(id);
    }

    private populates<R>(docsQuery, populates): Promise<R | null> {
        if (populates) {
            [].concat(populates).forEach((item) => {
                docsQuery.populate(item);
            });
        }
        return docsQuery.exec();
    }
}
