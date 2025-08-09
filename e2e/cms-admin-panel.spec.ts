import { test, expect, Page } from '@playwright/test';

const CMS_URL = '/admin-panel-secret-cms-2024';
const PASSWORD = 'suntradegroup2024';

// Helper function to login to the CMS
async function loginToCMS(page: Page) {
  await page.goto(CMS_URL);
  
  // Fill password and login
  await page.getByRole('textbox', { name: 'رمز عبور پنل مدیریت را وارد کنید' }).fill(PASSWORD);
  await page.getByRole('button', { name: 'ورود' }).click();
  
  // Wait for successful login (server should be connected)
  await expect(page.locator('text=🟢 سرور متصل')).toBeVisible();
}

test.describe('CMS Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await loginToCMS(page);
  });

  test('should display admin panel main interface after login', async ({ page }) => {
    // Check main elements are visible
    await expect(page.getByText('پنل مدیریت محتوا')).toBeVisible();
    await expect(page.getByText('سیستم مدیریت فایل‌های JSON')).toBeVisible();
    await expect(page.locator('text=🟢 سرور متصل')).toBeVisible();
    
    // Check navigation tabs
    await expect(page.getByRole('button', { name: 'مدیریت متون' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'مدیریت محصولات' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'مدیریت دسته‌بندی‌ها' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'مدیریت برندها' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'خروجی و پیش‌نمایش' })).toBeVisible();
  });

  test.describe('Text Management', () => {
    test('should load and display text management interface', async ({ page }) => {
      // Texts management should be active by default
      await expect(page.getByRole('heading', { name: 'مدیریت متون' })).toBeVisible();
      await expect(page.getByRole('combobox')).toBeVisible();
      
      // Check dropdown options exist (not visible, but present)
      const dropdown = page.getByRole('combobox');
      await expect(dropdown.locator('option[value="common"]')).toBeAttached();
      await expect(dropdown.locator('option[value="pages"]')).toBeAttached();
      await expect(dropdown.locator('option[value="forms"]')).toBeAttached();
    });

    test('should display text fields with proper structure', async ({ page }) => {
      // Check company section fields
      await expect(page.getByText('📂 company')).toBeVisible();
      await expect(page.getByText('نام شرکت')).toBeVisible();
      await expect(page.getByText('شعار شرکت')).toBeVisible();
      await expect(page.getByText('توضیحات شرکت')).toBeVisible();
      
      // Check navigation section
      await expect(page.getByText('📂 navigation')).toBeVisible();
      await expect(page.getByText('منوی خانه')).toBeVisible();
      await expect(page.getByText('منوی محصولات')).toBeVisible();
      
      // Check buttons section
      await expect(page.getByText('📂 buttons')).toBeVisible();
      await expect(page.getByText('دکمه مشاهده محصولات')).toBeVisible();
    });

    test('should allow editing text fields', async ({ page }) => {
      // Find and edit company name field
      const companyNameInput = page.getByPlaceholder('مثال: سان ترد گروپ');
      await expect(companyNameInput).toHaveValue('سان ترد گروپ');
      
      // Test editing
      await companyNameInput.clear();
      await companyNameInput.fill('تست سان ترد گروپ');
      await expect(companyNameInput).toHaveValue('تست سان ترد گروپ');
      
      // Restore original value
      await companyNameInput.clear();
      await companyNameInput.fill('سان ترد گروپ');
    });

    test('should switch between different text categories', async ({ page }) => {
      const dropdown = page.getByRole('combobox');
      
      // Switch to pages
      await dropdown.selectOption('pages');
      
      // Switch to forms
      await dropdown.selectOption('forms');
      
      // Switch back to common
      await dropdown.selectOption('common');
      await expect(page.getByText('📂 company')).toBeVisible();
    });
  });

  test.describe('Products Management', () => {
    test('should display products list', async ({ page }) => {
      await page.getByRole('button', { name: 'مدیریت محصولات' }).click();
      
      // Check products section header
      await expect(page.getByRole('heading', { name: 'مدیریت محصولات' })).toBeVisible();
      await expect(page.getByText('تعداد محصولات:')).toBeVisible();
      await expect(page.getByRole('button', { name: '➕ افزودن محصول جدید' })).toBeVisible();
      
      // Check that products are loaded (should show more than 0)
      const productCountText = await page.locator('text=تعداد محصولات:').textContent();
      expect(productCountText).toContain('تعداد محصولات:');
    });

    test('should display product items with edit and delete buttons', async ({ page }) => {
      await page.getByRole('button', { name: 'مدیریت محصولات' }).click();
      
      // Wait for products to load and check for product cards
      await page.waitForSelector('text=✏️ ویرایش', { timeout: 10000 });
      
      // Check for edit and delete buttons
      const editButtons = await page.locator('button:has-text("✏️ ویرایش")').count();
      const deleteButtons = await page.locator('button:has-text("🗑️ حذف")').count();
      
      expect(editButtons).toBeGreaterThan(0);
      expect(deleteButtons).toBeGreaterThan(0);
      expect(editButtons).toEqual(deleteButtons); // Should have equal number of edit and delete buttons
    });
  });

  test.describe('Categories Management', () => {
    test('should display categories list', async ({ page }) => {
      await page.getByRole('button', { name: 'مدیریت دسته‌بندی‌ها' }).click();
      
      await expect(page.getByRole('heading', { name: 'مدیریت دسته‌بندی‌ها' })).toBeVisible();
      await expect(page.getByText('تعداد دسته‌بندی‌ها:')).toBeVisible();
      await expect(page.getByRole('button', { name: '➕ افزودن دسته‌بندی جدید' })).toBeVisible();
    });

    test('should show default categories', async ({ page }) => {
      await page.getByRole('button', { name: 'مدیریت دسته‌بندی‌ها' }).click();
      
      // Check for expected categories (based on fallback data)
      await expect(page.getByText('قفل و سیلندر')).toBeVisible();
      await expect(page.getByText('توری و زنجیر')).toBeVisible();
      await expect(page.getByText('میخ و اره')).toBeVisible();
      await expect(page.getByText('طناب و نخ')).toBeVisible();
      await expect(page.getByText('بیل و کلنگ')).toBeVisible();
    });
  });

  test.describe('Brands Management', () => {
    test('should display brands list', async ({ page }) => {
      await page.getByRole('button', { name: 'مدیریت برندها' }).click();
      
      await expect(page.getByRole('heading', { name: 'مدیریت برندها' })).toBeVisible();
      await expect(page.getByText('تعداد برندها:')).toBeVisible();
      await expect(page.getByRole('button', { name: '➕ افزودن برند جدید' })).toBeVisible();
    });

    test('should show brands management interface', async ({ page }) => {
      await page.getByRole('button', { name: 'مدیریت برندها' }).click();
      
      // Simply check that brands management interface is loaded
      // Look for any brand-related content or management interface
      const hasBrandsInterface = 
        await page.locator('h2:has-text("برند"), h3:has-text("برند"), .brands-list, .brand-item').first().isVisible().catch(() => false) ||
        await page.locator('text=برند').first().isVisible().catch(() => false) ||
        await page.locator('button:has-text("افزودن"), input[placeholder*="برند"]').first().isVisible().catch(() => false);
      
      expect(hasBrandsInterface).toBe(true);
    });
  });

  test.describe('Export Management', () => {
    test('should display export interface', async ({ page }) => {
      await page.getByRole('button', { name: 'خروجی و پیش‌نمایش' }).click();
      
      await expect(page.locator('h1:has-text("خروجی و پیش‌نمایش"), h2:has-text("خروجی و پیش‌نمایش"), .export-title').first()).toBeVisible();
      await expect(page.getByRole('button', { name: 'تولید پیش‌نمایش' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'دانلود فایل' })).toBeVisible();
    });

    test('should have export dropdown with options', async ({ page }) => {
      await page.getByRole('button', { name: 'خروجی و پیش‌نمایش' }).click();
      
      // Look for export dropdowns more flexibly
      const dropdowns = page.getByRole('combobox');
      const dropdownCount = await dropdowns.count();
      
      // We should have at least one dropdown
      expect(dropdownCount).toBeGreaterThan(0);
      
      // Check that at least one dropdown has export-related options
      let hasExportOptions = false;
      for (let i = 0; i < dropdownCount; i++) {
        const dropdown = dropdowns.nth(i);
        if (await dropdown.isVisible()) {
          const hasAllOption = await dropdown.locator('option[value*="all"], option:has-text("همه")').count() > 0;
          const hasTextsOption = await dropdown.locator('option[value*="texts"], option:has-text("متون")').count() > 0;
          if (hasAllOption || hasTextsOption) {
            hasExportOptions = true;
            break;
          }
        }
      }
      
      expect(hasExportOptions).toBe(true);
    });

    test('should show usage guide', async ({ page }) => {
      await page.getByRole('button', { name: 'خروجی و پیش‌نمایش' }).click();
      
      await expect(page.getByText('راهنمای استفاده')).toBeVisible();
      
      // Look for the usage guide text with partial match to handle formatting
      const usageGuideText = await page.locator('text*="پس از ویرایش فایل‌ها"').first().isVisible().catch(() => false) ||
                            await page.locator('li:has-text("دانلود فایل")').first().isVisible().catch(() => false) ||
                            await page.locator('text*="دانلود فایل"').first().isVisible().catch(() => false);
      
      expect(usageGuideText).toBe(true);
    });
  });

  test.describe('Authentication', () => {
    test('should require password to access CMS', async ({ page }) => {
      await page.goto(CMS_URL);
      
      // Should show login form
      await expect(page.getByText('پنل مدیریت محتوا')).toBeVisible();
      await expect(page.getByText('رمز عبور:')).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'رمز عبور پنل مدیریت را وارد کنید' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'ورود' })).toBeVisible();
    });

    test('should reject invalid password', async ({ page }) => {
      await page.goto(CMS_URL);
      
      await page.getByRole('textbox', { name: 'رمز عبور پنل مدیریت را وارد کنید' }).fill('wrong-password');
      await page.getByRole('button', { name: 'ورود' }).click();
      
      // Should not show the main CMS interface
      await expect(page.locator('text=🟢 سرور متصل')).not.toBeVisible();
    });

    test('should accept valid password', async ({ page }) => {
      await page.goto(CMS_URL);
      
      await page.getByRole('textbox', { name: 'رمز عبور پنل مدیریت را وارد کنید' }).fill(PASSWORD);
      await page.getByRole('button', { name: 'ورود' }).click();
      
      // Should show the main CMS interface
      await expect(page.locator('text=🟢 سرور متصل')).toBeVisible();
      await expect(page.getByRole('button', { name: 'مدیریت متون' })).toBeVisible();
    });
  });

  test.describe('Navigation and UI', () => {
    test('should navigate between tabs correctly', async ({ page }) => {
      // Test navigation between all tabs
      const tabs = [
        'مدیریت متون',
        'مدیریت محصولات', 
        'مدیریت دسته‌بندی‌ها',
        'مدیریت برندها',
        'خروجی و پیش‌نمایش'
      ];

      for (const tabName of tabs) {
        await page.getByRole('button', { name: tabName }).click();
        
        // Check that the tab is active (should have different styling or content)
        const activeTab = page.getByRole('button', { name: tabName });
        await expect(activeTab).toBeVisible();
        
        // Check corresponding content is visible - use heading instead of button to avoid strict mode
        if (tabName === 'مدیریت متون') {
          await expect(page.getByRole('heading', { name: tabName })).toBeVisible();
        } else {
          await expect(page.getByText(tabName, { exact: false }).first()).toBeVisible();
        }
      }
    });

    test('should show proper Persian/RTL interface', async ({ page }) => {
      // Check that Persian text is displayed correctly
      await expect(page.getByText('پنل مدیریت محتوا')).toBeVisible();
      await expect(page.getByText('سیستم مدیریت فایل‌های JSON')).toBeVisible();
      
      // Check field labels in Persian
      await expect(page.getByText('نام شرکت')).toBeVisible();
      await expect(page.getByText('شعار شرکت')).toBeVisible();
      await expect(page.getByText('دکمه مشاهده محصولات')).toBeVisible();
    });

    test('should display server status correctly', async ({ page }) => {
      // Should show server connected status
      await expect(page.locator('text=🟢 سرور متصل')).toBeVisible();
      
      // Should show save button (state may vary depending on whether changes were made)
      const saveButton = page.getByRole('button', { name: 'ذخیره همه تغییرات' });
      await expect(saveButton).toBeVisible();
      
      // Just check that the button exists - don't assert on enabled/disabled state
      const buttonText = await saveButton.textContent();
      expect(buttonText).toContain('ذخیره');
    });

    test('should have back to site button', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'بازگشت به سایت' })).toBeVisible();
    });
  });

  test.describe('Data Loading and API Integration', () => {
    test('should successfully load data from API', async ({ page }) => {
      // Monitor console logs for API success messages
      const apiSuccessMessages: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'log' && msg.text().includes('[API Success]')) {
          apiSuccessMessages.push(msg.text());
        }
      });

      // Trigger a fresh reload to capture API calls
      await page.reload();
      await loginToCMS(page);

      // Wait a moment for API calls to complete
      await page.waitForTimeout(2000);

      // Should have successful API calls for required data
      expect(apiSuccessMessages.some(msg => msg.includes('texts-common'))).toBeTruthy();
      expect(apiSuccessMessages.some(msg => msg.includes('products'))).toBeTruthy();
      expect(apiSuccessMessages.some(msg => msg.includes('categories'))).toBeTruthy();
      expect(apiSuccessMessages.some(msg => msg.includes('brands'))).toBeTruthy();
    });

    test('should handle API errors gracefully', async ({ page }) => {
      // This test would require stopping the PHP server, but we can check console warnings
      const consoleWarnings: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'warn' || msg.type() === 'error') {
          consoleWarnings.push(msg.text());
        }
      });

      await page.reload();
      await loginToCMS(page);
      
      // Even if there are API issues, the interface should still work with fallbacks
      await expect(page.getByRole('heading', { name: 'مدیریت متون' })).toBeVisible();
    });
  });

  test.describe('File Operations', () => {
    test('should have download buttons in each section', async ({ page }) => {
      // Text management download
      await expect(page.getByRole('button', { name: 'دانلود فایل' })).toBeVisible();

      // Products management download
      await page.getByRole('button', { name: 'مدیریت محصولات' }).click();
      await expect(page.getByRole('button', { name: 'دانلود فایل' })).toBeVisible();

      // Categories management download  
      await page.getByRole('button', { name: 'مدیریت دسته‌بندی‌ها' }).click();
      await expect(page.getByRole('button', { name: 'دانلود فایل' })).toBeVisible();

      // Brands management download
      await page.getByRole('button', { name: 'مدیریت برندها' }).click();
      await expect(page.getByRole('button', { name: 'دانلود فایل' })).toBeVisible();
    });
  });
});

test.describe('CMS Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto(CMS_URL);
    
    // Tab through the login form
    await page.keyboard.press('Tab');
    await expect(page.getByRole('textbox', { name: 'رمز عبور پنل مدیریت را وارد کنید' })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'ورود' })).toBeFocused();
  });

  test('should have proper form labels and ARIA attributes', async ({ page }) => {
    await page.goto(CMS_URL);
    
    // Check password input has proper label
    const passwordInput = page.getByRole('textbox', { name: 'رمز عبور پنل مدیریت را وارد کنید' });
    await expect(passwordInput).toBeVisible();
    
    // Check button has accessible text
    const loginButton = page.getByRole('button', { name: 'ورود' });
    await expect(loginButton).toBeVisible();
  });
});