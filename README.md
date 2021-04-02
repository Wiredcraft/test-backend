# Wiredcraft Back-end Developer Test

[![Coverage Status](https://coveralls.io/repos/github/KengoTODA/test-backend/badge.svg?branch=master)](https://coveralls.io/github/KengoTODA/test-backend?branch=master)

## Policy to design the service

### Framework and library

- [TypeScript](http://typescriptlang.org/) providing better typing experience
- [NestJS](https://nestjs.com/) used at Wiredcraft
- [MongoDB](https://docs.mongodb.com/) officially supported by NestJS
- [mongoose](https://mongoosejs.com/) reducing boilerplate, and smaller than [TypeORM](https://github.com/typeorm/typeorm)
- [Husky](https://typicode.github.io/husky/#/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/) and [pretty-quick](https://github.com/azz/pretty-quick) to automate development

### Architecture

Apply the four-tier architecture for better maintainability. Nowadays maintainability is most important [software product quality](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010) for team development, to keep the product growing and changing.

See [ARCHTECTURE.md](./ARCHTECTURE.md) for detail.

## How to debug this app

To develop and test the product, you need a MongoDB instance listening the `27017` port in local.
You can run it in container, to keep your local env clean:

```sh
docker pull mongo:4.4
docker run -it -p 27017:27017 mongo:4.4
```

To test with production build, use `docker-compose` then it will launch necessary service and config for production:

```sh
docker-compose build
docker-compose up
```

## Guideline for feature development

As a backend engineer, consider three kinds of characteristic:

1. How we design a RESTful interface?
   - [MicrosoftREST API Guideline](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md) is a good reference.
   - Idempotency is the key to make RESTful API useful and reliable.
2. How we design domain model?
   - In domain tier: Represent domain's properties and behaviours.
   - In application tier: Represent use cases and exceptions.
3. How we persist data in database?
   - Estimate size of data, cost to backup, time to restore as much as possible.
   - Ensure [each online query uses index](https://docs.mongodb.com/manual/tutorial/measure-index-use/).
   - If we assume high-load access on API, consider to apply [CQRS](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs), [Event Sourcing](https://docs.microsoft.com/en-us/azure/architecture/patterns/event-sourcing) or [other data management pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/category/data-management) for better performance.

### Case 1: Friends feature

When we have a new requirement like "followers/following" or "friends" feature, consider following requirements:

- How many friends a user can have at most.
  - If it's many, we cannot use [Embedded Data Models](https://docs.mongodb.com/manual/core/data-model-design/#embedded-data-models) so we need to consider deeper about consistency.
- When a user adds a friend, how long time we can wait until the target's followers have updated.
  - If we can wait seconds, [event-driven architecture](https://docs.microsoft.com/en-us/azure/architecture/guide/architecture-styles/event-driven) could be better for resiliency.
  - [Transaction](https://docs.mongodb.com/manual/core/transactions/) is also an option but [it probably reduce our options in operation phase like shading](https://www.mongodb.com/blog/post/performance-best-practices-transactions-and-read--write-concerns).

When code, The 'follow' is `User`'s behaviour, so implement a `follow(User)` method in `User` class like:

```typescript
private readonly friends: Set<UserId>;
private readonly followers: Set<UserId>;

follow(another: User) {
    this.follower.add(another.userId);
    another.friends.add(this.userId);
}
```

Then get user's input (DTO) in a controller, and provide it to a method in application service which calls `follow(User)` like:

```typescript
async follow(from: UserId, to: UserId): Promise<void> {
    const [fromUser, toUser] = await Promise.all(
        this.repo.find(from),
        this.repo.find(to)
    );

    fromUser.follow(toUser);

    // TODO: keep consistency
    return Promise.all(
        repo.update(fromPromise),
        repo.update(toPromise)
    );
}
```

### Case 2: Geospatial search feature

MongoDB provides [geospatial query](https://docs.mongodb.com/manual/geospatial-queries/) support including [nearSphere operator](https://docs.mongodb.com/manual/reference/operator/query/nearSphere/), so design the repository API to use this. We also need to consider several points:

- Frequency of search query
  - If we need scalability, we can consider to apply the CQRS pattern and use isolated datastore.
- How to sort friends
  - Deoends on business requirements, we may sort result by distance, `UserId` or another property.
- Need paging feature or not
  - It could be needless if we need just a few friends (e.g. for recomendation).

The geospatial search is not behaviour a use case, so we add a method to application service. It receives a `UserId`, distance and limit to search:

```typescript
async searchNearbyFriends(id: UserId, distance = DEFAULT_DISTANCE, limit = DEFAULT_LIMIT): Promise<User[]> {
    if (distance <= 0) {
        distance = DEFAULT_DISTANCE;
    }
    distance = Math.min(limit, MAX_DISTANCE);

    if (limit <= 0) {
        limit = DEFAULT_LIMIT;
    }
    limit = Math.min(limit, MAX_LIMIT);

    const user = await this.repo.find(id);
    return repo.searchNearbyFriends(user, distance, limit);
}
```

We can encapsule the logic complexity into datastore in this scenario. It makes code simple but we need to evaluate datastore performance and maintainability carefully.
