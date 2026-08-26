/**
 * Postal Pincode Lookup Utility for India
 * Uses Postal Pincode API with timeout and graceful fallback.
 */

export async function lookupPincode(pincode) {
  if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
    return null
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 4000)

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!response.ok) return null

    const data = await response.json()
    if (!data || !Array.isArray(data) || data.length === 0) return null

    const record = data[0]
    if (record.Status !== 'Success' || !Array.isArray(record.PostOffice) || record.PostOffice.length === 0) {
      return null
    }

    const po = record.PostOffice[0]
    return {
      district: po.District || '',
      state: po.State || '',
      taluk: po.Block || po.Taluk || po.District || '',
      cityTown: po.Name || po.District || '',
      country: 'India',
    }
  } catch (err) {
    clearTimeout(timeoutId)
    // Gracefully fail silently so manual entry is uninterrupted
    return null
  }
}
