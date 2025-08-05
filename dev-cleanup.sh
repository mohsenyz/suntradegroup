#!/bin/bash

echo "🧹 Cleaning up development environment..."
echo ""

# Function to kill processes on a port
kill_port() {
    local port=$1
    local name=$2
    
    if lsof -i:$port >/dev/null 2>&1; then
        echo "🔍 Found processes on port $port ($name)"
        lsof -ti:$port | while read pid; do
            echo "   🗑️  Killing PID $pid"
            kill -9 $pid 2>/dev/null || true
        done
        sleep 1
        if lsof -i:$port >/dev/null 2>&1; then
            echo "   ⚠️  Some processes may still be running"
        else
            echo "   ✅ Port $port is now free"
        fi
    else
        echo "✅ Port $port ($name) is already free"
    fi
}

# Kill processes on our development ports
kill_port 3000 "Next.js Frontend"
kill_port 8080 "PHP API Server"

# Kill any node processes that might be hanging
echo ""
echo "🔍 Checking for hanging Node.js processes..."
if pgrep -f "next dev" >/dev/null; then
    echo "   🗑️  Killing Next.js dev processes"
    pkill -f "next dev" 2>/dev/null || true
fi

if pgrep -f "node.*dev" >/dev/null; then
    echo "   🗑️  Killing Node.js dev processes"
    pkill -f "node.*dev" 2>/dev/null || true
fi

# Kill any PHP processes that might be hanging
echo ""
echo "🔍 Checking for hanging PHP processes..."
if pgrep -f "php.*8080" >/dev/null; then
    echo "   🗑️  Killing PHP server processes"
    pkill -f "php.*8080" 2>/dev/null || true
fi

echo ""
echo "🎉 Cleanup complete!"
echo ""
echo "📊 Port status:"
if lsof -i:3000 >/dev/null 2>&1; then
    echo "   ❌ Port 3000: Still in use"
else
    echo "   ✅ Port 3000: Free"
fi

if lsof -i:8080 >/dev/null 2>&1; then
    echo "   ❌ Port 8080: Still in use"
else
    echo "   ✅ Port 8080: Free"
fi

echo ""
echo "🚀 Ready to start fresh development environment!"
echo "   ./dev-start.sh"