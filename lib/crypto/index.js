// 非对称性加密
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

// 获取公钥和私钥
const publicKey = fs.readFileSync(path.join(__dirname, "/rsa_public.key"));
const privateKey = fs.readFileSync(path.join(__dirname, "/rsa_private.key"));

const axios = require("axios")

// 创建axios实例s
const axiosRequest = axios.create({
    // baseURL: `http://${HOST}:10000`,
    timeout: 2 * 1000,

})

axiosRequest.interceptors.request.use(config => {
    config.headers.post['Content-Type'] = 'application/json'
    return config
}, error => {
    // console.log(error) // for debug
    Promise.reject(error)
})

axiosRequest.interceptors.response.use(response => {
    return response
}, error => {
    return  error
})

const Crypto = {

    axiosRequest,

    /**
     * 加密字符串
     * @param {string|Object} source 要加密的字符串要加密的字符串
     * @return {{type: 'Buffer', data: ArrayBuffer}}
     */
    encrypt(source) {
        if (!(source instanceof String)) source = JSON.stringify(source)
        const bufferArr = crypto.publicEncrypt(publicKey, Buffer.from(source))
        return JSON.parse(JSON.stringify(bufferArr))
    },

    /**
     * 解密二进制数组
     * @param {ArrayBuffer} bufferArray 二进制数组
     * @return {string}
     */
    decrypt(bufferArray) {
        return crypto.privateDecrypt(privateKey, Buffer.from(bufferArray)).toString()
    },

    /**
     * 加密请求体对象
     * @param {Object} obj 请求体对象
     * @return {{type: 'Buffer', encrypted: true, data: ArrayBuffer}}
     */
    encryptRequestObject(obj) {
        const ret = this.encrypt(obj)
        ret.encrypted = true
        return ret
    },

    /**
     * 解密请求体对象, 如果解密成功则则 req 中添加 decryptedBody 对象
     * @param {{ body: {type: 'Buffer', encrypted: true, data: ArrayBuffer}}} req
     * @return {{ body: {type: 'Buffer', encrypted: true, data: ArrayBuffer}, decryptedBody: Object }}
     */
    decryptRequestObject(req) {
        const obj = req.body
        if (obj.encrypted && obj.type === 'Buffer' && obj.data) {
            req.decryptedBody = JSON.parse(this.decrypt(obj.data))
        } else {
            req.decryptedBody = null
        }
        return req
    },




}

module.exports = Crypto

// const testBody = { name: 'uop', info: 'hello'}
// const encrypted = Crypto.encryptRequestObject(testBody)
// const decrypted = Crypto.decryptRequestObject(encrypted)
// console.log(decrypted)



//
// axiosRequest({
//     url: 'http://localhost:3003/openapi/query/tenant/configs',
//     method: 'post',
//     data: Crypto.encryptRequestObject({})
// }).then(res => {
//     console.log(res.status, res.data)
// })