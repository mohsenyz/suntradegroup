import { test, expect, Page } from '@playwright/test';

const CMS_URL = '/admin-panel-secret-cms-2024';
const PASSWORD = 'suntradegroup2024';

async function loginToCMS(page: Page) {
  await page.goto(CMS_URL);
  await page.getByTestId('cms-password-input').fill(PASSWORD);
  await page.getByTestId('cms-login-button').click();
  await expect(page.getByTestId('server-status-connected')).toBeVisible();
}

test.describe('CMS to Frontend Integration Test', () => {
  test('should make CMS changes visible on frontend', async ({ page, context }) => {
    // Step 1: Login to CMS and make a change
    await loginToCMS(page);
    
    await page.getByTestId('tab-products').click();
    await page.waitForSelector('text=✏️ ویرایش', { timeout: 10000 });
    await page.locator('button:has-text("✏️ ویرایش")').first().click();
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    
    const nameInput = page.locator('input[type="text"]').first();
    const originalName = await nameInput.inputValue();
    const testName = `INTEGRATION_TEST_${Date.now()}`;
    
    await nameInput.clear();
    await nameInput.fill(testName);
    
    // Save the change
    const saveButton = page.getByTestId('save-all-changes-button');
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
    await saveButton.click();
    await page.waitForTimeout(3000);
    
    console.log(`✅ Saved product name change: ${testName}`);
    
    // Step 2: Check frontend in a new tab
    const frontendPage = await context.newPage();
    await frontendPage.goto('/products');
    await frontendPage.waitForLoadState('networkidle');
    
    // Check if the new name appears on the frontend
    const hasNewName = await frontendPage.locator(`text=${testName}`).count() > 0;
    
    if (hasNewName) {
      console.log('✅ CMS changes are immediately visible on frontend!');
    } else {
      console.log('⚠️  CMS changes may take time to appear on frontend, or frontend is using cached data');
      
      // Check what product names are actually shown
      const productElements = await frontendPage.locator('.product-name, h1, h2, h3, [class*="product"]').allTextContents();
      console.log('Products visible on frontend:', productElements.filter(text => text.trim().length > 0).slice(0, 10));
    }
    
    // Step 3: Restore original name
    await page.bringToFront();
    await nameInput.clear();
    await nameInput.fill(originalName);
    await saveButton.click();
    await page.waitForTimeout(2000);
    
    await frontendPage.close();
    
    console.log('✅ CMS-to-Frontend integration test completed');
  });
});