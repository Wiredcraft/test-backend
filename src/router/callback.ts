import { HttpMethod, Router } from '.';
import { parse } from 'querystring';
import { PhysicalTable } from '../db/schema';
import { Provider } from '../service/oauth';
import url from 'url';

export const installCallback = async (router:Router):Promise<void> => {
    const route = 'callback';
    router.route(HttpMethod.GET, /\/callback.*/, async (req, res) => {
        // ?oauthInfo=${oauthInfo}&state=${query.state}
        const rawData = parse(url.parse(req.url!.substr(route.length + 1)).query!);
        const { oauthInfo, state } = rawData;
        const stateArr = (state as string).split(',');
        const [ provider, _env, _cb ] = stateArr;

        // better define a serial of types later for different providers
        // {"access_token":"gho_xxxxxxxxxxxxxxxxxxxxxxxxxfB4xy1d39Qr","token_type":"bearer","scope":"user"}
        const oauthObj = JSON.parse(oauthInfo as string);

        // same here
        // {"login":"test3207","id":10000000,"node_id":"MDQ6VXNlcjIwxxxxxxxx","avatar_url":"https://avatars.githubusercontent.com/u/20714425?v=4","gravatar_id":"","url":"https://api.github.com/users/test3207","html_url":"https://github.com/test3207","followers_url":"https://api.github.com/users/test3207/followers","following_url":"https://api.github.com/users/test3207/following{/other_user}","gists_url":"https://api.github.com/users/test3207/gists{/gist_id}","starred_url":"https://api.github.com/users/test3207/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/test3207/subscriptions","organizations_url":"https://api.github.com/users/test3207/orgs","repos_url":"https://api.github.com/users/test3207/repos","events_url":"https://api.github.com/users/test3207/events{/privacy}","received_events_url":"https://api.github.com/users/test3207/received_events","type":"User","site_admin":false,"name":"test3207","company":"homeless","blog":"test3207.com","location":"anywhere","email":"test3207@outlook.com","hireable":null,"bio":"Anybody wants me?\r\nEat little,work hard,easy to feed.\r\nQAQ","twitter_username":null,"public_repos":11,"public_gists":0,"followers":0,"following":2,"created_at":"2016-07-29T00:38:55Z","updated_at":"2021-10-17T14:08:20Z","private_gists":0,"total_private_repos":8,"owned_private_repos":8,"disk_usage":124350,"collaborators":0,"two_factor_authentication":false,"plan":{"name":"free","space":976562499,"collaborators":0,"private_repos":10000}}
        const userInfo = await router.app.service!.oauth.getUser(oauthObj.access_token, provider as Provider|undefined || Provider.github);

        if (userInfo.node_id === undefined || userInfo.name === undefined) {
            return {
                err: new Error('auth process failed'),
                statusCode: 401,
            };
        }
        const boundUser = await router.app.service!.oauthGithub.read({
            node_id: userInfo.node_id,
        });
        let user: PhysicalTable['user']|undefined;

        // can use transact here, considering the actual possibilities and it's a test, we can skip in this case.
        if (!boundUser) {
            user = await router.app.service!.user.create({
                name: userInfo.name,
            });
            await router.app.service!.oauthGithub.create({
                user_id: user!.id,
                node_id: userInfo.node_id,
            });
        } else {
            user = await router.app.service!.user.read({
                id: boundUser.user_id,
            });
        }
        await router.app.service!.session.setAuth(req, res, user!.id);
        await router.app.service!.oauth.renderLogInfo(req, res);
        return;
    });
};
