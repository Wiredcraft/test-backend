# Wiredcraft backend test summary document.
## summary
The objective of this Document is to exhaustively design and present a full user order management application.

## Architecture diagram:
see [draw.io diagram]()

## Global technology summary:
- [Docker](https://www.docker.com/) and [Kubernetes](https://kubernetes.io/) for the micro-service structure and scalability.
- [NodeJS](https://nodejs.org/en/) with an [ExpressJs](https://expressjs.com/) API framework for the User API.
- NOSQL [Cassandra](cassandra.apache.org) Database to hold the user records.
- [WeChat mini-program](https://open.wechat.com/cgi-bin/newreadtemplate?t=overseas_open/docs/mini-programs/index#mini-programs_index) for the end user application.
- git + [github](https://github.com/lerignoux/wiredcraft-test-backend) for the code versioning and simple CI.
- [dockerhub](https://hub.docker.com) to host the containers and integrate with github to complete the CI-CD process.
- [datadog](https://www.datadoghq.com/) used for logging centralisation and possible metrics and analytics evolution.  
  An elasticsearch instance could also be considered for this purpose but would require more work on consultation side.

## User Sequence diagram:
see [draw.io diagram]()

## Components:
----
### API
###### Technology stack
The API is served via docker containers.  
The API is implemented in java-script using Node [ExpressJs](https://expressjs.com/).  
The API is documented using an automatically generated swagger documentation available with it. [swagger-express](https://www.npmjs.com/package/swagger-express) package will probably be used for this.  
The API is tested (mainly integration tests in this case since there is currently no real logic behind it) using [mocha](https://mochajs.org/) and [super-test](https://www.npmjs.com/package/supertest) packages.  
The API dependencies are scanned for security issues using [snyk](https://snyk.io/).  

###### Developer Documentation
The documentation must be present and generated with any instance of the API (dev, pre-prod, prod, ...).  
A simple swagger documentation will be provided.  
If it became too complex, additional documentation may be added later on.

###### Testing
The full test suite should be run to ensure each branch is valid before any integration in the production branch (master)

###### CI-CD
on each new version the associated docker container will be released with the version considered as docker tag

###### Versioning
The API will follow Semantic versioning for the release versionning.

----
### database
Given the small scope of the application this choice was made a bit arbitrarily and would require a second reflection on a production use case.

###### Technology stack
The backend is supported by a Cassandra database cluster, also hosted on docker containers.


----
### user application
The end user application is a wechat mini program.

###### Technology stack
The tencent development system will be used to develop the wechat mini-program.
It is based on javascrip

###### User Documentation
The interface should be clear and simple enough to not require additional documentation.  
An help link must be present to redirect the user to a user support platform / system
A dedicated email address and wechat account is probably enough in a first time.

----
### authentication
The authentication is fully delegated to tencent wechat mini-program authentication system. The mini program authentication information are directly verified by the API upon reception of a query.
###### Technology stack
The Tencent authentication system is based on OAuth2

----
### hosting
Given the client needs (we-chat mini program) the main end-user target is probably located in China Mainland.  
Hosting should then probably be done on [Aliyun](https://www.aliyun.com/) or [Tencent](https://cloud.tencent.com/) cloud services.

###### Test case
Given the difficulty to get a VPS on these services, the current demo will be hosted as a proof of concept on another provider
