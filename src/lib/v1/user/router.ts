import Router from 'koa-router'
import * as controller from "./controller"
const router = new Router()

router.post('Create User', '/user', controller.createUser)
router.delete('Delete User', '/user/:userId', controller.deleteUser)
router.patch('Patch User', '/user/:userId', controller.patchUser)
router.put('Update User', '/user/:userId', controller.updateUser)
router.get('Get User', '/user/:userId', controller.getUser)
router.get('Get All users', '/user', controller.listUsers)

router.routes()

export { router }
