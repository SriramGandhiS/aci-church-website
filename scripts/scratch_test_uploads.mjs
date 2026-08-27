import { chromium } from 'playwright';

async function testUploads() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1600 } });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  await page.evaluate(() => {
    const applicantUser = {
      email: 'new.applicant@gmail.com',
      userId: 'USR-NEW001',
      name: 'Rev. Emmanuel Raj',
      role: 'APPLICANT',
      isAdmin: false
    };
    localStorage.setItem('aci_auth_session_v1', JSON.stringify(applicantUser));
    sessionStorage.setItem('aci_auth_session_v1', JSON.stringify(applicantUser));
  });

  await page.goto('http://localhost:5173/get-involved/application', { waitUntil: 'networkidle' });

  // Fill Step 1 required name & DOB and click Continue
  await page.fill('#fullName', 'REV. EMMANUEL RAJ');
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(500);

  // Step 2 Continue
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(500);

  // Step 3 Fill church name & continue
  await page.fill('#churchName', 'Emmanuel Apostolic Mission');
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(500);

  // Now on Step 4! Scroll down to Section IX
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_step4_uploads_real.png', fullPage: true });
  console.log('Step 4 upload fields captured!');
  await browser.close();
}

testUploads();
