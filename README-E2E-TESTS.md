# CMS Admin Panel E2E Tests

This project includes comprehensive end-to-end tests for the CMS admin panel using Playwright, including **critical integration tests** that verify CMS changes are properly applied to the frontend website content.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Playwright Browsers**
   ```bash
   npx playwright install
   ```

3. **Start the PHP API Server**
   ```bash
   ./start-php-server.sh
   ```
   Or manually:
   ```bash
   cd api && php -S localhost:8080
   ```

## Running Tests

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Only CMS Admin Tests
```bash
npm run test:cms
```

### Run Only CMS Integration Tests (Changes Applied to Frontend)
```bash
npm run test:cms-integration
```

### Run All CMS Tests (Admin + Integration)
```bash
npm run test:cms-all
```

### Run Tests in UI Mode (Interactive)
```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (Visible Browser)
```bash
npm run test:e2e:headed
```

## Test Coverage

The E2E tests cover two critical areas:

### 1. CMS Admin Panel Tests (`cms-admin-panel.spec.ts`)
Tests the CMS interface functionality:

### 2. CMS Integration Tests (`cms-integration.spec.ts`) 
**MOST IMPORTANT** - Tests that CMS changes are actually applied to the frontend website:

#### ✅ Text Changes Integration
- Company name changes reflected on homepage
- Tagline changes applied to all pages  
- Navigation menu text updates in header
- Button text changes across entire site

#### ✅ Product Changes Integration
- Product edits reflected on product pages
- New products appear after adding via CMS
- Product data consistency between CMS and frontend

#### ✅ Category Changes Integration  
- Category changes reflected on categories page
- Individual category pages updated when edited
- Category navigation consistency

#### ✅ Brand Changes Integration
- Brand changes reflected on brands page  
- Brand data synchronization

#### ✅ Live Data Synchronization
- Frontend updates without requiring server restart
- Data consistency between CMS and frontend
- Real-time change propagation

#### ✅ API Data Flow Testing
- Changes saved to API and retrieved correctly
- API failure handling
- POST/GET request validation

#### ✅ Cross-page Content Validation
- Consistent company info across all pages
- Updated navigation menu on all pages
- Content changes propagated site-wide

#### ✅ SEO and Metadata Integration
- Page titles updated based on CMS changes
- Meta descriptions reflect CMS content
- SEO consistency maintained

## Admin Panel Test Coverage

### Authentication
- ✅ Password-protected access
- ✅ Invalid password rejection
- ✅ Valid password acceptance

### Main Interface
- ✅ Admin panel main interface display
- ✅ Navigation tabs functionality
- ✅ Server status indicator
- ✅ Persian/RTL interface validation

### Text Management
- ✅ Text management interface loading
- ✅ Text field structure and display
- ✅ Field editing functionality
- ✅ Switching between text categories (common, pages, forms)

### Products Management
- ✅ Products list display
- ✅ Product count validation
- ✅ Product items with edit/delete buttons
- ✅ Add new product button

### Categories Management
- ✅ Categories list display
- ✅ Default categories loading (قفل و سیلندر, توری و زنجیر, etc.)
- ✅ Category management interface

### Brands Management
- ✅ Brands list display
- ✅ Default brands loading (سان, مون)
- ✅ Brand management interface

### Export Management
- ✅ Export interface display
- ✅ Export dropdown options
- ✅ Usage guide display
- ✅ Preview and download functionality

### Data Loading and API Integration
- ✅ Successful API data loading
- ✅ API error handling with fallbacks
- ✅ Console log monitoring for API calls

### File Operations
- ✅ Download buttons in all sections
- ✅ File operation availability

### Accessibility
- ✅ Keyboard navigation
- ✅ Proper form labels and ARIA attributes

## Test Structure

```
e2e/
└── cms-admin-panel.spec.ts    # Main CMS test suite
```

## Configuration Files

- `playwright.config.ts` - Playwright configuration
- `start-php-server.sh` - PHP server startup script

## Prerequisites

Before running tests, ensure:

1. **Next.js Dev Server** is running on `http://localhost:3000`
2. **PHP API Server** is running on `http://localhost:8080`
3. **Data files** are properly copied to `public/data/` directory

## Issues Fixed

The following issues were identified and resolved during manual testing:

1. **PHP Server Connectivity** - Added automatic PHP server startup
2. **Missing Local Data Files** - Fixed 404 errors by copying data files to `public/data/`
3. **API Client Fallback Paths** - Updated fallback URLs from `/src/data/` to `/data/`

## Manual Testing Results

✅ **CMS Login** - Authentication working correctly  
✅ **Text Management** - Full Persian interface with hierarchical JSON editing  
✅ **Products Management** - 17 products loading successfully  
✅ **Categories Management** - 5 categories displayed properly  
✅ **Brands Management** - 2 brands loading correctly  
✅ **Export Management** - Export interface functional  
✅ **Server Status** - Green connection indicator working  
✅ **API Integration** - All API calls successful  

## Running Tests in CI/CD

For automated testing in CI/CD pipelines:

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps

# Start servers in background
./start-php-server.sh &
npm run dev &

# Wait for servers to be ready
sleep 10

# Run tests
npm run test:e2e

# Cleanup
pkill -f "php -S"
pkill -f "next dev"
```

## Test Reports

Playwright generates HTML reports with detailed test results:
- Reports are saved in `playwright-report/`
- View with: `npx playwright show-report`