@echo off
REM ============================================
REM START INCIDENT MANAGEMENT SYSTEM (Windows)
REM ============================================

echo Starting Incident Management System...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo Creating environment file...
    copy .env.local .env
    echo Environment file created
)

echo Starting Docker services...
echo This may take 1-2 minutes on first run...
echo.

docker-compose -f docker-compose.local.yml up -d

echo.
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo Service Status:
docker-compose -f docker-compose.local.yml ps

echo.
echo System started!
echo.
echo Access the application at:
echo    Main App:    http://localhost:3000
echo    API:         http://localhost:4000/health
echo    Email Test:  http://localhost:8025
echo    RabbitMQ:    http://localhost:15672 (guest/guest)
echo    MinIO:       http://localhost:9001 (minioadmin/minioadmin)
echo.
echo To view logs:   logs.bat
echo To stop:        stop.bat
echo.
pause
