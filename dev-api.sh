#!/bin/bash

# Development script to run PHP API server
echo "🚀 Starting PHP API Server..."
echo "📍 API will be available at: http://localhost:8080/api/"
echo "🔐 Password: suntradegroup2024"
echo ""
echo "Press Ctrl+C to stop the server gracefully"
echo "============================================"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping PHP API server..."
    # Kill any processes on port 8080
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    echo "✅ PHP API server stopped"
    echo "👋 Goodbye!"
    exit 0
}

# Set trap for graceful shutdown
trap cleanup SIGINT SIGTERM EXIT

# Check if port is already in use
if lsof -i:8080 >/dev/null 2>&1; then
    echo "❌ Port 8080 is already in use!"
    echo "💡 Kill existing process: lsof -ti:8080 | xargs kill"
    exit 1
fi

# Start PHP built-in server
cd api
echo "🔧 Starting server in directory: $(pwd)"
php -S localhost:8080 router.php