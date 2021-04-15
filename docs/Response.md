# Refresh Mechanism and Logout Feature



## Refresh Mechanism
I have added redis for token management. All tokens have a ttl of 2 hours. 

Basically, when the `refresh` endpoint is called, the `refresh_token` will be verified and deleted from `redis` together with it's `access_token`. 

A new set of tokens will be generated and saved in redis.


## Logout
Accepts access token, verifies it and removes it from redis.


### To Improve
* Refactor authentication tests.
* Add a sequence diagram to represent the implementation.
* Improve on token invalidation
