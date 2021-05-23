const NodeCache = require('node-cache')
const logger = require('../logger')

let nodeCache = new NodeCache()

/**
 * 添加一个新缓存
 * @param cachename 缓存名
 * @param value 缓存值
 * @param ttl 缓存时间
 */
const setCache = (cachename, value) => {
    const ret = nodeCache.set(cachename, value)
    if (!ret) logger.error(`缓存写入失败:  key ${cachename}   value ${JSON.stringify(value)}`)
    return ret
}
/**
 * 添加一个新缓存, 限定缓存时间
 * @param cachename 缓存名
 * @param value 缓存值
 * @param ttl 缓存时间
 */
const setCacheLimited = (cachename, value, ttl) => {
    nodeCache.set(cachename, value, ttl)
}

/**
 * 获取缓存数据
 * @param cachename 缓存名
 */
const getCache = (cachename) => {
    return nodeCache.get(cachename)
}

/**
 * 删除缓存数据
 * @param cachename 缓存名
 */
const delCache = (cachename) => {
    nodeCache.del(cachename)
}


module.exports = {
    MULTI_TENANT_CONFIG_CACHE_KEY: 'multi_tenant_config',
    CURRENT_TENANT_CONFIG_KEY: 'current_tenant_config',
    CURRENT_TENANT_SCHEMA_KEY: 'current_tenant_schema',
    MAIN_CONFIG_KEY: 'main_config',
    setCache,
    getCache,
    delCache
}
