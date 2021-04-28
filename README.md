# Wiredcraft Back-end Developer Test
This is a backend service which can `get/create/update/delete` user data from MongoDB.


## Prerequisites
* Node.js 15.0 or greater
* Docker 20.0 or greater (optional if you use local MongoDB)
* MongoDB 4.0 or greater (optional if you use docker)

## How to run
Download the project, go to the root directory of project. 

### Run in docker
Simply run:
```
docker-compose up
```

### Run locally
You need to set up MongoDB locally beforehand either by docker or installing it manually.
* By docker, run the following commands (you can specify your own mount path):
```
docker pull mongo
docker run -itd -v /mongodata:/data/db -p 27017:27017 --name mongodb mongo
```
The command above starts a MongoDB running on `localhost:27017`.


* To install MongoDB manually, please refer to: [MongoDB official manual](https://docs.mongodb.com/manual/installation/)


After configuring MongoDB, inside the root directory of project, install dependencies:
```
npm install
```

When the installation completes, start the server:
```
npm start
```

In case you would like to run the tests:
```
npm run test
```

## How to use
This backend service runs on `localhost:3000` locally by default, and exposes one endpoint:
```
/users
```
This endpoint provides functionalities of `get/create/update/delete` user data.

### Example
* Get all users 
```
curl -X GET localhost:3000/users
```

* Get one user by ID
```
curl -X GET localhost:3000/users/{userId}
```

* Create a user by ID
```
curl -H "Content-Type: application/json" -X POST -d '{                                            
    "name": "Brandy King",  
    "dob": "1988-08-08",
    "address": "349 Maple Street",
    "description": "I have ginger hair."
}' localhost:3000/users
```

* Update a user by ID
```
curl -X PATCH -d "name"="Marcelo Saciloto" -d "description"="I am a Brazilian papa." localhost:3000/users/{userId}
```

* Delete a user by ID
```
curl -X DELETE localhost:3000/users/{userId}
```

Feel free to use other tools such as Postman to interact with it.
