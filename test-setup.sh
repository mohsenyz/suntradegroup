#!/bin/bash

echo "🧪 Testing Development Setup..."
echo ""

# Check if PHP is installed
if command -v php &> /dev/null; then
    echo "✅ PHP is installed: $(php --version | head -n 1)"
else
    echo "❌ PHP is not installed. Please install PHP 7.4 or higher."
    exit 1
fi

# Check if Node.js is installed
if command -v node &> /dev/null; then
    echo "✅ Node.js is installed: $(node --version)"
else
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    echo "✅ npm is installed: $(npm --version)"
else
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Check if scripts are executable
if [[ -x "dev-start.sh" ]]; then
    echo "✅ Development scripts are executable"
else
    echo "⚠️  Making scripts executable..."
    chmod +x dev-start.sh dev-api.sh dev-frontend.sh
    echo "✅ Scripts are now executable"
fi

# Check if node_modules exists
if [[ -d "node_modules" ]]; then
    echo "✅ Dependencies are installed"
else
    echo "⚠️  Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
fi

# Check if API directory exists
if [[ -d "api" ]]; then
    echo "✅ API directory exists"
else
    echo "❌ API directory not found"
    exit 1
fi

echo ""
echo "🎉 Setup test complete! Everything looks good."
echo ""
echo "🚀 Ready to start development:"
echo "   npm run dev:full    # Start everything"
echo "   npm run dev:api     # Just PHP server"
echo "   npm run dev:frontend # Just Next.js"
echo ""
echo "📱 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   CMS:      http://localhost:3000/admin-panel-secret-cms-2024"
echo "   API:      http://localhost:8080/api/"