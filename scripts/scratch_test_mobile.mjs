import { chromium, devices } from 'playwright';

async function testMobileMenu() {
  const browser = await chromium.launch({ headless: true });
  const pixel = devices['Pixel 7'];
  const context = await browser.newContext({ ...pixel });
  const page = await context.newPage();

  // 1. Capture mobile header with Hamburger Menu visible
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_mobile_header_fixed.png' });

  // 2. Click Hamburger to open Mobile Drawer
  const hamburger = await page.$('.hamburger');
  if (hamburger) {
    await hamburger.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_mobile_drawer_open.png' });
    console.log('Mobile menu drawer opened & captured successfully!');
  } else {
    console.error('Hamburger not found!');
  }

  await browser.close();
}

testMobileMenu();
