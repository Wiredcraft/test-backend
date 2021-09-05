## Weirdcratf backend test repo

### Start-kit

I use [Koa2-template](https://github.com/CaoMeiYouRen/koa2-template) as my start-kit.
And I did some changes. so the entire project structrue is showed below.

### Project Structure

```
.
├── Dockerfile
├── License
├── README.md
├── docker-compose.yml //
├── logs
├── package-lock.json
├── package.json
├── src
│   ├── app.ts
│   ├── bin
│   │   └── www.ts
│   ├── config
│   │   └── index.ts // config file here
│   ├── controllers
│   │   └── user.ts // controller here to attach route
│   ├── data
│   │   ├── user.ts // to access user data both redis and mongodb
│   │   └── user_geo.ts // to access user geo
│   ├── db
│   │   ├── index.ts
│   │   └── redis.ts
│   ├── helpers // helper file
│   │   ├── ErrorCode.ts
│   │   ├── HttpError.ts
│   │   ├── HttpStatusCode.ts
│   │   ├── ResponseDto.ts
│   │   └── index.ts
│   ├── index.ts
│   ├── middleware
│   │   ├── catchError.ts
│   │   ├── index.ts
│   │   ├── logger.ts
│   │   └── timeout.ts
│   ├── models // model definition here
│   │   ├── index.ts
│   │   ├── user.ts
│   │   └── user_geo.ts
│   ├── routes // import koa-swagger-decorator use decorator to register routes
│   │   └── index.ts
│   ├── services // user service file
│   │   └── user.ts
│   └── utils
│   ├── helper.ts
│   └── index.ts
├── test // all tests
│   ├── app.test.ts
│   ├── geo.test.ts
│   └── register.ts
├── tsconfig.json
└── yarn.lock
```

### DB Design

#### User

```javascript
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    dob: Date,
    address: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
});
```

#### User Geo

```javascript
const UserGeoSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    geo: {
        type: [Number],
        index: {
            type: "2dsphere",
            sparse: true,
        },
    },

    createdAt: { type: Date, default: Date.now },
});
```

#### Why didn't store geo information in User Schema ?

For some reason, user's basic data is updated infrequently.
However, user's location will be updated frequently. So it's better to store the data separately and use cache like redis you can quickly get the geo information.

### How to run this repo

You can simply just run :

```bash
yarn run start

```

If you dont have a local mongodb or redis environment.

You can run :

```
docker-compose up -d
```

And also, all the test-case will use a dcoker container to run the testcase

### Test case

I dint't write too much unit tests.
I write 2 e2e tests to cover the whole process of user [create/ update/ delete] and user-geo [update / list / update/ list]

After run `docker-compose up -d`

```

You can find an existed container named `koa2-template_myapp-tests_1`.

You can see the test results in the container logs

```

```
 6   -_-_-_-_,------,
 0   -_-_-_-_|   /\_/\
 0   -_-_-_-^|__( ^ .^)
     -_-_-_-  ""  ""

  6 passing (246ms)
```

```

```

### Production

We may just use `docker-compose` to run project localy.

When realease for production, we alaways use aws or aliyun mongodb and redis services.

if you use `pm2` to host the project, you can just change the evnvironments.

if you use `docker` , you can pass `--env` when you execute `docker run `

if you use `kubernetes` ,you can set:

```yaml
env:
    - name: DEMO_GREETING
    value: "Hello from the environment"
    - name: DEMO_FAREWELL
    value: "Such a sweet sorrow"`
```

and if you have a `registry center`. Its more much easier to store the config.
