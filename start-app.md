redis port 6379
create mysql database test
mysql user:root
mysql password:wiredcraft

```
curl --location --request POST 'localhost:8080/test/user/add/' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=61098B05033139E3F17BFD134AD212EF' \
--data-raw '{
    "name": "kobe", 
    "dob": "dob",
    "address": "address",
    "description": "description",
    "createdAt": "createdAt"
}'
```


```
add position

curl --location --request POST 'localhost:8080/test/user/position/add' \
--header 'Content-Type: application/json' \
--header 'Cookie: JSESSIONID=61098B05033139E3F17BFD134AD212EF' \
--data-raw '{
    "id": 4,
    "x": 118.7753044024717,
    "y": 31.979087384553864
}'

```