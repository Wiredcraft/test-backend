# Wiredcraft Back-end Developer Test

Make sure you read the whole document carefully and follow the guidelines in it.

## Context

Build a RESTful API that can `get/create/update/delete` user data from a persistence database

### User Model

```
{
  "id": "xxx",                  // user ID 
  "name": "test",               // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": ""               // user created date
}
```

## Requirements

### Functionality

- The API should follow typical RESTful API design pattern.
- The data should be saved in the DB.
- Provide proper unit test.
- Provide proper API document.

### Tech stack

- Spring Boot.
- MongoDB.

### Advanced requirements

*These are used for some further challenges. You can safely skip them if you are not asked to do any, but feel free to try out.*

- Provide a complete user auth (authentication/authorization/etc.) strategy, such as OAuth. This should provide a way to allow end users to securely login, autenticate requests and only access their own information.
- Provide a complete logging (when/how/etc.) strategy.
- Imagine we have a new requirement right now that the user instances need to link to each other, i.e., a list of "followers/following" or "friends". Can you find out how you would design the model structure and what API you would build for querying or modifying it?
- Related to the requirement above, suppose the address of user now includes a geographic coordinate(i.e., latitude and longitude), can you build an API that,
  - given a user name
  - return the nearby friends


## How to run it
>Don't forget to generate the RSA keys and change the credentials in `src/main/resources/application-development.yaml` if you want to run it locally
- Start the application
`gradle bootRun`
- Run the units test
  `gradle test`
- Generate API documents
  `gradle asciidoctor`
