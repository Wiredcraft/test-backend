# How I designed
According to requirements in README.md, I designed APIs as below:
|API path|Description|
|:-------|:---------|
|GET /api/user | Get all users, result format is {size: n, data: [user]}.|
|POST /api/user | Create a new user. |
|PATCH /api/user/{id} | Update user by id. If no change then no update in DB.|
|DELETE /api/user/{id} | DELETE user by id.|

# How to run this project
1. [Required] Prerequisite: Data source for Mongo DB configuration:
Update server/datasources.json, replace values in {} as yours.<br/>
&ensp;```mongodb://admin:{yourMongoPwd}@{yourHost}:27017/{yourDBName}?authSource=admin```<br/>
ex. ```mongodb://admin:qwewour#29382@localhost:27017/test?authSource=admin```<br/>

2. Go to project path, ex. ~/test-backend/ and run cmd: ```npm install```
3. Then run cmd: ```node .```
4. After see: "Browse your REST API at http://localhost:3000/explorer" in console, access this URL in browser. Then will see LoopBack API Explorer.
![image](https://user-images.githubusercontent.com/25922093/162609801-e8cd1c67-0a8a-457d-9773-6be25eaf3dce.png)

5. Run unit test via this cmd: ```npm run test1file test/user.js```
![image](https://user-images.githubusercontent.com/25922093/162609821-5ed0b6fb-5f04-4cc2-9ed0-288ff9c59d87.png)

6. To get coverage report run this cmd: ```npm run test-local```
<br/>In console:<br/>
![image](https://user-images.githubusercontent.com/25922093/162609831-ddec1b60-5d10-4baf-ba45-28857af19ef5.png)
<br/>Or open test/report/report.html in browser:<br/>
![image](https://user-images.githubusercontent.com/25922093/162609835-b44f9a4b-31c1-4b55-92bd-b9cb9205bc0a.png)
