import { chromium } from 'playwright';

const ROUTES = [
  '/',
  '/about',
  '/diocese',
  '/activities',
  '/partnership',
  '/synod',
  '/directory',
  '/get-involved',
  '/get-involved/application',
  '/get-involved/status',
  '/admin/applications',
  '/admin/application/ACI-2026-000004',
  '/media',
  '/gallery',
  '/contact'
];

async function runAudit() {
  console.log('🚀 Starting Comprehensive System Bug Audit...\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Set local test authentication session
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    const adminUser = {
      email: 'iamramm8@gmail.com',
      userId: 'USR-TB6KLRH',
      name: 'S. John Samuel',
      role: 'ADMIN',
      isAdmin: true
    };
    localStorage.setItem('aci_auth_session_v1', JSON.stringify(adminUser));
    sessionStorage.setItem('aci_auth_session_v1', JSON.stringify(adminUser));
  });

  const errors = [];
  const brokenImages = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Filter out non-fatal expected warnings
      if (!text.includes('favicon.ico')) {
        errors.push(`[Console Error] ${text}`);
      }
    }
  });

  page.on('pageerror', exception => {
    errors.push(`[Uncaught Exception] ${exception.message}`);
  });

  page.on('response', response => {
    if (response.status() === 404) {
      const url = response.url();
      if (url.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i)) {
        brokenImages.push(url);
      }
    }
  });

  for (const route of ROUTES) {
    const url = `http://localhost:5173${route}`;
    process.stdout.write(`Testing ${route}... `);
    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(500);

      const status = res?.status();
      if (status && status >= 400) {
        errors.push(`[HTTP ${status}] Failed to load route: ${route}`);
        console.log(`❌ HTTP ${status}`);
      } else {
        console.log(`✅ OK (${status})`);
      }
    } catch (e) {
      errors.push(`[Navigation Timeout/Error] ${route}: ${e.message}`);
      console.log(`❌ Failed: ${e.message}`);
    }
  }

  // Mobile viewport overflow check
  console.log('\n📱 Testing Mobile Viewport Horizontal Scroll & Overflow on Pixel 7...');
  await page.setViewportSize({ width: 393, height: 851 });
  for (const route of ['/', '/diocese', '/synod', '/get-involved/application']) {
    await page.goto(`http://localhost:5173${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    if (scrollWidth > clientWidth) {
      console.log(`⚠️ Overflow detected on ${route}: scrollWidth (${scrollWidth}px) > clientWidth (${clientWidth}px)`);
      errors.push(`[Mobile Overflow] ${route} has horizontal overflow (${scrollWidth}px vs ${clientWidth}px)`);
    } else {
      console.log(`✅ ${route}: Clean mobile fit (Width: ${clientWidth}px)`);
    }
  }

  console.log('\n========================================');
  console.log('📊 AUDIT SUMMARY:');
  console.log(`Total Routes Tested: ${ROUTES.length}`);
  console.log(`Console / Page Errors: ${errors.length}`);
  console.log(`Broken Images (404s): ${brokenImages.length}`);
  console.log('========================================\n');

  if (errors.length > 0) {
    console.log('🚨 Errors Found:');
    errors.forEach(e => console.log('  -', e));
  } else {
    console.log('✨ ZERO Fatal Code Errors or Exceptions across all routes!');
  }

  if (brokenImages.length > 0) {
    console.log('🚨 Broken Images:');
    brokenImages.forEach(img => console.log('  -', img));
  } else {
    console.log('✨ ZERO Broken Images found!');
  }

  await browser.close();
}

runAudit();
