import http from 'http';
import fs from 'fs';

function fetchIndi(uniq) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://acidiocese.org/gallery_indi.php?uniq=${uniq}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'http://acidiocese.org/gallery.php'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
  });
}

function parseIndiPhotos(html) {
  const photos = [];
  // Look for <img> tags or href tags pointing to gallery/
  const matches = html.matchAll(/src=["'](gallery\/[^"']+)["']/g);
  for (const m of matches) {
    if (!photos.includes(m[1]) && !m[1].includes('bx_loader')) {
      photos.push(m[1]);
    }
  }
  const hrefMatches = html.matchAll(/href=["'](gallery\/[^"']+)["']/g);
  for (const m of hrefMatches) {
    if (!photos.includes(m[1])) {
      photos.push(m[1]);
    }
  }
  return photos;
}

async function run() {
  const scraped = JSON.parse(fs.readFileSync('src/data/scraped_gallery.json', 'utf8'));
  const current = JSON.parse(fs.readFileSync('src/data/allGalleryAlbumsWithPhotos.json', 'utf8'));

  const fullAlbumMap = new Map();
  // Index existing
  for (const a of current) {
    fullAlbumMap.set(a.uniq, a);
  }

  // Iterate all scraped categories and albums
  for (const [cat, albums] of Object.entries(scraped)) {
    console.log(`Processing ${cat} (${albums.length} albums)...`);
    for (const album of albums) {
      if (!fullAlbumMap.has(album.uniq) || fullAlbumMap.get(album.uniq).photos.length === 0) {
        console.log(`Fetching photos for missing album: [${album.title}] (${album.uniq})...`);
        try {
          const html = await fetchIndi(album.uniq);
          const photos = parseIndiPhotos(html);
          const fullAlbum = {
            uniq: album.uniq,
            category: cat,
            title: album.title,
            count: album.photoCount || `${photos.length} photos`,
            thumb: album.imgSrc,
            photos: photos.length > 0 ? photos : [album.imgSrc]
          };
          fullAlbumMap.set(album.uniq, fullAlbum);
          console.log(` -> Found ${photos.length} photos`);
        } catch (err) {
          console.error(`Error fetching album ${album.uniq}:`, err.message);
        }
      }
    }
  }

  const updatedList = Array.from(fullAlbumMap.values());
  console.log(`Total albums after update: ${updatedList.length}`);
  fs.writeFileSync('src/data/allGalleryAlbumsWithPhotos.json', JSON.stringify(updatedList, null, 2), 'utf8');
  console.log('Successfully updated src/data/allGalleryAlbumsWithPhotos.json');
}

run();
