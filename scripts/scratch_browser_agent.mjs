import { chromium } from 'playwright';

async function runBrowserAgent() {
  console.log('Launching Agentic Chromium Browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. Visit Home
  console.log('Visiting Home Page...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_home.png' });

  // 2. Visit Application Page
  console.log('Visiting Application Page...');
  await page.goto('http://localhost:5173/get-involved/application', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_application.png' });

  // 3. Visit Admin Applications
  console.log('Visiting Admin Applications Dashboard...');
  await page.evaluate(() => {
    const adminUser = {
      email: 'iamramm8@gmail.com',
      userId: 'USR-TB6KLRH',
      googleSub: '1036279866231',
      name: 'S. JOHN SAMUEL',
      role: 'ADMIN',
      isAdmin: true,
      lastApplicationId: 'ACI-2026-000001'
    };
    localStorage.setItem('aci_auth_session', JSON.stringify(adminUser));
    sessionStorage.setItem('aci_auth_session', JSON.stringify(adminUser));
  });

  await page.goto('http://localhost:5173/admin/applications', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_admin_dashboard.png' });

  // 4. Visit Status Tracking
  console.log('Visiting Status Tracker...');
  await page.goto('http://localhost:5173/get-involved/status', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_status_tracker.png' });

  console.log('Agentic browser finished all screenshot captures!');
  await browser.close();
}

runBrowserAgent();
