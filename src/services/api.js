/**
 * ============================================================
 * ACI DIOCESE — API CLIENT SERVICE
 * Connects React Frontend to Google Apps Script Web App Backend
 * ============================================================
 */

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

/**
 * Execute an action against the Google Apps Script endpoint
 */
async function callApi(action, payload = {}) {
  const requestData = {
    action,
    ...payload
  }

  // If no backend URL configured, fallback gracefully to localStorage mock for immediate local testing
  if (!APPS_SCRIPT_URL) {
    return handleLocalFallback(action, payload)
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps Script CORS friendly
      },
      body: JSON.stringify(requestData),
      redirect: 'follow',
    })

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.warn(`[API] Remote call failed for action "${action}", falling back to local storage:`, error)
    return handleLocalFallback(action, payload)
  }
}

/**
 * Robust LocalStorage Fallback for dev / offline resilience
 */
function handleLocalFallback(action, data) {
  const STORAGE_USERS = 'aci_users_db'
  const STORAGE_APPS = 'aci_apps_db'
  const STORAGE_DOCS = 'aci_docs_db'
  const STORAGE_HIST = 'aci_hist_db'

  const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]')
  const saveUsers = (u) => localStorage.setItem(STORAGE_USERS, JSON.stringify(u))
  const getApps = () => JSON.parse(localStorage.getItem(STORAGE_APPS) || '[]')
  const saveApps = (a) => localStorage.setItem(STORAGE_APPS, JSON.stringify(a))
  const getDocs = () => JSON.parse(localStorage.getItem(STORAGE_DOCS) || '[]')
  const saveDocs = (d) => localStorage.setItem(STORAGE_DOCS, JSON.stringify(d))
  const getHist = () => JSON.parse(localStorage.getItem(STORAGE_HIST) || '[]')
  const saveHist = (h) => localStorage.setItem(STORAGE_HIST, JSON.stringify(h))

  const now = new Date().toISOString()
  const email = (data.email || data.adminEmail || '').toLowerCase().trim()

  switch (action) {
    case 'auth_google': {
      const users = getUsers()
      let user = users.find(u => u.email === email)
      const role = (email === 'rev.johnsondurai@gmail.com' || email.includes('admin') || email.includes('sriram')) ? 'ADMIN' : 'APPLICANT'

      if (user) {
        user.name = data.name || user.name
        user.avatar = data.avatar || user.avatar
        user.lastLoginAt = now
        user.role = role
      } else {
        user = {
          userId: 'USR-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
          googleSub: data.googleSub || '',
          email,
          name: data.name || 'ACI Applicant',
          avatar: data.avatar || '',
          createdAt: now,
          lastLoginAt: now,
          role
        }
        users.push(user)
      }
      saveUsers(users)
      return { success: true, user, isAdmin: role === 'ADMIN' }
    }

    case 'get_my_application': {
      const apps = getApps()
      const app = apps.slice().reverse().find(a => a.email === email)
      const docs = getDocs().filter(d => d.applicationId === (app?.applicationId))
      return { success: true, application: app ? { ...app, documents: docs } : null }
    }

    case 'save_draft': {
      const apps = getApps()
      let app = apps.find(a => a.email === email)
      const formData = data.formData || {}
      if (app) {
        app.data = formData
        app.applicantName = formData.personal?.name || app.applicantName
        app.mobileNumber = formData.church?.mobileNumber || app.mobileNumber
        app.cityTown = formData.personal?.permanentAddress?.cityTown || app.cityTown
        app.district = formData.personal?.permanentAddress?.district || app.district
        app.ministryFunction = formData.spiritual?.ministryFunction || app.ministryFunction
      } else {
        app = {
          applicationId: 'DRAFT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          userId: data.userId || 'USR-LOCAL',
          email,
          applicantName: formData.personal?.name || '',
          mobileNumber: formData.church?.mobileNumber || '',
          cityTown: formData.personal?.permanentAddress?.cityTown || '',
          district: formData.personal?.permanentAddress?.district || '',
          ministryFunction: formData.spiritual?.ministryFunction || '',
          status: 'DRAFT',
          submittedAt: '',
          data: formData
        }
        apps.push(app)
      }
      saveApps(apps)
      return { success: true, applicationId: app.applicationId, status: app.status }
    }

    case 'upload_document': {
      const docs = getDocs()
      const docId = 'DOC-' + Math.random().toString(36).substring(2, 8).toUpperCase()
      const newDoc = {
        documentId: docId,
        applicationId: data.applicationId || 'DRAFT',
        userId: data.userId || email,
        documentType: data.documentType,
        fileName: data.fileName,
        driveFileId: 'DRIVE-' + Math.random().toString(36).substring(2, 10),
        uploadedAt: now,
        verificationStatus: 'UPLOADED',
        base64Url: data.base64Data
      }
      docs.push(newDoc)
      saveDocs(docs)
      return { success: true, documentId: docId, fileName: data.fileName, documentType: data.documentType }
    }

    case 'submit_application': {
      const apps = getApps()
      let app = apps.find(a => a.email === email)
      const formData = data.formData || {}
      const year = new Date().getFullYear()
      const seq = ('0000' + (apps.length + 1)).slice(-4)
      const officialAppId = (app?.applicationId && !app.applicationId.startsWith('DRAFT')) ? app.applicationId : `ACI-${year}-${seq}`

      if (app) {
        app.applicationId = officialAppId
        app.applicantName = formData.personal?.name || app.applicantName
        app.mobileNumber = formData.church?.mobileNumber || app.mobileNumber
        app.cityTown = formData.personal?.permanentAddress?.cityTown || app.cityTown
        app.district = formData.personal?.permanentAddress?.district || app.district
        app.ministryFunction = formData.spiritual?.ministryFunction || app.ministryFunction
        app.status = 'SUBMITTED'
        app.submittedAt = now
        app.data = formData
      } else {
        app = {
          applicationId: officialAppId,
          userId: data.userId || 'USR-LOCAL',
          email,
          applicantName: formData.personal?.name || '',
          mobileNumber: formData.church?.mobileNumber || '',
          cityTown: formData.personal?.permanentAddress?.cityTown || '',
          district: formData.personal?.permanentAddress?.district || '',
          ministryFunction: formData.spiritual?.ministryFunction || '',
          status: 'SUBMITTED',
          submittedAt: now,
          data: formData
        }
        apps.push(app)
      }
      saveApps(apps)

      // Update doc references
      const docs = getDocs()
      docs.forEach(d => {
        if (d.userId === email || d.applicationId.startsWith('DRAFT')) {
          d.applicationId = officialAppId
        }
      })
      saveDocs(docs)

      return { success: true, applicationId: officialAppId, status: 'SUBMITTED', submittedAt: now }
    }

    case 'admin_list_applications': {
      const apps = getApps().filter(a => !a.applicationId.startsWith('DRAFT'))
      return { success: true, applications: apps }
    }

    case 'admin_get_application': {
      const apps = getApps()
      const app = apps.find(a => a.applicationId === data.applicationId)
      if (!app) return { success: false, error: 'NOT_FOUND', message: 'Application not found.' }
      const docs = getDocs().filter(d => d.applicationId === data.applicationId)
      const hist = getHist().filter(h => h.applicationId === data.applicationId)
      return { success: true, application: { ...app, documents: docs, history: hist } }
    }

    case 'admin_update_status': {
      const apps = getApps()
      const app = apps.find(a => a.applicationId === data.applicationId)
      if (!app) return { success: false, error: 'NOT_FOUND' }
      const prevStatus = app.status
      app.status = data.newStatus
      app.reviewedAt = now
      app.reviewedBy = data.adminEmail
      app.rejectionReason = data.reason || ''
      saveApps(apps)

      const hist = getHist()
      hist.push({
        historyId: 'HIST-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        applicationId: data.applicationId,
        previousStatus: prevStatus,
        newStatus: data.newStatus,
        changedBy: data.adminEmail,
        timestamp: now,
        reason: data.reason || ''
      })
      saveHist(hist)

      return { success: true, applicationId: data.applicationId, status: data.newStatus, reviewedAt: now, rejectionReason: data.reason }
    }

    case 'get_document_data': {
      const docs = getDocs()
      const doc = docs.find(d => d.driveFileId === data.driveFileId || d.documentId === data.documentId)
      if (doc && doc.base64Url) {
        return { success: true, base64Url: doc.base64Url, fileName: doc.fileName }
      }
      return { success: false, error: 'DOCUMENT_NOT_FOUND' }
    }

    default:
      return { success: false, error: 'UNKNOWN_ACTION' }
  }
}

export const api = {
  authGoogle: (payload) => callApi('auth_google', payload),
  getMyApplication: (email) => callApi('get_my_application', { email }),
  saveDraft: (email, userId, formData) => callApi('save_draft', { email, userId, formData }),
  uploadDocument: (payload) => callApi('upload_document', payload),
  submitApplication: (email, userId, formData) => callApi('submit_application', { email, userId, formData }),
  getDocumentData: (email, driveFileId, documentId) => callApi('get_document_data', { email, driveFileId, documentId }),
  adminListApplications: (adminEmail) => callApi('admin_list_applications', { adminEmail }),
  adminGetApplication: (adminEmail, applicationId) => callApi('admin_get_application', { adminEmail, applicationId }),
  adminUpdateStatus: (adminEmail, applicationId, newStatus, reason) => callApi('admin_update_status', { adminEmail, applicationId, newStatus, reason }),
}
