import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import {
  UserCheckIcon,
  DocumentIcon,
  SearchIcon,
  CheckIcon,
  AlertCircleIcon,
  InfoIcon
} from '../components/Icons/SvgIcons'
import './AdminDashboardPage.css'

export default function AdminDashboardPage() {
  const { user, isAdmin, logout } = useAuth()
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const navigate = useNavigate()

  // Main navigation tab
  const [activeTab, setActiveTab] = useState('applications') // 'applications' | 'subscriptions'

  // Application vetting state
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Subscriptions tab state
  const [subSearch, setSubSearch] = useState('')
  const [subFilter, setSubFilter] = useState('ALL')
  const [renewingId, setRenewingId] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    loadApplications(user?.email || 'iamramm8@gmail.com')
  }, [user])

  const loadApplications = async (adminEmail) => {
    setLoading(true)
    try {
      const res = await api.adminListApplications(adminEmail)
      if (res && res.success && res.applications) {
        setApplications(res.applications)
      }
    } catch (e) {
      console.warn('Error fetching admin applications:', e)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4000)
  }

  const handleRenewSubscription = async (appId) => {
    setRenewingId(appId)
    try {
      const res = await api.adminRenewSubscription(appId, 1)
      if (res && res.success) {
        setApplications(prev => prev.map(item => {
          if (item.applicationId === appId) {
            const nextDate = res.subscriptionExpiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            return {
              ...item,
              subscriptionExpiryDate: nextDate,
              subscriptionStatus: 'ACTIVE'
            }
          }
          return item
        }))
        showToast(isTa ? `விண்ணப்பம் ${appId} மேலும் 1 வருடத்திற்கு புதுப்பிக்கப்பட்டது!` : `Subscription for ${appId} successfully renewed for 1 Year!`)
      } else {
        showToast(res?.message || 'Failed to renew subscription')
      }
    } catch (err) {
      showToast('Error renewing subscription: ' + err.message)
    } finally {
      setRenewingId(null)
    }
  }

  const filteredApps = applications.filter((app) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      app.status === statusFilter ||
      (statusFilter === 'PENDING' && (app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW'))

    const q = searchTerm.toLowerCase().trim()
    const matchesSearch =
      !q ||
      app.applicationId?.toLowerCase().includes(q) ||
      app.applicantName?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q) ||
      app.mobileNumber?.toLowerCase().includes(q) ||
      app.cityTown?.toLowerCase().includes(q)

    return matchesStatus && matchesSearch
  })

  const enrichedSubscriptions = applications.map((app) => {
    const submittedDate = app.submittedAt ? new Date(app.submittedAt) : new Date('2026-01-01')
    const expiry = app.subscriptionExpiryDate ? new Date(app.subscriptionExpiryDate) : new Date(submittedDate.getTime() + 365 * 24 * 60 * 60 * 1000)
    const now = new Date()
    const diffMs = expiry.getTime() - now.getTime()
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    let subState = 'ACTIVE'
    if (app.status === 'REJECTED') {
      subState = 'REJECTED'
    } else if (app.status !== 'ACCEPTED') {
      subState = 'PENDING'
    } else if (daysLeft <= 0) {
      subState = 'EXPIRED'
    } else if (daysLeft <= 30) {
      subState = 'EXPIRING_SOON'
    }

    return {
      ...app,
      submittedDate,
      expiryDate: expiry,
      daysLeft,
      subState
    }
  })

  const filteredSubs = enrichedSubscriptions.filter((sub) => {
    const matchesState =
      subFilter === 'ALL' ||
      sub.subState === subFilter

    const q = subSearch.toLowerCase().trim()
    const matchesSearch =
      !q ||
      sub.applicationId?.toLowerCase().includes(q) ||
      sub.applicantName?.toLowerCase().includes(q) ||
      sub.email?.toLowerCase().includes(q) ||
      sub.mobileNumber?.toLowerCase().includes(q) ||
      sub.district?.toLowerCase().includes(q)

    return matchesState && matchesSearch
  })

  const countTotal = applications.length
  const countSubmitted = applications.filter((a) => a.status === 'SUBMITTED').length
  const countUnderReview = applications.filter((a) => a.status === 'UNDER_REVIEW').length
  const countAccepted = applications.filter((a) => a.status === 'ACCEPTED').length
  const countRejected = applications.filter((a) => a.status === 'REJECTED').length

  const subTotal = enrichedSubscriptions.filter(s => s.status === 'ACCEPTED').length
  const subActive = enrichedSubscriptions.filter(s => s.status === 'ACCEPTED' && s.subState === 'ACTIVE').length
  const subExpiring = enrichedSubscriptions.filter(s => s.status === 'ACCEPTED' && s.subState === 'EXPIRING_SOON').length
  const subExpired = enrichedSubscriptions.filter(s => s.status === 'ACCEPTED' && s.subState === 'EXPIRED').length

  return (
    <div className="admin-page-container">
      {toastMessage && (
        <div className="admin-toast-banner">
          <span>✨ {toastMessage}</span>
          <button type="button" onClick={() => setToastMessage('')}>✕</button>
        </div>
      )}

      <div className="admin-top-bar">
        <div>
          <div className="admin-badge">
            <span>🛡️ ACI DIOCESE CENTRAL ADMINISTRATIVE PORTAL</span>
          </div>
          <h1 className="admin-page-title">
            {isTa ? 'பேராய நிர்வாகக் கட்டுப்பாட்டு மையம்' : 'Central Executive Administration & Registry'}
          </h1>
          <p className="admin-page-sub">
            {isTa
              ? 'உறுப்பினர் விண்ணப்பங்களை ஆய்வு செய்தல், ஆண்டு சந்தா காலாவதி கண்காணிப்பு மற்றும் புதுப்பித்தல் மேலாண்மை.'
              : 'Official vetting registry, applicant credential inspection, and annual subscription renewal monitoring.'}
          </p>
        </div>

        <div className="admin-user-ctrl">
          <span className="admin-user-email">Admin: <strong>{user?.email || 'Executive Admin'}</strong></span>
          <button type="button" className="admin-logout-btn" onClick={logout}>
            {isTa ? 'வெளியேறு' : 'Sign Out'}
          </button>
        </div>
      </div>

      <div className="admin-main-tabs">
        <button
          type="button"
          className={`main-tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <DocumentIcon size={18} />
          <span>{isTa ? 'விண்ணப்பங்கள் சரிபார்ப்பு' : 'Applications & Vetting'}</span>
          <span className="main-tab-count">{countTotal}</span>
        </button>

        <button
          type="button"
          className={`main-tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          <UserCheckIcon size={18} />
          <span>{isTa ? 'ஆண்டு சந்தா & உறுப்பினர் புதுப்பித்தல்' : 'Annual Subscriptions & Renewals'}</span>
          <span className="main-tab-count text-gold">{subTotal}</span>
        </button>
      </div>

      {activeTab === 'applications' && (
        <div className="admin-tab-content">
          <div className="admin-metrics-grid">
            <div className="metric-card total" onClick={() => setStatusFilter('ALL')}>
              <span className="metric-lbl">{isTa ? 'மொத்த விண்ணப்பங்கள்' : 'Total Applications'}</span>
              <span className="metric-num">{countTotal}</span>
            </div>
            <div className="metric-card submitted" onClick={() => setStatusFilter('SUBMITTED')}>
              <span className="metric-lbl">{isTa ? 'புதியவை' : 'New Submissions'}</span>
              <span className="metric-num">{countSubmitted}</span>
            </div>
            <div className="metric-card review" onClick={() => setStatusFilter('UNDER_REVIEW')}>
              <span className="metric-lbl">{isTa ? 'பரிசீலனையில்' : 'Under Review'}</span>
              <span className="metric-num">{countUnderReview}</span>
            </div>
            <div className="metric-card accepted" onClick={() => setStatusFilter('ACCEPTED')}>
              <span className="metric-lbl">{isTa ? 'அங்கீகரிக்கப்பட்டவை' : 'Accepted Members'}</span>
              <span className="metric-num">{countAccepted}</span>
            </div>
            <div className="metric-card rejected" onClick={() => setStatusFilter('REJECTED')}>
              <span className="metric-lbl">{isTa ? 'நிராகரிக்கப்பட்டவை' : 'Rejected'}</span>
              <span className="metric-num">{countRejected}</span>
            </div>
          </div>

          <div className="admin-controls-card">
            <div className="admin-search-wrap">
              <SearchIcon size={16} />
              <input
                type="text"
                placeholder={isTa ? 'விண்ணப்ப எண், பெயர், ஊர் அல்லது மின்னஞ்சல் மூலம் தேடுக...' : 'Search applications by ID, Name, Email, or City...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-search-input"
              />
              {searchTerm && (
                <button type="button" className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
              )}
            </div>

            <div className="admin-filter-tabs">
              <button
                type="button"
                className={`filter-tab ${statusFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setStatusFilter('ALL')}
              >
                All ({countTotal})
              </button>
              <button
                type="button"
                className={`filter-tab ${statusFilter === 'SUBMITTED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('SUBMITTED')}
              >
                Submitted ({countSubmitted})
              </button>
              <button
                type="button"
                className={`filter-tab ${statusFilter === 'UNDER_REVIEW' ? 'active' : ''}`}
                onClick={() => setStatusFilter('UNDER_REVIEW')}
              >
                Under Review ({countUnderReview})
              </button>
              <button
                type="button"
                className={`filter-tab ${statusFilter === 'ACCEPTED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('ACCEPTED')}
              >
                Accepted ({countAccepted})
              </button>
              <button
                type="button"
                className={`filter-tab ${statusFilter === 'REJECTED' ? 'active' : ''}`}
                onClick={() => setStatusFilter('REJECTED')}
              >
                Rejected ({countRejected})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="admin-loading-card">
              <div className="app-dash-spinner" />
              <p>{isTa ? 'விண்ணப்பங்கள் ஏற்றப்படுகின்றன...' : 'Loading applications from Google Sheets...'}</p>
            </div>
          ) : filteredApps.length > 0 ? (
            <div className="admin-table-card">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Applicant Name</th>
                    <th>Email & Phone</th>
                    <th>Ministry Function</th>
                    <th>Location</th>
                    <th>Submitted On</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map((app) => (
                    <tr key={app.applicationId}>
                      <td className="font-mono font-bold text-gold">{app.applicationId}</td>
                      <td>
                        <div className="app-applicant-name-cell">
                          <strong>{app.applicantName || '—'}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="app-contact-cell">
                          <span>{app.email}</span>
                          {app.mobileNumber && <small className="text-muted">{app.mobileNumber}</small>}
                        </div>
                      </td>
                      <td>{app.ministryFunction || 'Pastor'}</td>
                      <td>{app.cityTown ? `${app.cityTown}, ${app.district || ''}` : '—'}</td>
                      <td className="text-muted text-xs">
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Draft'}
                      </td>
                      <td>
                        <span className={`admin-status-badge ${app.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <Link
                          to={`/admin/application/${encodeURIComponent(app.applicationId)}`}
                          className="admin-view-btn"
                        >
                          <span>Review Form</span> →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-card">
              <p>{isTa ? 'பொருத்தமான விண்ணப்பங்கள் எதுவும் இல்லை.' : 'No matching applications found.'}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="admin-tab-content">
          <div className="admin-metrics-grid">
            <div className="metric-card total" onClick={() => setSubFilter('ALL')}>
              <span className="metric-lbl">{isTa ? 'மொத்த உறுப்பினர்கள்' : 'Affiliated Members'}</span>
              <span className="metric-num">{subTotal}</span>
            </div>
            <div className="metric-card accepted" onClick={() => setSubFilter('ACTIVE')}>
              <span className="metric-lbl">{isTa ? 'செயலில் உள்ளவை (>30 நாட்கள்)' : 'Active Subscriptions'}</span>
              <span className="metric-num">{subActive}</span>
            </div>
            <div className="metric-card review" onClick={() => setSubFilter('EXPIRING_SOON')}>
              <span className="metric-lbl">{isTa ? 'விரைவில் காலாவதியாகிறது (<=30)' : 'Expiring Soon (<=30d)'}</span>
              <span className="metric-num">{subExpiring}</span>
            </div>
            <div className="metric-card rejected" onClick={() => setSubFilter('EXPIRED')}>
              <span className="metric-lbl">{isTa ? 'காலாவதியானவை' : 'Expired Subscriptions'}</span>
              <span className="metric-num">{subExpired}</span>
            </div>
          </div>

          <div className="admin-controls-card">
            <div className="admin-search-wrap">
              <SearchIcon size={16} />
              <input
                type="text"
                placeholder={isTa ? 'உறுப்பினர் பெயர், ID, மின்னஞ்சல், அலைபேசி அல்லது மாவட்டம் மூலம் தேடுக...' : 'Search members by Name, ID, Phone, District...'}
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                className="admin-search-input"
              />
              {subSearch && (
                <button type="button" className="clear-search-btn" onClick={() => setSubSearch('')}>✕</button>
              )}
            </div>

            <div className="admin-filter-tabs">
              <button
                type="button"
                className={`filter-tab ${subFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setSubFilter('ALL')}
              >
                All Members ({enrichedSubscriptions.length})
              </button>
              <button
                type="button"
                className={`filter-tab ${subFilter === 'ACTIVE' ? 'active' : ''}`}
                onClick={() => setSubFilter('ACTIVE')}
              >
                Active ({subActive})
              </button>
              <button
                type="button"
                className={`filter-tab ${subFilter === 'EXPIRING_SOON' ? 'active' : ''}`}
                onClick={() => setSubFilter('EXPIRING_SOON')}
              >
                Expiring Soon ({subExpiring})
              </button>
              <button
                type="button"
                className={`filter-tab ${subFilter === 'EXPIRED' ? 'active' : ''}`}
                onClick={() => setSubFilter('EXPIRED')}
              >
                Expired ({subExpired})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="admin-loading-card">
              <div className="app-dash-spinner" />
              <p>{isTa ? 'சந்தா பதிவேடு ஏற்றப்படுகிறது...' : 'Loading annual subscriptions registry...'}</p>
            </div>
          ) : filteredSubs.length > 0 ? (
            <div className="admin-table-card">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Diocesan ID</th>
                    <th>Member Details</th>
                    <th>Calling / District</th>
                    <th>Affiliation Date</th>
                    <th>Annual Expiry Date</th>
                    <th>Validity Countdown</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Renewal & Contact Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubs.map((sub) => {
                    const isRenewing = renewingId === sub.applicationId
                    const waPhone = sub.mobileNumber ? sub.mobileNumber.replace(/[^0-9]/g, '') : ''
                    const waText = encodeURIComponent(
                      `Greetings from Apostolic Council of India Diocese.\\n\\nDear ${sub.applicantName},\\nThis is an official notice regarding your Annual Ministerial Affiliation (ID: ${sub.applicationId}).\\nExpiry Date: ${sub.expiryDate.toLocaleDateString()}\\nDays Left: ${sub.daysLeft > 0 ? sub.daysLeft : 'Expired'}.\\n\\nPlease complete your annual renewal to maintain your active diocesan standing.\\n\\nSecretariat Contact: +91 93457 12307`
                    )

                    return (
                      <tr key={sub.applicationId}>
                        <td className="font-mono font-bold text-gold">{sub.applicationId}</td>
                        <td>
                          <div className="app-applicant-name-cell">
                            <strong>{sub.applicantName || '—'}</strong>
                            <small className="text-muted">{sub.email}</small>
                            {sub.mobileNumber && <small className="text-muted">📞 {sub.mobileNumber}</small>}
                          </div>
                        </td>
                        <td>
                          <div>
                            <span>{sub.ministryFunction || 'Episcopal Minister'}</span>
                            <small className="text-muted d-block">{sub.district || sub.cityTown || '—'}</small>
                          </div>
                        </td>
                        <td className="text-xs text-muted">
                          {sub.submittedDate.toLocaleDateString()}
                        </td>
                        <td className="text-xs font-bold text-gold">
                          {sub.expiryDate.toLocaleDateString()}
                        </td>
                        <td>
                          <div className="sub-countdown-cell">
                            {sub.daysLeft > 30 ? (
                              <span className="sub-days-tag green">🟢 {sub.daysLeft} days left</span>
                            ) : sub.daysLeft > 0 ? (
                              <span className="sub-days-tag amber">⚠️ {sub.daysLeft} days left</span>
                            ) : (
                              <span className="sub-days-tag red">🔴 Expired ({Math.abs(sub.daysLeft)}d ago)</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`admin-status-badge ${sub.subState.toLowerCase().replace(/_/g, '-')}`}>
                            {sub.subState}
                          </span>
                        </td>
                        <td>
                          <div className="sub-actions-cell">
                            <button
                              type="button"
                              className="admin-renew-action-btn"
                              disabled={isRenewing}
                              onClick={() => handleRenewSubscription(sub.applicationId)}
                              title="Extend subscription for 1 Year"
                            >
                              {isRenewing ? 'Renewing...' : '🔄 +1 Year Renewal'}
                            </button>

                            {waPhone && (
                              <a
                                href={`https://wa.me/${waPhone.startsWith('91') ? waPhone : '91' + waPhone}?text=${waText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-wa-reminder-btn"
                                title="Send WhatsApp renewal notice"
                              >
                                💬 WhatsApp
                              </a>
                            )}

                            <Link
                              to={`/admin/application/${encodeURIComponent(sub.applicationId)}`}
                              className="admin-icon-link-btn"
                              title="View Detailed Application"
                            >
                              📄
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty-card">
              <p>{isTa ? 'பொருத்தமான சந்தா பதிவுகள் எதுவும் இல்லை.' : 'No matching subscription records found.'}</p>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

