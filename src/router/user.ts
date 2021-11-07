import { HttpMethod, parseUrl, Router } from '.';

export const installUser = async (router:Router):Promise<void> => {
    const route = 'users';
    const { checkAuth } = router.app.service!.session;
    router.route(HttpMethod.GET, /\/users.*/, async(req, _res) => {
        const params = parseUrl(req.url!, route);
        const { id, name } = params;
        const user = await router.app.service!.user.read({
            id: id ? Number(id) : undefined,
            name: name ? String(name) : undefined,
        });
        if (!user) {
            router.logger.warn(params);
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
            router.logger.warn(body);
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
        const params = parseUrl(req.url!, route);
        const { id } = params;
        if (id === undefined || isNaN(Number(id))) {
            router.logger.warn(params, body);
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
        const params = parseUrl(req.url!, route);
        const { id } = params;
        if (id === undefined || isNaN(Number(id))) {
            router.logger.warn(params, params);
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
