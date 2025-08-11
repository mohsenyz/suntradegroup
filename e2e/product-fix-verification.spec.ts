import { test, expect, Page } from '@playwright/test';

const CMS_URL = '/admin-panel-secret-cms-2024';
const PASSWORD = 'suntradegroup2024';

async function loginToCMS(page: Page) {
  await page.goto(CMS_URL);
  await page.getByRole('textbox', { name: 'رمز عبور پنل مدیریت را وارد کنید' }).fill(PASSWORD);
  await page.getByRole('button', { name: 'ورود' }).click();
  await expect(page.locator('text=🟢 سرور متصل')).toBeVisible();
}

test.describe('Product Changing Fix Verification', () => {
  test('should successfully edit product name, save it, and persist the change', async ({ page }) => {
    await loginToCMS(page);
    
    // Navigate to products management
    await page.getByRole('button', { name: 'مدیریت محصولات' }).click();
    await expect(page.getByRole('heading', { name: 'مدیریت محصولات' })).toBeVisible();
    await page.waitForSelector('text=✏️ ویرایش', { timeout: 10000 });
    
    // Click edit for first product
    await page.locator('button:has-text("✏️ ویرایش")').first().click();
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    
    // Get original name and make change
    const nameInput = page.locator('input[type="text"]').first();
    const originalName = await nameInput.inputValue();
    const testName = `VERIFIED_FIX_${Date.now()}`;
    
    await nameInput.clear();
    await nameInput.fill(testName);
    
    // Verify save button becomes enabled
    const saveButton = page.getByRole('button', { name: 'ذخیره همه تغییرات' });
    await expect(saveButton).toBeEnabled({ timeout: 5000 });
    
    // Click save and wait for success
    await saveButton.click();
    await page.waitForTimeout(3000);
    
    // Verify the change is still there
    const nameAfterSave = await nameInput.inputValue();
    expect(nameAfterSave).toBe(testName);
    
    // Navigate away and back to verify persistence
    await page.getByRole('button', { name: 'مدیریت متون' }).click();
    await page.getByRole('button', { name: 'مدیریت محصولات' }).click();
    await page.waitForSelector('text=✏️ ویرایش', { timeout: 10000 });
    await page.locator('button:has-text("✏️ ویرایش")').first().click();
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    
    // Verify the change persisted
    const nameAfterNavigation = await nameInput.inputValue();
    expect(nameAfterNavigation).toBe(testName);
    
    // Restore original name
    await nameInput.clear();
    await nameInput.fill(originalName);
    
    const restoreSaveButton = page.getByRole('button', { name: 'ذخیره همه تغییرات' });
    await expect(restoreSaveButton).toBeEnabled({ timeout: 5000 });
    await restoreSaveButton.click();
    
    console.log('✅ Product editing fix verified successfully!');
  });
  
  test('should detect changes immediately when editing products', async ({ page }) => {
    await loginToCMS(page);
    
    // Navigate to products
    await page.getByRole('button', { name: 'مدیریت محصولات' }).click();
    await page.waitForSelector('text=✏️ ویرایش', { timeout: 10000 });
    
    // Verify save button starts disabled
    const saveButton = page.getByRole('button', { name: 'ذخیره همه تغییرات' });
    await expect(saveButton).toBeDisabled();
    
    // Start editing
    await page.locator('button:has-text("✏️ ویرایش")').first().click();
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    
    // Make a single character change
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.type('X');
    
    // Verify save button becomes enabled immediately
    await expect(saveButton).toBeEnabled({ timeout: 2000 });
    
    console.log('✅ Change detection working correctly!');
  });
});