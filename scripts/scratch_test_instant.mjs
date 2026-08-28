import { chromium } from 'playwright';

async function testInstant() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  await page.goto('http://localhost:5173/admin/application/ACI-2026-000003', { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_stephen_instant.png' });
  console.log('Instant render captured!');
  await browser.close();
}

testInstant();
