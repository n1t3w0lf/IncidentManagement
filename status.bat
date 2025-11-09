@echo off
REM ============================================
REM CHECK STATUS (Windows)
REM ============================================

echo Service Status:
echo.
docker-compose -f docker-compose.local.yml ps

echo.
echo Disk Usage:
docker system df

echo.
echo To view logs:
echo    logs.bat                    (all services)
echo    logs.bat frontend           (frontend only)
echo    logs.bat incident-service   (incident service only)
echo.
pause
