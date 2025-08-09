#!/bin/bash

echo "🧪 CMS E2E Test Runner"
echo "======================="

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check if Playwright browsers are installed
if ! npx playwright --version > /dev/null 2>&1; then
    echo "❌ Playwright not found. Installing..."
    npm install @playwright/test
fi

# Check if browsers are installed
if ! ls ~/.cache/ms-playwright/chromium* > /dev/null 2>&1; then
    echo "🌐 Installing Playwright browsers..."
    npx playwright install
    if [ $? -ne 0 ]; then
        echo "⚠️  Browser installation failed. Tests may not run properly."
        echo "   Try running: npx playwright install"
    fi
fi

# Start PHP server if not running
if ! lsof -ti:8080 > /dev/null 2>&1; then
    echo "🐘 Starting PHP API server..."
    cd api && php -S localhost:8080 > /dev/null 2>&1 &
    PHP_PID=$!
    echo "   PHP server started with PID: $PHP_PID"
    cd ..
    sleep 2
else
    echo "✅ PHP server already running"
    PHP_PID=""
fi

# Check if Next.js dev server is running
if ! lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Next.js dev server not running on port 3000"
    echo "   Please start it with: npm run dev"
    echo "   Attempting to continue anyway..."
else
    echo "✅ Next.js dev server running"
fi

# Run tests based on argument
case "$1" in
    "admin")
        echo "🧪 Running CMS Admin Panel Tests..."
        npx playwright test cms-admin-panel.spec.ts
        ;;
    "integration")
        echo "🔗 Running CMS Integration Tests..."
        npx playwright test cms-integration.spec.ts
        ;;
    "all"|"")
        echo "🧪 Running All CMS Tests..."
        npx playwright test cms-admin-panel.spec.ts cms-integration.spec.ts
        ;;
    *)
        echo "Usage: $0 [admin|integration|all]"
        echo "  admin       - Run CMS admin panel tests only"
        echo "  integration - Run CMS frontend integration tests only" 
        echo "  all         - Run all CMS tests (default)"
        ;;
esac

# Cleanup PHP server if we started it
if [ ! -z "$PHP_PID" ]; then
    echo "🧹 Cleaning up PHP server..."
    kill $PHP_PID 2>/dev/null
fi

echo "✅ Test run completed!"