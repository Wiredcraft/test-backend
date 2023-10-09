import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'UsersController.index') //Lists users

  Route.post('', 'UsersController.store') //Store user

  Route.group(() => {
    Route.patch('', 'UsersController.update') //Update user

    Route.delete('', 'UsersController.destroy') //Delete user
  }).prefix(':userID')
}).prefix('/api/v1/users')
