import Router from 'koa-router';
import userService from '../services/user';
import { validator } from '../middlewares/validator';
import { userValidator } from '../lib/validator';
const router = new Router();

router.prefix('/users');

router.post('/login', async (ctx) => {

});

router.post('/logout', async (ctx) => {

});

router.post('/follow', async(ctx) => {
  const {username, follower} = ctx.request.body;
  ctx.body = await userService.follow(username, follower);
})

router.post('/unfollow', async (ctx) => {
  const {username, follower} = ctx.request.body;
  ctx.body = await userService.unfollow(username, follower);
})

router.get('/:username/follower', async (ctx) => {
  const username = ctx.params.username;
  ctx.body = await userService.getFollowerByUsername(username);
})

router.post('/', validator(userValidator) ,async(ctx) => {
  const body = ctx.request.body;
  ctx.body = await userService.createUser(body);
})

router.patch('/info', validator(userValidator), async (ctx) => {
  const body = ctx.request.body;
  ctx.body = await userService.updateByUsername(body.name, body);
})

router.patch('/password',validator(userValidator), async (ctx) => {
  const { name, oldPassword, newPassword } = ctx.request.body;
  ctx.body = await userService.updatePasswordByUsername(name, oldPassword, newPassword);


})

router.post('/delete', async (ctx) => {
  const {username, isSoft} = ctx.request.body;
  console.log(username, !!isSoft)
  ctx.body = await userService.deleteByUsername(username, !!isSoft)

})

router.get('/:username', validator(userValidator),async (ctx) => {
  const username = ctx.params.username;
  ctx.body = await userService.findByUsername(username);
})

router.get('/', async (ctx) => {
  ctx.body = await userService.findAllActive();

})

export { router };