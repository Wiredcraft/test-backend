/**
 * Created by eagleQL on 4/8 2020.
 */

const fileGen = require('./swagger').generateSpecAndMount
const expressRouterGen = require('./swagger-express-option-sequelize').generateSpecAndMount

module.exports = function generateSpecAndMount(app) {

    return function (options) {
        const scanScope = options.scanScope || 3
        switch (scanScope) {
            case 1:
                fileGen(app)(options)
                break
            case 2:
                expressRouterGen(app)(options)
                break
            case 3:
                // 在 router 中定义的 swagger 文档，如果 url 和 tag 与自动生成的文档一样的话，会对应覆盖
                expressRouterGen(app)(options)
                fileGen(app)(options)
                break
        }
    }
}