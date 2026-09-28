import http from 'http';
import fs from 'fs';
import path from 'path';

function postData(endpoint, dataStr) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://acidiocese.org/${endpoint}`, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'http://acidiocese.org/gallery.php',
        'Origin': 'http://acidiocese.org',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Content-Length': Buffer.byteLength(dataStr)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(dataStr);
    req.end();
  });
}

function parseItems(html) {
  const items = [];
  const oneBlocks = html.split('<div class="one">');
  for (let i = 1; i < oneBlocks.length; i++) {
    const block = oneBlocks[i];
    const uniqMatch = block.match(/uniq=([^"&]+)/);
    const srcMatch = block.match(/src="([^"]+)"/);
    const overlayMatch = block.match(/<div class="overlaytext">([^<]*)<\/div>/);
    const titleMatch = block.match(/<p><a [^>]*>([^<]+)<\/a>/);

    if (srcMatch) {
      items.push({
        uniq: uniqMatch ? uniqMatch[1] : '',
        imgSrc: srcMatch ? srcMatch[1] : '',
        photoCount: overlayMatch ? overlayMatch[1].trim() : '',
        title: titleMatch ? titleMatch[1].trim() : ''
      });
    }
  }
  return items;
}

const CATEGORIES = [
  'Ordination',
  'Word Sharing Meet',
  'Zonal Meet',
  'Church Visit',
  'Children Ministry',
  'Youth Ministry',
  'Outreach',
  'Members’ Ministry Support',
  'DOS Appointment',
  'Graduation',
  'Synod',
  'Others',
  'Others1',
  'Others2',
  'Others3'
];

async function scrapeCategory(cat) {
  const allItems = [];
  const html1 = await postData('get_page.php', `cat=${encodeURIComponent(cat)}`);
  const items1 = parseItems(html1);
  allItems.push(...items1);

  const pageOffsets = [];
  const pageMatch = html1.matchAll(/page\s*:\s*'(\d+)'/g);
  for (const m of pageMatch) {
    if (!pageOffsets.includes(m[1]) && m[1] !== '0') {
      pageOffsets.push(m[1]);
    }
  }

  for (const offset of pageOffsets) {
    const htmlPage = await postData('getData.php', `page=${offset}&cat=${encodeURIComponent(cat)}`);
    const pageItems = parseItems(htmlPage);
    for (const item of pageItems) {
      if (!allItems.some(x => x.imgSrc === item.imgSrc && x.title === item.title)) {
        allItems.push(item);
      }
    }
  }

  return allItems;
}

async function run() {
  const result = {};
  for (const cat of CATEGORIES) {
    console.log(`Scraping ${cat}...`);
    try {
      const items = await scrapeCategory(cat);
      result[cat] = items;
      console.log(` -> ${items.length} items`);
    } catch (e) {
      console.error(`Error scraping ${cat}:`, e.message);
    }
  }

  fs.mkdirSync('src/data', { recursive: true });
  fs.writeFileSync('src/data/scraped_gallery.json', JSON.stringify(result, null, 2), 'utf8');
  console.log('Saved to src/data/scraped_gallery.json');
}

run();
