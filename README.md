# Wiredcraft Back-end Developer Test

## Techniques
* Express Framework for the REST API service
* MongoDB for database
* Jest for testing
* Swagger for generating API document

## How to run the code
#### Make sure you have mongodb running on your machine, if not, you may simply run it within a docker container:
```
docker run -d -p 27017:27017 --rm --name db_name \
    -e MONGO_INITDB_ROOT_USERNAME=username \
    -e MONGO_INITDB_ROOT_PASSWORD=password \
    mongo

```
#### Create a .env file in the root directory to host the environment variables, all of which are DB configuration-related, please set their values accordingly:
* MONGO_USER
* MONGO_USER
* MONGO_PASS
* MONGO_HOST
* MONGO_PORT
* MONGO_DB_NAME
* MONGO_USER_TEST
* MONGO_PASS_TEST
* MONGO_HOST_TEST
* MONGO_PORT_TEST
* MONGO_DB_NAME_TEST

#### Run the tests:
```
npm run test
```
#### Run the service:
```
npm run start
```

#### Access the API Docs:
http://localhost:3000/v1/docs/

#### Try the REST API endpoints, e.g.:
```
curl --location --request POST '127.0.0.1:3000/v1/users/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "seth 4",
    "dob": "2000-01-02",
    "address": "ssdfs 363",
    "location": {
        "coordinates": [0, 11]
    },
    "description": "xxxx"
}'
```

## TODO
* Add data validations
* Add more test cases
* Refactory: extract DB operations out from routes
* Dockerize and add Makefile for easier setup and consitent environment
