# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start Next.js frontend with Turbopack (port 3000)
- `npm run dev:full` - Start both frontend and PHP API server automatically (recommended)
- `npm run dev:api` - Start PHP API server only (port 8080)
- `npm run dev:frontend` - Start frontend only
- `npm run dev:cleanup` - Clean development artifacts and temporary files

### Build & Deploy
- `npm run build` - Production build (sets BUILD_TIME for footer timestamps)
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linter (always run before commits)
- `npm run export` - Static export for hosting (also sets BUILD_TIME)
- `npm run serve` - Serve static files locally

### Testing (Playwright E2E)
- `npm run test:e2e` - Run all tests (headless)
- `npm run test:e2e:ui` - Interactive test runner (recommended for development)
- `npm run test:e2e:headed` - Watch tests run in browser
- `npm run test:cms` - CMS admin panel tests only (26 tests)
- `npm run test:cms-integration` - CMS↔Frontend integration tests (16 tests)
- `npm run test:cms-all` - Complete CMS test suite

### Image Optimization
- `npm run optimize:images` - Optimize existing images
- `npm run convert:webp` - Convert images to WebP format
- `npm run optimize:all` - Complete optimization pipeline

## Project Architecture

### Stack Overview
- **Frontend**: Next.js 15.3.5 + Turbopack, TypeScript, Tailwind CSS
- **Backend**: PHP 8.x RESTful API with JSON file storage
- **Language**: Persian/Farsi (RTL) with complete localization
- **Testing**: Playwright E2E tests (100% pass rate, 42 tests)
- **Authentication**: Password-protected CMS admin panel

### Key Architectural Patterns

#### Data Flow
```
Frontend (Next.js) ↔ PHP API ↔ JSON Files (with auto-backup)
       ↕              ↕           ↕
CMS Admin Panel → Live Updates → Automatic Backups
```

#### API Authentication
- **Public endpoints**: products, categories, brands, texts-* (no auth required)
- **Protected endpoints**: CMS operations, file management, contacts (X-Password header required)
- **CMS Password**: `suntradegroup2024`

#### File Structure Highlights
- `/src/app/admin-panel-secret-cms-2024/` - CMS admin interface
- `/api/` - PHP backend with JSON storage in `/api/data/`
- `/api/data/backups/` - Automatic timestamped backups
- `/api/database/` - SQLite database with migration capabilities
- Custom hooks: `useTexts.tsx`, `useData.tsx` (unified data fetching)

#### CMS Context Pattern
- **CMSContext** (`/src/components/cms/CMSContext.tsx`) - Centralized state management for CMS
- Manages texts, products, categories, brands, and contacts data
- Tracks original vs. modified states for change detection
- Provides unified `saveAllChanges()` and `loadData()` methods

### Development Patterns

#### RTL/Persian Language Support
- HTML has `lang="fa" dir="rtl"` 
- Uses Vazirmatn font family for Persian text
- All UI text dynamically loaded from JSON files via custom hooks

#### CMS Integration
- Real-time sync between CMS and frontend
- All text content managed through `/api/texts-*` endpoints
- Product management with complete CRUD operations
- Automatic backup system prevents data loss

#### Testing Strategy
- E2E tests cover both CMS admin panel and frontend integration
- Tests verify CMS changes reflect on frontend pages
- Comprehensive coverage: authentication, CRUD operations, data sync
- Run `npm run test:e2e:ui` for development testing

## Important Notes

### Dual Server Requirement
This application requires both servers running:
1. **Next.js frontend** (localhost:3000)
2. **PHP API server** (localhost:8080)

Use `npm run dev:full` to start both automatically, or start manually:
```bash
# Terminal 1
npm run dev

# Terminal 2  
php -S localhost:8080 -t api
```

### CMS Admin Access
- URL: `http://localhost:3000/admin-panel-secret-cms-2024`
- Password: `suntradegroup2024`
- Features: Text management, Product CRUD, Categories, Brands, Export/Import

### Data Storage
- JSON files in `/api/data/` directory
- Automatic backups in `/api/data/backups/` with timestamps
- Rate limiting for contact form submissions

### Image Management
- **Comprehensive Upload System**: Full-featured image upload with drag-and-drop support
- **Visual CMS Interface**: Product images visible with previews in CMS admin panel
- **Backend API**: PHP upload endpoint at `/api/upload.php` with authentication
- **Auto-optimization**: Images automatically resized (max 1200x1200) and converted to WebP
- **File Management**: Upload, delete, and organize images through CMS interface
- **Gallery Browser**: Select from existing images in built-in gallery
- **Storage Structure**: `/public/images/products/` for optimized images, `/originals/` for source files
- **Supported Formats**: JPG, PNG, WebP, GIF (max 10MB)
- **Security**: Password-protected uploads, file type validation, unique filename generation

### Development Environment Patterns

#### Build Time System
- **Development mode**: Shows "حالت توسعه" (Development Mode) when BUILD_TIME env var is not set
- **Production builds**: BUILD_TIME automatically set via `date` command in build scripts
- **Build info component**: `src/components/cms/BuildInfo.tsx` handles display logic

#### Database Migration
- **JSON to SQLite migration**: Available via `/api/database/` endpoints
- **Current state**: Hybrid system supporting both JSON and SQLite storage
- **Migration tools**: `migrate.php` and database initialization scripts

### When Making Changes
1. Test CMS functionality with `npm run test:cms`
2. Verify frontend integration with `npm run test:cms-integration`
3. Run full test suite with `npm run test:e2e` before commits
4. Use linter: `npm run lint` (required before commits)

### Common Development Scenarios
- **Adding new products**: Use CMS admin panel or edit `/api/data/products.json`
- **Modifying text content**: Use CMS text management or edit `/api/data/texts-*.json`
- **Testing changes**: Always run integration tests to ensure CMS↔Frontend sync works
- **Adding features**: Follow existing patterns in `/src/components/` and `/src/hooks/`