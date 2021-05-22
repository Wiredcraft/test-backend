const multi_tenant = require('../lib/multi-tenant/index')
const {Sequelize, Op, Model, DataTypes} = require('sequelize');
const Crypto = require('../lib/crypto/index')

function getAllSepecificModels(exceptModels = [], exceptRegEX = '') {
    delete require.cache[require.resolve('../orm/BaseRepository.js')]
    Object.keys(require.cache).forEach(function (key) {
        if (key.includes('/orm/model/') || key.includes('\\orm\\model\\')) delete require.cache[key];
    })
    const Models = require('require-all')({
        dirname: __dirname + '/../orm/model',
        filter: /.*\.js$/,
        resolve: function (Model) {
            return Model
        },
        map: val => val.replace('.js', '')
    })
    return Object.entries(Models).map(([k, v]) => new Object({name: k, model: v}))
}

function getAllSepecificRouters(exceptModels = [], exceptRegEX = '') {
    const models = getAllSepecificModels()
    delete require.cache[require.resolve('../orm/controller/BaseController.js')]
    const BaseConroller = require('../orm/controller/BaseController')

    Object.keys(require.cache).forEach(function (key) {
		if (key.includes('/routes/') || key.includes('/open-api/')
		|| key.includes('\\routes\\') || key.includes('\\open-api\\'))
			delete require.cache[key];
    })
    // 批量引入 routers，并存入数组供后续注册路由
    let Controllers = require('require-all')({
        dirname: __dirname + '/../routes',
        filter: /.*\.js$/,
        resolve: function (Controller) {
            return Controller
        },
        map: val => val.replace('.js', '')
    })
    const Controllers2 = require('require-all')({
            dirname: __dirname + '/../open-api',
            filter: /.*\.js$/,
            resolve: function (Controller) {
                return Controller
            },
            map: val => 'open-api/' + val.replace('.js', '')
        })
    Controllers = {...Controllers, ...Controllers2}
    return Object.entries(Controllers).map(([k, v]) => new Object({name: k, router: v}))
        .concat(
            models.filter(m => !Object.keys(Controllers).includes(m.name))
                .map(m => new Object({
                    name: m.name,
                    router: new (BaseConroller)().getRouter(m.name.replace('open-api', ''))
                }))
        )
}

function reGenerateRoutesForTenant(app, routers = []) {
    // 删除之前注册的路由,重新注册
    routers.forEach(r => {
        app.use(`/${r.name}`, r.router)
    })
    const ErrorInterceptor = require('./ErrorInterceptor')
    ErrorInterceptor(app)
}

function getOrgId(req) {
    let id
    if (req.headers.hasOwnProperty('orgid')) {
        id = +req.header('orgId')
    } else if (process.env.NODE_ENV === 'dev') {
        id = 0
    } else id = null
    return id
}

function getDomin(req) {
    return req.header('origin') && req.header('origin').replace('https://', '').replace('http://', '') || ''
}

const unSubscribedWhiteList = [
    '/open-api',
    '/favicon.ico',
    '/stylesheets/style.css',
    '/api-docs',
]

module.exports = {
    useridentityInterceptor: async (req, res, app) => {

        // 解密请求体(若必要)
        try {
            req = Crypto.decryptRequestObject(req)
        } catch (e) {
            const ErrorInterceptor = require('./ErrorInterceptor')
            ErrorInterceptor(app)
            throw new Error(e.message)
        }

        // 调用方法获取该请求者对应的数据库名,然后加到 req 里
        req.tenant = {id: getOrgId(req), Domin: getDomin(req)} // aaa domin 供开发测试用
        const [dbName, config] = await multi_tenant.getCurrentTenantDBName(req, app)
        req.tenant.schema = req.dbName = dbName

        // 如果是租户 且 非免费&&未订阅用户,则只允许其访问自己管理后台的配置接口和一些基本信息接口
        if (config) {
            try {
                await multi_tenant.verifyTenantSubscriptionStatus(config)
            } catch (e) {
                const allow =  unSubscribedWhiteList.some(path => req.originalUrl.includes(path))
                if (!allow) throw new Error(e)
            }
        }
    },

    reGenerateRoutesForTenant,
    getAllSepecificRouters
}