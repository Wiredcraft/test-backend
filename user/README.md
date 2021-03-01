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

## 4. Create An App User
```shell
curl --location --request POST 'http://127.0.0.1:8000/appusers/' \
--header 'Content-Type: application/json' \
--data-raw '{
  "id": "aaron",
  "dob": "1985-08-09",
  "description": "test"
}'
```

## 5. Visit Docs
http://127.0.0.1:8000/appusers/

http://127.0.0.1:8000/appusers/aaron/ (**after create the user**)