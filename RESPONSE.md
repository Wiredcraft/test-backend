# Wiredcraft Backend Developer Test Response 

## Architecture

- App
  - Http Layer : Expressjs
  - Storage Layer : Mongodb(Raw client)
  - Validation Layer : Regex and Joi validation
  - Testing : Mocha
  - Deployment : Docker


### Rationale aka. (What I was thinking) 
- I decided to take a look at the senecajs documentation as I had never used it before. That being said I decided to take a crack at it because I found the idea of structuring an application based on roles and actions to be a more scalable way to handle Microservice architectures and prevent Monoliths
  
- I believe we could further decouple the application , if I separated the services into their standalone containers with their own dependencies . Because sticking true to separation of responsibilities there is no reason that the http layer should share the same dependencies as the storage layer. That being said I opted to keep them in the same project to avoid over engineering. But I want to point out that this thought crossed my mind when designing 

- I opted to use a standalone expressjs framework for two reasons. First because if I used loopback I could quickly prototype the endpoints for user crud , but I don’t think that’s what the point of the test is. And secondly I did consider using Graphql to aid with the documentation and validation of input but opted out because I wanted this part to be handled with a different service as I will explain later

- I used a raw mongo db client and not mongoose etc because as I understood from the requirements the use of frameworks isn’t the main goal , that is why I created the validation service to further show the single responsibility approach. And I felt the validation of input whether from the http layer or not should also be a service on its own to prevent tight coupling. I opted not to soft delete pertaining to the issue I raised yesterday , because I think this is an open ended question and as such in production based on business logic would consider whether to do it or not.

- Logging is done pretty straight forward using Winston , console log in development and logging to a file in production. On further thought about this it might be feasible to have logging handled completely seperately 
  
- Authentication is handled with JWT
- Testing is done with mocha 
- Documentation is done with apidocs , as I decided not to use Graphql to help with that , also generally unless its an exposed service I believe browsing endpoints could be a security issue. I created a plugin a while back to secure Graphql endpoints just because I had this fear of exposing documentation 
  
- Build process is handled with Docker, I wrote a deployment script but as I dont have a server to play with . Its more of a reference 
  
- I use standard for my formatting my code 
- The service handler is responsible for registering the services and serves as the main entry point of my application
- I use git-flow in handling my branching
- 
In conclusion I hope this helps explain my methodology and approach for tackling this problem , I tried my best to stick to the ideology of speration of concerns and my architecture could definitely use some more revision as every time I think about it I find new ways to further improve , but I hope what I have now gives an idea of what I was thinking and how I tackled the issue.

#### Submitted by Justice Adeennze-Kangah