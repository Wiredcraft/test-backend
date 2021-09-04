import * as path from "path";

import { SwaggerRouter } from "koa-swagger-decorator";

const router = new SwaggerRouter(); // extends from koa-router

// swagger docs avaliable at http://localhost:3000/api/swagger-html
router.swagger({
    title: "Example Server",
    description: "API DOC",
    version: "1.0.0",
    // [optional] default is root path.
    // if you are using koa-swagger-decorator within nested router, using this param to let swagger know your current router point
    // prefix: "/api",

    // [optional] default is /swagger-html

    // [optional] default is /swagger-json

    // [optional] additional options for building swagger doc
    // eg. add api_key as shown below
});
router.mapDir(path.resolve(__dirname, "../controllers/"));

console.log("````` Router.Swagger `````");

export default router;
