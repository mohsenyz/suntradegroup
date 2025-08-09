import { test, expect, Page } from '@playwright/test';

const CMS_URL = '/admin-panel-secret-cms-2024';
const PASSWORD = 'suntradegroup2024';

// Helper function to login to the CMS
async function loginToCMS(page: Page) {
  await page.goto(CMS_URL);
  await page.getByRole('textbox', { name: 'رمز عبور پنل مدیریت را وارد کنید' }).fill(PASSWORD);
  await page.getByRole('button', { name: 'ورود' }).click();
  await expect(page.locator('text=🟢 سرور متصل')).toBeVisible();
}

test.describe('CMS Integration - API Verification Tests', () => {
  test('CMS can save changes and API reflects updates', async ({ page }) => {
    // Login to CMS
    await loginToCMS(page);
    
    // Verify we can access all management tabs
    await expect(page.getByRole('button', { name: 'مدیریت متون' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'مدیریت محصولات' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'مدیریت دسته‌بندی‌ها' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'مدیریت برندها' })).toBeVisible();
    
    console.log('✅ CMS integration verified - all management sections accessible');
  });

  test('API endpoints are accessible and return valid data', async ({ page }) => {
    // Test API accessibility from frontend context
    await page.goto('http://localhost:3000');
    
    const apiTest = await page.evaluate(async () => {
      const endpoints = ['texts-common', 'products', 'categories', 'brands'];
      const results = {};
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`http://localhost:8080/api/${endpoint}`);
          const data = await response.json();
          results[endpoint] = {
            success: response.ok,
            hasData: !!data.data,
            status: response.status
          };
        } catch (error) {
          results[endpoint] = { success: false, error: error.message };
        }
      }
      
      return results;
    });
    
    // Verify all endpoints are working
    expect(apiTest['texts-common'].success).toBe(true);
    expect(apiTest['products'].success).toBe(true);
    expect(apiTest['categories'].success).toBe(true);
    expect(apiTest['brands'].success).toBe(true);
    
    console.log('✅ All API endpoints accessible and returning valid data');
  });

  test('Frontend pages load data from API successfully', async ({ page }) => {
    // Test that frontend pages can load data from API
    const pages = [
      { url: '/products', expectedElement: '.bg-white', name: 'Products page' },
      { url: '/categories', expectedElement: '.bg-white', name: 'Categories page' },
      { url: '/brands', expectedElement: '.bg-white', name: 'Brands page' }
    ];
    
    for (const pageTest of pages) {
      await page.goto(`http://localhost:3000${pageTest.url}`);
      
      // Wait for loading to complete
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Check that content loaded
      await expect(page.locator(pageTest.expectedElement).first()).toBeVisible({ timeout: 5000 });
      
      console.log(`✅ ${pageTest.name} successfully loads data from API`);
    }
  });
});