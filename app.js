'use strict';

const assert = require('assert');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    // The config file has been read and merged, but it has not yet taken effect
    // This is the last time the application layer modifies the configuration
    // Note: This function only supports synchronous calls.

    // as early as possible require
    // require('appoptics-apm');
  }

  async willReady() {
    // When signing in for the first time, you generally need to put user information into the repository and record the Session.
    // In the second login, the user information obtained from OAuth or Session, and the database is read to get the complete user information.
    this.app.passport.verify(async (ctx, user) => {
      // Check user
      assert(user.provider, 'user.provider should exists');
      assert(user.id, 'user.id should exists');

      // Find user information from the database
      //
      // Authorization Collection
      // field   | desc
      // ---      | --
      // provider | provider name, like auth0, github, twitter, facebook, weibo and so on
      // uid      | provider unique id
      // userId  | current application user id
      const auth = await ctx.model.Authorization.findOne({
        uid: user.id,
        provider: user.provider,
      });
      const existsUser = auth && await ctx.model.User.findById(auth.userId);
      if (existsUser) {
        return existsUser;
      }
      // Call service to register a new user
      const newUser = await ctx.service.oauth.register(user);
      return newUser;
    });

    // // Serialize and store the user information into session. Generally, only a few fields need to be streamlined/saved.
    // this.app.passport.serializeUser(async (ctx, user) => {
    //   // process user
    //   // ...
    //   // return user;
    // });

    // // Deserialize the user information from the session, check the database to get the complete information
    // this.app.passport.deserializeUser(async (ctx, user) => {
    //   // process user
    //   // ...
    //   // return user;
    // });
  }
}

module.exports = AppBootHook;
