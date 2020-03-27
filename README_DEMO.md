# test-backend

Wiredcraft Back-end Developer Test

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### Code Review

- Provide a complete user auth (authentication/authorization/etc.) strategy, such as OAuth. Just open [http://localhost:7001/](http://localhost:7001/) with Chrome and click `auth0` to login
- Provide a complete logging (when/how/etc.) strategy. Logger features:
  - Levels
  - Universal logging, .error() will save ERROR level logs into a file for later debugging
  - Logs from dispatch and runtime are separated
  - Automatic sharding
- Realized the friend function， design the model structure, follow/unfollow and a list of "followers/following", but no API for now
- Only design the model structure for geographic coordinate


### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.