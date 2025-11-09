#!/bin/bash
# ============================================
# CHECK STATUS
# ============================================
# Check which services are running
# ============================================

echo "📊 Service Status:"
echo ""
docker-compose -f docker-compose.local.yml ps

echo ""
echo "💾 Disk Usage:"
docker system df

echo ""
echo "🔍 To view logs:"
echo "   ./logs.sh [service-name]"
echo ""
echo "Examples:"
echo "   ./logs.sh                    # All services"
echo "   ./logs.sh frontend           # Frontend only"
echo "   ./logs.sh incident-service   # Incident service only"
echo ""
