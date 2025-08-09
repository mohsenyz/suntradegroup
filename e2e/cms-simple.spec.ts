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

test.describe('CMS Simple Tests', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto(CMS_URL);
    
    // Check login form is visible
    await expect(page.getByText('پنل مدیریت محتوا')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'رمز عبور پنل مدیریت را وارد کنید' })).toBeVisible();
    
    // Fill password and login
    await page.getByRole('textbox', { name: 'رمز عبور پنل مدیریت را وارد کنید' }).fill(PASSWORD);
    await page.getByRole('button', { name: 'ورود' }).click();
    
    // Should show connected status
    await expect(page.locator('text=🟢 سرور متصل')).toBeVisible();
  });

  test('should display main navigation tabs', async ({ page }) => {
    await loginToCMS(page);
    
    // Check all navigation tabs are visible
    await expect(page.getByRole('button', { name: 'مدیریت متون' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'مدیریت محصولات' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'مدیریت دسته‌بندی‌ها' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'مدیریت برندها' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'خروجی و پیش‌نمایش' })).toBeVisible();
  });

  test('should show text management fields', async ({ page }) => {
    await loginToCMS(page);
    
    // Should show company fields
    await expect(page.getByText('نام شرکت')).toBeVisible();
    await expect(page.getByText('شعار شرکت')).toBeVisible();
    await expect(page.getByText('توضیحات شرکت')).toBeVisible();
    
    // Should show navigation fields  
    await expect(page.getByText('منوی خانه')).toBeVisible();
    await expect(page.getByText('منوی محصولات')).toBeVisible();
  });

  test('should navigate to products tab', async ({ page }) => {
    await loginToCMS(page);
    
    // Click products tab
    await page.getByRole('button', { name: 'مدیریت محصولات' }).click();
    
    // Should show products interface
    await expect(page.getByText('تعداد محصولات:')).toBeVisible();
    await expect(page.getByRole('button', { name: '➕ افزودن محصول جدید' })).toBeVisible();
  });

  test('should navigate to categories tab', async ({ page }) => {
    await loginToCMS(page);
    
    // Click categories tab
    await page.getByRole('button', { name: 'مدیریت دسته‌بندی‌ها' }).click();
    
    // Should show categories
    await expect(page.getByText('تعداد دسته‌بندی‌ها:')).toBeVisible();
    await expect(page.getByText('قفل و سیلندر')).toBeVisible();
    await expect(page.getByText('توری و زنجیر')).toBeVisible();
  });

  test('should show server status', async ({ page }) => {
    await loginToCMS(page);
    
    // Should show server connected
    await expect(page.locator('text=🟢 سرور متصل')).toBeVisible();
    
    // Should show save button (either enabled or disabled is fine)
    const saveButton = page.getByRole('button', { name: 'ذخیره همه تغییرات' });
    await expect(saveButton).toBeVisible();
    
    // Just verify the button exists and has the right text - state doesn't matter for this test
    const buttonText = await saveButton.textContent();
    expect(buttonText).toContain('ذخیره');
  });
});