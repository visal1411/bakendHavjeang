@echo off
REM Hav-Jeang Testing Script for Windows

echo 🚀 Hav-Jeang Testing Script
echo ============================
echo.

REM Check if .env exists
if not exist .env (
    echo ❌ .env file not found!
    echo 📝 Creating .env from .env.example...
    copy .env.example .env
    echo ⚠️  Please edit .env and add your VAPID keys and JWT_SECRET
    echo    Run: npx web-push generate-vapid-keys (in backend directory)
    pause
    exit /b 1
)

echo ✅ .env file found
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running!
    echo    Please start Docker Desktop and try again
    pause
    exit /b 1
)

echo ✅ Docker is running
echo.

REM Start services
echo 🐳 Starting Docker containers...
docker-compose up -d

echo.
echo ⏳ Waiting for services to be healthy...
timeout /t 10 /nobreak >nul

REM Check service status
echo.
echo 📊 Service Status:
docker-compose ps

echo.
echo ✅ Services started!
echo.
echo 🌐 Access the application:
echo    Frontend:  http://localhost:5000
echo    Backend:   http://localhost:3000/api
echo    API Docs:  http://localhost:3000/api-docs
echo.
echo 📋 View logs:
echo    docker-compose logs -f
echo.
echo 🛑 Stop services:
echo    docker-compose down
echo.
pause
