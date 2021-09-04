import {
    request,
    summary,
    query,
    path,
    body,
    tags,
} from "koa-swagger-decorator";
import koa from "koa";

import NewUserusecase from "../services/user";

const userTag = tags(["test"]);

const userSchema = {
    name: { type: "string", required: true },
};

export default class UserController {
    // @request("get", "/users")
    // @summary("get user list")
    // @userTag
    // @query({
    //     type: {
    //         type: "number",
    //         default: 1,
    //         description: "type",
    //     },
    // })
    // static async getUsers(ctx: koa.Context) {
    //     ctx.body = { users: [123] };
    // }

    @request("post", "/user")
    @summary("create user")
    @userTag
    @body(userSchema)
    static async createUsers(ctx: koa.Context) {
        console.log("ctx.body", ctx.request.body);
        const useCase = NewUserusecase();
        const res = await useCase.CreateUser(ctx.request.body);
        ctx.body = { id: res.id };
    }
}
