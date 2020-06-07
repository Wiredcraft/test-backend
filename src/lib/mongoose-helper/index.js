import mongooseHidden from "mongoose-hidden";
import Filter from "./filter";

export default function(schema, options) {
  // soft delete
  schema.add({ deleted: { type: Boolean, index: true } });
  schema.add({ deletedAt: { type: Date } });

  schema.loadClass(Base);

  // hidden _id in toJSON and toObject
  schema.plugin(mongooseHidden(), {
    hidden: { _id: true, _v: true },
  });
}

/**
 * @template T
 */
class Base {
  /**
   * Get by id
   * @param {string} id - The objectId of model.
   * @returns {Promise<T>}
   */
  static get(id, populate = "") {
    return this.findById(id)
      .populate(populate)
      .exec();
  }

  /**
   * Update or create object with given id
   *
   * @param {*} id id of doc
   * @param {*} update body tobe updated
   * @returns {Promise<T>}
   */
  static upsert(id, update) {
    return this.findByIdAndUpdate(id, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }).exec();
  }

  /**
   * @typedef ListResult
   * @prop {number} ListResult.total number of total documents.
   * @prop {Array<T>} ListResult.docs documents to be returned.
   */

  /**
   * List objects in descending order of 'updatedAt' timestamp.
   *
   * @param {number} offset - Number of objects to be skipped.
   * @param {number} limit - Limit number of objects to be returned.
   * @param {Object} conditions - Query condition.
   * @returns {Promise<ListResult>}
   */
  static list({
    filter = {},
    lean = false,
    limit = 10,
    offset = 0,
    populate = "",
    select,
    sort = "-updatedAt",
  } = {}) {
    // make sure we default query not deleted docs
    filter = new Filter(filter);
    if (!filter.deleted) filter.deleted = { $ne: true };

    // build filter
    const count = this.countDocuments(filter).exec();
    const query = this.find(filter)
      .sort(sort)
      .skip(Number(offset))
      .limit(Number(limit))
      .populate(populate)
      .select(select)
      .lean(lean)
      .exec();

    return Promise.all([count, query]).then(([total, docs]) => ({
      total,
      docs,
    }));
  }

  /**
   * Soft remove.
   *
   * @returns {Promise<T>}
   */
  delete() {
    return this.set({
      deletedAt: new Date(),
      deleted: true,
    }).save();
  }

  /**
   * Get document back after soft removed.
   *
   * @returns {Promise<T>}
   */
  restore() {
    return this.set({
      deletedAt: undefined,
      deleted: undefined,
    }).save();
  }
}
