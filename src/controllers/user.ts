import {
    request,
    summary,
    query,
    path,
    body,
    tags,
} from "koa-swagger-decorator";

import koa from "koa";

import { NewUserGeousecase, NewUserusecase } from "../services/user";
import { ResponseDto, HttpStatusCode, ErrorCode } from "@/helpers";
import { parseInt } from "lodash";

const userTag = tags(["user"]);

const userSchema = {
    name: { type: "string", required: true },
    address: { type: "string", required: false },
    dob: { type: "string", required: false },
    description: { type: "string", required: false },
};

const userGeoSchema = {
    geo: {
        type: "array",
        required: true,
        items: { type: "number", example: "101.1" },
    },
};
const useCase = NewUserusecase();
const geoUseCase = NewUserGeousecase();

export default class UserController {
    @request("get", "/user/{_id}")
    @summary("get specific user")
    @path({
        _id: { type: "string", required: true, description: "user_id" },
    })
    @userTag
    static async getUsers(ctx: koa.Context) {
        const { _id } = ctx.params;
        const res = await useCase.GetUser(_id);

        ctx.body = new ResponseDto({
            data: res,
            statusCode: HttpStatusCode.OK,
        });
    }

    @request("post", "/user")
    @summary("create user")
    @userTag
    @body(userSchema)
    static async createUsers(ctx: koa.Context) {
        console.log("createUsers", ctx.request.body);

        const res = await useCase.CreateUser(ctx.request.body);

        ctx.body = new ResponseDto({
            data: res,
            statusCode: HttpStatusCode.OK,
        });
    }

    @request("delete", "/user/{_id}")
    @summary("deleete specific user")
    @path({
        _id: { type: "string", required: true, description: "user_id" },
    })
    @userTag
    static async deleteUser(ctx: koa.Context) {
        const { _id } = ctx.params;
        const res = await useCase.DeleteUser(_id);

        if (res.ok === false) {
            // ctx.body
            ctx.body = new ResponseDto({
                data: res,
                reason: ErrorCode.RECORD_NOT_EXIST,
                statusCode: HttpStatusCode.OK,
            });
            return;
        }

        ctx.body = new ResponseDto({
            data: res,
            statusCode: HttpStatusCode.OK,
        });
    }

    @request("put", "/user/{_id}")
    @summary("update specific user")
    @path({
        _id: { type: "string", required: true, description: "user_id" },
    })
    @body(userSchema)
    @userTag
    static async updateUser(ctx: koa.Context) {
        const { _id } = ctx.params;
        const res = await useCase.UpdateUser(_id, ctx.request.body);

        if (res.ok === false) {
            ctx.body = new ResponseDto({
                data: res,
                reason: ErrorCode.RECORD_NOT_EXIST,
                statusCode: HttpStatusCode.OK,
            });
            return;
        }

        ctx.body = new ResponseDto({
            data: res,
            statusCode: HttpStatusCode.OK,
        });
    }

    // user geo below
    @request("put", "/user/{_id}/geo")
    @summary("update  user's location ")
    @path({
        _id: { type: "string", required: true, description: "user_id" },
    })
    @body(userGeoSchema)
    @userTag
    static async updateUserGeo(ctx: koa.Context) {
        const { _id } = ctx.params;
        const res = await geoUseCase.UpdateUserGeo(_id, ctx.request.body.geo);

        ctx.body = new ResponseDto({
            data: res,
            statusCode: HttpStatusCode.OK,
        });
    }

    @request("get", "/user/{_id}/nearby")
    @summary("get user's nearby ")
    @path({
        _id: { type: "string", required: true, description: "user_id" },
    })
    @query({
        limit: {
            type: "number",
            required: true,
            default: 10,
            description: "db limit count",
        },
        offset: {
            type: "number",
            required: true,
            default: 0,
            description: "db offset",
        },
        distance: {
            type: "number",
            required: true,
            default: 1000,
            description: "db offset",
        },
    })
    @userTag
    static async ListUserNearby(ctx: koa.Context) {
        const { _id } = ctx.params;

        const { limit, offset, distance } = ctx.query;

        const res = await geoUseCase.ListUserNearby(
            _id,
            parseInt(distance as string),
            parseInt(offset as string),
            parseInt(limit as string)
        );

        ctx.body = new ResponseDto({
            data: res,
            statusCode: HttpStatusCode.OK,
        });
    }
}
