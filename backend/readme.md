# Hello, this is the homework from Peng(Apply for the Node.js backend development)

## How to run this web application?
```
1 We need a Node.js env a mongodb and a redis
2 cd backend && npm start
3 If we want to run unit testing we should cd backend && npm run test
4 Take care!!! When you try to test the remove and the update function, at first, you should change the userid of test cases.
```

## What this project contains?
```
1 routes: Just define REST APIs
2 controller: Validate and filter params that is legal
3 mongo: Schema contains the defination of schemas and Dal contains query(If we need to change our databse, just modify the mongo dic)
4 middleware: It contains the logger and i save those logger to mongodb
5. lib: Some utils that have been used in this project
```