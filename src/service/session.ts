import { App } from '../entry/app';
import http from 'http';

export class SessionService {
    constructor(private app:App) {
    }
    public checkAuth = async (req:http.IncomingMessage) => {

    }
    public getUserId = async (req:http.IncomingMessage) => {

    }
    public setCookie = async (req:http.IncomingMessage, res:http.ServerResponse) => {

    }
    public expireCookie = async (req:http.IncomingMessage, res:http.ServerResponse) => {

    }
}
