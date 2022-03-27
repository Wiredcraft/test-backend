import Koa from "koa";
import { map } from "lodash"

import {
    createRouteParams,
    deleteRouteParams, getRouteParams,
    patchRouteParams,
    updateRouteParams,
    validatorDeleteRoute, validatorPatchRoute,
    validatorPostRoute,
    validatorUpdateRoute
} from "./validator";
import {ERRORS} from "../../../consts";
import {UserModel} from "./model";

export const createUser = async (ctx: Koa.Context): Promise<void> => {
    const rawParams: createRouteParams = {
        name: ctx.request.body.name as string,
        dateOfBirth: ctx.request.body.dateOfBirth as string,
        address: ctx.request.body.address as string,
        description: ctx.request.body.description as string,
    }

    const { error, value } = validatorPostRoute(rawParams)

    if (error) {
        throw ERRORS.generic.validation.failed('', map(error.details, 'message'), '')
    }

    value.id = "FAKE_ID"
    ctx.body = value
}


export const deleteUser = async (ctx: Koa.Context): Promise<void> => {
    const rawParams: deleteRouteParams = {
        userId: ctx.params.userId as string,
    }

    const { error, value } = validatorDeleteRoute(rawParams)

    if (error) {
        throw ERRORS.generic.validation.failed('', map(error.details, 'message'), '')
    }

    ctx.body = {}
}

export const patchUser = async (ctx: Koa.Context): Promise<void> => {
    const rawParams: patchRouteParams = {
        userId: ctx.params.userId as string,
        name: ctx.request.body.name as string,
        dateOfBirth: ctx.request.body.dateOfBirth as string,
        address: ctx.request.body.address as string,
        description: ctx.request.body.description as string,
    }

    const { error, value } = validatorPatchRoute(rawParams)

    if (error) {
        throw ERRORS.generic.validation.failed('', map(error.details, 'message'), '')
    }

    delete value.userId
    ctx.body = value

}

export const updateUser = async (ctx: Koa.Context): Promise<void> => {
    const rawParams: updateRouteParams = {
        userId: ctx.params.userId as string,
        name: ctx.request.body.name as string,
        dateOfBirth: ctx.request.body.dateOfBirth as string,
        address: ctx.request.body.address as string,
        description: ctx.request.body.description as string,
    }

    const { error, value } = validatorUpdateRoute(rawParams)

    if (error) {
        throw ERRORS.generic.validation.failed('', map(error.details, 'message'), '')
    }

    delete value.userId
    ctx.body = value
}

export const getUser = async (ctx: Koa.Context): Promise<void> => {
    const rawParams: getRouteParams = {
        userId: ctx.params.userId as string,
    }

    const {error, value} = validatorDeleteRoute(rawParams)

    if (error) {
        throw ERRORS.generic.validation.failed('', map(error.details, 'message'), '')
    }

    const fakeUser: UserModel = {
        name: "Test user",
        dateOfBirth: "06-14-1994",
        address: "3 Passage Catinat, Saint-Gratien, France",
        description: "Fake user",
    }

    ctx.body = fakeUser

}

export const listUsers = async(ctx: Koa.Context): Promise<void> => {
    const fakeUsers: UserModel[] = []
    fakeUsers.push({
        name: "Test user",
        dateOfBirth: "06-14-1994",
        address: "3 Passage Catinat, Saint-Gratien, France",
        description: "Fake user",
    })

    ctx.body = fakeUsers
}
