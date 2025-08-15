import { test, expect, type Page } from '@playwright/test';
import { loginToCMS, saveChanges, waitForFrontendRefresh } from './test-helpers';

test.describe.configure({ mode: 'serial' });

test.describe('CMS Frontend Integration (Core Functionality)', () => {
  test('CMS→Frontend integration is working - changes are saved and accessible', async ({ page, context, browserName }) => {
    // Step 1: Login to CMS
    await loginToCMS(page);
    
    // Step 2: Make a unique change to verify integration
    // Use different fields for each browser to avoid race conditions
    const timestamp = Date.now().toString().slice(-4);
    let fieldSelector: string;
    let testValue: string;
    let fieldPath: string;
    
    switch (browserName) {
      case 'chromium':
        fieldSelector = 'text-field-company-tagline';
        testValue = `Integration ${browserName} ${timestamp}`;
        fieldPath = 'company.tagline';
        break;
      case 'firefox':
        fieldSelector = 'text-field-company-description';
        testValue = `Integration test description ${browserName} ${timestamp}`;
        fieldPath = 'company.description';
        break;
      case 'webkit':
        fieldSelector = 'text-field-copyright';
        testValue = `© Integration test ${browserName} ${timestamp}`;
        fieldPath = 'copyright';
        break;
      default:
        fieldSelector = 'text-field-company-tagline';
        testValue = `Integration ${browserName} ${timestamp}`;
        fieldPath = 'company.tagline';
    }
    
    const fieldInput = page.getByTestId(fieldSelector);
    
    // Get original value first
    const originalValue = await fieldInput.inputValue();
    console.log(`Original ${fieldPath}:`, originalValue);
    
    await fieldInput.clear();
    await fieldInput.fill(testValue);
    
    // Verify the input was filled correctly
    const inputValue = await fieldInput.inputValue();
    console.log(`Input field value after fill:`, inputValue);
    
    // Trigger change events properly
    await fieldInput.focus();
    await fieldInput.dispatchEvent('input');
    await fieldInput.dispatchEvent('change');
    await fieldInput.blur();
    
    // Wait for change detection
    await page.waitForTimeout(3000);
    
    // Step 3: Save changes - direct approach
    const saveButton = page.getByTestId('save-all-changes-button');
    console.log('Save button state before click:', await saveButton.isEnabled());
    await saveButton.click();
    console.log('💾 Save button clicked');
    
    // Wait for save to complete
    await page.waitForTimeout(5000);
    
    // Step 4: Verify changes are saved in API
    const apiData = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/api/texts-common');
      return response.json();
    });
    
    console.log(`Expected ${fieldPath}:`, testValue);
    const actualValue = fieldPath.split('.').reduce((obj, key) => obj?.[key], apiData.data);
    console.log(`Actual ${fieldPath}:`, actualValue);
    
    expect(actualValue).toBe(testValue);
    
    // Step 5: Verify frontend can load the updated data
    const frontendPage = await context.newPage();
    await frontendPage.goto('http://localhost:3000');
    
    // Wait for data loading and check header
    await frontendPage.waitForTimeout(2000);
    await frontendPage.reload();
    
    // Verify the new value appears on the frontend (only for tagline which is visible on homepage)
    if (fieldPath === 'company.tagline') {
      await expect(frontendPage.locator('text=' + testValue)).toBeVisible();
    }
    
    console.log(`✅ CMS→Frontend integration verified! ${fieldPath} updated to: ${testValue}`);
  });
  
  test('API endpoints are properly accessible', async ({ page }) => {
    // Test that the API is accessible and returns proper data
    await page.goto('http://localhost:3000');
    
    const apiTest = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:8080/api/texts-common');
        const data = await response.json();
        return {
          success: true,
          hasData: !!data.data,
          hasCompany: !!data.data?.company,
          companyName: data.data?.company?.name
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    expect(apiTest.success).toBe(true);
    expect(apiTest.hasData).toBe(true);
    expect(apiTest.hasCompany).toBe(true);
    expect(apiTest.companyName).toBeTruthy();
    
    console.log(`✅ API accessibility verified! Current company name: ${apiTest.companyName}`);
  });
});