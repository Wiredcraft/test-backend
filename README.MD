# Test Backend



## Requirement

* [Requirement.md](./Requirement.md)

## API Doc

* Swagger: [/swagger](http://127.0.0.1:3000/swagger)

* OpenAPI 3.0: [/swagger-json]([127.0.0.1:3000/swagger-json](http://127.0.0.1:3000/swagger-json))



## Configuration

Edit `./src/config/`

| NODE_ENV | config file              |      |
| -------- | ------------------------ | ---- |
| dev      | `./Config/DevConfig.ts`  |      |
| test     | `./Config/TestConfig.ts` |      |
| prod     | `./Config/ProdConfig.ts` |      |

## Installation

```
yarn 
or
npm install
```



## Getting Started

```
npm start
// dev
npm strat:dev
```





## API

### Base OK Response

```typescript
export interface ITResponse<T> {
  // track id
  requestId: string;
  // data
  payload: T;
  // code 0
  code: 0;
}
```

example:

```javascript

{
    requestId: "ff36a3cc-ec34-11e6-b1a0-64510650abcf",
    payload: {
     	id: "605723b0c7d3f68248ea542b"
    },
    code: 0
}
```



### Base Error Response

```typescript
export interface ITError<T> {
	// track id
  requestId: string;
  // BusinessError code
  code: ErrorCode;
  // error details message
  details: T
  //
  message: stirng
}
```

example:

```javascript
{
	// BusinessError CODE
        code: 13,
    	
        message: "User Error",

    	details: {
            message: 'xxxxxx'
        },
        requestId: "ff36a3cc-ec34-11e6-b1a0-64510650abcf"

}
```





