import Router from 'koa-router';
import * as ctrl from './controller';
import * as filter from './filter';

let router = Router();

router.post('/user', filter.create, ctrl.create);
router.get('/user/list', filter.list, ctrl.list);
router.get('/user/pages', filter.pages, ctrl.pages);
router.get('/user/:id', ctrl.query);
router.put('/user/:id', filter.update, ctrl.update);
router.delete('/user/:id', ctrl.remove);
router.get('/user/checkName', ctrl.checkName);
router.get('/user/nearBy', ctrl.nearBy);


export default router;
