const { Pool } = require('pg');
const crypto = require('crypto');
String.prototype.underline = function () {
    return this.replace(/-/g, '_')
}
global.sql = (literals, ...params) => {    // For the syntax highlight in VSCode plugin: SQL Lit
    let result = ''
    for (let i = 0; i < literals.length; i++) {
        result += literals[i] + (i < params.length ? params[i] : '')
    }
    return result
}
const $fetch = req => {
    return new Promise(finish => {
        let data = '';
        req.on('data', chunk => data += chunk)
        req.on('end', () => finish(JSON.parse(data)))
    })
}

const KEY = 'leovinci'
function encrypt(data, key = KEY) {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(encrypted, key = KEY) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
const pool = new Pool({
    database: 'wiredcraft'
}) 

const $query = async (...args) => {
    const { rows: [ data ] } = await pool.query(...args);
    return data
}

module.exports = { encrypt, decrypt, $fetch, $query }