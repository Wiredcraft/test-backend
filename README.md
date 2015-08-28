# Wiredcraft Back-end Developer Coding Test

## Description

This is a project under developing. A restful API powered by [Django](https://www.djangoproject.com/) and [Django REST framework](http://www.django-rest-framework.org/). You can `get/create/update/delete` user data from server database.

- Example: [Demo](http://test.charlieli.cn/users/) (need update)

- Try:

```bash
curl -l -H "Content-type: application/json" -X POST -d '{"Name":"Charlie","Dob":"1991-05-08","Address":"Beijing","Description":"Student"}' http://127.0.0.1:8000/users/
```

### User Model

```
{
  "id": "1",                    // int,     [system create],					user id
  "name": "xxx",                // string,  max_length=20,		        user name
  "dob": "",                    // date,    YYYY[-MM[-DD]],						date of birth
  "address": "",                // string,	max_length=50,blank=True,	user address
  "description": "",            // string,	blank=True						    user description
  "created_at": ""              // date,	  [system create],					user created date
}
```

### API

```
GET    /users/{id}                   - Get user by ID
POST   /users/                       - To create a new user
PUT    /users/{id}                   - To update an existing user with data
DELETE /users/{id}                   - To delete a user from database
```

## Getting started

### Postgres

Here I use [PostgreSQL](http://www.postgresql.org/) as my database, you can choose to use sqlite3 and skip this step for your convenient.

- Install [PostgreSQL](http://www.postgresql.org/).
- PostgreSQL configuration

```bash
$ psql postgres
```

To Make sure your database could be visited remotely,edit the `postgresql.conf` and modify `\#listen_addresses = ‘localhost’` to `listen_addresses = ‘*’ ` to listen to anywhere, `\#password_encryption = on` to `password_encryption = on` to enable password authentication. Edit `pg_hba.conf`, add `host all all 0.0.0.0 0.0.0.0 md5` to the last line to allow your client visiting postgresql server.

Linux:

```bash
$ vi /etc/postgresqlpv/9.4/main/postgresql.conf
$ vi /etc/postgresql/9.4/main/pg_hba.conf
```

or Mac:

```bash
$ vi /usr/local/var/postgres/postgresql.conf
$ vi /usr/local/var/postgres/pg_hba.conf
```

Restart PostgreSQL server

Linux:

```bash
$ /etc/init.d/postgresql restart
```

or Mac:

```bash
$ pg_ctl restart -D /usr/local/var/postgres
```

Create your own database

```bash
$ psql postgres
$ postgres=# create user “charlie” with password ‘123456’ nocreatedb;
$ postgres=# create database “charlieDB” with owner=”charlie”;
$ \q
```

You can test your database by

```bash
psql charlieDB
```

- Install psycopg2 to enable the connection bwtween django and postgresql

Linux:

```bash
$ sudo apt-get install python-psycopg2
```

or Mac:

```bash
$ sudo pip install psycopg2
```

Test if it's installed properly.

```bash
    $ python
    >>> import psycopg2
    >>> psycopg2.apilevel
	’2.0′
```

### Set up

- Git clone

```bash
$ git clone git@github.com:Wiredcraft/backend-test.git backend-test
```

- Edit settings.py to meet your PostgreSQL configuration

```
'default': {
    'ENGINE': 'django.db.backends.postgresql_psycopg2',
    'NAME': 'charlieDB',        #YOUR DATABASE NAME
    'USER': 'charlie',          #YOUR DATABASE USERNAME
    'PASSWORD': '123456',       #YOUR DATABASE PASSWORDch
    'HOST': '',
    'PORT': '5432',
}
```

- Synchronize model and database

```bash
$ python manage.py makemigrations
$ python manage.py migrate  
```

If you see something like this, you are good to go.

```bash
$ python manage.py makemigrations
Migrations for 'userapp':
  0001_initial.py:
    - Create model Appuser
$ python manage.py migrate       
Operations to perform:
  Apply all migrations: admin, contenttypes, userapp, auth, sessions
Running migrations:
  Rendering model states... DONE
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying sessions.0001_initial... OK
  Applying userapp.0001_initial... OK
```

- Run and try

```bash
$ python manage.py runserver

System check identified no issues (0 silenced).
August 28, 2015 - 12:37:18
Django version 1.9.dev20150827233257, using settings 'backendTest.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

Try: 

```bash
curl http://127.0.0.1:8000/users/
```


## Test

You can find `tests.py` in userapp folder. There are test methods for `get/post/put/delete`.

```bash
$ python manage.py test
```

## License

MIT

## Contact

CCharlieLi(ccharlieli@live.com)

