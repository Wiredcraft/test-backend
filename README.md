# Wiredcraft Back-end Developer Coding Test - Alutun

## Background

The project was to Build a restful api that could `get/create/update/delete` user data from a persistence database

### User Model

```
{
  "id": "xxx",                  // user id(you can use uuid or the id provided by database, but need to be unique)
  "name": "test",               // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "created_at": ""              // user created date
}
```

### API

```
GET    /user/{id}                   - Get user by ID
POST   /user/                       - To create a new user
PUT    /user/{id}                   - To update an existing user with data
DELETE /user/{id}                   - To delete a user from database
```

## Additional Requirements

I got some additional requirement for this test which are : 
1. Use Loopback
2. Choose a DB other than MongoDB
3. User login/auth is a plus.

## Some thoughts

### Database 

I decided to use **PostgreSql** for the following reason : 

1. For the exercise, I already used MySql and MongoDB was forbidden for this test.
2. It's a famous for it's strong Data Integrity  and stability which make sens for User information API. 
3. The speed of PostgreSQL is not the best but again for user information it make sens, user information API don't need to handle a lot of request are they are almost static information in our cases. 

    Note : I created an online free instance, so it's more easy to test this project, it's also why I increase the timeout of mocha to 15 sc because database is based in US, of course this is not viable for production ^^.

### API

#### PATCH instead of PUT
I took the liberty to change the endpoint **PUT /user/{id}** by **PATCH /user/{id}**.

I wanted to be able to update an user information partially and as define in [RFC 5789](http://tools.ietf.org/html/rfc5789, it is said that a PUT should be only used only if youre replace entirely an HTTP ressources. With Patch we can modify only one properties, wich for me make more sens for the nature of a user object. 

#### Timestamp

I also decided to use a mixin **loopback-ds-timestamp-mixin** in loopback to handle the _createdAt_ properties and it also add _updatedAt_ which I think is interesting for user information to know the last update time.

#### Unique Name

I also decided that the user properties **name** should be unique, otherwise we won't have any "human" way to make the difference between two user with the same name.

#### Description

And to finish I decided that description was not mandatory field for the fun =)

### Production

If I had to put the app in production I would do it behind a reverse proxy such a nginx which could handle HTTPS and load balancing if needed. 

#### Improvement

Because Makara told me to spend only few hours, to respect that time frame I didn't do the following that I could have done. 

1. Manage error of the API server and make difference between DEV and PRODUCTION environnement with strong-error-handler for exemple.
2. Use configuration based on ENV variable (such as database credential, port, etc).
3. I only test the status code in my unit test, I could also check specific error message for exemple when name is not the right size, and not unique.

## Getting Started

make sure to have mocha install as a global package

```
   npm install -g mocha
```

### Installation
  ```
    npm install
  ```

### Run API Server

``` 
   npm start
```

The Api will run on localhost on port 3000.
You can acces to test API explorer on http://localhost:3000/explorer.

When the server boot it will check If the structure of the database match the structure of the user model, If not the database will be update accordingly.

### Test

```
   npm test
```

 Note : Before running the test It will flush the database, that take few seconds.

### Other

If you want to Flush and reste the Database use the following script :

```
    node ./Tool/dataBaseReset.js
```
 
