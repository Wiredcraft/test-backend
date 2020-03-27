'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async render() {
    const ctx = this.ctx;
    console.log(ctx.user, '....');
    if (ctx.isAuthenticated()) {
      ctx.body = `<div>
        <h2>${ctx.path}</h2>
        <hr>
        Logined user: <img src="${ctx.user.avatar}"> ${ctx.user.name} / ${ctx.user._id} | <a href="/logout">Logout</a>
        <pre><code>${JSON.stringify(ctx.user, null, 2)}</code></pre>
        <hr>
        <a href="/">Home</a> | <a href="/user">User</a>
      </div>`;
    } else {
      ctx.session.returnTo = ctx.path;
      ctx.body = `
        <div>
          <h2>${ctx.path}</h2>
          <hr>
          Login with
          <a href="/passport/auth0">Auth0</a>
          <hr>
          <a href="/">Home</a> | <a href="/user">User</a>
        </div>
      `;
    }
  }
}

module.exports = HomeController;
