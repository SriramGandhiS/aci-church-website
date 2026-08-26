/**
 * Reliable India Post Pincode Lookup Utility
 * Returns all matching post offices / localities under a 6-digit PIN code.
 */

export async function lookupPincode(pincode) {
  if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
    return { status: 'invalid', message: 'Enter a valid 6-digit PIN code', results: [] }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      return { status: 'error', message: 'PIN service unavailable. Please enter address manually.', results: [] }
    }

    const data = await response.json()
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { status: 'not_found', message: 'PIN could not be verified. You can enter the address manually.', results: [] }
    }

    const record = data[0]
    if (record.Status !== 'Success' || !Array.isArray(record.PostOffice) || record.PostOffice.length === 0) {
      return { status: 'not_found', message: 'PIN not found. You can enter the address manually.', results: [] }
    }

    // Map all available post office records
    const results = record.PostOffice.map((po) => ({
      name: po.Name || '',
      branchType: po.BranchType || '',
      deliveryStatus: po.DeliveryStatus || '',
      district: po.District || '',
      state: po.State || '',
      taluk: po.Block || po.Taluk || po.District || '',
      cityTown: po.Name || po.District || '',
      country: 'India',
    }))

    return {
      status: 'success',
      message: results.length === 1 ? 'PIN verified' : `${results.length} localities found for PIN ${pincode}`,
      results,
    }
  } catch (err) {
    clearTimeout(timeoutId)
    return { status: 'error', message: 'PIN could not be verified. You can enter the address manually.', results: [] }
  }
}
