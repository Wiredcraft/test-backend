# Wiredcraft Back-end Developer Coding Test

This is Wiredcraft Back-end Developer Coding Test Project built with [LoopBack](http://loopback.io). You can `get/create/update/delete` user data from server database.


### User Model

```
{
  "id": "1",                    // int,     [system create],   user id
  "name": "xxx",                // string,                     user name
  "dob": "",                    // date,    [YYYY-MM-DD],      date of birth
  "address": "",                // string,  optional,          user address
  "description": "",            // string,  optional,          user description
  "created_at": ""              // date,    [YYYY-MM-DD],      user created date
}
```

### API

```
GET    /people/{id}                   - Get user by ID
POST   /people/                       - To create a new user
PUT    /people/{id}                   - To update an existing user with data
DELETE /people/{id}                   - To delete a user from database
```


## Getting started

### MongoDB

- Install [MongoDB](http://docs.mongodb.org/manual/)

- Run MongoDB service

```bash
$ sudo mongod
...
...
2015-09-01T09:30:10.149+0800 I NETWORK  [initandlisten] waiting for connections on port 27017
```

If you see something like this, you are good to go.

### Set up

- Git clone and install

```bash
$ git clone git@github.com:CCharlieLi/backend-test.git 
$ git checkout loopback
$ npm install
```

- Database configuration

Edit `server/datasources.json` to modify database configuration to meet your need.

```json
"mongo": {
    "name": "mongo",
    "connector": "mongodb", 
    "host": "127.0.0.1",   
    "port": 27017,        
    "database": "Demo"    
  }
```

- Run and try

```bash
$ node .
```

Now go to `http://localhost:3000/explorer`.  You'll see the [StrongLoop API Explorer](https://docs.strongloop.com/display/public/LB/Use+API+Explorer) showing the two models: people( model we created ) and User ( created by default ). You can edit `server/model-config.json` to determine if you want any model to show up by adding `"public": false`. For example:

```json
"User": {
    "dataSource": "db"
  },
  "AccessToken": {
    "dataSource": "db",
    "public": false
  },
  "ACL": {
    "dataSource": "db",
    "public": false
  },
  "RoleMapping": {
    "dataSource": "db",
    "public": false
  },
  "Role": {
    "dataSource": "db",
    "public": false
  },
  "person": {
    "dataSource": "mongo",
    "public": true
  }
```

### Test



# License

MIT

# Contact

CCharlieLi(ccharlieli@live.com)