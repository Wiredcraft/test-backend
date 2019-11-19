import expressJwt = require('express-jwt')
import config from './constant'

const jwtAuth = expressJwt({
    secret: config.secretKey,
    credentialsRequired: true // 设置为false就不进行校验了，游客也可以访问
}).unless({
    // tslint:disable-next-line: max-line-length
    path: ['/api/users/create', '/api/login', '/api/users/register']
})

export default jwtAuth
