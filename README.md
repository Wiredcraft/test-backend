## Wiredcraft User Service

### TL;DR
#### How to run the demo?
Supposing you have installed the docker and mysql cli, and you are running on the Mac/Linux

1. `make env-up` to start the env
2. `make server-up` to run the server
3. `make clean-data` to tear down and clean the env

### Basic Requirements

Build a RESTful API that can get/create/update/delete user data from a persistence database.

### Proposal
#### Get API
The get API follows REST that returns the user given the userId and return 404 if no user is found.

#### Create API
The create API uses `PUT` to create the user into the service. 
And the userId is generated from other systems, instead of generated inside this user service.

#### Update API
The update API has to pass-in the `version`, which value can be fetched by the get API. 
The purpose of `version` is like the optimistic lock, 
to avoid the lost update or other anomalies in case of data race. 

#### Delete API
The delete API is to delete by userId, leveraging the `DELETE` semantics in REST world.

#### Data Storage
Actually the data storage only requires **transactional** and **durable** **KV** storage. 
And in current company the DynamoDB is the best choice while I have no idea which KV storage fits best. 
MongoDB does not support transaction. Redis requires extra effort to support duration. 
And I am not quite familiar with Cassandra or other similar DB. 
Therefore, I choose MySQL as the data storage. It supports transaction and duration well 
and it can act as the KV store if we only get/set/delete by userId. 

MySQL has some other advantages and drawbacks in function extensibility and service scalability, 
which are widely debated and I will not cover here. 
Be free to ask for in your comments if you'd like further discussion ;)    

#### Tests
I have added the UT in the `test` file folders, following the project structure of maven. 
And I want to call out the integration test.
In some examples from internet, the file `WiredcraftApplicationTests` is used to generate http request and send to local server.
While I do not agree with this solution, because it has assumption that the server can be started up locally, which is not always true.
From my experience, the server has to do some authentication and authorization (AAA) work to access downstream services before it can be started.
And those work can hardly be done all in local env. And if we are using CI (travis or gitlabCI), 
the worker in the CI platform may not have the AAA env as well. 
So writing integration test to start server locally is a bad idea to me, and I prefer to use another repo acting as the client to call the service.   
And this is not included in this work, with only an ugly mitigate `test_bash.sh`, as the time is limited. 

#### To Be Improved
1. The username and password of database should be encrypted or using other AAA mechanism.
2. The TLS is to be added.
3. Integration test and load test is to be added.
4. MySQL is not encrypted-friendly for the PII info, such as name, as the length of column is predefined.
5. The controller invokes mapper directly, as the business logic now is simple.

### Advanced Requirements
#### Provide a complete user auth (authentication/authorization/etc.) strategy, such as OAuth.
I do not quite understand this requirement, actually. 
If you want only the user can update him/herself, I think the simplest way is to 
1) store the password in the DB 
2) in each request, attach the password in the header
3) add a password checking filter
4) encrypting the transportation
Another way is to use token/session for authorization.

For the authorization case, I assume it could be "user lets other APP to access the user info".
And in this case, we need 
1) user service to authorize the request
2) Auth server to generate the token
3) other APP use the token to access the user service

I do not have much exp in OAuth2 protocol and this is only my proposal.

#### Provide a complete logging (when/how/etc.) strategy.
I leverage Log4J2 to do the logging. 
1) For each exception prints the error log
2) TODO: print debug or info for each request and response, for debugging and troubleshooting 

#### Imagine we have a new requirement right now that the user instances need to link to each other, i.e., a list of "followers/following" or "friends". Can you find out how you would design the model structure and what API you would build for querying or modifying it?
Basically the "friends" design depends on the business requirements, or how the friends link are used for.
If the friends is used only for analysis and does not require low-latency, then we can sync the data to a data lake (Hive, Athena) to run some query.
The data model can be

```json
{
  "userId": 1,
  ...
  "friends": [
    {
      "userId": 2,
      "name": "name",
      ...
    },
    {}
    ...
  ]
}
```
And we can (or maybe not) add the friends of the friends. 
Another way to achieve the goal is to use the GraphSQL, such as Neo4J, 
but I do not have much exp there and do not know whether it can be scaled. 
So leave it as an open question.

If the "friends" is used for the users to fetch their friends, which requires low-latency but not up-to-date,
then we can return the similar model,
```json
{
  "userId": 1,
  ...
  "friends": [
    {
      "userId": 2,
      "name": "name",
      ...
    },
    {}
    ...
  ]
}
```
but only with the necessary info, like userId, name, but NOT description or address. 
And we do not return the friends of the friends. 
The data to store the relationship can be

```json
{
  "userId1": "1",
  "userName1": "name1",
  "geo1": [121, 31],
  "userId2": "2",
  "userName2": "name2",
  "geo2": [121, 31],
  "createAt": 1234534
}
```
Suppose the relationship is like A ---> B, then userId1 is A and userId2 is B,
This would duplicate the data but we can shard the data from both the A and B's side

One callout is how to handle "too many As likes B" or "A likes too many Bs", in which case we can 
1) precompute the hot As or Bs. And in the API level use pagination by "createAt" 
2) or limit the friends of each user. Like WeChat only 2000 friends are allowed for each user.

#### Related to the requirement above, suppose the address of the user now includes a geographic coordinate(i.e., latitude and longitude), can you build an API that, given a user name return the nearby friends
Basically the API should be like 

```List<User> getFriends(String name);``` 

And to achieve the goal, we can leverage the relationship model before, and the Elasticsearch, as it supports filter and geo search.
One thing to callout in defining the index schema is to set the `username1` and `username2` to `keyword`
Another callout is the data size as well. If A has millions of friends nearby, then it brings pressure to the ES server.
One way is to limit the max distance of "nearby". Another way is to paginate the results and merge. 
Scaling up the ES server is also an option.
The third thing is why ES is selected. Actually PostgresQL and MongoDB also supports Geo search and we seem not to need full-text search. 
So they are also acceptable. We can take the cost, scalability and functional extensibility (like full-text search).  

