import Joi, {string} from 'joi'

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
        name: string().required(),
        dateOfBirth: string().isoDate().required(),
        address: string().required(),
        description: string().required()
    }).validate(params)
}

export const validatorPostRoute = (params: createRouteParams): Joi.ValidationResult => {
    return Joi.object({
        userId : Joi.string().required(),
        name: string().required(),
        dateOfBirth: string().isoDate().required(),
        address: string().required(),
        description: string().required()
    }).validate(params)
}

export const validatorUpdateRoute = (params: updateRouteParams): Joi.ValidationResult => {
    return Joi.object({
        userId : Joi.string().required(),
        name: string(),
        dateOfBirth: string().isoDate(),
        address: string(),
        description: string()
    }).validate(params)
}

export interface getRouteParams {
    userId: string
}

export interface deleteRouteParams {
    userId: string
}

export interface patchRouteParams {
    name:string,
    dateOfBirth: string,
    address: string,
    description:string,
}

export interface updateRouteParams {
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

