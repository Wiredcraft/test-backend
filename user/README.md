## 0. Notes
- The project was based on Django REST framework
- For data layer, the configuration uses SQLite by default

## 1. Application Setup
```shell
# Create a virtual environment to isolate our package dependencies locally
python3 -m venv user-api
source user-api/bin/activate  # On Windows use `env\Scripts\activate`

pip install --requirement requirements.txt
cd user
cp user/.env.example user/.env
./manage.py migrate
./manage.py runserver
```

## 2. Code Quality Check
```shell
DJANGO_SETTINGS_MODULE=user.settings pylint --load-plugins pylint_django --disable=R,C user/appuser
```

## 3. Run Test
```shell
python manage.py test
```

## 4. APIs demonstration
[OAuth's strategy setup](../docs/oauth_manual.md) elaborate on a separate document. 
### Create An App User
```shell
curl --location --request POST 'http://127.0.0.1:8000/appusers/' \
--header 'Authorization: Bearer <your_access_token>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "dob": "1985-08-09",
  "description": "test"
}'
```
### Get App Users List
```shell
curl --location --request GET 'http://127.0.0.1:8000/appusers/' \
--header 'Authorization: Bearer <your_access_token>'
```
### Get An App User
```shell
curl --location --request GET 'http://127.0.0.1:8000/appusers/<user_id>/' \
--header 'Authorization: Bearer <your_access_token>'
```
### Update An App User
```shell
curl --location --request PUT 'http://127.0.0.1:8000/appusers/<user_id>/' \
--header 'Authorization: Bearer <your_access_token>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "aaron2",
  "dob": "1985-08-08",
  "description": "hi"
}'
```
### Delete An App User
```shell
curl --location --request DELETE 'http://127.0.0.1:8000/appusers/<user_id>/' \
--header 'Authorization: Bearer <your_access_token>'
```

## 5. Visit Docs In Browser
http://127.0.0.1:8000/appusers/

http://127.0.0.1:8000/appusers/1/ (**after create the user**)