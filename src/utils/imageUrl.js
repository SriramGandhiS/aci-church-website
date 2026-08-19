/* ============================================================
   IMAGE / MEDIA URL HELPER
   Transforms insecure http://acidiocese.org/ URLs into secure HTTPS CDN URLs
   via wsrv.nl (Cloudflare edge proxy with SSL termination & WebP optimization)
   This prevents Mixed Content blocking on HTTPS production hosts like Netlify.
   ============================================================ */

export function getMediaUrl(path) {
  if (!path) return '/placeholder.jpg'

  // Return local assets directly
  if (path.startsWith('/') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }

  // Strip leading http://acidiocese.org/ if present
  let cleanPath = path.replace(/^https?:\/\/acidiocese\.org\//i, '')
  cleanPath = cleanPath.replace(/^\/+/, '')

  // Encode each segment of path to preserve directory structure and handle spaces
  const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/')

  // Return secure HTTPS image URL
  return `https://wsrv.nl/?url=http://acidiocese.org/${encodedPath}`
}
