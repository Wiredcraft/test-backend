curl -XGET http://127.0.0.1:8080/user/2
echo "\n"
curl -XPUT  -H "Content-Type: application/json"  -d '{ "userId": "2", "name": "used1", "dateOfBirth": "2019-01-01", "address": "address1", "latitude": "121", "longitude": "31.0", "description": "description1"}' http://127.0.0.1:8080/user
echo "\n"
curl -XGET http://127.0.0.1:8080/user/2
echo "\n"
curl -XPOST  -H "Content-Type: application/json"  -d '{ "userId": "2", "name": "userChange1", "dateOfBirth": "2019-01-01", "address": "address1", "latitude": "121", "longitude": "31.0", "description": "description1"}' http://127.0.0.1:8080/user
echo "\n"
curl -XPOST  -H "Content-Type: application/json"  -d '{ "userId": "2", "name": "userChange1", "dateOfBirth": "2019-01-01", "address": "address1", "latitude": "121", "longitude": "31.0", "description": "description1", "version":1}' http://127.0.0.1:8080/user
echo "\n"
curl -XGET http://127.0.0.1:8080/user/2
echo "\n"
curl -XDELETE http://127.0.0.1:8080/user/2