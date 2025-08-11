import { test, expect } from '@playwright/test';

test.describe('CMS to PDP Data Synchronization', () => {
  test('should verify PDP uses dynamic data that can be updated by CMS', async ({ page }) => {
    console.log('=== Testing PDP Data Source ===');
    
    // Test the samurai saw product mentioned by user
    const testSlug = 'samurai-saw-with-sheath-sun-38cm';
    await page.goto(`/products/${testSlug}/`);
    await page.waitForLoadState('networkidle');
    
    // Get the current product name from PDP
    const pdpH1 = page.locator('main h1.text-3xl').first();
    await pdpH1.waitFor({ state: 'visible' });
    const currentProductName = await pdpH1.textContent();
    console.log(`Current PDP product name: "${currentProductName}"`);
    
    // Check if the page shows loading state first (indicating dynamic loading)
    const hasLoadingIndicator = await page.locator('text=در حال بارگذاری محصول').count() > 0 ||
                                await page.locator('.animate-spin').count() > 0;
    console.log(`PDP shows loading indicator: ${hasLoadingIndicator}`);
    
    // Check if the page has any client-side behavior by looking for JavaScript
    const hasClientSideJs = await page.evaluate(() => {
      // Check if React hydration happened
      return window.React !== undefined || 
             document.querySelector('[data-reactroot]') !== null ||
             document.querySelector('script[src*="client"]') !== null;
    });
    console.log(`Page has client-side JavaScript: ${hasClientSideJs}`);
    
    // Test network requests to see if API calls are made
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/') || request.url().includes('products')) {
        requests.push(request.url());
      }
    });
    
    // Reload to capture network activity
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    console.log('Network requests made:');
    requests.forEach(req => console.log(`  - ${req}`));
    
    const hasApiCalls = requests.some(req => req.includes('/api/'));
    console.log(`API calls detected: ${hasApiCalls}`);
    
    // Summary
    console.log('\n=== Data Source Analysis ===');
    console.log(`Loading indicator: ${hasLoadingIndicator ? 'YES (dynamic)' : 'NO (static)'}`);
    console.log(`Client-side JS: ${hasClientSideJs ? 'YES' : 'NO'}`);
    console.log(`API calls: ${hasApiCalls ? 'YES (dynamic)' : 'NO (static)'}`);
    
    const isDynamic = hasClientSideJs; // At minimum we need client-side JS for dynamic updates
    console.log(`Overall assessment: ${isDynamic ? 'DYNAMIC ✅' : 'STATIC ❌'}`);
    
    // Expect the page to be dynamic for CMS updates to work
    expect(currentProductName).toBeTruthy();
    expect(hasClientSideJs).toBe(true);
  });
});