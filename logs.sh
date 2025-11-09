#!/bin/bash
# ============================================
# VIEW LOGS
# ============================================
# View logs from all services
# Press Ctrl+C to exit
# ============================================

if [ -z "$1" ]; then
    echo "📋 Viewing logs from all services..."
    echo "   Press Ctrl+C to exit"
    echo ""
    docker-compose -f docker-compose.local.yml logs -f --tail=100
else
    echo "📋 Viewing logs from: $1"
    echo "   Press Ctrl+C to exit"
    echo ""
    docker-compose -f docker-compose.local.yml logs -f --tail=100 $1
fi
