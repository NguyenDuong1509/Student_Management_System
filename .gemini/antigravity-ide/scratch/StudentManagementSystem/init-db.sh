#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE student_db;
    CREATE DATABASE course_db;
    CREATE DATABASE enrollment_db;
    CREATE DATABASE auth_db;
EOSQL
