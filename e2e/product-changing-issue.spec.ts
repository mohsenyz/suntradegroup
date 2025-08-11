import { test, expect, Page, Request } from '@playwright/test';

const CMS_URL = '/admin-panel-secret-cms-2024';
const PASSWORD = 'suntradegroup2024';

// Helper function to login to the CMS
async function loginToCMS(page: Page) {
  await page.goto(CMS_URL);
  await page.getByRole('textbox', { name: 'رمز عبور پنل مدیریت را وارد کنید' }).fill(PASSWORD);
  await page.getByRole('button', { name: 'ورود' }).click();
  await expect(page.locator('text=🟢 سرور متصل')).toBeVisible();
}

test.describe('Product Changing Issue - E2E Diagnosis', () => {
  let networkRequests: Request[] = [];
  let apiResponses: { url: string; status: number; method: string; body?: any }[] = [];

  test.beforeEach(async ({ page }) => {
    // Reset arrays
    networkRequests = [];
    apiResponses = [];

    // Monitor all network requests
    page.on('request', (request) => {
      networkRequests.push(request);
    });

    // Monitor API responses  
    page.on('response', async (response) => {
      if (response.url().includes('/api/')) {
        let body;
        try {
          body = await response.json();
        } catch {
          body = await response.text();
        }
        
        apiResponses.push({
          url: response.url(),
          status: response.status(),
          method: response.request().method(),
          body
        });
      }
    });
  });

  test('should successfully change product name and persist the change', async ({ page }) => {
    await loginToCMS(page);
    
    // Navigate to products management
    await page.getByRole('button', { name: 'مدیریت محصولات' }).click();
    await expect(page.getByRole('heading', { name: 'مدیریت محصولات' })).toBeVisible();
    
    // Wait for products to load
    await page.waitForSelector('text=✏️ ویرایش', { timeout: 10000 });
    
    // Click edit button for the first product
    const editButton = page.locator('button:has-text("✏️ ویرایش")').first();
    await editButton.click();
    
    // Wait for edit form to appear
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    
    // Find the product name input field
    const nameInput = page.locator('input[type="text"]').first();
    const originalName = await nameInput.inputValue();
    
    console.log(`Original product name: ${originalName}`);
    
    // Change the product name
    const testName = `TEST_PRODUCT_${Date.now()}`;
    await nameInput.clear();
    await nameInput.fill(testName);
    
    console.log(`Changed product name to: ${testName}`);
    
    // Verify the input shows the new value
    await expect(nameInput).toHaveValue(testName);
    
    // Save all changes
    const saveButton = page.getByRole('button', { name: 'ذخیره همه تغییرات' });
    await saveButton.click();
    
    // Wait for save operation to complete
    await page.waitForTimeout(3000);
    
    // Check if there were any API save requests
    const saveRequests = apiResponses.filter(resp => 
      resp.method === 'POST' && resp.url.includes('/api/')
    );
    
    console.log(`Save requests made: ${saveRequests.length}`);
    saveRequests.forEach((req, index) => {
      console.log(`Save request ${index + 1}: ${req.method} ${req.url} - Status: ${req.status}`);
    });
    
    // Refresh the page to check persistence
    await page.reload();
    await loginToCMS(page);
    await page.getByRole('button', { name: 'مدیریت محصولات' }).click();
    await page.waitForSelector('text=✏️ ویرایش', { timeout: 10000 });
    
    // Click edit button again
    await page.locator('button:has-text("✏️ ویرایش")').first().click();
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    
    // Check if the change persisted
    const nameInputAfterRefresh = page.locator('input[type="text"]').first();
    const nameAfterRefresh = await nameInputAfterRefresh.inputValue();
    
    console.log(`Product name after refresh: ${nameAfterRefresh}`);
    
    // Verify the change persisted
    if (nameAfterRefresh === testName) {
      console.log('✅ Product name change persisted successfully');
    } else {
      console.log('❌ Product name change was reset!');
      console.log(`Expected: ${testName}, Got: ${nameAfterRefresh}`);
    }
    
    expect(nameAfterRefresh).toBe(testName);
  });

  test('should detect automatic data reloading that resets changes', async ({ page }) => {
    await loginToCMS(page);
    
    // Navigate to products management
    await page.getByRole('button', { name: 'مدیریت محصولات' }).click();
    await page.waitForSelector('text=✏️ ویرایش', { timeout: 10000 });
    
    // Click edit button for the first product
    await page.locator('button:has-text("✏️ ویرایش")').first().click();
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    
    // Get original name
    const nameInput = page.locator('input[type="text"]').first();
    const originalName = await nameInput.inputValue();
    
    // Change the product name
    const testName = `TEMP_TEST_${Date.now()}`;
    await nameInput.clear();
    await nameInput.fill(testName);
    
    // Wait and monitor for any automatic reloading
    console.log('Monitoring for automatic data reloads...');
    await page.waitForTimeout(10000); // Wait 10 seconds
    
    // Check if the value was reset without user action
    const currentName = await nameInput.inputValue();
    
    if (currentName !== testName) {
      console.log('❌ Detected automatic reset!');
      console.log(`Changed to: ${testName}, but now shows: ${currentName}`);
      
      // Check what API calls happened during this period
      const loadRequests = apiResponses.filter(resp => 
        resp.method === 'GET' && resp.url.includes('/api/') && 
        (resp.url.includes('products') || resp.url.includes('loadData'))
      );
      
      console.log(`Automatic load requests detected: ${loadRequests.length}`);
      loadRequests.forEach((req, index) => {
        console.log(`Load request ${index + 1}: ${req.url}`);
      });
    } else {
      console.log('✅ No automatic reset detected');
    }
  });

  test('should analyze the save process step by step', async ({ page }) => {
    await loginToCMS(page);
    
    // Navigate to products management
    await page.getByRole('button', { name: 'مدیریت محصولات' }).click();
    await page.waitForSelector('text=✏️ ویرایش', { timeout: 10000 });
    
    // Clear previous network logs
    apiResponses = [];
    
    // Click edit button
    await page.locator('button:has-text("✏️ ویرایش")').first().click();
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    
    // Make a change
    const nameInput = page.locator('input[type="text"]').first();
    const testName = `SAVE_TEST_${Date.now()}`;
    await nameInput.clear();
    await nameInput.fill(testName);
    
    console.log('Step 1: Made change to product name');
    
    // Monitor the save button state
    const saveButton = page.getByRole('button', { name: 'ذخیره همه تغییرات' });
    const isEnabled = await saveButton.isEnabled();
    console.log(`Step 2: Save button enabled: ${isEnabled}`);
    
    // Click save
    await saveButton.click();
    console.log('Step 3: Clicked save button');
    
    // Wait for potential API calls
    await page.waitForTimeout(5000);
    
    // Analyze what happened
    const postRequests = apiResponses.filter(resp => resp.method === 'POST');
    const getRequests = apiResponses.filter(resp => resp.method === 'GET');
    
    console.log(`Step 4: POST requests made: ${postRequests.length}`);
    console.log(`Step 5: GET requests made: ${getRequests.length}`);
    
    postRequests.forEach((req, index) => {
      console.log(`POST ${index + 1}: ${req.url} - Status: ${req.status}`);
      if (req.body) {
        console.log(`  Body:`, JSON.stringify(req.body, null, 2));
      }
    });
    
    getRequests.forEach((req, index) => {
      console.log(`GET ${index + 1}: ${req.url} - Status: ${req.status}`);
    });
    
    // Check current state
    const currentName = await nameInput.inputValue();
    console.log(`Step 6: Current name in field: ${currentName}`);
    
    expect(postRequests.length).toBeGreaterThan(0); // Should have made at least one save request
  });

  test('should verify frontend reflects CMS changes', async ({ page, context }) => {
    await loginToCMS(page);
    
    // Make a change in CMS
    await page.getByRole('button', { name: 'مدیریت محصولات' }).click();
    await page.waitForSelector('text=✏️ ویرایش', { timeout: 10000 });
    await page.locator('button:has-text("✏️ ویرایش")').first().click();
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    
    const nameInput = page.locator('input[type="text"]').first();
    const originalName = await nameInput.inputValue();
    const testName = `FRONTEND_TEST_${Date.now()}`;
    
    await nameInput.clear();
    await nameInput.fill(testName);
    
    // Save changes
    await page.getByRole('button', { name: 'ذخیره همه تغییرات' }).click();
    await page.waitForTimeout(3000);
    
    // Open a new tab to check frontend
    const frontendPage = await context.newPage();
    await frontendPage.goto('/products');
    await frontendPage.waitForLoadState('networkidle');
    
    // Check if the change appears on frontend
    const hasTestName = await frontendPage.locator(`text=${testName}`).count() > 0;
    
    console.log(`CMS change (${testName}) visible on frontend: ${hasTestName}`);
    
    if (!hasTestName) {
      console.log('❌ CMS changes not reflected on frontend');
      
      // Check what products are actually shown
      const productNames = await frontendPage.locator('.product-name, h1, h2, h3').allTextContents();
      console.log('Products shown on frontend:', productNames);
    }
    
    await frontendPage.close();
  });
});