import { chromium, devices } from 'playwright';

async function testMobile() {
  const browser = await chromium.launch({ headless: true });
  const pixel = devices['Pixel 7'];
  const context = await browser.newContext({ ...pixel });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  await page.evaluate(() => {
    const applicantUser = {
      email: 'pastor.david.paul@gmail.com',
      userId: 'USR-DAVID01',
      name: 'Pastor David Paul',
      role: 'APPLICANT',
      isAdmin: false
    };
    localStorage.setItem('aci_auth_session_v1', JSON.stringify(applicantUser));
    sessionStorage.setItem('aci_auth_session_v1', JSON.stringify(applicantUser));
  });

  await page.goto('http://localhost:5173/get-involved/application', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_mobile_app.png' });
  console.log('Mobile screenshot captured successfully!');
  await browser.close();
}

testMobile();
