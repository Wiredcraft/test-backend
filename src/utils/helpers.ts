import * as bcrypt from 'bcryptjs'

/**
 * Compares hashed string with unencrypted string
 * @param  {string} param1
 * @param  {string} param2
 * @returns a promise of the compare result
 */
export const bcryptCompareAsync = (param1: string, param2: string) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(param1, param2, (err, res) => {
            if (err) reject(err)           
            resolve(res)    
        })
    });
}

/**
 * Asynchronously hashes a string with set level of salt
 * @param  {string} password
 * @param  {number|string} salt
 * @returns the hashed string
 */
export const bcryptHashAsync = (str: string, salt: number | string) => bcrypt.hash(str, salt)

/**
 * safely executes async function that can throw
 * @param  {Promise<any>} fn
 * @returns returns the function result or err if any
 */
export const safeCall = async (fn: Promise<any>) => {
    try {
        return { res: await fn }
    } catch(err) {
        return { err }
    }
}
