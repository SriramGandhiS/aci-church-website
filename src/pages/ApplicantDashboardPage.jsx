import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import FilledApplicationPdf from '../components/Form/FilledApplicationPdf'
import {
  UserCheckIcon,
  DocumentIcon,
  AlertCircleIcon,
  CheckIcon,
  ArrowLeftIcon,
  PrintIcon
} from '../components/Icons/SvgIcons'
import './ApplicantDashboardPage.css'

export default function ApplicantDashboardPage() {
  const { user, requireAuth, logout } = useAuth()
  const { lang } = useLanguage()
  const isTa = lang === 'ta'
  const navigate = useNavigate()

  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewingForm, setViewingForm] = useState(false)

  useEffect(() => {
    if (user?.email) {
      loadApplication(user.email, user.googleSub)
    } else {
      requireAuth((loggedUser) => {
        loadApplication(loggedUser.email, loggedUser.googleSub)
      })
    }
  }, [user])

  const loadApplication = async (email, googleSub) => {
    setLoading(true)
    try {
      const res = await api.getMyApplication(email, googleSub)
      if (res && res.success && res.application) {
        setApplication(res.application)
      } else {
        setApplication(null)
      }
    } catch (e) {
      console.warn('Error fetching application:', e)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="app-dash-container">
        <div className="app-dash-card text-center">
          <h2>{isTa ? 'உள்நுழைவு தேவை' : 'Authentication Required'}</h2>
          <p>{isTa ? 'விண்ணப்ப நிலையை சரிபார்க்க உள்நுழையவும்.' : 'Please sign in to view your application status.'}</p>
          <button type="button" className="btn btn-primary" onClick={() => requireAuth()}>
            {isTa ? 'உள்நுழைக' : 'Sign In with Google'}
          </button>
        </div>
      </div>
    )
  }

  if (viewingForm && application?.data) {
    return (
      <FilledApplicationPdf
        data={application.data}
        onEdit={() => setViewingForm(false)}
        isTa={isTa}
      />
    )
  }

  return (
    <div className="app-dash-container">
      <div className="app-dash-header">
        <div className="app-dash-user-info">
          <div className="app-dash-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h1 className="app-dash-welcome">
              {isTa ? 'வணக்கம்' : 'Welcome'}, {user.name}
            </h1>
            <p className="app-dash-email">{user.email}</p>
          </div>
        </div>

        <button type="button" className="app-dash-logout-btn" onClick={logout}>
          {isTa ? 'வெளியேறு' : 'Sign Out'}
        </button>
      </div>

      {loading ? (
        <div className="app-dash-loading">
          <div className="app-dash-spinner" />
          <p>{isTa ? 'விண்ணப்ப விவரங்கள் ஏற்றப்படுகின்றன...' : 'Loading your application details...'}</p>
        </div>
      ) : application ? (
        <div className="app-dash-content">
          
          {/* Status Badge Card */}
          <div className={`app-status-hero-card ${application.status.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="status-hero-left">
              <span className="status-hero-label">{isTa ? 'தற்போதைய நிலை' : 'Current Application Status'}</span>
              <h2 className="status-hero-val">{application.status}</h2>
              <p className="status-hero-id">
                {isTa ? 'விண்ணப்ப எண்' : 'Application ID'}: <strong>{application.applicationId}</strong>
              </p>
              {application.submittedAt && (
                <p className="status-hero-date">
                  {isTa ? 'சமர்ப்பிக்கப்பட்ட தேதி' : 'Submitted On'}: {new Date(application.submittedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="status-hero-right">
              {application.status === 'ACCEPTED' && (
                <div className="status-pill-lg accepted">
                  <CheckIcon size={20} />
                  <span>{isTa ? 'அங்கீகரிக்கப்பட்டது' : 'Approved & Affiliated'}</span>
                </div>
              )}
              {application.status === 'REJECTED' && (
                <div className="status-pill-lg rejected">
                  <AlertCircleIcon size={20} />
                  <span>{isTa ? 'நிராகரிக்கப்பட்டது' : 'Application Rejected'}</span>
                </div>
              )}
              {(application.status === 'SUBMITTED' || application.status === 'UNDER_REVIEW') && (
                <div className="status-pill-lg pending">
                  <UserCheckIcon size={20} />
                  <span>{isTa ? 'பரிசீலனையில் உள்ளது' : 'Under Committee Review'}</span>
                </div>
              )}
              {application.status === 'DRAFT' && (
                <div className="status-pill-lg draft">
                  <DocumentIcon size={20} />
                  <span>{isTa ? 'முழுமையடையாத வரைவு' : 'Incomplete Draft'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Notice Banner */}
          {application.status === 'REJECTED' && application.rejectionReason && (
            <div className="app-rejection-reason-card">
              <div className="rejection-card-header">
                <AlertCircleIcon size={18} />
                <h3>{isTa ? 'நிராகரிப்புக்கான காரணம் / குறிப்பு' : 'Reason for Rejection / Clarification Needed'}</h3>
              </div>
              <p className="rejection-reason-text">{application.rejectionReason}</p>
              <p className="rejection-help-text">
                {isTa
                  ? 'விவரங்களை திருத்த அல்லது புதிய ஆவணங்களை இணைக்க விண்ணப்பத்தை திருத்தவும்.'
                  : 'You may update your information or upload the requested documents and re-submit.'}
              </p>
            </div>
          )}

          {/* Action Cards */}
          <div className="app-dash-actions-grid">
            <div className="app-dash-action-card">
              <h3>{isTa ? 'அதிகாரப்பூர்வ விண்ணப்பப் படிவம்' : 'Official Application Form'}</h3>
              <p>{isTa ? 'உங்கள் 2-பக்க அதிகாரப்பூர்வ விண்ணப்பத்தை பார்வையிடவும் மற்றும் அச்சிடவும்.' : 'View and print your complete 2-page digital membership form.'}</p>
              <button
                type="button"
                className="app-dash-btn-view-pdf"
                onClick={() => setViewingForm(true)}
              >
                <PrintIcon size={16} />
                <span>{isTa ? 'படிவத்தை காண்க / அச்சிடு' : 'View / Print Official Form'}</span>
              </button>
            </div>

            <div className="app-dash-action-card">
              <h3>{isTa ? 'விண்ணப்பத் திருத்தம்' : 'Application Management'}</h3>
              <p>{isTa ? 'உங்கள் தகவல்களை சரிபார்க்க அல்லது தொடர படிவத்திற்கு செல்லவும்.' : 'Resume draft editing or review your entered details.'}</p>
              <Link to="/get-involved/application" className="app-dash-btn-edit">
                <span>{application.status === 'DRAFT' ? (isTa ? 'விண்ணப்பத்தை தொடரவும்' : 'Continue Application') : (isTa ? 'விண்ணப்பத்திற்கு செல்' : 'Open Application Wizard')}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      ) : (
        <div className="app-dash-empty-card">
          <DocumentIcon size={44} />
          <h2>{isTa ? 'விண்ணப்பம் எதுவும் தொடங்கப்படவில்லை' : 'No Application Found'}</h2>
          <p>{isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தில் உறுப்பினராக இணைய புதிய விண்ணப்பத்தை தொடங்கவும்.' : 'You have not submitted an application yet. Click below to begin your official 2-page membership application.'}</p>
          <Link to="/get-involved/application" className="btn btn-primary">
            {isTa ? 'புதிய விண்ணப்பத்தை தொடங்கு' : 'Start Membership Application'} →
          </Link>
        </div>
      )}
    </div>
  )
}
