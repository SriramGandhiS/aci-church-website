import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import './ProtectedAdminRoute.css'

export default function ProtectedAdminRoute({ children }) {
  const { user, isAdmin, loading, openAuthModal } = useAuth()
  const { language } = useLanguage()
  const isTa = language === 'ta'

  if (loading) {
    return (
      <div className="admin-lock-screen">
        <div className="admin-lock-spinner"></div>
        <p>{isTa ? 'அங்கீகாரம் சரிபார்க்கப்படுகிறது...' : 'Verifying Administrative Clearance...'}</p>
      </div>
    )
  }

  // Not logged in or not an admin
  if (!user || !isAdmin) {
    return (
      <div className="admin-lock-screen">
        <div className="admin-lock-card">
          <div className="admin-lock-badge-icon">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          
          <span className="admin-lock-pill">
            {isTa ? 'பாதுகாக்கப்பட்ட நிர்வாக தளம்' : 'RESTRICTED EXECUTIVE AREA'}
          </span>
          
          <h2 className="admin-lock-title">
            {isTa ? 'நிர்வாக அணுகல் தேவை' : 'Administrator Access Required'}
          </h2>
          
          <p className="admin-lock-desc">
            {isTa
              ? 'இந்த பகுதி அப்போஸ்தலிக் கவுன்சில் ஆஃப் இந்தியா பேராயத்தின் அங்கீகரிக்கப்பட்ட முதன்மை நிர்வாகிகளுக்கு மட்டுமே ஒதுக்கப்பட்டுள்ளது. மற்ற பயனர்களுக்கு அனுமதி இல்லை.'
              : 'This registry and control panel is strictly restricted to verified Diocesan Executives and Synod Administrators. Unauthorized access attempts are monitored and logged.'}
          </p>

          {!user ? (
            <div className="admin-lock-actions">
              <button 
                type="button"
                className="admin-lock-btn-primary"
                onClick={() => openAuthModal()}
              >
                {isTa ? 'நிர்வாகியாக உள்நுழைக' : 'Sign In with Admin Account'}
              </button>
              <Link to="/" className="admin-lock-btn-secondary">
                {isTa ? 'முகப்புக்குத் திரும்பு' : 'Return to Home'}
              </Link>
            </div>
          ) : (
            <div className="admin-lock-actions">
              <div className="admin-lock-logged-info">
                <span>{isTa ? 'தற்போதைய கணக்கு:' : 'Signed in as:'}</span>
                <strong>{user.email}</strong>
                <span className="admin-lock-status-badge">
                  {isTa ? 'வழக்கமான உறுப்பினர் (நிர்வாக அனுமதி இல்லை)' : 'Standard Member (No Admin Privilege)'}
                </span>
              </div>
              <Link to="/get-involved/status" className="admin-lock-btn-primary">
                {isTa ? 'என் உறுப்பினர் பக்கம் (Dashboard)' : 'Go to My Applicant Dashboard'}
              </Link>
              <Link to="/" className="admin-lock-btn-secondary">
                {isTa ? 'முகப்புக்குத் திரும்பு' : 'Return to Home'}
              </Link>
            </div>
          )}
        </div>
      </div>
    )
  }

  return children
}
