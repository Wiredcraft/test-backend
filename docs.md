## running

1. start mongo.
2. `npm install`
3. run tests with `npm test`
4. `npm start`



## endpoints

**port: 3003** (so far...)


- POST `/users`
creates an user
    _data:_
```
    * name: String
    * email: String
    * password: String
      dob: Date // day of birthday
      address: String
      description: String
```

- GET `/users`
returns all users

- GET `/user/:id`
get related user

- PUT `/user/:id`
updates user. **Requires authentication**
    _data:_
```
    * name: String
    * email: String
    * password: String
      dob: Date // day of birthday
      address: String
      description: String
```

- GET `/user/:id`
removes user

- GET `/me`
gets data of logged user. **Requires authentication**

- GET `/:id/meet/:friend`
creates a friendsheep between user with id `:id` and user with id `:friend`
returns user with id `:id`

- GET `/:id/break/:friend`
revokes a friendsheep between user with id `:id` and user with id `:friend`
returns user with id `:id`

- POST `/login`
authenticates an existing user
    _data:_
```
    * email: String
    * password: String
```

- GET `/token`
return data of sent token. **Requires authentication**

- GET `/users/mocks/:qtt`
creates `:qtt` users with random data