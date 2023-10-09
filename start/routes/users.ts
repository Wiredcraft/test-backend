import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'UsersController.index') //Lists users
}).prefix('/api/v1/users')
