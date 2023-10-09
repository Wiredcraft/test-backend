import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'UsersController.index') //Lists users

  Route.post('', 'UsersController.store') //Store user
}).prefix('/api/v1/users')
