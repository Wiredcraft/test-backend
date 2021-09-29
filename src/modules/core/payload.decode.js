import config from './config';
import crypto from 'crypto';
import JSONbig from 'json-bigint';

const {
    payloadEncodeConfig = {}
} = config;

const {
    type: cipherType = "aes",
    key: cipherKey,
    enable: cipherEnable = false
} = payloadEncodeConfig;

function aesDecode(data, key = '') {
    const aesKey = config.aesKey || '7419a89b1fc3';
    !key && (key = aesKey);
    const decipher = crypto.createDecipher('aes192', key);
    let decrypted = decipher.update(data, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}


function decodeData(data) {
    if (cipherType === 'aes') {
        return aesDecode(data, cipherKey);
    } else if (cipherType === 'base64') {
        return new Buffer(data, "base64").toString("utf-8");
    }
    return data;
}

function decodeRequestData(requestData) {
    if (requestData && Object.keys(requestData).length === 1 && requestData.payloadData) {
        let bodyData = decodeData(requestData.payloadData);
        bodyData = JSONbig.parse(bodyData);
        return bodyData || requestData;
    }
    return requestData;
}

export default function (ctx) {
    if (!cipherEnable) {
        return;
    }
    let {
        query,
        body
    } = ctx.request;
    if (query) {
        ctx.request.query = decodeRequestData(query);
    }
    if (body) {
        ctx.request.body = decodeRequestData(body);
    }
}