-- Local setup: creates (or repairs) the app role and database. Safe to re-run.
-- Run as the postgres superuser, passing the password from DATABASE_URL in .env:
--   psql -U postgres -h localhost -v app_password=<password> -f scripts/create-db.sql
-- On Windows, scripts/create-db.ps1 does this for you.
SELECT 'CREATE ROLE steelex_app LOGIN'
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'steelex_app') \gexec

ALTER ROLE steelex_app WITH LOGIN PASSWORD :'app_password';

SELECT 'CREATE DATABASE steelex OWNER steelex_app ENCODING ''UTF8'' TEMPLATE template0'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'steelex') \gexec
