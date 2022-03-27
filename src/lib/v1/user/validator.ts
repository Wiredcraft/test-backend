import Joi from 'joi'

export const validatorGetRoute = (params: getRouteParams): Joi.ValidationResult => {
    return Joi.object({
        userId : Joi.string().required()
    }).validate(params)
}

export const validatorDeleteRoute = (params: deleteRouteParams): Joi.ValidationResult => {
    return Joi.object({
        userId : Joi.string().required()
    }).validate(params)
}

export const validatorPatchRoute = (params: patchRouteParams): Joi.ValidationResult => {
    return Joi.object({
        userId : Joi.string().required(),
        name: Joi.string().required(),
        dateOfBirth: Joi.string().required(),
        address: Joi.string().required(),
        description: Joi.string().required()
    }).validate(params)
}

export const validatorPostRoute = (params: createRouteParams): Joi.ValidationResult => {
    return Joi.object({
        name: Joi.string().required(),
        dateOfBirth: Joi.string().required(),
        address: Joi.string().required(),
        description: Joi.string().required()
    }).validate(params)
}

export const validatorUpdateRoute = (params: updateRouteParams): Joi.ValidationResult => {
    return Joi.object({
        userId : Joi.string().required(),
        name: Joi.string(),
        dateOfBirth: Joi.string(),
        address: Joi.string(),
        description: Joi.string()
    }).validate(params)
}

export interface getRouteParams {
    userId: string
}

export interface deleteRouteParams {
    userId: string
}

export interface patchRouteParams {
    userId?: string
    name:string,
    dateOfBirth: string,
    address: string,
    description:string,
}

export interface updateRouteParams {
    userId?: string
    name?:string,
    dateOfBirth?: string,
    address?: string,
    description?: string,
}

export interface createRouteParams {
    name:string,
    dateOfBirth: string,
    address: string,
    description:string,
}

