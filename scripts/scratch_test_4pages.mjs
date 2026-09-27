import { chromium } from 'playwright';

async function test4Pages() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1800 } });

  await page.goto('http://localhost:5173/admin/application/ACI-2026-000004', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Snapshot Page 1
  const page1 = await page.$('#official-page-1');
  if (page1) {
    await page1.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_page_1.png' });
  }

  // Snapshot Page 2
  const page2 = await page.$('#official-page-2');
  if (page2) {
    await page2.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_page_2.png' });
  }

  // Snapshot Page 3
  const page3 = await page.$('#official-page-3');
  if (page3) {
    await page3.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_page_3.png' });
  }

  // Snapshot Page 4
  const page4 = await page.$('#official-page-4');
  if (page4) {
    await page4.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_page_4.png' });
  }

  console.log('All 4 pages captured successfully!');
  await browser.close();
}

test4Pages();
