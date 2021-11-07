import { App } from '../entry/app';
import http from 'http';
export enum Provider {
    github = 'github',
}

export class OauthService {
    constructor(private app:App) {
    }
    public renderTestPage = async (req:http.IncomingMessage, res:http.ServerResponse) => {
        const cbProtocal = this.app.config.origin === 'localhost' ? 'http': 'https';
        const cbPort = this.app.config.origin === 'localhost' ? this.app.config.port : '';
        const cbUrl = `${cbProtocal}://${this.app.config.origin}${cbPort ? `:${cbPort}` : ''}/callback`;
        res.statusCode = 200;
        res.end(`
<!DOCTYPE html>
<script>
    function openOauth() {
        var oauthWindow = window.open('${this.app.config.oauthUrl}entry?env=${this.app.config.env}&provider=${Provider.github}&cb=${encodeURI(cbUrl)}',
        'oauth_page',
        'height=580, width=600, top=200, left=300, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no'
        );
        var listener = (e) => {
            console.log('in listener')
            console.log(e)
            alert('message recieved!');
            window.removeEventListener('message', listener)
        };
        window.addEventListener('message', listener, false);
    }
</script>
<button onclick="openOauth()">
click to login
</button>
        `);
    };
    public renderLogInfo = async (req:http.IncomingMessage, res:http.ServerResponse, message?:string) => {
        res.end(`
<p>${message || 'success'}</p>
<script>
    window.opener.postMessage({success: ${!message}, message: '${message}'}, '*');
    setTimeout(() => {
        window.close();
    }, 5000);
</script>
`
        );
    };
    public getUser = async (token:string, provider=Provider.github) => {
        const { req } = this.app.service!.request;
        return JSON.parse(await req(this.app.config.oauthUrl + 'getUser' + `?provider=${provider}&access_token=${token}`));
    };
}
