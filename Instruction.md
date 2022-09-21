# Design Documentation

## Start Server
Since data should be stored in DB, I used local MySQL 5.7 for development.
So please make sure you have valid MySQL access if you'd like start the server locally

you can modify the mysql connection in src/resource/application.properties
```
spring.datasource.url=jdbc:mysql://localhost:3306/{db_name}
spring.datasource.username=root
spring.datasource.password=password
```
execute user.sql to create user table

run the following code to init the server
```
./gradlew runWithJavaExec
```
You can import WiredCraft.postman_collection.json to Postman if needed

## APIs
### Get
```
GET /user/get/{id}
```
return the user by userId, throw error when not found 
### Create
```
POST /user/create
```
return the user just created, throw error when dob format is invalid
### Update
```
PUT /user/update/{id}
```
return the user just updated, throw error when dob format is invalid or user not found by userId
### Delete
```
DELETE /user/delete/{id}
```
throw error when user not found by userId

## Design
I simply used Java SpringBoot framework to implement this web application. In terms of structure, I used the classical 
three layers (Controller\Service\Dao) to perform routing, data process and data access separately.





