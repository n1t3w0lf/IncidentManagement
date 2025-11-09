@echo off
REM ============================================
REM VIEW LOGS (Windows)
REM ============================================

if "%1"=="" (
    echo Viewing logs from all services...
    echo Press Ctrl+C to exit
    echo.
    docker-compose -f docker-compose.local.yml logs -f --tail=100
) else (
    echo Viewing logs from: %1
    echo Press Ctrl+C to exit
    echo.
    docker-compose -f docker-compose.local.yml logs -f --tail=100 %1
)
