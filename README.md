# test-backend

## Document

- [api doc](./document/api doc.md)(export from yapi)
- [postman collection](./document/test_backend.postman_collection.json)
- [postman environment](./document/test_backend.postman_environment.json)

## Online Test

- prod_url: http://47.105.117.157:9090

## QuickStart

### Development

#### Mysql

- create a database `wiredcraft`
- update username and password in `database/config.json` and `config/config.default.js`
- `npm install --save-dev sequelize-cli`
- run sequelize: `npx sequelize db:migrate`

#### Develop

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

## TODO

- add test files
