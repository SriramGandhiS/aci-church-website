import fs from 'fs';

// Scrape ALL albums with their uniq IDs from every category
const categories = [
  'Ordination', 'Word Sharing Meet', 'Zonal Meet', 'Church Visit',
  'Children Ministry', 'Youth Ministry', 'Outreach',
  "Members' Ministry Support", 'DOS Appointment', 'Graduation',
  'Synod', 'Others', 'Others1', 'Others2', 'Others3'
];

async function scrapeAllAlbumsWithUniq() {
  const allAlbums = [];
  const seen = new Set();

  for (const cat of categories) {
    try {
      const res = await fetch('http://acidiocese.org/get_page.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `cat=${encodeURIComponent(cat)}`
      });
      const html = await res.text();

      // Match each album block
      const blockRegex = /<a href="gallery_indi\.php\?uniq=([^"]+)"[^>]*>[\s\S]*?<img class="image" src="([^"]+)"[\s\S]*?<div class="overlaytext">([^<]+)<\/div>[\s\S]*?<p><a[^>]*>([\s\S]*?)<\/a>/g;
      let match;
      while ((match = blockRegex.exec(html)) !== null) {
        const uniq = match[1].trim();
        if (seen.has(uniq)) continue;
        seen.add(uniq);
        
        const img = match[2].trim();
        const count = match[3].trim();
        const title = match[4].replace(/<[^>]+>/g, '').trim();
        
        allAlbums.push({ uniq, category: cat, title, count, thumb: img });
      }
      console.log(`Category "${cat}": done`);
    } catch(e) {
      console.error(`Error on ${cat}:`, e.message);
    }
  }

  fs.writeFileSync('src/data/allGalleryAlbums.json', JSON.stringify(allAlbums, null, 2));
  console.log(`\nTotal albums scraped: ${allAlbums.length}`);
  console.log('Saved to src/data/allGalleryAlbums.json');
  return allAlbums;
}

async function scrapeAlbumPhotos(uniq) {
  try {
    const res = await fetch(`http://acidiocese.org/gallery_indi.php?uniq=${uniq}`);
    const html = await res.text();
    
    // Extract all photo image sources
    const photos = [];
    const imgRegex = /src="(gallery\/[^"]+\.(jpg|JPG|jpeg|png|gif))"/g;
    let m;
    const seen = new Set();
    while ((m = imgRegex.exec(html)) !== null) {
      const src = m[1];
      if (!seen.has(src)) {
        seen.add(src);
        photos.push(src);
      }
    }
    return photos;
  } catch(e) {
    return [];
  }
}

async function main() {
  console.log('Step 1: Scraping all albums with uniq IDs...');
  const albums = await scrapeAllAlbumsWithUniq();
  
  console.log('\nStep 2: Scraping individual photos for each album...');
  const albumsWithPhotos = [];
  
  for (const album of albums) {
    const photos = await scrapeAlbumPhotos(album.uniq);
    albumsWithPhotos.push({ ...album, photos });
    console.log(`  "${album.title}": ${photos.length} photos`);
  }
  
  fs.writeFileSync('src/data/allGalleryAlbumsWithPhotos.json', JSON.stringify(albumsWithPhotos, null, 2));
  console.log(`\nDone! Saved ${albumsWithPhotos.length} albums with all their individual photos.`);
}

main();
