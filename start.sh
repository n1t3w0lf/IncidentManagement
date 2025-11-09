#!/bin/bash
# ============================================
# START INCIDENT MANAGEMENT SYSTEM
# ============================================
# Simple script to start all services locally
# ============================================

echo "🚀 Starting Incident Management System..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.local .env
    echo "✅ Environment file created"
fi

# Start services
echo "🐳 Starting Docker services..."
echo "This may take 1-2 minutes on first run..."
echo ""

docker-compose -f docker-compose.local.yml up -d

# Wait a bit for services to start
echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check status
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.local.yml ps

echo ""
echo "✅ System started!"
echo ""
echo "🌐 Access the application at:"
echo "   Main App:    http://localhost:3000"
echo "   API:         http://localhost:4000/health"
echo "   Email Test:  http://localhost:8025"
echo "   RabbitMQ:    http://localhost:15672 (guest/guest)"
echo "   MinIO:       http://localhost:9001 (minioadmin/minioadmin)"
echo ""
echo "📝 To view logs:"
echo "   ./logs.sh"
echo ""
echo "🛑 To stop:"
echo "   ./stop.sh"
echo ""
