## Wiredcraft User Service

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
The delete API is to delete by userId, leveraging  `DELETE` semantics in REST world.

#### Data Storage
Actually the data storage only requires **transactional** and **durable** **KV** storage. 
And in Amazon the DynamoDB is the best choice while I have no idea which KV storage fits best. 
MongoDB does not support transaction. Redis requires extra effort to support duration. 
And I am not quite familiar with Cassandra or other similar DB. 
Therefore, I choose MySQL as the data storage. It supports transaction and duration well 
and it can act as the KV store if we only get/set/delete by userId. 

MySQL has some other advantages and drawbacks in function extensibility and service scalability, 
which are widely debated and I will not cover here. 
Be free to ask for in your comments if you'd like further discussion ;)    

#### Architecture


### Advanced Requirements
#### Provide a complete user auth (authentication/authorization/etc.) strategy, such as OAuth.

#### Provide a complete logging (when/how/etc.) strategy.

#### Imagine we have a new requirement right now that the user instances need to link to each other, i.e., a list of "followers/following" or "friends". Can you find out how you would design the model structure and what API you would build for querying or modifying it? 

#### Related to the requirement above, suppose the address of the user now includes a geographic coordinate(i.e., latitude and longitude), can you build an API that, given a user name return the nearby friends

