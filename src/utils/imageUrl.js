/* ============================================================
   IMAGE / MEDIA URL HELPER
   Transforms insecure http://acidiocese.org/ URLs into secure HTTPS CDN URLs
   via wsrv.nl (Cloudflare edge proxy with SSL termination & WebP optimization)
   This prevents Mixed Content blocking on HTTPS production hosts like Netlify.
   ============================================================ */

export function getMediaUrl(path, options = {}) {
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

  // High-resolution parameters for wsrv.nl CDN edge proxy
  const { width = 1600, quality = 95, format = 'webp' } = options
  const params = []
  if (width) params.push(`w=${width}`)
  if (quality) params.push(`q=${quality}`)
  if (format) params.push(`output=${format}`)

  const queryString = params.length > 0 ? `&${params.join('&')}` : ''

  // Return secure HTTPS high-resolution image URL
  return `https://wsrv.nl/?url=http://acidiocese.org/${encodedPath}${queryString}`
}
