import Router from 'koa-router';

import * as controller from './controller';

const router = new Router();

router.post('Create User', '/', controller.createUser);
router.delete('Delete User', '/:userId', controller.deleteUser);
router.patch('Patch User', '/:userId', controller.patchUser);
router.put('Update User', '/:userId', controller.updateUser);
router.get('Get User', '/:userId', controller.getUser);
router.get('Get All users', '/', controller.listUsers);

router.routes();

export { router };
