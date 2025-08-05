#!/bin/bash

# Development script to run Next.js frontend
echo "🚀 Starting Next.js Frontend..."
echo "📍 Frontend will be available at: http://localhost:3000"
echo "📱 CMS will be available at: http://localhost:3000/admin-panel-secret-cms-2024"
echo ""
echo "Press Ctrl+C to stop the server gracefully"
echo "============================================"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping Next.js frontend..."
    # Kill any processes on port 3000
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    echo "✅ Frontend stopped"
    echo "👋 Goodbye!"
    exit 0
}

# Set trap for graceful shutdown
trap cleanup SIGINT SIGTERM EXIT

# Check if port is already in use
if lsof -i:3000 >/dev/null 2>&1; then
    echo "❌ Port 3000 is already in use!"
    echo "💡 Kill existing process: lsof -ti:3000 | xargs kill"
    echo "💡 Or start on different port: npm run dev -- -p 3001"
    exit 1
fi

# Start Next.js development server
echo "🔧 Starting Next.js in directory: $(pwd)"
npm run dev