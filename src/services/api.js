import DIOCESE_MEMBERS_ROSTER from '../data/diocese_members_roster.json'
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
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps Script CORS friendly
      },
      body: JSON.stringify(requestData),
      redirect: 'follow',
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`)
    }

    const data = await response.json()
    if (!data.success && (
      data.error === 'INVALID_ACTION' ||
      data.error === 'UNKNOWN_ACTION' ||
      (typeof data.message === 'string' && data.message.toLowerCase().includes('not supported')) ||
      (typeof data.error === 'string' && data.error.toLowerCase().includes('not supported'))
    )) {
      console.warn(`[API] Remote endpoint does not support action "${action}", using local fallback:`, data)
      return handleLocalFallback(action, payload)
    }
    return data
  } catch (error) {
    console.warn(`[API] Remote call failed for action "${action}", falling back to local storage:`, error)
    return handleLocalFallback(action, payload)
  }
}

const ADMIN_EMAILS_LIST = [
  'iamramm8@gmail.com',
  'rev.johnsondurai@gmail.com',
  'admin@acidiocese.org',
  'sriramgandhis@gmail.com'
]

export const isEmailAdmin = (em) => {
  if (!em) return false
  const e = em.toLowerCase().trim()
  return ADMIN_EMAILS_LIST.includes(e) || e.includes('admin') || e.includes('iamramm8') || e.includes('sriram')
}

const SEED_APPS = DIOCESE_MEMBERS_ROSTER

const SEED_COORDINATORS = [
  {
    id: 'COORD-01',
    name: 'Rev. M. Jedidiah Durairaj',
    regNo: 'TN 0630',
    role: 'Sattur Taluk Coordinator',
    district: 'Virudhunagar Diocese',
    taluk: 'Sattur',
    church: 'Tamil Baptist Church, Sattur',
    email: 'jedidiah.durairaj@gmail.com',
    phone: '9994411422',
    assignedChurches: 8,
    activeMembers: 32,
    status: 'ACTIVE'
  },
  {
    id: 'COORD-02',
    name: 'Rev. S. James',
    regNo: 'TN 0637',
    role: 'Virudhunagar Coordinator',
    district: 'Virudhunagar Diocese',
    taluk: 'Virudhunagar',
    church: 'Divine Love Church, Virudhunagar',
    email: 'heavenjjames1986@gmail.com',
    phone: '9629437495',
    assignedChurches: 12,
    activeMembers: 48,
    status: 'ACTIVE'
  },
  {
    id: 'COORD-03',
    name: 'Rev. V. Joshua Selva Kumar',
    regNo: 'TN 0262',
    role: 'Sivakasi Coordinator',
    district: 'Virudhunagar Diocese',
    taluk: 'Sivakasi',
    church: 'El-Bethel Prayer House, Sivakasi',
    email: 'selvagbc@gmail.com',
    phone: '8144603057',
    assignedChurches: 9,
    activeMembers: 37,
    status: 'ACTIVE'
  }
]

const SEED_CHURCHES = [
  {
    id: 'CHU-01',
    name: 'Tamil Baptist Church',
    location: 'Sattur Road, Sattur',
    district: 'Virudhunagar Diocese',
    taluk: 'Sattur',
    pastor: 'Rev. M. Jedidiah Durairaj',
    coordinator: 'Rev. M. Jedidiah Durairaj',
    phone: '9994411422',
    email: 'jedidiah.durairaj@gmail.com',
    memberCount: 140,
    regNo: 'TN 0630',
    status: 'ACTIVE'
  },
  {
    id: 'CHU-02',
    name: 'Divine Love Church',
    location: 'Bazaar Street, Virudhunagar',
    district: 'Virudhunagar Diocese',
    taluk: 'Virudhunagar',
    pastor: 'Rev. S. James',
    coordinator: 'Rev. S. James',
    phone: '9629437495',
    email: 'heavenjjames1986@gmail.com',
    memberCount: 210,
    regNo: 'TN 0637',
    status: 'ACTIVE'
  },
  {
    id: 'CHU-03',
    name: 'El-Bethel Prayer House',
    location: 'Vilampatti Road, Sivakasi',
    district: 'Virudhunagar Diocese',
    taluk: 'Sivakasi',
    pastor: 'Rev. V. Joshua Selva Kumar',
    coordinator: 'Rev. V. Joshua Selva Kumar',
    phone: '8144603057',
    email: 'selvagbc@gmail.com',
    memberCount: 165,
    regNo: 'TN 0262',
    status: 'ACTIVE'
  },
  {
    id: 'CHU-04',
    name: 'Good Shepherd Revival Churches',
    location: 'Paravai & Vilangudi, Madurai',
    district: 'Madurai Diocese',
    taluk: 'Madurai North',
    pastor: 'Rev. Dr. Helen Daniel',
    coordinator: 'Central Secretariat',
    phone: '9842155021',
    email: 'helen.daniel@goodshepherd.org',
    memberCount: 380,
    regNo: 'ACI-MDU-001',
    status: 'ACTIVE'
  },
  {
    id: 'CHU-05',
    name: 'Living Redeemer Apostolic Church',
    location: 'Mission Compound Road, Dindigul',
    district: 'Dindigul Diocese',
    taluk: 'Dindigul',
    pastor: 'Rt. Rev. S. Johnson Durai',
    coordinator: 'Central Secretariat',
    phone: '9486485810',
    email: 'rev.johnsondurai@gmail.com',
    memberCount: 520,
    regNo: 'TR/ACT/2012/554',
    status: 'ACTIVE'
  }
]

const SEED_ACTIVITIES = [
  {
    id: 'ACT-01',
    title: 'Episcopal Ordination & Licensing',
    category: 'Ordination',
    description: 'Ordaining dedicated ministers who have served actively in God vineyard for at least 5 years upon confirmation of calling.',
    date: 'Twice Annually',
    location: 'Central Diocesan Office, Hanumantharayankottai',
    organizer: 'Synod Board of Trustees',
    status: 'PUBLISHED'
  },
  {
    id: 'ACT-02',
    title: 'Word Sharing & Theological Growth Meet',
    category: 'Word Sharing',
    description: 'Regular gathering of ministers to study the deep scriptures and strengthen spiritual leadership.',
    date: 'Monthly',
    location: 'Diocesan Conference Center',
    organizer: 'Theological Education Committee',
    status: 'PUBLISHED'
  },
  {
    id: 'ACT-03',
    title: 'Zonal Ministers Fellowship & Praise Gathering',
    category: 'Zonal Meet',
    description: 'Fellowship gathering of existing and prospective members at zonal levels with praise, worship and diocesan reports.',
    date: 'Quarterly',
    location: 'Regional Zonal Centers',
    organizer: 'Zonal Coordinators',
    status: 'PUBLISHED'
  },
  {
    id: 'ACT-04',
    title: 'Pastoral Church Visitation & Mentorship',
    category: 'Church Visit',
    description: 'Trustees accompanied by Diocesan Overseers visit member churches to equip, advise and pray.',
    date: 'Ongoing',
    location: 'Local Affiliated Parishes',
    organizer: 'Diocesan Council',
    status: 'PUBLISHED'
  },
  {
    id: 'ACT-05',
    title: 'Children & Sunday School Teachers Training (VBS)',
    category: 'Children Ministry',
    description: 'Training Sunday school teachers, children club leaders, and VBS directors with biblical curricula.',
    date: 'Summer Season',
    location: 'Diocesan Youth Center',
    organizer: 'Children Ministry Department',
    status: 'PUBLISHED'
  },
  {
    id: 'ACT-06',
    title: 'Youth Leadership & Evangelism Skills Camp',
    category: 'Youth Ministry',
    description: 'Empowering next-generation youth leaders in discipleship, evangelism, and character building.',
    date: 'Bi-Monthly',
    location: 'Central Diocesan Auditorium',
    organizer: 'Diocesan Youth Fellowship',
    status: 'PUBLISHED'
  }
]

const SEED_EVENTS = [
  {
    id: 'EVT-01',
    name: 'Annual Synod Assembly & Consecration 2026',
    description: 'General Assembly of all Synod Trustees, Clergy, Pastors and Delegates of Apostolic Council of India Diocese.',
    date: '2026-11-20',
    startTime: '09:30 AM',
    endTime: '04:30 PM',
    location: 'Diocesan Cathedral, Hanumantharayankottai, Dindigul',
    organizer: 'Synod Secretariat',
    registrationRequired: true,
    registrationLimit: 500,
    status: 'PUBLISHED'
  },
  {
    id: 'EVT-02',
    name: 'Southern Regional Pastors Prayer Summit',
    description: 'Intercessory prayer and spiritual leadership retreat for affiliated pastors from Virudhunagar, Madurai & Tirunelveli.',
    date: '2026-10-25',
    startTime: '10:00 AM',
    endTime: '03:00 PM',
    location: 'Tamil Baptist Church Campus, Sattur',
    organizer: 'Virudhunagar Zonal Office',
    registrationRequired: true,
    registrationLimit: 150,
    status: 'PUBLISHED'
  },
  {
    id: 'EVT-03',
    name: 'Winter Ordination Service & Licensing',
    description: 'Official diocesan ordination ceremony for confirmed candidates and issuing of national credentials.',
    date: '2026-12-15',
    startTime: '10:30 AM',
    endTime: '01:30 PM',
    location: 'Central Diocesan Chapel',
    organizer: 'Board of Trustees',
    registrationRequired: false,
    registrationLimit: 200,
    status: 'DRAFT'
  }
]

const SEED_GALLERY = [
  {
    id: 'GAL-01',
    title: 'Episcopal Ordination Service 2026',
    category: 'Worship',
    description: 'Consecration and licensing ceremony of senior episcopal ministers at Central Diocese.',
    date: '2026-02-10',
    imageUrl: '/archbishop_new.jpg',
    status: 'PUBLISHED'
  },
  {
    id: 'GAL-02',
    title: 'Virudhunagar Zonal Pastors Fellowship',
    category: 'Pastors',
    description: 'Gathering of taluk pastors and coordinators at Sattur fellowship hall.',
    date: '2026-01-20',
    imageUrl: '/archbishop_new.jpg',
    status: 'PUBLISHED'
  },
  {
    id: 'GAL-03',
    title: 'Children Ministry VBS Teachers Workshop',
    category: 'Youth',
    description: 'Training 60+ Sunday School and VBS teachers across southern districts.',
    date: '2026-03-05',
    imageUrl: '/archbishop_new.jpg',
    status: 'PUBLISHED'
  }
]

const SEED_ANNOUNCEMENTS = [
  {
    id: 'ANN-01',
    title: 'Notice: Annual Diocesan Affiliation Renewals 2026-2027',
    content: 'All affiliated churches and credentialed ministers are requested to verify their subscription status and complete annual renewals through their respective zonal coordinators.',
    author: 'Synod Secretariat',
    publishDate: '2026-09-01',
    status: 'PUBLISHED'
  },
  {
    id: 'ANN-02',
    title: 'Call for Ordination Applications — Winter 2026 Batch',
    content: 'Applications are now open for candidates fulfilling the 5-year ministerial calling for the upcoming winter ordination service.',
    author: 'Board of Trustees',
    publishDate: '2026-09-15',
    status: 'PUBLISHED'
  }
]

const SEED_AUDIT_LOGS = [
  {
    id: 'LOG-01',
    adminEmail: 'iamramm8@gmail.com',
    action: 'APPROVED_APPLICATION',
    targetRecord: 'TN 0630 (Rev. M. Jedidiah Durairaj)',
    details: 'Application verified and approved. Affiliation valid through Jan 2027.',
    timestamp: '2026-01-11T10:00:00.000Z'
  },
  {
    id: 'LOG-02',
    adminEmail: 'iamramm8@gmail.com',
    action: 'APPROVED_APPLICATION',
    targetRecord: 'TN 0637 (Rev. S. James)',
    details: 'Application approved with Virudhunagar coordinator credentials.',
    timestamp: '2026-01-16T12:00:00.000Z'
  },
  {
    id: 'LOG-03',
    adminEmail: 'iamramm8@gmail.com',
    action: 'APPROVED_APPLICATION',
    targetRecord: 'TN 0262 (Rev. V. Joshua Selva Kumar)',
    details: 'Application approved for Sivakasi coordinator desk.',
    timestamp: '2026-02-02T11:30:00.000Z'
  },
  {
    id: 'LOG-04',
    adminEmail: 'iamramm8@gmail.com',
    action: 'RENEWED_SUBSCRIPTION',
    targetRecord: 'TN 0630',
    details: 'Extended active affiliation subscription for +1 Year.',
    timestamp: '2026-10-02T15:30:00.000Z'
  }
]

const DEFAULT_SETTINGS = {
  dioceseName: 'Apostolic Council of India Diocese',
  headquarters: 'Central Office, Hanumantharayankottai, Dindigul 624002, Tamil Nadu',
  bishopName: 'Rt. Rev. S. Johnson Durai',
  adminContactEmail: 'admin@acidiocese.org',
  adminContactPhone: '+91 94864 85810',
  defaultSubscriptionMonths: 12,
  enableEmailAlerts: true,
  enableWhatsAppAlerts: true,
  autoExpireDaysThreshold: 30
}

/**
 * Robust LocalStorage Fallback for dev / offline resilience
 */
function handleLocalFallback(action, data) {
  const STORAGE_USERS = 'aci_users_db'
  const STORAGE_APPS = 'aci_apps_db'
  const STORAGE_DOCS = 'aci_docs_db'
  const STORAGE_HIST = 'aci_hist_db'
  const STORAGE_COORDS = 'aci_coordinators_db'
  const STORAGE_CHURCHES = 'aci_churches_db'
  const STORAGE_ACTS = 'aci_activities_db'
  const STORAGE_EVENTS = 'aci_events_db'
  const STORAGE_GALLERY = 'aci_gallery_db'
  const STORAGE_ANNOUNCEMENTS = 'aci_announcements_db'
  const STORAGE_AUDIT = 'aci_audit_log_db'
  const STORAGE_SETTINGS = 'aci_settings_db'

  const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]')
  const saveUsers = (u) => localStorage.setItem(STORAGE_USERS, JSON.stringify(u))
  const getApps = () => {
    let list = JSON.parse(localStorage.getItem(STORAGE_APPS) || '[]')
    if (list.length < SEED_APPS.length) {
      list = [...SEED_APPS]
      localStorage.setItem(STORAGE_APPS, JSON.stringify(list))
    } else {
      SEED_APPS.forEach(s => {
        if (!list.some(a => a.email === s.email || a.applicationId === s.applicationId)) {
          list.push(s)
        }
      })
      localStorage.setItem(STORAGE_APPS, JSON.stringify(list))
    }
    return list
  }
  const saveApps = (a) => localStorage.setItem(STORAGE_APPS, JSON.stringify(a))
  const getDocs = () => JSON.parse(localStorage.getItem(STORAGE_DOCS) || '[]')
  const saveDocs = (d) => localStorage.setItem(STORAGE_DOCS, JSON.stringify(d))
  const getHist = () => JSON.parse(localStorage.getItem(STORAGE_HIST) || '[]')
  const saveHist = (h) => localStorage.setItem(STORAGE_HIST, JSON.stringify(h))

  const getCoords = () => {
    const list = JSON.parse(localStorage.getItem(STORAGE_COORDS) || '[]')
    if (list.length === 0) {
      localStorage.setItem(STORAGE_COORDS, JSON.stringify(SEED_COORDINATORS))
      return SEED_COORDINATORS
    }
    return list
  }
  const saveCoords = (c) => localStorage.setItem(STORAGE_COORDS, JSON.stringify(c))

  const getChurches = () => {
    const list = JSON.parse(localStorage.getItem(STORAGE_CHURCHES) || '[]')
    if (list.length === 0) {
      localStorage.setItem(STORAGE_CHURCHES, JSON.stringify(SEED_CHURCHES))
      return SEED_CHURCHES
    }
    return list
  }
  const saveChurches = (c) => localStorage.setItem(STORAGE_CHURCHES, JSON.stringify(c))

  const getActivities = () => {
    const list = JSON.parse(localStorage.getItem(STORAGE_ACTS) || '[]')
    if (list.length === 0) {
      localStorage.setItem(STORAGE_ACTS, JSON.stringify(SEED_ACTIVITIES))
      return SEED_ACTIVITIES
    }
    return list
  }
  const saveActivities = (a) => localStorage.setItem(STORAGE_ACTS, JSON.stringify(a))

  const getEvents = () => {
    const list = JSON.parse(localStorage.getItem(STORAGE_EVENTS) || '[]')
    if (list.length === 0) {
      localStorage.setItem(STORAGE_EVENTS, JSON.stringify(SEED_EVENTS))
      return SEED_EVENTS
    }
    return list
  }
  const saveEvents = (e) => localStorage.setItem(STORAGE_EVENTS, JSON.stringify(e))

  const getGallery = () => {
    const list = JSON.parse(localStorage.getItem(STORAGE_GALLERY) || '[]')
    if (list.length === 0) {
      localStorage.setItem(STORAGE_GALLERY, JSON.stringify(SEED_GALLERY))
      return SEED_GALLERY
    }
    return list
  }
  const saveGallery = (g) => localStorage.setItem(STORAGE_GALLERY, JSON.stringify(g))

  const getAnnouncements = () => {
    const list = JSON.parse(localStorage.getItem(STORAGE_ANNOUNCEMENTS) || '[]')
    if (list.length === 0) {
      localStorage.setItem(STORAGE_ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS))
      return SEED_ANNOUNCEMENTS
    }
    return list
  }
  const saveAnnouncements = (a) => localStorage.setItem(STORAGE_ANNOUNCEMENTS, JSON.stringify(a))

  const getAuditLogs = () => {
    const list = JSON.parse(localStorage.getItem(STORAGE_AUDIT) || '[]')
    if (list.length === 0) {
      localStorage.setItem(STORAGE_AUDIT, JSON.stringify(SEED_AUDIT_LOGS))
      return SEED_AUDIT_LOGS
    }
    return list
  }
  const addAuditEntry = (actionName, targetRecord, details, adminEmail = 'iamramm8@gmail.com') => {
    const logs = getAuditLogs()
    const newEntry = {
      id: 'LOG-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      adminEmail,
      action: actionName,
      targetRecord,
      details,
      timestamp: new Date().toISOString()
    }
    logs.unshift(newEntry)
    localStorage.setItem(STORAGE_AUDIT, JSON.stringify(logs.slice(0, 100)))
    return newEntry
  }

  const getSettings = () => {
    const s = JSON.parse(localStorage.getItem(STORAGE_SETTINGS) || 'null')
    if (!s) {
      localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(DEFAULT_SETTINGS))
      return DEFAULT_SETTINGS
    }
    return s
  }
  const saveSettings = (s) => localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(s))

  const now = new Date().toISOString()
  const email = (data.email || data.adminEmail || '').toLowerCase().trim()

  switch (action) {
    case 'request_email_otp': {
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      sessionStorage.setItem('aci_otp_cache_' + email, JSON.stringify({
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000
      }))
      console.log(`%c[ACI OTP SYSTEM] Verification Code for ${email}: ${otp}`, 'background: #1e40af; color: white; font-size: 14px; font-weight: bold; padding: 4px 8px; border-radius: 4px;')
      return { success: true, message: `Verification code dispatched to ${email}` }
    }

    case 'verify_email_otp': {
      const cache = JSON.parse(sessionStorage.getItem('aci_otp_cache_' + email) || '{}')
      const inputOtp = (data.otp || '').trim()

      if (cache.otp && cache.otp !== inputOtp) {
        return { success: false, error: 'WRONG_OTP', message: 'Invalid verification code. Please check and re-enter.' }
      }

      sessionStorage.removeItem('aci_otp_cache_' + email)
      return handleLocalFallback('auth_google', data)
    }

    case 'auth_password_login': {
      const users = getUsers()
      const user = users.find(u => u.email === email)
      const role = isEmailAdmin(email) ? 'ADMIN' : 'APPLICANT'
      const seedApp = SEED_APPS.find(s => s.email === email)

      if (!user) {
        // Auto-register member / applicant with initial password
        const newUser = {
          userId: 'USR-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
          googleSub: 'email-' + Math.random().toString(36).substring(2, 9),
          email,
          name: seedApp?.applicantName || (isEmailAdmin(email) ? 'Sriram Gandhi (Admin)' : (data.name || email.split('@')[0])),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
          password: data.password || '',
          createdAt: now,
          lastLoginAt: now,
          role
        }
        users.push(newUser)
        saveUsers(users)
        return { success: true, user: newUser, isAdmin: role === 'ADMIN' }
      }

      // Check password if set
      if (user.password && data.password && user.password !== data.password) {
        return { success: false, error: 'INVALID_PASSWORD', message: 'Incorrect password. Please try again.' }
      }

      if (!user.password && data.password) {
        user.password = data.password
      }
      if (seedApp?.applicantName && (!user.name || user.name === email.split('@')[0])) {
        user.name = seedApp.applicantName
      }
      user.lastLoginAt = now
      user.role = role
      saveUsers(users)
      return { success: true, user, isAdmin: role === 'ADMIN' }
    }

    case 'auth_password_register': {
      const users = getUsers()
      let user = users.find(u => u.email === email)
      const role = isEmailAdmin(email) ? 'ADMIN' : 'APPLICANT'

      if (user) {
        user.password = data.password || user.password
        user.name = data.name || user.name
        user.lastLoginAt = now
        user.role = role
      } else {
        user = {
          userId: 'USR-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
          googleSub: 'email-' + Math.random().toString(36).substring(2, 9),
          email,
          name: data.name || (isEmailAdmin(email) ? 'Sriram Gandhi (Admin)' : email.split('@')[0]),
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name || email)}`,
          password: data.password || '',
          createdAt: now,
          lastLoginAt: now,
          role
        }
        users.push(user)
      }
      saveUsers(users)
      return { success: true, user, isAdmin: role === 'ADMIN' }
    }

    case 'auth_google': {
      const users = getUsers()
      let user = users.find(u => u.email === email)
      const role = isEmailAdmin(email) ? 'ADMIN' : 'APPLICANT'

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
          name: data.name || (isEmailAdmin(email) ? 'Sriram Gandhi (Admin)' : 'ACI Applicant'),
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
      const oneYearExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()

      if (app) {
        app.applicationId = officialAppId
        app.applicantName = formData.personal?.name || app.applicantName
        app.mobileNumber = formData.church?.mobileNumber || app.mobileNumber
        app.cityTown = formData.personal?.permanentAddress?.cityTown || app.cityTown
        app.district = formData.personal?.permanentAddress?.district || app.district
        app.ministryFunction = formData.spiritual?.ministryFunction || app.ministryFunction
        app.status = 'SUBMITTED'
        app.submittedAt = now
        app.subscriptionExpiryDate = app.subscriptionExpiryDate || oneYearExpiry
        app.subscriptionStatus = app.subscriptionStatus || 'ACTIVE'
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
          subscriptionExpiryDate: oneYearExpiry,
          subscriptionStatus: 'ACTIVE',
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

      return { success: true, applicationId: officialAppId, status: 'SUBMITTED', submittedAt: now, subscriptionExpiryDate: oneYearExpiry }
    }

    case 'admin_list_applications': {
      let apps = getApps().filter(a => !a.applicationId.startsWith('DRAFT'))
      if (apps.length === 0) {
        // Provide master seed dataset if none in localStorage yet
        apps = [
          {
            applicationId: 'TN 0630',
            applicantName: 'Rev. M. Jedidiah Durairaj',
            email: 'jedidiah.durairaj@gmail.com',
            mobileNumber: '9994411422',
            ministryFunction: 'Sattur Taluk Coordinator / Episcopal Minister',
            cityTown: 'Sattur',
            district: 'Virudhunagar Diocese',
            status: 'ACCEPTED',
            submittedAt: '2026-01-10T11:00:00.000Z',
            subscriptionExpiryDate: '2027-01-10T11:00:00.000Z',
            subscriptionStatus: 'ACTIVE'
          },
          {
            applicationId: 'TN 0637',
            applicantName: 'Rev. S. James',
            email: 'heavenjjames1986@gmail.com',
            mobileNumber: '9629437495',
            ministryFunction: 'Virudhunagar Coordinator / Episcopal Minister',
            cityTown: 'Virudhunagar',
            district: 'Virudhunagar Diocese',
            status: 'ACCEPTED',
            submittedAt: '2026-01-15T14:30:00.000Z',
            subscriptionExpiryDate: '2027-01-15T14:30:00.000Z',
            subscriptionStatus: 'ACTIVE'
          },
          {
            applicationId: 'TN 0262',
            applicantName: 'Rev. V. Joshua Selva Kumar',
            email: 'selvagbc@gmail.com',
            mobileNumber: '8144603057',
            ministryFunction: 'Sivakasi Coordinator / Episcopal Minister',
            cityTown: 'Sivakasi',
            district: 'Virudhunagar Diocese',
            status: 'ACCEPTED',
            submittedAt: '2026-02-01T09:15:00.000Z',
            subscriptionExpiryDate: '2027-02-01T09:15:00.000Z',
            subscriptionStatus: 'ACTIVE'
          }
        ]
        saveApps(apps)
      }
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
      if (data.newStatus === 'ACCEPTED' && !app.subscriptionExpiryDate) {
        app.subscriptionExpiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        app.subscriptionStatus = 'ACTIVE'
      }
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

    case 'admin_renew_subscription': {
      const apps = getApps()
      const app = apps.find(a => a.applicationId === data.applicationId)
      const yearsToAdd = data.years || 1
      const currentExpiry = (app && app.subscriptionExpiryDate) ? new Date(app.subscriptionExpiryDate).getTime() : Date.now()
      const baseTime = currentExpiry > Date.now() ? currentExpiry : Date.now()
      const newExpiry = new Date(baseTime + yearsToAdd * 365 * 24 * 60 * 60 * 1000).toISOString()

      if (app) {
        app.subscriptionExpiryDate = newExpiry
        app.subscriptionStatus = 'ACTIVE'
        saveApps(apps)
      }

      return {
        success: true,
        applicationId: data.applicationId,
        subscriptionExpiryDate: newExpiry,
        message: `Subscription extended for ${yearsToAdd} year(s).`
      }
    }

    // Members Management
    case 'admin_list_members': {
      const apps = getApps()
      const members = apps.filter(a => a.status === 'ACCEPTED' || a.subscriptionStatus === 'ACTIVE' || a.subscriptionStatus === 'EXPIRED' || a.subscriptionStatus === 'SUSPENDED').map(a => {
        const submittedDate = a.submittedAt ? new Date(a.submittedAt) : new Date('2026-01-01')
        const expiry = a.subscriptionExpiryDate ? new Date(a.subscriptionExpiryDate) : new Date(submittedDate.getTime() + 365 * 24 * 60 * 60 * 1000)
        const diffMs = expiry.getTime() - Date.now()
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

        let computedStatus = 'ACTIVE'
        if (a.subscriptionStatus === 'SUSPENDED') {
          computedStatus = 'SUSPENDED'
        } else if (daysLeft <= 0) {
          computedStatus = 'EXPIRED'
        } else if (daysLeft <= 30) {
          computedStatus = 'EXPIRING_SOON'
        }

        return {
          memberId: a.applicationId,
          name: a.applicantName,
          email: a.email,
          phone: a.mobileNumber,
          role: a.ministryFunction || 'Episcopal Minister',
          church: a.churchName || a.data?.church?.churchName || 'Affiliated Church',
          district: a.district || a.data?.personal?.permanentAddress?.district || 'Tamil Nadu Diocese',
          city: a.cityTown || a.data?.personal?.permanentAddress?.cityTown || 'Central',
          photo: a.data?.personal?.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(a.applicantName || 'Member')}`,
          plan: a.subscriptionPlan || '1-Year Annual Affiliation',
          startDate: a.submittedAt || '2026-01-01T00:00:00.000Z',
          expiryDate: expiry.toISOString(),
          daysLeft,
          status: computedStatus,
          lastRenewal: a.lastRenewalAt || a.reviewedAt || a.submittedAt
        }
      })
      return { success: true, members }
    }

    case 'admin_save_member': {
      const apps = getApps()
      const m = data.member
      let app = apps.find(a => a.applicationId === m.memberId)
      if (app) {
        app.applicantName = m.name || app.applicantName
        app.email = m.email || app.email
        app.mobileNumber = m.phone || app.mobileNumber
        app.ministryFunction = m.role || app.ministryFunction
        app.churchName = m.church || app.churchName
        app.district = m.district || app.district
        app.subscriptionStatus = m.status || app.subscriptionStatus
        if (m.expiryDate) app.subscriptionExpiryDate = m.expiryDate
        saveApps(apps)
        addAuditEntry('UPDATED_MEMBER', m.memberId, `Updated member profile for ${m.name}`, data.adminEmail)
      } else {
        const newApp = {
          applicationId: m.memberId || ('ACI-' + Math.random().toString(36).substring(2, 7).toUpperCase()),
          applicantName: m.name,
          email: m.email,
          mobileNumber: m.phone,
          ministryFunction: m.role || 'Episcopal Pastor',
          churchName: m.church,
          district: m.district,
          status: 'ACCEPTED',
          submittedAt: now,
          subscriptionExpiryDate: m.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          subscriptionStatus: 'ACTIVE',
          subscriptionPlan: m.plan || '1-Year Annual Affiliation'
        }
        apps.unshift(newApp)
        saveApps(apps)
        addAuditEntry('CREATED_MEMBER', newApp.applicationId, `Created new diocese member: ${newApp.applicantName}`, data.adminEmail)
      }
      return { success: true, message: 'Member profile saved successfully.' }
    }

    case 'admin_update_member_status': {
      const apps = getApps()
      const app = apps.find(a => a.applicationId === data.memberId)
      if (app) {
        app.subscriptionStatus = data.status
        saveApps(apps)
        addAuditEntry('UPDATED_MEMBER_STATUS', data.memberId, `Changed status of ${app.applicantName} to ${data.status}`, data.adminEmail)
        return { success: true, memberId: data.memberId, status: data.status }
      }
      return { success: false, error: 'MEMBER_NOT_FOUND' }
    }

    case 'get_coordinators':
    case 'admin_get_coordinators': {
      return { success: true, coordinators: getCoords() }
    }

    case 'admin_save_coordinator': {
      const coords = getCoords()
      const c = data.coordinator
      const idx = coords.findIndex(item => item.id === c.id || item.regNo === c.regNo)
      if (idx >= 0) {
        coords[idx] = { ...coords[idx], ...c }
      } else {
        coords.push({
          id: 'COORD-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
          ...c,
          status: c.status || 'ACTIVE'
        })
      }
      saveCoords(coords)
      addAuditEntry('SAVED_COORDINATOR', c.name, `Saved diocesan coordinator details for ${c.name} (${c.district})`, data.adminEmail)
      return { success: true, coordinator: c }
    }

    case 'admin_delete_coordinator': {
      let coords = getCoords()
      const found = coords.find(c => c.id === data.id || c.regNo === data.id)
      coords = coords.filter(c => c.id !== data.id && c.regNo !== data.id)
      saveCoords(coords)
      addAuditEntry('DELETED_COORDINATOR', data.id, `Archived coordinator ${found?.name || data.id}`, data.adminEmail)
      return { success: true, id: data.id }
    }

    case 'admin_get_churches': {
      return { success: true, churches: getChurches() }
    }

    case 'admin_save_church': {
      const churches = getChurches()
      const ch = data.church
      const idx = churches.findIndex(item => item.id === ch.id || item.regNo === ch.regNo)
      if (idx >= 0) {
        churches[idx] = { ...churches[idx], ...ch }
      } else {
        churches.push({
          id: 'CHU-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
          ...ch,
          status: ch.status || 'ACTIVE'
        })
      }
      saveChurches(churches)
      addAuditEntry('SAVED_CHURCH', ch.name, `Saved church directory entry for ${ch.name} (${ch.district})`, data.adminEmail)
      return { success: true, church: ch }
    }

    case 'admin_delete_church': {
      let churches = getChurches()
      const found = churches.find(c => c.id === data.id)
      churches = churches.filter(c => c.id !== data.id)
      saveChurches(churches)
      addAuditEntry('DELETED_CHURCH', data.id, `Archived church ${found?.name || data.id}`, data.adminEmail)
      return { success: true, id: data.id }
    }

    case 'admin_get_activities': {
      return { success: true, activities: getActivities() }
    }

    case 'admin_save_activity': {
      const acts = getActivities()
      const a = data.activity
      const idx = acts.findIndex(item => item.id === a.id)
      if (idx >= 0) {
        acts[idx] = { ...acts[idx], ...a }
      } else {
        acts.push({
          id: 'ACT-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
          ...a,
          status: a.status || 'PUBLISHED'
        })
      }
      saveActivities(acts)
      addAuditEntry('SAVED_ACTIVITY', a.title, `Saved activity module: ${a.title}`, data.adminEmail)
      return { success: true, activity: a }
    }

    case 'admin_delete_activity': {
      let acts = getActivities()
      acts = acts.filter(a => a.id !== data.id)
      saveActivities(acts)
      addAuditEntry('DELETED_ACTIVITY', data.id, `Deleted activity ${data.id}`, data.adminEmail)
      return { success: true, id: data.id }
    }

    case 'admin_get_events': {
      return { success: true, events: getEvents() }
    }

    case 'admin_save_event': {
      const evts = getEvents()
      const e = data.event
      const idx = evts.findIndex(item => item.id === e.id)
      if (idx >= 0) {
        evts[idx] = { ...evts[idx], ...e }
      } else {
        evts.push({
          id: 'EVT-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
          ...e,
          status: e.status || 'DRAFT'
        })
      }
      saveEvents(evts)
      addAuditEntry('SAVED_EVENT', e.name, `Saved event ${e.name} with status ${e.status}`, data.adminEmail)
      return { success: true, event: e }
    }

    case 'admin_delete_event': {
      let evts = getEvents()
      evts = evts.filter(e => e.id !== data.id)
      saveEvents(evts)
      addAuditEntry('DELETED_EVENT', data.id, `Deleted event ${data.id}`, data.adminEmail)
      return { success: true, id: data.id }
    }

    case 'admin_get_gallery': {
      return { success: true, gallery: getGallery() }
    }

    case 'admin_save_gallery': {
      const gall = getGallery()
      const g = data.galleryItem
      const idx = gall.findIndex(item => item.id === g.id)
      if (idx >= 0) {
        gall[idx] = { ...gall[idx], ...g }
      } else {
        gall.push({
          id: 'GAL-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
          ...g,
          status: g.status || 'PUBLISHED'
        })
      }
      saveGallery(gall)
      addAuditEntry('SAVED_GALLERY', g.title, `Saved gallery image ${g.title}`, data.adminEmail)
      return { success: true, galleryItem: g }
    }

    case 'admin_delete_gallery': {
      let gall = getGallery()
      gall = gall.filter(g => g.id !== data.id)
      saveGallery(gall)
      addAuditEntry('DELETED_GALLERY', data.id, `Deleted gallery record ${data.id}`, data.adminEmail)
      return { success: true, id: data.id }
    }

    case 'admin_get_announcements': {
      return { success: true, announcements: getAnnouncements() }
    }

    case 'admin_save_announcement': {
      const anns = getAnnouncements()
      const an = data.announcement
      const idx = anns.findIndex(item => item.id === an.id)
      if (idx >= 0) {
        anns[idx] = { ...anns[idx], ...an }
      } else {
        anns.push({
          id: 'ANN-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
          ...an,
          publishDate: an.publishDate || new Date().toISOString().split('T')[0],
          status: an.status || 'PUBLISHED'
        })
      }
      saveAnnouncements(anns)
      addAuditEntry('SAVED_ANNOUNCEMENT', an.title, `Saved announcement ${an.title}`, data.adminEmail)
      return { success: true, announcement: an }
    }

    case 'admin_delete_announcement': {
      let anns = getAnnouncements()
      anns = anns.filter(a => a.id !== data.id)
      saveAnnouncements(anns)
      addAuditEntry('DELETED_ANNOUNCEMENT', data.id, `Deleted announcement ${data.id}`, data.adminEmail)
      return { success: true, id: data.id }
    }

    case 'admin_get_audit_log': {
      return { success: true, auditLogs: getAuditLogs() }
    }

    case 'admin_add_audit_log': {
      const entry = addAuditEntry(data.actionName, data.targetRecord, data.details, data.adminEmail)
      return { success: true, entry }
    }

    case 'admin_get_settings': {
      return { success: true, settings: getSettings() }
    }

    case 'admin_save_settings': {
      saveSettings(data.settings)
      addAuditEntry('UPDATED_SETTINGS', 'Diocese Configuration', 'Admin updated system settings and parameters', data.adminEmail)
      return { success: true, settings: data.settings }
    }

    case 'get_document_data': {
      const docs = getDocs()
      const doc = docs.find(d => d.driveFileId === data.driveFileId || d.documentId === data.documentId)
      if (doc && doc.base64Url) {
        return { success: true, base64Url: doc.base64Url, fileName: doc.fileName }
      }
      return { success: false, error: 'DOCUMENT_NOT_FOUND' }
    }

    case 'get_application_for_attestation': {
      const apps = getApps()
      const app = apps.find(a => a.applicationId === data.appId || a.applicationId === data.applicationId)
      if (app) {
        return {
          success: true,
          application: {
            applicationId: app.applicationId,
            applicantName: app.applicantName,
            email: app.email,
            mobileNumber: app.mobileNumber,
            personal: app.data?.personal || { name: app.applicantName },
            church: app.data?.church || {},
            spiritual: app.data?.spiritual || { ministryCalling: app.ministryFunction },
            references: app.data?.references || {
              ref1: { name: 'Rev. R. John Durai', dioceseId: 'TN 0005', phone: '9443210987', knownDuration: '8 Years' },
              ref2: { name: 'Rev. D. Antony Raj', dioceseId: 'TN 0466', phone: '9876543210', knownDuration: '5 Years' }
            }
          }
        }
      }
      return {
        success: true,
        application: {
          applicationId: data.appId || 'ACI-2026-000004',
          applicantName: 'Pastor David Paul',
          personal: { name: 'Pastor David Paul', city: 'Chennai' },
          church: { name: 'Calvary Gospel Mission' },
          spiritual: { ministryCalling: 'pastor' },
          references: {
            ref1: { name: 'Rev. R. John Durai', dioceseId: 'TN 0005', phone: '9443210987', knownDuration: '8 Years' },
            ref2: { name: 'Rev. D. Antony Raj', dioceseId: 'TN 0466', phone: '9876543210', knownDuration: '5 Years' }
          }
        }
      }
    }

    case 'attest_application': {
      const apps = getApps()
      const app = apps.find(a => a.applicationId === data.appId)
      if (app) {
        if (!app.data) app.data = {}
        if (!app.data.references) app.data.references = {}
        const refKey = data.refKey || 'ref1'
        app.data.references[refKey] = {
          ...(app.data.references[refKey] || {}),
          name: data.refereeName,
          dioceseId: data.dioceseId,
          knownDuration: data.knownDuration,
          mode: data.mode,
          phone: data.phone,
          signature: data.signature,
          attestedAt: data.attestedAt || now,
          status: 'ATTESTED'
        }
        app.status = 'ATTESTED_BY_REFEREE'
        saveApps(apps)
        addAuditEntry('ATTESTED_APPLICATION', data.appId, `Referee ${data.refereeName} attested application`, data.refereeEmail || 'referee')
        return { success: true, applicationId: data.appId, refKey, attestedAt: now }
      }
      return { success: true, applicationId: data.appId, refKey: data.refKey, attestedAt: now }
    }

    default:
      return { success: false, error: 'UNKNOWN_ACTION' }
  }
}

export const api = {
  authGoogle: (payload) => callApi('auth_google', payload),
  loginWithPassword: (email, password) => callApi('auth_password_login', { email, password }),
  registerWithPassword: (email, password, name) => callApi('auth_password_register', { email, password, name }),
  requestEmailOtp: (email) => callApi('request_email_otp', { email }),
  verifyEmailOtp: (email, otp, name) => callApi('verify_email_otp', { email, otp, name }),
  getMyApplication: async (email, googleSub) => {
    const res = await callApi('get_my_application', { email, googleSub })
    if ((!res || !res.success || !res.application) && email) {
      const match = SEED_APPS.find(s => s.email.toLowerCase() === email.toLowerCase().trim())
      if (match) {
        return { success: true, application: match }
      }
    }
    return res
  },
  saveDraft: (email, userId, googleSub, formData) => callApi('save_draft', { email, userId, googleSub, formData }),
  uploadDocumentMeta: (payload) => callApi('upload_document_meta', payload),
  uploadDocument: (payload) => callApi('upload_document', payload),
  submitApplication: (email, userId, googleSub, formData) => callApi('submit_application', { email, userId, googleSub, formData }),
  getDocumentData: (email, driveFileId, documentId) => callApi('get_document_data', { email, driveFileId, documentId }),
  getApplicationForAttestation: (appId) => callApi('get_application_for_attestation', { appId }),
  attestApplication: (payload) => callApi('attest_application', payload),
  sendRefereeEmail: (payload) => callApi('send_referee_email', payload),
  
  // Admin Core API
  adminListApplications: async (adminEmail) => {
    const res = await callApi('admin_list_applications', { adminEmail })
    return res
  },
  adminGetApplication: (adminEmail, applicationId) => callApi('admin_get_application', { adminEmail, applicationId }),
  adminUpdateStatus: (adminEmail, applicationId, newStatus, reason, adminNotes) => callApi('admin_update_status', { adminEmail, applicationId, newStatus, reason, adminNotes }),
  adminRenewSubscription: (applicationId, years = 1, adminEmail = 'iamramm8@gmail.com') => callApi('admin_renew_subscription', { applicationId, years, adminEmail }),
  
  // Members
  adminListMembers: (adminEmail) => callApi('admin_list_members', { adminEmail }),
  adminSaveMember: (member, adminEmail) => callApi('admin_save_member', { member, adminEmail }),
  adminUpdateMemberStatus: (memberId, status, adminEmail) => callApi('admin_update_member_status', { memberId, status, adminEmail }),
  
  // Coordinators
  getCoordinators: (dioceseId) => callApi('get_coordinators', { dioceseId }),
  adminGetCoordinators: (adminEmail) => callApi('admin_get_coordinators', { adminEmail }),
  adminSaveCoordinator: (coordinator, adminEmail) => callApi('admin_save_coordinator', { coordinator, adminEmail }),
  adminDeleteCoordinator: (id, adminEmail) => callApi('admin_delete_coordinator', { id, adminEmail }),
  
  // Churches
  adminGetChurches: (adminEmail) => callApi('admin_get_churches', { adminEmail }),
  adminSaveChurch: (church, adminEmail) => callApi('admin_save_church', { church, adminEmail }),
  adminDeleteChurch: (id, adminEmail) => callApi('admin_delete_church', { id, adminEmail }),
  
  // Activities & Events
  adminGetActivities: (adminEmail) => callApi('admin_get_activities', { adminEmail }),
  adminSaveActivity: (activity, adminEmail) => callApi('admin_save_activity', { activity, adminEmail }),
  adminDeleteActivity: (id, adminEmail) => callApi('admin_delete_activity', { id, adminEmail }),
  adminGetEvents: (adminEmail) => callApi('admin_get_events', { adminEmail }),
  adminSaveEvent: (event, adminEmail) => callApi('admin_save_event', { event, adminEmail }),
  adminDeleteEvent: (id, adminEmail) => callApi('admin_delete_event', { id, adminEmail }),
  
  // Gallery
  adminGetGallery: (adminEmail) => callApi('admin_get_gallery', { adminEmail }),
  adminSaveGallery: (galleryItem, adminEmail) => callApi('admin_save_gallery', { galleryItem, adminEmail }),
  adminDeleteGallery: (id, adminEmail) => callApi('admin_delete_gallery', { id, adminEmail }),
  
  // Announcements
  adminGetAnnouncements: (adminEmail) => callApi('admin_get_announcements', { adminEmail }),
  adminSaveAnnouncement: (announcement, adminEmail) => callApi('admin_save_announcement', { announcement, adminEmail }),
  adminDeleteAnnouncement: (id, adminEmail) => callApi('admin_delete_announcement', { id, adminEmail }),
  
  // Audit Logs & Settings
  adminGetAuditLog: (adminEmail) => callApi('admin_get_audit_log', { adminEmail }),
  adminAddAuditLog: (actionName, targetRecord, details, adminEmail) => callApi('admin_add_audit_log', { actionName, targetRecord, details, adminEmail }),
  adminGetSettings: (adminEmail) => callApi('admin_get_settings', { adminEmail }),
  adminSaveSettings: (settings, adminEmail) => callApi('admin_save_settings', { settings, adminEmail }),
}
