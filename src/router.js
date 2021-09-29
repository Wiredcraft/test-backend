import UserRouter from './modules/user/router'

function register(app) {
    app.use(UserRouter.routes());
}

export default register;
