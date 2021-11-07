import { HttpMethod, Router } from '.';
import { parse } from 'querystring';

export const installUser = async (router:Router):Promise<void> => {
    const route = 'users';
    const { checkAuth } = router.app.service!.session;
    router.route(HttpMethod.GET, /\/users.*/, async(req, _res) => {
        const params = parse(req.url!.substr(route.length + 1));
        const user = await router.app.service!.user.read(params);
        if (!user) {
            return {
                err: new Error('no data'),
                statusCode: 404,
            };
        } else {
            return {
                data: user,
                statusCode: 200,
            };
        }
    });
    
    router.route(HttpMethod.POST, /\/users\/.*/, checkAuth, async(_req, _res, body) => {
        const user = await router.app.service!.user.create(body);
        if (!user) {
            return {
                e: new Error('failed to create new user'),
                statusCode: 404,
            };
        } else {
            return {
                data: user,
                statusCode: 201,
            };
        }
    });

    router.route(HttpMethod.PUT, /\/users\/.*/, checkAuth, async(req, _res, body) => {
        const params = parse(req.url!.substr(route.length + 2));
        const { id } = params;
        if (id === undefined || isNaN(Number(id))) {
            return {
                e: new Error('params error'),
                statusCode: 400,
            };
        }
        const user = await router.app.service!.user.update({id: Number(id)}, body);
        if (!user) {
            return {
                e: new Error('no data'),
                statusCode: 404,
            };
        } else {
            return {
                data: user,
                statusCode: 201,
            };
        }
    });

    router.route(HttpMethod.DELETE, /\/users\/.*/, checkAuth, async(req, _res) => {
        const params = parse(req.url!.substr(route.length + 2));
        const { id } = params;
        if (id === undefined || isNaN(Number(id))) {
            return {
                e: new Error('params error'),
                statusCode: 400,
            };
        }
        const result = await router.app.service!.user.delete({id: Number(id)});
        if (result) {
            return {
                data: null,
                statusCode: 201,
            };
        } else {
            return {
                e: new Error('delete failed'),
                statusCode: 404,
            };
        }
    });
};
