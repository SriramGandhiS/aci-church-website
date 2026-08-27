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
  const { user, isAdmin, requireAuth, logout } = useAuth()
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED'

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



  // Filtered & Searched Applications
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

  // Metrics Count
  const countTotal = applications.length
  const countSubmitted = applications.filter((a) => a.status === 'SUBMITTED').length
  const countUnderReview = applications.filter((a) => a.status === 'UNDER_REVIEW').length
  const countAccepted = applications.filter((a) => a.status === 'ACCEPTED').length
  const countRejected = applications.filter((a) => a.status === 'REJECTED').length

  return (
    <div className="admin-page-container">
      {/* Top Header */}
      <div className="admin-top-bar">
        <div>
          <div className="admin-badge">
            <span>🛡️ ACI DIOCESE CENTRAL ADMINISTRATIVE PORTAL</span>
          </div>
          <h1 className="admin-page-title">
            {isTa ? 'உறுப்பினர் விண்ணப்பங்கள் மேலாண்மை' : 'Membership Applications Management'}
          </h1>
          <p className="admin-page-sub">
            {isTa
              ? 'விண்ணப்பங்களை சரிபார்த்தல், 2-பக்க படிவத்தை ஆய்வு செய்தல் மற்றும் தீர்மானங்களை பதிவு செய்தல்.'
              : 'Review submitted membership applications, inspect official 2-page documents, and record committee decisions.'}
          </p>
        </div>

        <div className="admin-user-ctrl">
          <span className="admin-user-email">Admin: <strong>{user.email}</strong></span>
          <button type="button" className="admin-logout-btn" onClick={logout}>
            {isTa ? 'வெளியேறு' : 'Sign Out'}
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="admin-metrics-grid">
        <div className="metric-card total" onClick={() => setStatusFilter('ALL')}>
          <span className="metric-lbl">{isTa ? 'மொத்த விண்ணப்பங்கள்' : 'Total Applications'}</span>
          <span className="metric-num">{countTotal}</span>
        </div>
        <div className="metric-card submitted" onClick={() => setStatusFilter('SUBMITTED')}>
          <span className="metric-lbl">{isTa ? 'புதியவை (Submitted)' : 'New Submissions'}</span>
          <span className="metric-num">{countSubmitted}</span>
        </div>
        <div className="metric-card review" onClick={() => setStatusFilter('UNDER_REVIEW')}>
          <span className="metric-lbl">{isTa ? 'பரிசீலனையில்' : 'Under Review'}</span>
          <span className="metric-num">{countUnderReview}</span>
        </div>
        <div className="metric-card accepted" onClick={() => setStatusFilter('ACCEPTED')}>
          <span className="metric-lbl">{isTa ? 'அங்கீகரிக்கப்பட்டவை' : 'Accepted'}</span>
          <span className="metric-num">{countAccepted}</span>
        </div>
        <div className="metric-card rejected" onClick={() => setStatusFilter('REJECTED')}>
          <span className="metric-lbl">{isTa ? 'நிராகரிக்கப்பட்டவை' : 'Rejected'}</span>
          <span className="metric-num">{countRejected}</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="admin-controls-card">
        <div className="admin-search-wrap">
          <SearchIcon size={16} />
          <input
            type="text"
            placeholder={isTa ? 'விண்ணப்ப எண், பெயர், ஊர் அல்லது மின்னஞ்சல் மூலம் தேடுக...' : 'Search by Application ID, Name, Email, or City...'}
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

      {/* Applications Table */}
      {loading ? (
        <div className="admin-loading-card">
          <div className="app-dash-spinner" />
          <p>{isTa ? 'விண்ணப்பங்கள் ஏற்றப்படுகின்றன...' : 'Loading applications from Google Database...'}</p>
        </div>
      ) : filteredApps.length > 0 ? (
        <div className="admin-table-card">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Applicant Name</th>
                <th>Email & Phone</th>
                <th>Ministry Calling</th>
                <th>Location</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.applicationId}>
                  <td className="font-mono font-bold">{app.applicationId}</td>
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
                      <span>Review</span> →
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
  )
}
