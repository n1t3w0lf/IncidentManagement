@echo off
REM ============================================
REM RESET INCIDENT MANAGEMENT SYSTEM (Windows)
REM ============================================

echo WARNING: This will delete ALL data!
echo    - All database records
echo    - All uploaded files
echo    - All user accounts
echo.
set /p confirm="Are you sure? (yes/no): "

if not "%confirm%"=="yes" (
    echo Reset cancelled
    pause
    exit /b 0
)

echo.
echo Removing all containers and data...

docker-compose -f docker-compose.local.yml down -v

echo.
echo System reset complete!
echo.
echo To start fresh: start.bat
echo.
pause
