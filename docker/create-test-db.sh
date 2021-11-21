#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE DATABASE test_backend_test;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname test_backend_test <<-EOSQL
  CREATE EXTENSION hstore;
  CREATE EXTENSION postgis;
EOSQL