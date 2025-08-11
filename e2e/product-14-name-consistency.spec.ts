import { test, expect, Page } from '@playwright/test';

const CMS_URL = '/admin-panel-secret-cms-2024';
const PASSWORD = 'suntradegroup2024';

async function loginToCMS(page: Page) {
  await page.goto(CMS_URL);
  await page.getByRole('textbox', { name: 'رمز عبور پنل مدیریت را وارد کنید' }).fill(PASSWORD);
  await page.getByRole('button', { name: 'ورود' }).click();
  await expect(page.locator('text=🟢 سرور متصل')).toBeVisible();
}

test.describe('Product ID 14 Name Consistency Check', () => {
  test('should check product ID 14 name across different pages', async ({ page, context }) => {
    let adminPanelName = '';
    let productsListingName = '';
    let productPageName = '';

    // Step 1: Check name in CMS Admin Panel
    await loginToCMS(page);
    await page.getByRole('button', { name: 'مدیریت محصولات' }).click();
    await page.waitForSelector('text=✏️ ویرایش', { timeout: 10000 });

    // Find product ID 14 in the admin panel
    const productCards = await page.locator('.bg-white.border.border-gray-200').all();
    
    for (let i = 0; i < productCards.length; i++) {
      const card = productCards[i];
      const idText = await card.locator('text=شناسه:').textContent();
      
      if (idText && idText.includes('14')) {
        // Found product ID 14, get its name
        const nameElement = await card.locator('h3').first();
        adminPanelName = await nameElement.textContent() || '';
        console.log(`Admin Panel - Product 14 name: "${adminPanelName}"`);
        break;
      }
    }

    // Step 2: Check name on products listing page
    const listingPage = await context.newPage();
    await listingPage.goto('/products');
    await listingPage.waitForLoadState('networkidle');

    // Find product by slug or other identifier
    const productLinks = await listingPage.locator('a[href*="cylinder-7cm-sun"], a[href*="14"]').all();
    
    if (productLinks.length > 0) {
      const productLink = productLinks[0];
      const nameElement = await productLink.locator('h3, h2, h1, .product-name, [class*="name"]').first();
      if (await nameElement.isVisible()) {
        productsListingName = await nameElement.textContent() || '';
      } else {
        // Try to get the name from the link text itself
        productsListingName = await productLink.textContent() || '';
        productsListingName = productsListingName.replace(/\s+/g, ' ').trim();
      }
      console.log(`Products Listing - Product 14 name: "${productsListingName}"`);
    }

    // Step 3: Check name on product detail page (PDP)
    const pdpPage = await context.newPage();
    await pdpPage.goto('/products/cylinder-7cm-sun');
    await pdpPage.waitForLoadState('networkidle');

    // Get the product name from the PDP
    const pdpNameSelectors = [
      'h1',
      'h2',
      '[data-testid="product-name"]',
      '.product-title',
      '.product-name',
      '[class*="title"]',
      '[class*="name"]'
    ];

    for (const selector of pdpNameSelectors) {
      try {
        const element = pdpPage.locator(selector).first();
        if (await element.isVisible()) {
          productPageName = await element.textContent() || '';
          if (productPageName.trim()) {
            console.log(`PDP Page - Product 14 name: "${productPageName}"`);
            break;
          }
        }
      } catch (e) {
        // Continue to next selector
      }
    }

    // Step 4: Compare the names
    console.log('\n=== Product Name Comparison ===');
    console.log(`Admin Panel: "${adminPanelName}"`);
    console.log(`Products Listing: "${productsListingName}"`);
    console.log(`Product Detail Page: "${productPageName}"`);

    const allNamesMatch = (
      adminPanelName === productsListingName &&
      productsListingName === productPageName &&
      adminPanelName.length > 0
    );

    if (allNamesMatch) {
      console.log('✅ All product names are consistent across pages');
    } else {
      console.log('❌ Product names are inconsistent across pages');
      
      // Check which ones are different
      if (adminPanelName !== productsListingName) {
        console.log(`⚠️  Admin Panel vs Listing: "${adminPanelName}" vs "${productsListingName}"`);
      }
      
      if (productsListingName !== productPageName) {
        console.log(`⚠️  Listing vs PDP: "${productsListingName}" vs "${productPageName}"`);
      }
      
      if (adminPanelName !== productPageName) {
        console.log(`⚠️  Admin Panel vs PDP: "${adminPanelName}" vs "${productPageName}"`);
      }
    }

    // Step 5: Check data sources
    console.log('\n=== Data Source Analysis ===');
    
    // Check API response
    const apiResponse = await pdpPage.evaluate(async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        const product14 = data.products?.find((p: any) => p.id === "14" || p.id === 14);
        return product14 ? product14.name : 'Product not found';
      } catch (error) {
        return 'API Error: ' + error.message;
      }
    });
    
    console.log(`API Response - Product 14 name: "${apiResponse}"`);

    await listingPage.close();
    await pdpPage.close();

    // The test passes regardless - we just want to gather information
    expect(adminPanelName).toBeTruthy(); // At least admin panel should have a name
  });
});