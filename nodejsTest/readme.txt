/****************************************************
* node.js RESTful API for get/add/update/delete
* user data with format:
* {
*    "id": "123",    		// user ID 
*    "name": "tempUser",   	// user name
*    "dob": "1900-1-1",         // date of birth
*    "address": "China",        // user address
*    "description": "",  	// user description
*    "createdAt": "1900-1-1"    // user created date
* };
*  in couchdb for Test
*****************************************************/
couchdb db name:mytestdb, 
db port: 5984, http port: 5985
/////////////////////////////////////////////////////
(1)files:
nodejsTest(folder)  ----httpdb.js
                    |
                    ---views(folder)  ---addUser.html
			 |
                          ---------------getUser.html
                         |
                          ---------------updateUser.html
                         |
                          ---------------deleteUser.html
/////////////////////////////////////////////////////
(2)running method:
node.js -> node httpdb.js //http server will listen the request

(3)add user data
use browser(I use firefox or IE) and input:
http://127.0.0.1:5985/addUser   //other terminal can use ip 192.168....
http server will reply the addUser.html page.
//note that firefox maybe has display problem(just display source 
//code),there is no problem in IE.

the addUser page has text controls and one add button:
{ 
  id: ¡õ
  name: ¡õ
  dob: ¡õ
  address: ¡õ
  description: ¡õ
}
input user data and click add button. User data will be sent to server
and be saved in db.

(4)get user data
input http://127.0.0.1:5985/getUser in browser, http server will reply
getUser.html page. There are one id input box and one get button.
input user id and click the button, the user data will be displayed.

(5)update and delete user data
input http://127.0.0.1:5985/updateUser and 
      http://127.0.0.1:5985/deleteUser in browser. The server will reply
updateUser.html and deleteUser.html. Fill in new user data or user id
and click the corresponding button.
//update page should display the old data(I did not do it due to time)

/////////////////////////////////////////////////////
some unit tests:
(6) http://127.0.0.1:5985/addUser
input:
  003 //id
  test003 //name
  2000-1-1  //dob
  China  //address
  test of test003 //description

click add button and server replies:
create user data successfully! 
{"id":"003","name":"test003","dob":"2000-1-1","address":"China",
"description":"test of test003","createdAt":"2019-11-21"}

(7)http://127.0.0.1:5985/deleteUser
input 003, click delete button and server replies:
delete user data successfully! id:003
/////////////////////////////////////////////////////
I've just handled the simple exception due to time. I have a quick 
learning in html, and I still keep learning node.js and trying to 
understand RESTful API. RESTful API try to use nouns, not verbs. 
My API still use verbs: get + User. I still keep learning RESTClient
and try to use GET/PUT/POST/DELETE. But I should submit my current 
version for test as time relation. Anyway, this is not the end for my 
learning node.js.Thank you!
/////////////////////////////////////////////////////