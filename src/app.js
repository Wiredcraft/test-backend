import http from 'http';
import Koa from 'koa';
import convert from 'koa-convert';
import error from 'koa-error';
import config from './modules/core/config';
import router from './router';
import bodyParser from 'koa-bodyparser';
import path from 'path';
import {
	logger
} from './modules/core/logger';
import {
	auth,
	services as upmServices
} from 'upm-auth';
import {
	startsWith
} from 'lodash';
import payloadDecode from './modules/core/payload.decode';
import autolog from './modules/core/autolog';
const {
	whitePaths,
	isAutoLogEnable = 0
} = config;

const app = new Koa();


app.use(convert(auth({
	whitePaths: whitePaths,
	appId: config.upm.appId,
	basePath: config.upm.prefix,
	logger: logger,
	disable: config.env == "development" ? true : false,
	actionPath: '/oldaction/list',
})));

app.use(bodyParser({
	enableTypes: ['json', 'form', 'text'],
	extendTypes: {
		text: ['application/xml', 'text/xml']
	}
}));

function isWhitePath(url) {
	for (var i = 0; i < whitePaths.length; i++) {
		if (startsWith(url, whitePaths[i])) {
			return true;
		}
	}
	return false;
}

app.use(async function (ctx, next) {
	let url = ctx.url;
	payloadDecode(ctx);
	if (!(whitePaths && isWhitePath(url))) {
		let user = await upmServices.getUserInfo(ctx);
		if (!user) {
			user = {
				id: 1,
				fullname: "admin"
			}
		}
		ctx.state.user = user;
	}
	await next();
});

if (isAutoLogEnable) {
	app.use(autolog());
}


//禁止缓存
if (config.env == 'development') {
	app.use(function (ctx, next) {
		ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
		ctx.set('Pragma', 'no-cache'); // HTTP 1.0.
		ctx.set('Expires', '0'); // Proxies.
		return next();
	});
}
//输出错误日志
if (config.env == 'development') {
	app.use(convert(error({
		engine: 'nunjucks',
		template: path.join(__dirname, "./modules/core/error.html")
	})));
} else {
	app.on('error', function (err, ctx) {
		ctx.status = err.status || 500;
		ctx.body = err.message;
		if (ctx.status != 404) {
			logger.error({
				type: "System",
				err: error
			});
		}
	});
}
//路由
router(app);

const server = http.createServer(app.callback());

server.on('connection', function (socket) {
	socket.setTimeout(config.apiTimeout);
})

server.listen(config.port, function () {
	console.info('listen on', config.port);
});