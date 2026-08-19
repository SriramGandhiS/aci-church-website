import fs from 'fs';

const categories = [
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

async function scrapeAll() {
  const allAlbums = [];
  let counter = 1;

  for (const cat of categories) {
    try {
      const res = await fetch('http://acidiocese.org/get_page.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `cat=${encodeURIComponent(cat)}`
      });
      const html = await res.text();
      const blocks = html.split('<div class="one">');

      blocks.slice(1).forEach((b) => {
        const imgMatch = b.match(/src="([^"]+)"/);
        const countMatch = b.match(/<div class="overlaytext">([^<]+)<\/div>/);
        const titleMatch = b.match(/<p><a[^>]*>([\s\S]*?)<\/a>/);

        const img = imgMatch ? imgMatch[1] : '';
        const count = countMatch ? countMatch[1].trim() : '';
        const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

        if (title && !allAlbums.some(a => a.title === title)) {
          allAlbums.push({ id: counter++, category: cat, title, count, img });
        }
      });
    } catch (e) {
      console.error(`Error scraping category ${cat}:`, e.message);
    }
  }

  fs.writeFileSync('src/data/allGalleryAlbums.json', JSON.stringify(allAlbums, null, 2));
  console.log(`Successfully scraped ${allAlbums.length} total photo albums across all categories!`);
}

scrapeAll();
