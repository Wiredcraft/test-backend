import Router from 'koa-router';

import * as controller from './controller';
import * as validator from './validator';

const router = new Router();

// Route to create a user
// POST URL:PORT/v1/user
router.post('Create User', '/', validator.validatorPostRoute(validator.postSchema), controller.createUser);

// Route to delete a user
// DELETE URL:PORT/v1/user/:userId
router.delete('Delete User', '/:userId', controller.deleteUser);

// Route to patch a user
// PATCH URL:PORT/v1/user/:userId
router.patch('Patch User', '/:userId',validator.validatorPatchRoute(validator.patchSchema), controller.patchUser);

// Route to update a user
// PUT URL:PORT/v1/user/:userId
router.put('Update User', '/:userId', validator.validatorUpdateRoute(validator.putSchema), controller.updateUser);

// Route a get a user
// GET URL:PORT/v1/user/:userId
router.get('Get User', '/:userId', controller.getUser);

// Route to patch a paginated list of users. URL params are all optionals
// PATCH URL:PORT/v1/user?perPage=XX&page=XX&orderBy=XX&orderDir=asc|desc
router.get('List users', '/', validator.validatorListRoute(validator.listSchema), controller.listUsers,);

router.routes();

export { router };
