#!/bin/bash

# Hav-Jeang Testing Script

echo "🚀 Hav-Jeang Testing Script"
echo "============================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your VAPID keys and JWT_SECRET"
    echo "   Run: npx web-push generate-vapid-keys (in backend directory)"
    exit 1
fi

echo "✅ .env file found"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "   Please start Docker Desktop and try again"
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found!"
    echo "   Please install docker-compose"
    exit 1
fi

echo "✅ docker-compose is available"
echo ""

# Start services
echo "🐳 Starting Docker containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ Services started!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend:  http://localhost:5000"
echo "   Backend:   http://localhost:3000/api"
echo "   API Docs:  http://localhost:3000/api-docs"
echo ""
echo "📋 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
