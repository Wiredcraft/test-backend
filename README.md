# A RESTful API Web Server

This web application implements by Koa, that can get/create/update/delete user data from a persistence database.

And not only that,it also simplely implements user link to each other, can get a list of "followers/fans". In the user model, the 'gps' field used to storage the user addres latitude and longitude that can find user nearby friends.

## DB Requirements  

* MySQL5.7：storage user model data
* Redis：storage user and follwers relation data   

*In the `config/index.ts` you must modify it if you want to run it in your environment.*

## API Doc

See detail from this [link](https://documenter.getpostman.com/view/7457278/TzzDLFak)


## Run Application

### install all packages  
```npm install```

### typescript build
```npm run build```

### run
```npm run start```

## Code Test

If you want to test the API, you can run the test demo, it is in the `test` directory.

## Log Print 

When the Application running,it will print log at the important position, for example the apps start or error occur,and the API receive a request. 
The the log file is in the `log` directory.


