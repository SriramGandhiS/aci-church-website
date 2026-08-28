/**
 * Safe Base64URL JWT Payload Decoder & Validator for Google Identity Services
 */
export function decodeGoogleJwt(token, expectedClientId) {
  try {
    if (!token || typeof token !== 'string') return null
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const payload = JSON.parse(jsonPayload)

    // 1. Verify Issuer
    const validIssuers = ['https://accounts.google.com', 'accounts.google.com']
    if (!validIssuers.includes(payload.iss)) {
      console.warn('[JWT] Invalid Google token issuer:', payload.iss)
      return null
    }

    // 2. Verify Expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      console.warn('[JWT] Google token has expired.')
      return null
    }

    // 3. Verify Audience if configured
    if (expectedClientId && payload.aud && payload.aud !== expectedClientId) {
      console.warn('[JWT] Audience mismatch.')
      return null
    }

    // 4. Verify Email Status
    if (!payload.email || payload.email_verified !== true) {
      console.warn('[JWT] Email is missing or not verified by Google.')
      return null
    }

    return payload
  } catch (error) {
    console.error('Failed to decode/validate Google JWT token:', error)
    return null
  }
}
