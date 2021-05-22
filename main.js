module.exports = app => {

    app.use(async function (req, res, next) {
        // 清除之前的路由 shuqian 如果此处清除的数量不对的话会引起路由死循环,特别是内部抛出 error 的时候
        const staticMiddleWareCount = 9 // 指在 main.js 之前定义的一些中间件,比如在 app.js 里,main(app)之前. 从 main 开始,后面的中间件都是动态刷新的
        app._router.stack.splice(staticMiddleWareCount, app._router.stack.length - 3)

        // 删除相关组件的缓存
        // delete require.cache[require.resolve('./orm/BaseRepository.js')]
        // Object.keys(require.cache).forEach(function (key) {
        //     if (key.includes('/orm/model/')) delete require.cache[key];
        // })
        // delete require.cache[require.resolve('./orm/controller/BaseController.js')]
        // Object.keys(require.cache).forEach(function (key) {
        //     if (key.includes('/routes/')) delete require.cache[key];
        // })

        // 用户身份识别拦截器
        const { useridentityInterceptor, reGenerateRoutesForTenant, getAllSepecificRouters } = require('./request-filter/UserIdentityInterceptor')
        await useridentityInterceptor(req, res, app)
        const routers = getAllSepecificRouters()

        // 权限拦截器
        // 本测试项目暂不鉴权
        // const PermissionFilter = require('./request-filter/PermissionFilter')
        // PermissionFilter(app)


        // 重新注册路由
        app.use(async function (req, res, next) {
            reGenerateRoutesForTenant(app, routers)
            return next()
        })

        return next()
    })

}