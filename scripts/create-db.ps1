# One-time local setup: creates the steelex_app role and steelex database,
# using the app password already stored in DATABASE_URL in .env.
# Run from the backend folder:  powershell -ExecutionPolicy Bypass -File scripts/create-db.ps1
$ErrorActionPreference = 'Stop'
$line = Get-Content (Join-Path $PSScriptRoot '..\.env') | Where-Object { $_ -match '^DATABASE_URL=' }
if ($line -notmatch '://steelex_app:([^@]+)@') { throw 'DATABASE_URL in .env must use the steelex_app user' }
$appPassword = $Matches[1]
$psql = Get-ChildItem 'C:\Program Files\PostgreSQL\*\bin\psql.exe' | Sort-Object FullName -Descending | Select-Object -First 1
if (-not $psql) { throw 'psql.exe not found under C:\Program Files\PostgreSQL' }
Write-Host 'Enter the password of the postgres superuser when asked.'
& $psql.FullName -U postgres -h localhost -v ON_ERROR_STOP=1 -v app_password=$appPassword -f (Join-Path $PSScriptRoot 'create-db.sql')
if ($LASTEXITCODE -eq 0) { Write-Host 'Database steelex is ready.' }
