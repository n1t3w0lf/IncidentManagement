@echo off
REM ============================================
REM STOP INCIDENT MANAGEMENT SYSTEM (Windows)
REM ============================================

echo Stopping Incident Management System...
echo.

docker-compose -f docker-compose.local.yml stop

echo.
echo All services stopped!
echo.
echo Your data is preserved.
echo Run start.bat to start again.
echo.
echo To completely reset (delete all data): reset.bat
echo.
pause
