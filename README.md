# WC RESTful API

👷🏿 by [Emmanuel N K](https://www.github.com/emmanuelnk) 

## Introduction

This project is a simple RESTful API built using NodeJS, KOA, Typescript and TypeORM as an ORM for MongoDB. Middleware uses JWT, CORS, Winston Logger. Swagger API docs are used to produce an api front-end.  

Check out the project homepage here: [wc-backend-test](https://wc-backend-test.herokuapp.com)   
Or get straight to the action in an online API GUI here (courtesy of Swagger UI): [wc-backend-test/swagger-html](https://wc-backend-test.herokuapp.com/swagger-html)    
Or view the project github here: [test-backend](https://github.com/emmanuelnk/test-backend)   

### Tools
- Node.js (v12.x.x)
- NPM (v6.x.x) 
- Typescript
- KOA Framework v2
- MongoDB 4 with TypeORM
- Winston (logging)
- Swagger-UI (documenting the API)
- Mocha, Chai, Supertest (unit and integration tests)
- NYC (code coverage)
- ESlint, Prettier (code formatting)
- AJV for Schema validation

### Why use KOA to build API Servers?

Koa was built by the same team behind Express, and is a smaller, more expressive, and more robust foundation for web applications and APIs. It has the following advantages:
- Koa improves interoperability, robustness, and makes writing middleware much more enjoyable.
- Has a large number of helpful methods but maintains a small footprint, as no middleware are bundled.
- Koa is very lightweight, with just 550 lines of code.
- Better error handling through try/catch.
- Generated-based control flow.
- No more callbacks, facilitating an upstream and downstream flow of control.
- Cleaner, more readable async code.

## Setup

### Requirements
- Node.js version >= 12
- npm version >= 6
- docker and docker-compose (to run the mongodb db in localhost)

### Setup
- install dependencies:
  ```bash
  npm install
  ```
- setup the `.env` file. Edit the environment variables inside accordingly:
  ```bash
  cp .env.example .env
  ```
- start the mongodb container in docker:
  ```bash
  sudo docker-compose -f mongo.docker-compose up -d
  ```
### Start

- for development:
  ```bash
  npm run watch-server
  ```
- for deployment on local host:
  ```bash
  npm run build
  npm start
  ```
### Test
- to run integration tests:
  ```bash
  npm test
  ```
### Coverage
- to run code coverage:
  ```bash
  npm run coverage
  ```

## Project Structure
- The project is written in Typescript. After Typescript compiles, all subsequently built javascript files are in `/dist`
- The entry point for the server is `src/server.ts`
- Program flow: `server` --> `routes` --> `controllers` --> `entities`
- `Entities` are defined with and validated by TypeORM
- Tests are in the `test` folder and contain both integration tests and unit tests

## Deployment
- Project is deployed via Github Actions to Heroku using a ci.yml file in the project
- The mongodb database used is hosted on free tier Mongo Atlas

## Design Choices

### Authentication/Authorization
- Authentication is implemented using a jwt access and refresh token system. When a user logs in they are given a short term access token with which to perform authenticated requests. When this toek expires they can access the `/refresh` endpoint to get another one. The refresh token is stored in the database. 
- The refresh token expires after a very long time and thus allows the user to maintain a seemingly constant session.
- This method allows for multiple device login for an api
- A drawback of this method is with explicit log out. When a user logs outs, the client deletes the old token but the token is still valid on the server side
- A solution to this would be to implement a token blacklist in a redis datastore that checks invalidated tokens on user access to authenticated routes. This is however resource intensive.

### Followers/ Following
- Implemented using only the addition of `following` property on the User Model
- This property keeps an array of ids of users that the user follows
- To get all the profiles that a user follows, just query using this array
- To get all of a user's followers, you query all `following` that contain the user's id
- Example:
  ```typescript
  // to find all followers of user id 'xxx-1'
  const followers = db.user.find({ following: 'xxx-1' })

  // to find all following
  const user = db.user.find({ id: 'xxx-1' }, { following: 1 })

  // query for the profiles of followers using the followers array
  // if a user has many followers, then this operation 
  // should be batched when retrieving the profiles (make use of lazy loading)
  const usersFollowed = db.users.find({ id: { $in: user.following }})

  // to get the follwed count
  const user = db.users.find({ id: 'xxx-1' }, { following: 1 })
  const followedCount = user.following.length

  // to get the follower count
  const followerCount = db.users.count({ following: 'xxx-1' })
  ```
  
### Rate Limiting
- Rate limiting is implemented using koa middleware that keeps track of access in either an in-memory cache or redis datastore. 
- Redis would be the preferred albeit expensive option for this scenario.

### Testing
- This project concentrates on API integration tests and those are acheived using Mocha as a test runner, Chai for assertions and Supertest for accessing the server and making requests.
- Tests are run against test databases on local and a test database docker container when in CI (Github Actions)

## Answers to Challenge Questions

Here are my answers to the questions posed that I did not fully implement.

### Full logging Solution
- This one is relatively straightforward. I would highly recommend using a cloud service provider like AWS where you can do the following.
- Every container running the API logs to AWS Cloudwatch (or equivalent service). With Cloudwatch you can set up monitoring and metrics.
- You are able to parse through gigabytes of logged data and form graphs based on what you query (e.g. 5xx, 4xx error counts, maliciopus ip count)
- Logs can be saved to a service such as S3 where they can be further analysed by services like Athena or Redshift to gain more insight into API usage.
- Another approach to monitor container performance and logs is setting up an ELK stack (Elasticsearch, Logstash, Kibana). This is where Logstash process parses through logs saved to Cloudwatch and moves them to an Elasticsearch service which indexes the data for super fast querying. Kibana, a visualization interface tool can access this elastic search service and plot more powerful graphs and visualiztions than Cloudwatch.
- The last approach is to use a third party logging service. This is the most expensive approach but also the least developer time intensive.

### Geographic Location of nearby friend
- My recommendation for this would be to use Elasticsearch due to its powerful search query capabilites. While you can issue a geo query to the main NoSQL database directly, the Elasticsearch approach would be faster and would also avoid straining the main (NoSQL) database resources.
- Whenever users location updates in the main database, the data is indexed to Elasticsearch by a continuous process (like Monstache)
- When a friend queries for nearby friends, a geo query is issued to the ElasticSearch service and since friends geo location is already indexed with their id, this query would be extremely fast (First search all ids and then filter with the geo data).
- example of a geo query search to an elasticsearch cluster. (The passed in coordinates are the current user's coordinates). The service will return all ids within the vicinity (300m) that are the users friends.
```
GET user_location/_search
{
  "query": {
    "bool" : {
      "filter" : {
        "geo_distance" : {
          "distance" : "300m",
          "location" : "-25.442987, -49.239504"
        }
      }
    }
  }
}
```
  



