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

  const [activeTab, setActiveTab] = useState('applications')
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
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

  const enrichedApplications = applications.map((app) => {
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

  const filteredApps = enrichedApplications.filter((app) => {
    let matchesStatus = true
    if (statusFilter === 'ALL') {
      matchesStatus = true
    } else if (statusFilter === 'PENDING') {
      matchesStatus = app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW'
    } else if (statusFilter === 'EXPIRING') {
      matchesStatus = app.subState === 'EXPIRING_SOON' || app.subState === 'EXPIRED'
    } else {
      matchesStatus = app.status === statusFilter
    }

    const q = searchTerm.toLowerCase().trim()
    const matchesSearch =
      !q ||
      app.applicationId?.toLowerCase().includes(q) ||
      app.applicantName?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q) ||
      app.mobileNumber?.toLowerCase().includes(q) ||
      app.cityTown?.toLowerCase().includes(q) ||
      app.district?.toLowerCase().includes(q)

    return matchesStatus && matchesSearch
  })

  const countTotal = applications.length
  const countSubmitted = applications.filter((a) => a.status === 'SUBMITTED').length
  const countUnderReview = applications.filter((a) => a.status === 'UNDER_REVIEW').length
  const countAccepted = applications.filter((a) => a.status === 'ACCEPTED').length
  const countRejected = applications.filter((a) => a.status === 'REJECTED').length

  const subTotal = enrichedApplications.filter(s => s.status === 'ACCEPTED').length
  const subActive = enrichedApplications.filter(s => s.status === 'ACCEPTED' && s.subState === 'ACTIVE').length
  const subExpiring = enrichedApplications.filter(s => s.status === 'ACCEPTED' && s.subState === 'EXPIRING_SOON').length
  const subExpired = enrichedApplications.filter(s => s.status === 'ACCEPTED' && s.subState === 'EXPIRED').length

  const handleWhatsAppReminder = (app) => {
    const text = encodeURIComponent(
      `Shalom Pastor ${app.applicantName},\n\nThis is an official notice from Apostolic Council of India Central Registry regarding your Diocesan Affiliation (${app.applicationId}).\n\nYour annual affiliation renewal is currently scheduled. Please visit the portal or contact the Secretariat to keep your credential active.\n\nBlessings,\nACI Diocese Central Administration`
    )
    const phone = app.mobileNumber ? app.mobileNumber.replace(/\D/g, '') : ''
    const fullPhone = phone.length === 10 ? `91${phone}` : phone
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank')
  }
  return (
    <div className="bento-canvas-wrapper">
      {toastMessage && (
        <div className="bento-floating-toast">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage('')}>✕</button>
        </div>
      )}

      <div className="bento-dashboard-window">
        {/* LEFT CAPSULE SIDEBAR DOCK */}
        <aside className="bento-capsule-sidebar">
          <div className="dock-top-brand">
            <Link to="/" className="dock-brand-logo" title="ACI Diocese Home">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="dock-cross-icon">
                <path d="M12 2v20M7 8h10"></path>
              </svg>
            </Link>
          </div>

          <div className="dock-nav-items">
            <button
              type="button"
              className={`dock-btn ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
              title="Applications & Vetting"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="2"></rect>
                <rect x="14" y="3" width="7" height="7" rx="2"></rect>
                <rect x="14" y="14" width="7" height="7" rx="2"></rect>
                <rect x="3" y="14" width="7" height="7" rx="2"></rect>
              </svg>
            </button>

            <button
              type="button"
              className={`dock-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscriptions')}
              title="Annual Subscriptions"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </button>

            <button
              type="button"
              className={`dock-btn ${activeTab === 'coordinators' ? 'active' : ''}`}
              onClick={() => setActiveTab('coordinators')}
              title="Diocesan Coordinators"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </button>

            <button
              type="button"
              className={`dock-btn ${activeTab === 'trends' ? 'active' : ''}`}
              onClick={() => setActiveTab('trends')}
              title="Annual Trends & Analytics"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </button>

            <button
              type="button"
              className={`dock-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
              title="Diocesan Settings"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>

          <div className="dock-bottom-profile">
            <div className="dock-avatar-chip" title={`Logged in as ${user?.email || 'Executive Admin'}`}>
              <div className="dock-avatar-circle">
                <span>{(user?.email?.[0] || 'A').toUpperCase()}</span>
                <span className="dock-online-dot"></span>
              </div>
            </div>
            <button type="button" className="dock-logout-mini" onClick={logout} title="Sign Out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </aside>

        {/* MAIN EXECUTIVE DASHBOARD CONTENT AREA */}
        <main className="bento-main-body">
          {/* HEADER ROW */}
          <header className="bento-header-row">
            <div className="bento-header-left">
              <div className="bento-crumb-tag">
                <span className="bento-crumb-dot"></span>
                <span>ACI DIOCESE • CENTRAL ADMINISTRATION</span>
              </div>
              <h1 className="bento-main-title">
                Managing Your Diocese and Workflows
              </h1>
            </div>

            <div className="bento-header-actions">
              <button
                type="button"
                className="bento-circle-action"
                title="Diocese Settings"
                onClick={() => setActiveTab('settings')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </button>

              <Link to="/membership-application" className="bento-pill-cta">
                <span className="plus-symbol">+</span>
                <span>Create a New Application</span>
              </Link>
            </div>
          </header>

          {/* HORIZONTAL CAPSULE PILL NAV TABS */}
          <nav className="bento-pill-tabs-nav">
            <button
              type="button"
              className={`pill-tab-item ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              <span>{isTa ? 'விண்ணப்பங்கள் & சரிபார்ப்பு' : 'Applications & Vetting'}</span>
              <span className="tab-pill-badge">{countTotal}</span>
            </button>

            <button
              type="button"
              className={`pill-tab-item ${activeTab === 'subscriptions' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscriptions')}
            >
              <span>{isTa ? 'ஆண்டு சந்தா & புதுப்பித்தல்' : 'Annual Subscriptions'}</span>
              <span className="tab-pill-badge lime-badge">{subTotal}</span>
            </button>

            <button
              type="button"
              className={`pill-tab-item ${activeTab === 'coordinators' ? 'active' : ''}`}
              onClick={() => setActiveTab('coordinators')}
            >
              <span>{isTa ? 'பேராய ஒருங்கிணைப்பாளர்கள்' : 'Diocesan Coordinators'}</span>
              <span className="tab-pill-badge">3</span>
            </button>

            <button
              type="button"
              className={`pill-tab-item ${activeTab === 'trends' ? 'active' : ''}`}
              onClick={() => setActiveTab('trends')}
            >
              <span>{isTa ? 'வளர்ச்சி புள்ளிவிவரங்கள்' : 'Annual Trends'}</span>
            </button>

            <button
              type="button"
              className={`pill-tab-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span>{isTa ? 'கட்டமைப்பு அமைப்புகள்' : 'Diocesan Settings'}</span>
            </button>
          </nav>

          {/* TOP BENTO ROW - 3 EQUAL HEIGHT EXECUTIVE CARDS */}
          <section className="bento-top-grid">
            {/* CARD 1: APPLICATIONS OVERVIEW */}
            <div className="bento-card bento-card-light">
              <div className="bento-card-header">
                <div>
                  <span className="bento-card-label">{isTa ? 'விண்ணப்ப மேலாண்மை' : 'Applications Overview'}</span>
                  <div className="bento-metric-large">{countTotal}</div>
                </div>
                <div className="bento-pill-indicator lime-indicator">
                  <span>82% Active</span>
                </div>
              </div>

              <div className="bento-capsule-meter-group">
                <div className="meter-label-row">
                  <span>Vetting Distribution</span>
                  <span>{countAccepted} Approved / {countUnderReview + countSubmitted} Pending</span>
                </div>
                <div className="capsule-progress-bar">
                  <div className="prog-pill dark-pill" style={{ width: `${Math.max(15, Math.min(80, (countAccepted / (countTotal || 1)) * 100))}%` }}></div>
                  <div className="prog-pill lime-pill" style={{ width: `${Math.max(10, Math.min(50, ((countUnderReview + countSubmitted) / (countTotal || 1)) * 100))}%` }}></div>
                  <div className="prog-pill slate-pill" style={{ width: `${Math.max(5, (countRejected / (countTotal || 1)) * 100)}%` }}></div>
                </div>
                <div className="meter-legend-row">
                  <span className="legend-item"><span className="legend-dot dark-dot"></span> Accepted ({countAccepted})</span>
                  <span className="legend-item"><span className="legend-dot lime-dot"></span> Review ({countUnderReview + countSubmitted})</span>
                  <span className="legend-item"><span className="legend-dot slate-dot"></span> Rejected ({countRejected})</span>
                </div>
              </div>
            </div>

            {/* CARD 2: VIBRANT NEON LIME ANNUAL SUBSCRIPTION CARD */}
            <div className="bento-card bento-card-lime">
              <div className="bento-card-header">
                <div>
                  <span className="bento-card-label-dark">{isTa ? 'ஆண்டு சந்தா மேலாண்மை' : 'Annual Subscriptions'}</span>
                  <div className="bento-metric-large-dark">{subActive} Active</div>
                </div>
                <div className="bento-pill-indicator dark-indicator">
                  <span>365-Day Cycle</span>
                </div>
              </div>

              <div className="bento-capsule-meter-group lime-meter-theme">
                <div className="meter-label-row dark-text">
                  <span>Membership Expiry Status</span>
                  <span>{subExpiring} Expiring &lt;30d</span>
                </div>
                <div className="capsule-progress-bar lime-track">
                  <div className="prog-pill dark-solid-pill" style={{ width: `${Math.max(20, (subActive / (subTotal || 1)) * 100)}%` }}></div>
                  <div className="prog-pill amber-solid-pill" style={{ width: `${Math.max(10, (subExpiring / (subTotal || 1)) * 100)}%` }}></div>
                </div>
                <div className="meter-legend-row dark-text">
                  <span className="legend-item"><span className="legend-dot dark-dot"></span> Active ({subActive})</span>
                  <span className="legend-item"><span className="legend-dot amber-dot"></span> Warning ({subExpiring})</span>
                  <span className="legend-item"><span className="legend-dot red-dot"></span> Expired ({subExpired})</span>
                </div>
              </div>
            </div>

            {/* CARD 3: DARK HERO SECRETARIAT COVER CARD */}
            <div className="bento-card bento-card-dark-hero">
              <div className="hero-content-wrap">
                <div>
                  <div className="hero-badge">DIOCESE EXECUTIVE SECRETARIAT</div>
                  <h3 className="hero-title">
                    {isTa ? 'பேராய உறுப்பினர் பதிவேடு & நெறிமுறை' : 'Diocese Registry & Fellowship'}
                  </h3>
                  <p className="hero-desc">
                    {isTa ? '1-வருட அங்கீகார முறைமை மற்றும் பேராய சான்றிதழ் மேலாண்மை மையம்.' : 'Official cloud vetting, credential renewal, and automated dispatch.'}
                  </p>
                </div>
                <div className="hero-action-row">
                  <button
                    type="button"
                    className="hero-action-pill"
                    onClick={() => loadApplications(user?.email || 'iamramm8@gmail.com')}
                  >
                    <span>Renew Registry</span>
                    <span className="hero-arrow">→</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
          {/* LOWER SPLIT LAYOUT */}
          <div className="bento-lower-grid">
            {/* LEFT MAIN DATA PANEL */}
            <div className="bento-left-panel">
              {/* CAPSULE STACKED STATS VISUALIZER */}
              <div className="bento-stats-capsule-box">
                <div className="stats-box-header">
                  <div>
                    <h4 className="stats-box-title">Diocesan Monthly Activity & Registrations</h4>
                    <p className="stats-box-sub">Candidate submissions and renewals across taluk zones</p>
                  </div>
                  <div className="stats-capsule-badge">
                    <span>Weekly Trends</span>
                  </div>
                </div>

                <div className="capsule-bars-visualizer">
                  {[
                    { day: 'Mon', val: 82, count: '82%', limeVal: 45 },
                    { day: 'Tue', val: 64, count: '64%', limeVal: 30 },
                    { day: 'Wed', val: 91, count: '91%', limeVal: 60 },
                    { day: 'Thu', val: 75, count: '75%', limeVal: 40 },
                    { day: 'Fri', val: 88, count: '88%', limeVal: 55 },
                    { day: 'Sat', val: 95, count: '95%', limeVal: 70 },
                    { day: 'Sun', val: 70, count: '70%', limeVal: 35 },
                  ].map((bar, idx) => (
                    <div className="capsule-col" key={idx}>
                      <div className="capsule-pillar-track">
                        <div className="capsule-pill-lime" style={{ height: `${bar.limeVal}%` }}>
                          <span className="pill-tip-tag">{bar.count}</span>
                        </div>
                        <div className="capsule-pill-dark" style={{ height: `${bar.val - bar.limeVal}%` }}></div>
                      </div>
                      <span className="capsule-day-label">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEARCH AND FILTER BAR */}
              <div className="bento-table-controls">
                <div className="bento-search-pill">
                  <SearchIcon size={16} />
                  <input
                    type="text"
                    placeholder={isTa ? 'பெயர், விண்ணப்ப எண், ஊர் அல்லது எண் மூலம் தேடுக...' : 'Search members by Name, ID, District, Phone...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button type="button" className="clear-btn" onClick={() => setSearchTerm('')}>✕</button>
                  )}
                </div>

                <div className="bento-filter-pills">
                  <button
                    type="button"
                    className={`filter-pill ${statusFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('ALL')}
                  >
                    All ({applications.length})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${statusFilter === 'PENDING' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('PENDING')}
                  >
                    Pending ({countUnderReview + countSubmitted})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${statusFilter === 'ACCEPTED' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('ACCEPTED')}
                  >
                    Accepted ({countAccepted})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${statusFilter === 'EXPIRING' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('EXPIRING')}
                  >
                    Expiring Soon ({subExpiring + subExpired})
                  </button>
                </div>
              </div>

              {/* DATA TABLE / LIST */}
              <div className="bento-data-table-wrap">
                {loading ? (
                  <div className="bento-loading-box">
                    <div className="bento-spinner"></div>
                    <p>{isTa ? 'விண்ணப்பங்கள் ஏற்றப்படுகின்றன...' : 'Loading Diocese Applications & Registry...'}</p>
                  </div>
                ) : filteredApps.length === 0 ? (
                  <div className="bento-empty-box">
                    <h4>{isTa ? 'விண்ணப்பங்கள் எதுவும் காணப்படவில்லை' : 'No Applications Found'}</h4>
                    <p>{isTa ? 'தேடல் சொல்லை மாற்றி முயற்சிக்கவும்.' : 'Try adjusting your search query or filter selection.'}</p>
                  </div>
                ) : (
                  <div className="bento-table-container">
                    <table className="bento-table">
                      <thead>
                        <tr>
                          <th>APPLICANT / MINISTRY</th>
                          <th>ID</th>
                          <th>DISTRICT</th>
                          <th>ANNUAL SUBSCRIPTION</th>
                          <th>STATUS</th>
                          <th className="text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApps.map((app) => {
                          const initials = (app.applicantName || 'Applicant')
                            .split(' ')
                            .map(n => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()

                          return (
                            <tr key={app.applicationId || app.id} className="bento-row">
                              {/* APPLICANT */}
                              <td>
                                <div className="applicant-cell">
                                  <div className="applicant-avatar-chip">{initials}</div>
                                  <div className="applicant-info">
                                    <div className="applicant-name">{app.applicantName || 'Unnamed Candidate'}</div>
                                    <div className="applicant-sub">{app.mobileNumber || app.email || 'No contact'}</div>
                                  </div>
                                </div>
                              </td>

                              {/* APP ID */}
                              <td>
                                <span className="app-id-pill">{app.applicationId || 'APP-ACI'}</span>
                              </td>

                              {/* DISTRICT */}
                              <td>
                                <span className="district-tag">{app.district || app.cityTown || 'Tamil Nadu'}</span>
                              </td>

                              {/* SUBSCRIPTION STATUS & EXPIRY */}
                              <td>
                                {app.status === 'ACCEPTED' ? (
                                  <div className="sub-status-box">
                                    {app.subState === 'ACTIVE' && (
                                      <span className="sub-badge active-badge">
                                        <span className="status-dot-pulse green-dot"></span>
                                        <span>Active ({app.daysLeft}d left)</span>
                                      </span>
                                    )}
                                    {app.subState === 'EXPIRING_SOON' && (
                                      <span className="sub-badge warning-badge">
                                        <span className="status-dot-pulse amber-dot"></span>
                                        <span>Expiring ({app.daysLeft}d left)</span>
                                      </span>
                                    )}
                                    {app.subState === 'EXPIRED' && (
                                      <span className="sub-badge expired-badge">
                                        <span className="status-dot-pulse red-dot"></span>
                                        <span>Expired ({Math.abs(app.daysLeft)}d ago)</span>
                                      </span>
                                    )}
                                    <span className="sub-date-sub">
                                      Renews: {app.expiryDate ? app.expiryDate.toLocaleDateString() : 'Annual'}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="sub-badge vetting-badge">
                                    <span>Vetting in progress</span>
                                  </span>
                                )}
                              </td>

                              {/* STATUS PILL */}
                              <td>
                                {app.status === 'ACCEPTED' && <span className="status-pill status-accepted">Approved</span>}
                                {app.status === 'SUBMITTED' && <span className="status-pill status-submitted">New</span>}
                                {app.status === 'UNDER_REVIEW' && <span className="status-pill status-review">In Review</span>}
                                {app.status === 'REJECTED' && <span className="status-pill status-rejected">Rejected</span>}
                              </td>

                              {/* ACTIONS */}
                              <td className="text-right">
                                <div className="row-actions-group">
                                  <Link
                                    to={`/admin/application/${app.applicationId}`}
                                    className="row-action-btn view-btn"
                                    title="Inspect Application & Credentials"
                                  >
                                    View
                                  </Link>

                                  <button
                                    type="button"
                                    className="row-action-btn wa-btn"
                                    onClick={() => handleWhatsAppReminder(app)}
                                    title="Send WhatsApp Renewal Notice"
                                  >
                                    WhatsApp
                                  </button>

                                  {app.status === 'ACCEPTED' && (
                                    <button
                                      type="button"
                                      className="row-action-btn renew-btn"
                                      onClick={() => handleRenewSubscription(app.applicationId)}
                                      disabled={renewingId === app.applicationId}
                                      title="Extend Subscription for +1 Year (365 Days)"
                                    >
                                      {renewingId === app.applicationId ? '...' : '+1 Year'}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            {/* RIGHT ASIDE BENTO QUICK ACCESS WIDGETS */}
            <aside className="bento-right-aside">
              <div className="aside-bento-card">
                <div className="aside-card-top">
                  <div className="aside-icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l9 5H3l9-5z"></path>
                    </svg>
                  </div>
                  <span className="aside-badge">ACTIVE DESK</span>
                </div>
                <h4 className="aside-card-title">Synod Council Desk</h4>
                <p className="aside-card-desc">
                  Central executive board review, ordination validation, and bishopric protocol.
                </p>
                <div className="aside-card-footer">
                  <span className="aside-count-tag">12 Trustees</span>
                  <button type="button" className="aside-arrow-btn" title="Open Synod Desk">↗</button>
                </div>
              </div>

              <div className="aside-bento-card">
                <div className="aside-card-top">
                  <div className="aside-icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <span className="aside-badge lime-aside-badge">VIRUDHUNAGAR</span>
                </div>
                <h4 className="aside-card-title">Diocesan Coordinators</h4>
                <div className="aside-coord-list">
                  <div className="coord-mini-item">
                    <strong>Jeddiah Dhurai Raj</strong>
                    <span>Sattur Taluk • 9994411422</span>
                  </div>
                  <div className="coord-mini-item">
                    <strong>James</strong>
                    <span>Virudhunagar • 9629437495</span>
                  </div>
                  <div className="coord-mini-item">
                    <strong>Selvakumar</strong>
                    <span>Sivakasi • 8144603057</span>
                  </div>
                </div>
                <div className="aside-card-footer">
                  <span className="aside-count-tag">3 Coordinators Active</span>
                  <button type="button" className="aside-arrow-btn" title="Manage Coordinators">↗</button>
                </div>
              </div>

              <div className="aside-bento-card">
                <div className="aside-card-top">
                  <div className="aside-icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <span className="aside-badge">SECURE VAULT</span>
                </div>
                <h4 className="aside-card-title">Diocese Registry & Archives</h4>
                <p className="aside-card-desc">
                  Ministerial ordinations, government affidavits, and membership records.
                </p>
                <div className="aside-card-footer">
                  <span className="aside-count-tag">Cloud Sync OK</span>
                  <button type="button" className="aside-arrow-btn" title="View Archives">↗</button>
                </div>
              </div>

              <div className="aside-bento-card">
                <div className="aside-card-top">
                  <div className="aside-icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="2"></circle>
                      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
                    </svg>
                  </div>
                  <span className="aside-badge">BROADCAST</span>
                </div>
                <h4 className="aside-card-title">Diocese Media & Bulletins</h4>
                <p className="aside-card-desc">
                  Publish circulars, convention bulletins, and prayer gallery updates.
                </p>
                <div className="aside-card-footer">
                  <Link to="/gallery" className="aside-count-tag">View Gallery</Link>
                  <Link to="/gallery" className="aside-arrow-btn" title="Open Media Desk">↗</Link>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
