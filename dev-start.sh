#!/bin/bash

# Master development script to run both API and Frontend
echo "🔥 Starting Full Development Environment..."
echo ""
echo "🎯 This will start:"
echo "   📡 PHP API Server on http://localhost:8080/api/"
echo "   🌐 Next.js Frontend on http://localhost:3000"
echo "   📱 CMS Panel on http://localhost:3000/admin-panel-secret-cms-2024"
echo ""
echo "💡 Use Ctrl+C to stop all servers gracefully"
echo "============================================"

# Store PIDs for proper cleanup
API_PID=""
FRONTEND_PID=""

# Function to handle graceful cleanup
cleanup() {
    echo ""
    echo "🛑 Gracefully stopping all servers..."
    
    # Stop frontend (npm process)
    if [[ -n "$FRONTEND_PID" ]]; then
        echo "   🌐 Stopping Next.js frontend..."
        kill -TERM "$FRONTEND_PID" 2>/dev/null
        wait "$FRONTEND_PID" 2>/dev/null
        echo "   ✅ Frontend stopped"
    fi
    
    # Stop API server
    if [[ -n "$API_PID" ]]; then
        echo "   📡 Stopping PHP API server..."
        kill -TERM "$API_PID" 2>/dev/null
        wait "$API_PID" 2>/dev/null
        echo "   ✅ API server stopped"
    fi
    
    # Kill any remaining processes on our ports
    echo "   🧹 Cleaning up remaining processes..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    
    echo ""
    echo "🎉 All servers stopped gracefully!"
    echo "👋 Goodbye!"
    exit 0
}

# Set trap to catch Ctrl+C and other signals
trap cleanup SIGINT SIGTERM EXIT

# Start PHP API server in background
echo "🚀 Starting PHP API Server..."
cd api
php -S localhost:8080 router.php &
API_PID=$!
cd ..

# Wait a moment for API to start and check if it's running
sleep 2
if ! kill -0 "$API_PID" 2>/dev/null; then
    echo "❌ Failed to start PHP API server!"
    echo "   💡 Check if port 8080 is already in use: lsof -i :8080"
    exit 1
fi

# Start Next.js frontend in background
echo "🚀 Starting Next.js Frontend..."
npm run dev &
FRONTEND_PID=$!

# Wait a moment and check if frontend started
sleep 3
if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
    echo "❌ Failed to start Next.js frontend!"
    echo "   💡 Check if port 3000 is already in use: lsof -i :3000"
    cleanup
    exit 1
fi

# Display success message
echo ""
echo "✅ Development environment is ready!"
echo ""
echo "🔗 Quick Links:"
echo "   Frontend: http://localhost:3000"
echo "   CMS:      http://localhost:3000/admin-panel-secret-cms-2024"
echo "   API:      http://localhost:8080/api/"
echo ""
echo "🔐 CMS Password: suntradegroup2024"
echo ""
echo "📊 Process IDs:"
echo "   API Server: $API_PID"
echo "   Frontend:   $FRONTEND_PID"
echo ""
echo "💡 Press Ctrl+C to stop all servers gracefully"
echo "============================================"

# Wait for background processes
wait