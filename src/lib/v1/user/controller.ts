import Koa from "koa";
import { map } from "lodash"

import {
    createRouteParams,
    patchRouteParams,
    updateRouteParams,
    validatorPatchRoute,
    validatorPostRoute,
    validatorUpdateRoute
} from "./validator";
import {ERRORS} from "../../../consts";
import {UserModel} from "./model";


/**
 * Create a user, return the user created with its new ID.
 * TODO Token here
 * @param ctx
 */
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


/**
 * Delete a user by ID
 * No need for a validator here, as not sending an ID would not land you here.
 * @param ctx
 */
export const deleteUser = async (ctx: Koa.Context): Promise<void> => {

    ctx.body = {}
}


/**
 * Patch a user by ID. replace only what is given.
 * @param ctx
 */
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

/**
 * Update a user by ID. PUT method, takes a whole user to replace a user
 * @param ctx
 */
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

/**
 * Return a user by ID.
 * No need for a validator here, as not sending an ID would not land you here.
 * @param ctx
 */
export const getUser = async (ctx: Koa.Context): Promise<void> => {
    const fakeUser: UserModel = {
        name: "Test user",
        dateOfBirth: "06-14-1994",
        address: "3 Passage Catinat, Saint-Gratien, France",
        description: "Fake user",
    }

    ctx.body = fakeUser

}

/**
 * Return a list of all user.
 * TODO add pagination
 * @param ctx
 */
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
