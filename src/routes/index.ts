import { router as userRouter} from './user';
import Koa from 'koa'

export default (app: Koa) => {
    app.use(userRouter.routes()).use(userRouter.allowedMethods())
}