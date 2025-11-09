#!/bin/bash
# ============================================
# STOP INCIDENT MANAGEMENT SYSTEM
# ============================================
# Simple script to stop all services
# (Data is preserved)
# ============================================

echo "🛑 Stopping Incident Management System..."
echo ""

docker-compose -f docker-compose.local.yml stop

echo ""
echo "✅ All services stopped!"
echo ""
echo "💾 Your data is preserved."
echo "   Run ./start.sh to start again."
echo ""
echo "🗑️  To completely reset (delete all data):"
echo "   ./reset.sh"
echo ""
