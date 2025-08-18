import { test, expect, type Page } from '@playwright/test';
import { loginToCMS, saveChanges, waitForFrontendRefresh, findElementFlexibly } from './test-helpers';

test.describe('Complete CMS→Frontend Integration', () => {
  test('All CMS data types are accessible via API', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const integrationTest = await page.evaluate(async () => {
      const results = {};
      
      // Test texts API
      try {
        const textsResponse = await fetch('http://localhost:8080/api/texts-common');
        const textsData = await textsResponse.json();
        results['texts'] = {
          success: true,
          hasData: !!textsData.data,
          companyName: textsData.data?.company?.name
        };
      } catch (error) {
        results['texts'] = { success: false, error: error.message };
      }
      
      // Test products API
      try {
        const productsResponse = await fetch('http://localhost:8080/api/products');
        const productsData = await productsResponse.json();
        results['products'] = {
          success: true,
          hasData: !!productsData.data,
          count: productsData.data?.products?.length || 0
        };
      } catch (error) {
        results['products'] = { success: false, error: error.message };
      }
      
      // Test categories API
      try {
        const categoriesResponse = await fetch('http://localhost:8080/api/categories');
        const categoriesData = await categoriesResponse.json();
        results['categories'] = {
          success: true,
          hasData: !!categoriesData.data,
          count: categoriesData.data?.categories?.length || 0
        };
      } catch (error) {
        results['categories'] = { success: false, error: error.message };
      }
      
      // Test brands API
      try {
        const brandsResponse = await fetch('http://localhost:8080/api/brands');
        const brandsData = await brandsResponse.json();
        results['brands'] = {
          success: true,
          hasData: !!brandsData.data,
          count: brandsData.data?.brands?.length || 0
        };
      } catch (error) {
        results['brands'] = { success: false, error: error.message };
      }
      
      return results;
    });
    
    // Verify all API endpoints are working
    expect(integrationTest['texts'].success).toBe(true);
    expect(integrationTest['products'].success).toBe(true);
    expect(integrationTest['categories'].success).toBe(true);
    expect(integrationTest['brands'].success).toBe(true);
    
    // Log results for visibility
    console.log('🎯 API Integration Results:');
    console.log(`✅ Texts: ${integrationTest['texts'].companyName}`);
    console.log(`✅ Products: ${integrationTest['products'].count} products`);
    console.log(`✅ Categories: ${integrationTest['categories'].count} categories`);
    console.log(`✅ Brands: ${integrationTest['brands'].count} brands`);
  });
  
  test.skip('Text changes from CMS appear on frontend pages', async ({ page, context }) => {
    // Login to CMS
    await loginToCMS(page);
    
    // Make a unique text change
    const timestamp = Date.now().toString().slice(-4);
    const testTagline = `تست متن ${timestamp}`;
    
    // Find tagline input with multiple selectors to avoid strict mode issues
    const taglineInput = await findElementFlexibly(page, [
      'input[placeholder="مثال: ابزار و یراق آلات"]',
      'input[placeholder*="ابزار"]',
      'input[name*="tagline"]',
      'label:has-text("شعار") + input, label:has-text("شعار شرکت") + input'
    ]);
    
    await taglineInput.clear();
    await taglineInput.fill(testTagline);
    await taglineInput.blur();
    
    await saveChanges(page);
    
    // Test on homepage with proper refresh
    const homePage = await context.newPage();
    await homePage.goto('http://localhost:3000');
    await waitForFrontendRefresh(homePage);
    
    // Check for the text in multiple possible locations
    const textFound = await homePage.locator(`text=${testTagline}`).first().isVisible().catch(() => false) ||
                     await homePage.locator(`p:has-text("${testTagline}")`).first().isVisible().catch(() => false) ||
                     await homePage.locator(`*:has-text("${testTagline}")`).first().isVisible().catch(() => false);
    
    expect(textFound).toBe(true);
    
    console.log(`✅ Text integration verified: ${testTagline} appears on homepage`);
  });
  
  test('Categories page loads from API and displays data', async ({ page }) => {
    // Simply verify categories page loads data from API
    await page.goto('http://localhost:3000/categories');
    
    // Wait for loading to complete
    const loadingIndicator = page.getByText('در حال بارگذاری دسته‌بندی‌ها...');
    if (await loadingIndicator.isVisible().catch(() => false)) {
      await loadingIndicator.waitFor({ state: 'hidden', timeout: 15000 });
    }
    
    // Wait for page to be ready
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Verify categories are loaded (check for known category names)
    const categorySelectors = [
      'text=قفل و سیلندر',
      'text=میخ و اره', 
      'text=توری و زنجیر',
      'h3:has-text("قفل")',
      'h3:has-text("میخ")'
    ];
    
    let categoryFound = false;
    for (const selector of categorySelectors) {
      if (await page.locator(selector).first().isVisible().catch(() => false)) {
        categoryFound = true;
        break;
      }
    }
    
    expect(categoryFound).toBe(true);
    
    console.log('✅ Categories page integration verified: categories loaded from API');
  });
  
  test('Products page loads data from API', async ({ page }) => {
    await page.goto('http://localhost:3000/products');
    
    // Wait for loading to complete
    await expect(page.getByText('در حال بارگذاری محصولات...')).toBeHidden({ timeout: 10000 });
    
    // Verify products are loaded
    await expect(page.locator('[data-testid="product-item"], .product-card, .bg-white').first()).toBeVisible({ timeout: 5000 });
    
    // Verify we have product content
    const productCount = await page.locator('[data-testid="product-item"], .product-card, .bg-white').count();
    expect(productCount).toBeGreaterThan(0);
    
    console.log(`✅ Products page integration verified: ${productCount} products loaded`);
  });
  
  test('Categories page loads data from API', async ({ page }) => {
    await page.goto('http://localhost:3000/categories');
    
    // Wait for loading to complete
    await expect(page.getByText('در حال بارگذاری دسته‌بندی‌ها...')).toBeHidden({ timeout: 10000 });
    
    // Verify categories are loaded
    await expect(page.locator('.bg-white').first()).toBeVisible({ timeout: 5000 });
    
    // Check for category names
    const hasCategories = await page.locator('h3:has-text("قفل و سیلندر"), h3:has-text("میخ و اره")').first().isVisible();
    expect(hasCategories).toBe(true);
    
    console.log('✅ Categories page integration verified: categories loaded from API');
  });
  
  test('Brands page loads data from API', async ({ page }) => {
    await page.goto('http://localhost:3000/brands');
    
    // Wait for loading to complete
    await expect(page.getByText('در حال بارگذاری برندها...')).toBeHidden({ timeout: 10000 });
    
    // Verify brands are loaded
    await expect(page.locator('.bg-white').first()).toBeVisible({ timeout: 5000 });
    
    // Check for brand names
    const hasBrands = await page.locator('h3:has-text("سان")').first().isVisible();
    expect(hasBrands).toBe(true);
    
    console.log('✅ Brands page integration verified: brands loaded from API');
  });
});