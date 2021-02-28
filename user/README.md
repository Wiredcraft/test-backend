## 0.Notes
- The project was based on Django REST framework
- For data layer, the configuration uses SQLite by default

## 1.Application Setup
```shell
# Create a virtual environment to isolate our package dependencies locally
python3 -m venv user-api
source user-api/bin/activate  # On Windows use `env\Scripts\activate`

pip install djangorestframework
cd user
./manage.py migrate
./manage.py runserver
```

## 2. Run Test
```shell
python manage.py test
```

## 3. Create An App User
```shell
curl --location --request POST 'http://127.0.0.1:8000/appusers/' \
--header 'Content-Type: application/json' \
--data-raw '{
  "id": "aaron",
  "dob": "1985-08-09",
  "description": "test"
}'
```

## 4. Visit Docs
http://127.0.0.1:8000/appusers/
http://127.0.0.1:8000/appusers/aaron/ (**after create the user**)