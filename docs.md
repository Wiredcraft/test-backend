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
    * password: String
      dob: Date // day of birthday
      address: String
      description: String
```

- GET `/users`
returns all users


