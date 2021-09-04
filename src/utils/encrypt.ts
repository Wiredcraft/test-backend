import crypto = require('crypto')// 导入加密
/**
 * 生成md5加密字符串
 * @param {string} str
 */
export function md5(str: any) {
    str = `${str}`
    const hash = crypto.createHash('md5')
    hash.update(str)
    return hash.digest('hex')
}
export function sha256(str: any) {
    str = `${str}`
    const hash = crypto.createHash('sha256')
    hash.update(str)
    return hash.digest('hex')
}
/**
 * 生成sha512加密字符串
 * @param {string} str
 */
export function sha512(str: any) {
    str = `${str}`
    const hash = crypto.createHash('sha512')
    hash.update(str)
    return hash.digest('hex')
}