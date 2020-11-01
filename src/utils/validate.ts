import Ajv from 'ajv'
import addFormats from 'ajv-formats'

/**
 * Validates an object against an ajv schema
 * @param  {Record<string, {} any>} object The object to be validated
 * @param  {Record<string, {} any>} schema The ajv schema to be used
 * @param  {Array<string>} required An array of required object key props e.g. ['id', 'name']
 * @returns array of errors if any. undefined otherwise
 */
export const validate = async (object: Record<string, any>, schema: Record<string, any>, required: Array<string>) => {
    const ajv = new Ajv({ strict: false })

    addFormats(ajv)

    const validate = ajv.compile({ ...schema, required })
    const valid = await validate(object)

    if (!valid && validate.errors && validate.errors.length > 0) return validate.errors

    return
}

/**
 * validates a user's passwords against common recommendations
 * @param  {string} str the password to be validated
 * @returns string with 'good' if password successfully validated else error string as to why not
 */
export const validatePassword = (string: string) => {
    if (string.length < 6)
        return 'too_short'

    if (string.length > 50) 
        return 'too_long'

    if (!string.match(/(?=.*\d)/)) 
        return 'missing_number'

    if (!string.match(/(?=.*[A-Z])/)) 
        return 'missing_uppercase_char'

    if (!string.match(/(?=.*[a-z])/)) 
        return 'missing_lowercase_char'
    
    if (!string.match(/(?=.*[^\dA-Za-z])/)) 
        return 'missing_special_char'
    
    return 'good'
}
/**
 * returns properties missing from an object if any
 * @param  {Record<string, any>} obj
 * @param  {Array<string>} required
 * an array of strings of the keys of the missing properties
 */
export const requiredProperties = (object: Record<string, any>, required: Array<string>) => {
    const missing = []

    for(const property of required)
        if(!object.hasOwnProperty(property) || object[property] == undefined)
            missing.push(property)

    return missing
}
/**
 * Checks if a unix timestamp is in the past
 * @param  {number} exp
 * returns true if unix timestamp is in the past. false otherwise
 */
export const isExpired = (exp: number) => Date.now() >= exp * 1000