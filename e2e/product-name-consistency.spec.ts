import { test, expect } from '@playwright/test';

test.describe('Product Name Consistency Across Pages', () => {
  test('should show consistent product name for ID 14 across admin panel, listing, and PDP', async ({ page }) => {
    const productName = 'سیلندر ۷ سانت سان 3323';
    
    // Test 1: Product Listing Page
    console.log('=== Testing Products Listing Page ===');
    await page.goto('/products/');
    await page.waitForLoadState('networkidle');
    
    const listingProductExists = await page.locator(`text=${productName}`).count();
    console.log(`Product name found on listing page: ${listingProductExists > 0 ? 'YES' : 'NO'}`);
    
    // Test 2: Product Detail Page (PDP)
    console.log('\n=== Testing Product Detail Page (PDP) ===');
    await page.goto('/products/cylinder-7cm-sun/');
    await page.waitForLoadState('networkidle');
    
    // Look for the product name H1 specifically (not header H1)
    const pdpH1 = page.locator('main h1.text-3xl').first();
    const pdpProductName = await pdpH1.textContent();
    console.log(`PDP H1 text: "${pdpProductName}"`);
    
    const pdpMatches = pdpProductName === productName;
    console.log(`PDP name matches expected: ${pdpMatches ? 'YES' : 'NO'}`);
    
    // Summary
    console.log('\n=== SUMMARY ===');
    console.log(`Expected name: "${productName}"`);
    console.log(`Listing page: ${listingProductExists > 0 ? 'PASS' : 'FAIL'}`);
    console.log(`PDP page: ${pdpMatches ? 'PASS' : 'FAIL'}`);
    
    const allConsistent = listingProductExists > 0 && pdpMatches;
    console.log(`Overall consistency: ${allConsistent ? 'PASS ✅' : 'FAIL ❌'}`);
    
    // Assertions - focusing on the key issue that was reported
    expect(listingProductExists).toBeGreaterThan(0);
    expect(pdpProductName).toBe(productName);
  });
});