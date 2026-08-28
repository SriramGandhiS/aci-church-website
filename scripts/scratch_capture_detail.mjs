import { chromium } from 'playwright';

async function captureDetail() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  await page.evaluate(() => {
    const adminUser = {
      email: 'iamramm8@gmail.com',
      userId: 'USR-TB6KLRH',
      name: 'S. JOHN SAMUEL',
      role: 'ADMIN',
      isAdmin: true
    };
    localStorage.setItem('aci_auth_session', JSON.stringify(adminUser));
    sessionStorage.setItem('aci_auth_session', JSON.stringify(adminUser));
  });

  await page.goto('http://localhost:5173/admin/application/ACI-2026-000004', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_detail_perfect.png' });
  console.log('Detail screenshot captured successfully!');
  await browser.close();
}

captureDetail();
