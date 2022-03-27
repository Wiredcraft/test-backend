import Koa from "koa";
import { map } from "lodash"

import {createRouteParams, deleteRouteParams, validatorDeleteRoute, validatorPostRoute} from "./validator";
import {ERRORS} from "../../../consts";

export const createUser = async (ctx: Koa.Context): Promise<void> => {
    const rawParams: createRouteParams = {
        name: ctx.params.name as string,
        dateOfBirth: ctx.params.dob as string,
        address: ctx.params.address as string,
        description: ctx.params.description as string,
    }

    const { error, value } = validatorPostRoute(rawParams)

    if (error) {
        throw ERRORS.generic.validation.failed('', map(error.details, 'message'), '')
    }

    ctx.body = {status: "success", message: `Request correct`, params: value}
}


export const deleteUser = async (ctx: Koa.Context): Promise<void> => {
    const rawParams: deleteRouteParams = {
        userId: ctx.params.userId as string,
    }

    const { error, value } = validatorDeleteRoute(rawParams)

    if (error) {
        throw ERRORS.generic.validation.failed('', map(error.details, 'message'), '')
    }

    ctx.body = {status: "success", message: `Request correct`, params: value}
}

export const patchUser = async (ctx: Koa.Context): Promise<void> => {
    const rawParams: createRouteParams = {
        name: ctx.params.name as string,
        dateOfBirth: ctx.params.dob as string,
        address: ctx.params.address as string,
        description: ctx.params.description as string,
    }

    const { error, value } = validatorPostRoute(rawParams)

    if (error) {
        throw ERRORS.generic.validation.failed('', map(error.details, 'message'), '')
    }

    ctx.body = {status: "success", message: `Request correct`, params: value}

}

export const updateUser = async (ctx: Koa.Context): Promise<void> => {
    const rawParams: createRouteParams = {
        name: ctx.params.name as string,
        dateOfBirth: ctx.params.dob as string,
        address: ctx.params.address as string,
        description: ctx.params.description as string,
    }

    const { error, value } = validatorPostRoute(rawParams)

    if (error) {
        throw ERRORS.generic.validation.failed('', map(error.details, 'message'), '')
    }

    ctx.body = {status: "success", message: `Request correct`, params: value}

}

export const getUser = async (ctx: Koa.Context): Promise<void> => {
    const rawParams: deleteRouteParams = {
        userId: ctx.params.userId as string,
    }

    const { error, value } = validatorDeleteRoute(rawParams)

    if (error) {
        throw ERRORS.generic.validation.failed('', map(error.details, 'message'), '')
    }

    ctx.body = {status: "success", message: `Request correct`, params: value}
}

export const listUsers = async(ctx: Koa.Context): Promise<void> => {
    ctx.body = {status: "success", message: `Request correct`}
}
