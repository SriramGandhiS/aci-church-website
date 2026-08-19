import fs from 'fs';

const html = fs.readFileSync('backups/gallery_albums.html', 'utf8');
const blocks = html.split('<div class="one">');

console.log(`Total Albums Found: ${blocks.length - 1}`);

const albums = [];

blocks.slice(1).forEach((b, i) => {
  const imgMatch = b.match(/src="([^"]+)"/);
  const countMatch = b.match(/<div class="overlaytext">([^<]+)<\/div>/);
  const titleMatch = b.match(/<p><a[^>]*>([\s\S]*?)<\/a>/);

  const img = imgMatch ? imgMatch[1] : '';
  const count = countMatch ? countMatch[1].trim() : '';
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  albums.push({ id: i + 1, title, count, img });
});

fs.writeFileSync('src/data/galleryAlbums.json', JSON.stringify(albums, null, 2));
console.log('Saved to src/data/galleryAlbums.json!');
