---
id: ErrorHandling
title: ErrorHandling
sidebar_label: ErrorHandling
---

To avoid adding `try...catch` everywhere in the code, the errorHandling function can do all the work and errors can be logged and handled at the same place. Meaning less chance of logging same error multiple times or ugly `try...catch...throw` wrapper.

### Normal function

```typescript
errorHandler(() => {
    throw Error('something went wrong');
});
```

The error will be caught and logged, in error handler

```typescript title="errorHandler.ts" {16-21}
export const errorHandler = (fn: (...args: any[]) => any) => async (
  ...args: any[]
): Promise<any> => {
  try {
    await fn(...args);
  } catch (err) {
    logger.error(err.stack || err);
    ...

    if (resFn) {
      let errors = {
        message: 'Internal Sever Error',
        error: err,
      };

      if (err instanceof mongoose.Error.ValidationError) {
        errors = {
          message: 'Mongoose Model Validation Error',
          error: err,
        };
      }
      if (err instanceof mongoose.mongo.MongoError) {
        errors = {
          message: 'MongDB Error',
          error: err,
        };
      }
      resFn.status(500).json(errors);
    }
  }
};

```

You can detect error type and handle them seprarately.



### Express function

When using with express

```typescript
errorHandler(async (req: Request, res: Response) => {
    throw Error('something went wrong');
});
```

It's basically the same with normal function, However, it will also automatically send a `500` response to the API request .

Example:

`500`

```json
{
  "message": "Internal Sever Error",
  "error": "SyntaxError: Unexpected token ;"
}
```

