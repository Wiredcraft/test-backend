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

### Followers/ Following/ Friends Solution
- This one is much tougher. First issue would be using a NoSQL database. While it is certainly possible, they are just not designed to handle relational data. Okay, you can design the model in a NoSQL many-to-many architecture which I believe would be okay for a smaller user base. However it may become a scaling problem once the user base goes beyond the tens of millions (depending on the size and structure of the user documents).
- By their very nature, social network modelling is a relational problem that would be better suited to an SQL database like MySQL or Postgre
- To implement this kind of social followers, following, friends, I would create a separate API called Social API that runs on an SQL database where I can easily model tables with foreign key relation to other tables to build a social graph. By using an SQL db for this, querys such as number of friends, likes, comments, followers, following are blazing fast. Ofcourse by implementing a separate API for this, you run the risk of slowing down user queries. I would try to keep this API internal on a high and closely connected network and use to reduce latency for this kind of internal API call (resources deployed in the same Availability Zone).

However if I have to use NoSQL such as mongoDB such as the one I've used for this project, this is how I would design it. I would add the field following that is an array of ids (of users) a user follows (Instagram model of followers/ following):
```typescript
// User model
export class User {
    // id
    @ObjectIdColumn()
    id!: ObjectID

    // following
    @Column()
    following!: Array<string>

    //  ... other columns ...
    //  ... ... ... ... .....
}
```
- This is how I would query these social relations

```typescript
// to find all followers of user id 'xxx-1'
const followers = db.users.find({ following: 'xxx-1' })

// to find all following
const user = db.users.find({ id: 'xxx-1' }, { following: 1 })

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
- Popular users profiles, counts, followers would be indexed on a more performant layer such as redis/elasticSearch e.g. celebrities, power users
- This would prevent hot documents from slowing down the rest of the NoSQL database 

### Geographic Location of nearby friend
- This is a job for another internal API. I would use Elasticsearch to power this API. 
- Whenever users location updates in the main database, the data is indexed to Elasticsearch by a continuous process (like Monstache)
- When a friend queries for nearby friends, a geo query is issued to the ElasticSearch service and since friends geo location is already indexed with their id, this query would be extremely fast (First search all ids and then filter with the geo data).
- While you can issue a geo query to the main NoSQL database directly, the Elasticsearch approach would be faster and would also avoid straining the main (NoSQL) database resources.
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
  



