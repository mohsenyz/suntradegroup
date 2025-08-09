import { test, expect, type Page } from '@playwright/test';
import { loginToCMS, saveChanges, waitForFrontendRefresh } from './test-helpers';

test.describe('CMS Frontend Integration (Core Functionality)', () => {
  test('CMS→Frontend integration is working - changes are saved and accessible', async ({ page, context }) => {
    // Step 1: Login to CMS
    await loginToCMS(page);
    
    // Step 2: Make a unique change to verify integration
    const timestamp = Date.now().toString().slice(-4);
    const testCompanyName = `Integration Test ${timestamp}`;
    
    const companyNameInput = page.getByPlaceholder('مثال: سان ترد گروپ');
    await companyNameInput.clear();
    await companyNameInput.fill(testCompanyName);
    await companyNameInput.blur();
    
    // Step 3: Save changes
    await saveChanges(page);
    
    // Step 4: Verify changes are saved in API
    const apiData = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/api/texts-common');
      return response.json();
    });
    
    expect(apiData.data.company.name).toBe(testCompanyName);
    
    // Step 5: Verify frontend can load the updated data
    const frontendPage = await context.newPage();
    await frontendPage.goto('http://localhost:3000');
    
    // Wait for data loading and check header
    await frontendPage.waitForTimeout(2000);
    await frontendPage.reload();
    
    // Verify the new company name appears in the header
    await expect(frontendPage.locator('h1').filter({ hasText: testCompanyName })).toBeVisible();
    
    console.log(`✅ CMS→Frontend integration verified! Company name updated to: ${testCompanyName}`);
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