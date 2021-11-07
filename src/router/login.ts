import { HttpMethod, Router } from '.';
import { parse } from 'querystring';

export const installLogin = async (router:Router):Promise<void> => {
    const route = 'login';
    router.route(HttpMethod.GET, /\/login.*/, async(req, res) => {
        await router.app.service!.oauth.renderTestPage(req, res);
    });
    router.route(HttpMethod.DELETE, /\/login.*/, async(req, res) => {
        await router.app.service!.session.expireAuth(req, res);
    });
};
