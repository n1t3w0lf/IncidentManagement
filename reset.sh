#!/bin/bash
# ============================================
# RESET INCIDENT MANAGEMENT SYSTEM
# ============================================
# This will DELETE ALL DATA and start fresh!
# ============================================

echo "⚠️  WARNING: This will delete ALL data!"
echo "   - All database records"
echo "   - All uploaded files"
echo "   - All user accounts"
echo ""
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Reset cancelled"
    exit 0
fi

echo ""
echo "🗑️  Removing all containers and data..."

docker-compose -f docker-compose.local.yml down -v

echo ""
echo "✅ System reset complete!"
echo ""
echo "🚀 To start fresh:"
echo "   ./start.sh"
echo ""
