import * as bcrypt from 'bcryptjs'

import { BaseContext } from 'koa'

/**
 * Compares hashed string with unencrypted string
 * @param  {string} param1
 * @param  {string} param2
 * @returns a promise of the compare result
 */
export const bcryptCompareAsync = (parameter1: string, parameter2: string) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(parameter1, parameter2, (error, res) => {
            if (error) reject(error)
           
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
export const bcryptHashAsync = (string: string, salt: number | string) => bcrypt.hash(string, salt)

/**
 * safely executes async function that can throw
 * @param  {Promise<any>} fn
 * @returns returns the function result or err if any
 */
export const safeCall = async (function_: Promise<any>) => {
    try {
        return { res: await function_ }
    } catch(error) {
        return { err: error }
    }
}

/**
 * Applies the status code and message on ctx body and returns
 * @param  {BaseContext} ctx
 * @param  {number} status
 * @param  {any} body?
 * @returns nothing
 */
export const response = (context: BaseContext, status: number, body?: any) => {
    context.status = status
    context.body = body
}
