'use strict';

const Service = require('egg').Service;

class OauthService extends Service {
  /**
   * register user and update Authorization colection
   * @param {Object} meta user info
   */

  // Transaction numbers are only allowed on a replica set member or mongos
  async register(meta) {
    this.logger.info('[service.user.register]', 'Begin to register', JSON.stringify({ provider: meta.provider, uid: meta.id }));
    const { ctx } = this;
    // const session = await ctx.model.User.startSession();
    // session.startTransaction();
    // const opts = { session };
    try {
      const newUser = (await ctx.model.User.create([{
        name: meta.displayName, // user name
        avatar: meta.photo,
        dob: '',  // date of birth
        address: '', // user address
        description: '', // user description
        location: {
          type: 'Point',
          coordinates: ['27.68', '120.32'] 
        },
      }]))[0]; // TODO: Add Transaction option 
      await ctx.model.Authorization.findOneAndUpdate({
        uid: meta.id,
        provider: meta.provider,
        userId: newUser._id,
      }, { $set: { meta: meta.profile._json } }, { upsert: true }); // TODO: Add Transaction option
      // await session.commitTransaction();
      // session.endSession();
      return newUser;
    } catch (error) {
      // await session.abortTransaction();
      // session.endSession();
      throw error;
    }
  }
}

module.exports = OauthService;
