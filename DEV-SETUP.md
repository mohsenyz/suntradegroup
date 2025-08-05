# 🚀 Local Development Setup

Simple setup to run both PHP API and Next.js frontend locally with zero headaches!

## 📋 Prerequisites

- **Node.js** (14+)
- **PHP** (7.4+) 
- **npm** or **yarn**

## ⚡ Quick Start (Recommended)

### Option 1: Run Everything at Once
```bash
# 1. Install dependencies
npm install

# 2. Start both API and frontend
./dev-start.sh
```

That's it! 🎉

- Frontend: http://localhost:3000
- CMS: http://localhost:3000/admin-panel-secret-cms-2024  
- API: http://localhost:8080/api/

### Option 2: Run Servers Separately

**Terminal 1 - Start PHP API:**
```bash
./dev-api.sh
```

**Terminal 2 - Start Next.js Frontend:**
```bash
./dev-frontend.sh
```

## 🔧 Manual Setup (If scripts don't work)

### 1. Start PHP API Server
```bash
cd api
php -S localhost:8080 router.php
```

### 2. Start Next.js Frontend
```bash
npm run dev
```

## 🎯 First Time Usage

1. **Start the servers** using any method above
2. **Open CMS**: http://localhost:3000/admin-panel-secret-cms-2024
3. **Login** with password: `suntradegroup2024`
4. **Initialize Backend**: Click the "راه‌اندازی سرور" (Setup Server) button
5. **Start editing**: Your CMS is now ready!

## 🛑 Graceful Shutdown

All scripts now include improved graceful shutdown:

- **Ctrl+C**: Stops all servers gracefully with status messages
- **Process tracking**: Shows PIDs and monitors server health
- **Port cleanup**: Automatically frees up ports on exit
- **Error handling**: Handles failed starts and port conflicts

### 🧹 Emergency Cleanup
If servers get stuck or ports remain occupied:
```bash
npm run dev:cleanup
# or
./dev-cleanup.sh
```

## 🔍 Troubleshooting

### ❌ "Cannot connect to API server"
- Make sure PHP server is running on port 8080
- Check if port 8080 is available: `lsof -i :8080`
- Try cleanup and restart: `npm run dev:cleanup && npm run dev:full`

### ❌ "Port already in use"
- Run cleanup script: `npm run dev:cleanup`
- Or manually kill processes: `lsof -ti:3000 | xargs kill`
- For different port: `npm run dev -- -p 3001`

### ❌ Servers won't stop properly
- Use cleanup script: `npm run dev:cleanup`
- Check running processes: `ps aux | grep -E "(php|node)"`
- Force kill if needed: `pkill -f "php.*8080"`

### ❌ Scripts not executable
```bash
chmod +x dev-start.sh dev-api.sh dev-frontend.sh dev-cleanup.sh
```

## 📁 How It Works

### API Server (PHP)
- Runs on `localhost:8080`
- Uses PHP's built-in server (no Apache/Nginx needed)
- Stores JSON files in `api/data/` directory
- Handles CORS automatically

### Frontend (Next.js)
- Runs on `localhost:3000`
- Auto-detects local API server
- Falls back to local JSON files if API unavailable
- Hot reloading enabled

### CMS Integration
- Same authentication as your existing CMS
- Auto-initializes backend with local data
- Real-time status indicators
- Global save functionality

## 🛠 Development Features

- **Auto-reload**: Both servers support hot reloading
- **Error logging**: API requests logged in browser console
- **Fallback data**: Works offline with local JSON files
- **Smart detection**: Automatically detects local vs production
- **One-click setup**: Initialize backend from CMS interface

## 🚀 Production Deployment

For production, replace the API client base URL:
```typescript
// In production, update baseUrl to your server
const apiClient = new JsonApiClient('https://yourserver.com/api');
```

## 💡 Tips

- Keep both servers running during development
- Use browser dev tools to monitor API calls
- Check `api/data/` folder to see saved files
- CMS changes are saved to PHP server, not local files
- Restart PHP server if you modify API code

---

**Happy coding! 🎉**