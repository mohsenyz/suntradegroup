import { test, expect, Page } from '@playwright/test';

test.describe('Debug PDP Page for Product ID 14', () => {
  test('should debug what happens on the PDP page', async ({ page }) => {
    // Navigate directly to the PDP page for product 14
    await page.goto('/products/cylinder-7cm-sun');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    console.log('=== Page Title and Meta ===');
    const title = await page.title();
    console.log(`Page Title: "${title}"`);
    
    // Check all h1 elements on the page
    console.log('\n=== H1 Elements ===');
    const h1Elements = await page.locator('h1').all();
    for (let i = 0; i < h1Elements.length; i++) {
      const text = await h1Elements[i].textContent();
      console.log(`H1 ${i + 1}: "${text}"`);
    }
    
    // Check all h2 elements
    console.log('\n=== H2 Elements ===');
    const h2Elements = await page.locator('h2').all();
    for (let i = 0; i < h2Elements.length; i++) {
      const text = await h2Elements[i].textContent();
      console.log(`H2 ${i + 1}: "${text}"`);
    }
    
    // Check if ProductDetails component is present
    console.log('\n=== Product Details Component ===');
    const productDetailsContainer = page.locator('.container.mx-auto.px-4.py-8');
    const isPresent = await productDetailsContainer.isVisible();
    console.log(`Product Details Container Present: ${isPresent}`);
    
    // Check if there's an image slider
    const imageSlider = page.locator('.image-slider, [class*="slider"], .slick-slider');
    const sliderCount = await imageSlider.count();
    console.log(`Image Sliders Found: ${sliderCount}`);
    
    // Check what text content we can find
    console.log('\n=== All Text Content on Page ===');
    const allText = await page.locator('body').textContent();
    if (allText && allText.includes('سیلندر')) {
      console.log('✅ Product name appears somewhere on the page');
      // Find where it appears
      const elements = await page.locator(':has-text("سیلندر")').all();
      console.log(`Found in ${elements.length} elements`);
      for (let i = 0; i < Math.min(elements.length, 5); i++) {
        const text = await elements[i].textContent();
        const tagName = await elements[i].evaluate(el => el.tagName);
        console.log(`  ${tagName}: "${text?.substring(0, 100)}..."`);
      }
    } else {
      console.log('❌ Product name does not appear anywhere on the page');
    }
    
    // Check browser console errors
    console.log('\n=== Browser Console Messages ===');
    const messages: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warn') {
        messages.push(`${msg.type()}: ${msg.text()}`);
      }
    });
    
    // Trigger a page refresh to capture console messages
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    messages.forEach(msg => console.log(msg));
    
    // Try to evaluate what product data is actually loaded
    console.log('\n=== JavaScript Product Data ===');
    const productData = await page.evaluate(() => {
      // Check if there's any product data in the global scope
      if (typeof window !== 'undefined') {
        // @ts-ignore
        return {
          // @ts-ignore
          productInProps: window.__NEXT_DATA__?.props?.pageProps?.product || null,
          // @ts-ignore
          pathname: window.location.pathname,
          // @ts-ignore
          documentTitle: document.title
        };
      }
      return null;
    });
    
    console.log('Product Data:', JSON.stringify(productData, null, 2));
    
    // Check if the page shows a 404 or not found state
    const notFoundText = await page.locator('text=یافت نشد, text=404, text=not found').count();
    console.log(`\nNot Found indicators: ${notFoundText}`);
    
    expect(title).toBeTruthy(); // Basic assertion to pass the test
  });
});