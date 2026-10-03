import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../services/api'
import './UserProfileModal.css'

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, isAdmin, logout } = useAuth()
  const { language } = useLanguage()
  const isTa = language === 'ta'

  const [application, setApplication] = useState(null)
  const [loadingApp, setLoadingApp] = useState(false)
  const [showRenewalInfo, setShowRenewalInfo] = useState(false)

  useEffect(() => {
    if (isOpen && user?.email) {
      fetchUserApp()
    }
  }, [isOpen, user])

  const fetchUserApp = async () => {
    setLoadingApp(true)
    try {
      const res = await api.getMyApplication(user.email, user.googleSub)
      if (res && res.success && res.application) {
        setApplication(res.application)
      } else {
        setApplication(null)
      }
    } catch (e) {
      console.warn('Failed to load user membership:', e)
    } finally {
      setLoadingApp(false)
    }
  }

  if (!isOpen || !user) return null

  // Calculate annual subscription & expiry
  const affiliatedDate = application?.submittedAt ? new Date(application.submittedAt) : new Date('2026-01-01')
  
  let expiryDate = application?.subscriptionExpiryDate 
    ? new Date(application.subscriptionExpiryDate) 
    : new Date(affiliatedDate.getTime() + 365 * 24 * 60 * 60 * 1000)

  const now = new Date()
  const diffTime = expiryDate.getTime() - now.getTime()
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  let subStatus = 'ACTIVE'
  let subStatusClass = 'status-active'
  let subStatusLabel = isTa ? 'செயலில் உள்ளது (Active)' : 'Active (Affiliated)'

  if (isAdmin) {
    subStatus = 'ACTIVE'
    subStatusClass = 'status-active'
    subStatusLabel = isTa ? 'முதன்மை நிர்வாகி (Active Executive)' : 'Active Executive Access'
  } else if (application?.status === 'REJECTED') {
    subStatus = 'REJECTED'
    subStatusClass = 'status-expired'
    subStatusLabel = isTa ? 'நிராகரிக்கப்பட்டது' : 'Application Rejected'
  } else if (!application || application.status === 'DRAFT' || application.status === 'SUBMITTED' || application.status === 'UNDER_REVIEW') {
    subStatus = 'PENDING'
    subStatusClass = 'status-pending'
    subStatusLabel = isTa ? 'பரிசீலனையில் உள்ளது' : 'Pending Approval'
  } else if (daysRemaining <= 0) {
    subStatus = 'EXPIRED'
    subStatusClass = 'status-expired'
    subStatusLabel = isTa ? 'காலாவதியானது (Renewal Required)' : 'Expired (Renewal Required)'
  } else if (daysRemaining <= 30) {
    subStatus = 'EXPIRING_SOON'
    subStatusClass = 'status-warning'
    subStatusLabel = isTa ? 'விரைவில் காலாவதியாகிறது' : 'Expiring Soon'
  }

  const diocesanId = application?.applicationId || (isAdmin ? 'ACI-EXEC-001' : 'ACI-2026-MEM')

  return (
    <div className="user-profile-modal-backdrop" onClick={onClose}>
      <div className="user-profile-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Ribbon */}
        <div className="upm-header">
          <div className="upm-header-brand">
            <div className="upm-shield-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <span className="upm-brand-sub">APOSTOLIC COUNCIL OF INDIA DIOCESE</span>
              <h3 className="upm-brand-title">{isTa ? 'உறுப்பினர் சுயவிவரம் & பாதுகாப்பு' : 'Member Identity & Security'}</h3>
            </div>
          </div>
          <button type="button" className="upm-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* User Identity Card */}
        <div className="upm-body">
          
          <div className="upm-identity-banner">
            <div className="upm-avatar-wrap">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="upm-avatar-img" />
              ) : (
                <div className="upm-avatar-fallback">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <span className="upm-online-dot" title="Verified Session"></span>
            </div>

            <div className="upm-identity-details">
              <h2 className="upm-user-name">{user.name}</h2>
              <p className="upm-user-email">{user.email}</p>
              <div className="upm-tags-row">
                {isAdmin ? (
                  <span className="upm-badge admin-badge">🛡️ {isTa ? 'முதன்மை நிர்வாகி' : 'Diocesan Administrator'}</span>
                ) : (
                  <span className="upm-badge member-badge">✝️ {isTa ? 'பேராய உறுப்பினர்' : 'Diocese Member'}</span>
                )}
                <span className="upm-id-pill">ID: {diocesanId}</span>
              </div>
            </div>
          </div>

          {/* Annual Subscription & Renewal Box */}
          <div className="upm-sub-card">
            <div className="upm-sub-header">
              <div className="upm-sub-title-wrap">
                <span className="upm-sub-type-badge">
                  {isTa ? 'ஆண்டு உறுப்பினர் சந்தா' : 'ANNUAL AFFILIATION PLAN'}
                </span>
                <h4 className="upm-sub-title">
                  {isTa ? '1 வருட பேராய இணைப்பு (365 நாட்கள்)' : '1-Year Ministerial Affiliation (365 Days)'}
                </h4>
              </div>
              <span className={`upm-sub-status-tag ${subStatusClass}`}>
                {subStatusLabel}
              </span>
            </div>

            <div className="upm-sub-grid">
              <div className="upm-sub-stat">
                <span className="upm-stat-label">{isTa ? 'இணைந்த தேதி' : 'Affiliation Date'}</span>
                <strong className="upm-stat-val">{affiliatedDate.toLocaleDateString()}</strong>
              </div>
              <div className="upm-sub-stat">
                <span className="upm-stat-label">{isTa ? 'காலாவதியாகும் தேதி' : 'Valid Until (Expiry)'}</span>
                <strong className="upm-stat-val text-gold">{expiryDate.toLocaleDateString()}</strong>
              </div>
              <div className="upm-sub-stat">
                <span className="upm-stat-label">{isTa ? 'மீதமுள்ள நாட்கள்' : 'Days Remaining'}</span>
                <strong className={`upm-stat-val ${daysRemaining <= 30 ? 'text-amber' : 'text-green'}`}>
                  {daysRemaining > 0 ? `${daysRemaining} ${isTa ? 'நாட்கள்' : 'Days'}` : (isTa ? 'காலாவதியானது' : 'Expired')}
                </strong>
              </div>
            </div>

            {/* Annual Renewal Notice */}
            <div className="upm-sub-footer">
              <div className="upm-sub-policy">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>
                  {isTa 
                    ? 'பேராய விதிமுறைகளின்படி, அனைத்து அங்கத்தினர்களும் ஆண்டுதோறும் தங்கள் அங்கீகாரத்தை புதுப்பிக்க வேண்டும்.'
                    : 'Per Diocesan Constitution, ministerial credentials & certificates are renewed on an annual basis.'}
                </span>
              </div>
              
              <button 
                type="button" 
                className="upm-renew-btn"
                onClick={() => setShowRenewalInfo(!showRenewalInfo)}
              >
                {isTa ? 'புதுப்பித்தல் விவரங்கள்' : 'Annual Renewal Details'}
              </button>
            </div>

            {showRenewalInfo && (
              <div className="upm-renewal-modal-box">
                <h5>{isTa ? 'ஆண்டு புதுப்பித்தல் வழிகாட்டுதல்' : 'Annual Renewal Instructions'}</h5>
                <p>
                  {isTa
                    ? 'உங்கள் பேராய அங்கீகாரத்தை புதுப்பிக்க செயலகத்தை தொடர்பு கொள்ளவும் அல்லது Canara Bank கணக்கிற்கு சந்தா செலுத்தி ரசீதை அனுப்பவும்.'
                    : 'To renew your annual affiliation, remit the annual dues to Canara Bank A/C 1567201000059 (IFSC: CNRB0001567) and send the receipt to Secretariat.'}
                </p>
                <div className="upm-renew-contacts">
                  <span>📞 +91 93457 12307</span>
                  <span>✉️ rev.johnsondurai@gmail.com</span>
                </div>
              </div>
            )}
          </div>

          {/* High Security Badges */}
          <div className="upm-security-bar">
            <div className="upm-sec-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>256-Bit SSL Encrypted</span>
            </div>
            <div className="upm-sec-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Synod Authenticated</span>
            </div>
            <div className="upm-sec-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Annual Cycle 2026</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="upm-footer">
          <Link 
            to="/get-involved/status" 
            className="upm-btn-portal"
            onClick={onClose}
          >
            {isTa ? 'விண்ணப்ப பக்கம் செல்லவும்' : 'Go to Applicant Dashboard'} →
          </Link>
          
          {isAdmin && (
            <Link 
              to="/admin/applications" 
              className="upm-btn-admin"
              onClick={onClose}
            >
              🛡️ {isTa ? 'நிர்வாக தளம்' : 'Admin Portal'}
            </Link>
          )}

          <button 
            type="button" 
            className="upm-btn-logout"
            onClick={() => { logout(); onClose(); }}
          >
            {isTa ? 'வெளியேறு' : 'Sign Out'}
          </button>
        </div>

      </div>
    </div>
  )
}
