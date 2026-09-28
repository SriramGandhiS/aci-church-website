import { chromium, devices } from 'playwright';

async function testAttestationFlow() {
  const browser = await chromium.launch({ headless: true });
  const pixel = devices['Pixel 7'];

  // 1. Test Mobile Attestation Page for District Overseer (Ref 1)
  const mobileContext = await browser.newContext({ ...pixel });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173/attest?appId=ACI-2026-000004&ref=ref1', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_attest_mobile.png', fullPage: true });
  console.log('Mobile attestation page captured!');

  // 2. Test Applicant Dashboard with WhatsApp Share Card
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const deskPage = await desktopContext.newPage();
  
  await deskPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await deskPage.evaluate(() => {
    const user = {
      email: 'pastor.david.paul@gmail.com',
      userId: 'USR-DAVID01',
      name: 'Pastor David Paul',
      role: 'APPLICANT',
      isAdmin: false
    };
    localStorage.setItem('aci_auth_session_v1', JSON.stringify(user));
    sessionStorage.setItem('aci_auth_session_v1', JSON.stringify(user));
  });

  await deskPage.goto('http://localhost:5173/get-involved/status', { waitUntil: 'networkidle' });
  await deskPage.waitForTimeout(800);
  await deskPage.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_applicant_whatsapp_share.png' });
  console.log('Applicant WhatsApp share screen captured!');

  // 3. Test Admin Application Detail with Referee Audit Card
  await deskPage.goto('http://localhost:5173/admin/application/ACI-2026-000004', { waitUntil: 'networkidle' });
  await deskPage.waitForTimeout(800);
  await deskPage.screenshot({ path: 'C:/Users/iamra/.gemini/antigravity/brain/641c8273-cda5-49c7-a994-2b325c1153be/screen_admin_attested_audit.png' });
  console.log('Admin Attested Audit card captured!');

  await browser.close();
}

testAttestationFlow();
