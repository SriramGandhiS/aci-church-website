import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../services/api'
import { ShieldIcon, UserCheckIcon, UsersIcon, CheckIcon, LogOutIcon } from '../Icons/SvgIcons'
import './UserProfileModal.css'

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, isAdmin, logout } = useAuth()
  const { language } = useLanguage()
  const isTa = language === 'ta'

  const [application, setApplication] = useState(null)
  const [loadingApp, setLoadingApp] = useState(false)

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

  const appData = application?.data || {}
  
  const diocesanId = application?.applicationId || appData.applicationNumber || (isAdmin ? 'ACI-EXEC-001' : 'ACI-MEMBER')
  const designation = appData.designation || (isAdmin ? 'Diocesan Executive Administrator' : 'Episcopal Minister / Pastor')
  const district = appData.district || appData.city || 'Tamil Nadu Central Diocese'
  const churchName = appData.churchName || appData.organizationName || 'Affiliated Parish / Ministry'

  let memberStatus = 'ACTIVE'
  let memberStatusLabel = isTa ? 'செயலில் உள்ள உறுப்பினர்' : 'Active Diocese Member'
  let statusBadgeClass = 'status-active'

  if (isAdmin) {
    memberStatus = 'ADMIN'
    memberStatusLabel = isTa ? 'முதன்மை நிர்வாகி' : 'Executive Administrator'
    statusBadgeClass = 'status-admin'
  } else if (application?.status === 'REJECTED') {
    memberStatus = 'REJECTED'
    memberStatusLabel = isTa ? 'நிராகரிக்கப்பட்டது' : 'Application Rejected'
    statusBadgeClass = 'status-expired'
  } else if (!application || application.status === 'DRAFT' || application.status === 'SUBMITTED' || application.status === 'UNDER_REVIEW') {
    memberStatus = 'PENDING'
    memberStatusLabel = isTa ? 'பரிசீலனையில் உள்ளது' : 'Pending Verification'
    statusBadgeClass = 'status-pending'
  }

  return (
    <div className="user-profile-modal-backdrop" onClick={onClose}>
      <div className="user-profile-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Ribbon */}
        <div className="upm-header">
          <div className="upm-header-brand">
            <div className="upm-shield-icon">
              <ShieldIcon size={20} />
            </div>
            <div>
              <span className="upm-brand-sub">APOSTOLIC COUNCIL OF INDIA DIOCESE</span>
              <h3 className="upm-brand-title">{isTa ? 'உறுப்பினர் சுயவிவரம்' : 'Member Identity & Profile'}</h3>
            </div>
          </div>
          <button type="button" className="upm-close-btn" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
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
                  <span className="upm-badge admin-badge">{isTa ? 'முதன்மை நிர்வாகி' : 'Executive Admin'}</span>
                ) : (
                  <span className="upm-badge member-badge">{isTa ? 'பேராய உறுப்பினர்' : 'Diocese Member'}</span>
                )}
                <span className="upm-id-pill">ID: {diocesanId}</span>
              </div>
            </div>
          </div>

          {/* Member Credentials & Diocesan Record */}
          <div className="upm-member-record-card">
            <div className="upm-sub-header">
              <div className="upm-sub-title-wrap">
                <span className="upm-sub-type-badge">
                  {isTa ? 'அங்கத்துவ விபரம்' : 'MINISTERIAL CREDENTIALS'}
                </span>
                <h4 className="upm-sub-title">
                  {isTa ? 'அங்கீகரிக்கப்பட்ட பேராய உறுப்பினர்' : 'Verified Diocesan Membership'}
                </h4>
              </div>
              <span className={`upm-sub-status-tag ${statusBadgeClass}`}>
                {memberStatusLabel}
              </span>
            </div>

            <div className="upm-sub-grid">
              <div className="upm-sub-stat">
                <span className="upm-stat-label">{isTa ? 'பதவி / ஊழியம்' : 'Designation / Ministry'}</span>
                <strong className="upm-stat-val text-gold">{designation}</strong>
              </div>
              <div className="upm-sub-stat">
                <span className="upm-stat-label">{isTa ? 'மாவட்டம் / மண்டலம்' : 'Diocese / District'}</span>
                <strong className="upm-stat-val">{district}</strong>
              </div>
              <div className="upm-sub-stat">
                <span className="upm-stat-label">{isTa ? 'சபை / ஸ்தலம்' : 'Parish / Church'}</span>
                <strong className="upm-stat-val">{churchName}</strong>
              </div>
              <div className="upm-sub-stat">
                <span className="upm-stat-label">{isTa ? 'பதிவு எண்' : 'Registration ID'}</span>
                <strong className="upm-stat-val text-gold">{diocesanId}</strong>
              </div>
            </div>

            <div className="upm-member-info-footer">
              <div className="upm-sub-policy">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>
                  {isTa 
                    ? 'அப்போஸ்தலிக் கவுன்சில் ஆப் இந்தியா பேராயத்தின் அதிகாரப்பூர்வ பதிவேட்டில் சரிபார்க்கப்பட்டது.'
                    : 'Authenticated and registered in the official records of the Apostolic Council of India Diocese.'}
                </span>
              </div>
            </div>
          </div>

          {/* High Security Badges */}
          <div className="upm-security-bar">
            <div className="upm-sec-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>256-Bit SSL Encrypted</span>
            </div>
            <div className="upm-sec-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Synod Authenticated</span>
            </div>
            <div className="upm-sec-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Official Roster</span>
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
            {isTa ? 'விண்ணப்ப நிலை பக்கம்' : 'Applicant Status Dashboard'} →
          </Link>
          
          {isAdmin && (
            <Link 
              to="/admin/applications" 
              className="upm-btn-admin"
              onClick={onClose}
            >
              {isTa ? 'நிர்வாக தளம்' : 'Admin Portal'}
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
