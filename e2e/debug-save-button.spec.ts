import { test, expect, Page } from '@playwright/test';

const CMS_URL = '/admin-panel-secret-cms-2024';
const PASSWORD = 'suntradegroup2024';

async function loginToCMS(page: Page) {
  await page.goto(CMS_URL);
  await page.getByRole('textbox', { name: 'رمز عبور پنل مدیریت را وارد کنید' }).fill(PASSWORD);
  await page.getByRole('button', { name: 'ورود' }).click();
  await expect(page.locator('text=🟢 سرور متصل')).toBeVisible();
}

test.describe('Debug Save Button Issue', () => {
  test('should debug why save button is disabled', async ({ page }) => {
    // Listen to console messages to capture debug logs
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.text().includes('[CMS DEBUG]')) {
        consoleLogs.push(msg.text());
      }
    });

    await loginToCMS(page);
    
    // Navigate to products management
    await page.getByRole('button', { name: 'مدیریت محصولات' }).click();
    await page.waitForSelector('text=✏️ ویرایش', { timeout: 10000 });
    
    // Click edit button
    await page.locator('button:has-text("✏️ ویرایش")').first().click();
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    
    // Get original name
    const nameInput = page.locator('input[type="text"]').first();
    const originalName = await nameInput.inputValue();
    console.log(`Original name: ${originalName}`);
    
    // Force a browser evaluation to check hasChanges function
    const beforeChange = await page.evaluate(() => {
      // @ts-ignore - accessing global context
      if (window.CMSContext) {
        // @ts-ignore
        return window.CMSContext.hasChanges();
      }
      return 'CMS Context not found';
    });
    
    console.log(`hasChanges before edit: ${beforeChange}`);
    
    // Make a change
    const testName = `DEBUG_TEST_${Date.now()}`;
    await nameInput.clear();
    await nameInput.fill(testName);
    
    console.log(`Changed name to: ${testName}`);
    
    // Wait for state to update
    await page.waitForTimeout(1000);
    
    // Check hasChanges after the change
    const afterChange = await page.evaluate(() => {
      // @ts-ignore
      if (window.CMSContext) {
        // @ts-ignore
        return window.CMSContext.hasChanges();
      }
      return 'CMS Context not found';
    });
    
    console.log(`hasChanges after edit: ${afterChange}`);
    
    // Check the save button state
    const saveButton = page.getByRole('button', { name: 'ذخیره همه تغییرات' });
    const isEnabled = await saveButton.isEnabled();
    const buttonClasses = await saveButton.getAttribute('class');
    
    console.log(`Save button enabled: ${isEnabled}`);
    console.log(`Save button classes: ${buttonClasses}`);
    
    // Print all debug logs captured
    console.log('=== Debug Logs ===');
    consoleLogs.forEach(log => console.log(log));
    
    // The test should pass regardless, we just want to see the debug info
    expect(testName).toContain('DEBUG_TEST_');
  });
});