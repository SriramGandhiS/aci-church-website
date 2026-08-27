import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import './AuthModal.css'

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle } = useAuth()
  const { lang } = useLanguage()
  const isTa = lang === 'ta'

  const [emailInput, setEmailInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isAuthModalOpen) return null

  const handleManualGoogleSubmit = async (e) => {
    e.preventDefault()
    if (!emailInput || !emailInput.includes('@')) {
      setErrorMsg(isTa ? 'சரியான மின்னஞ்சலை உள்ளிடவும்.' : 'Please enter a valid Google email address.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    const result = await loginWithGoogle({
      email: emailInput.toLowerCase().trim(),
      name: nameInput.trim() || emailInput.split('@')[0],
      avatar: '',
      sub: 'google-' + Math.random().toString(36).substring(2, 10)
    })

    if (!result.success) {
      setErrorMsg(result.error || (isTa ? 'உள்நுழைவு தோல்வியடைந்தது.' : 'Sign-in failed. Please try again.'))
    }
    setLoading(false)
  }

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        
        <button type="button" className="auth-modal-close-btn" onClick={closeAuthModal} aria-label="Close">
          ✕
        </button>

        <div className="auth-modal-header">
          <div className="auth-brand-badge">
            <img src="/aci-logo.png" alt="ACI Diocese Logo" className="auth-diocese-logo" onError={(e) => { e.target.src = '/aci-logo.jpg' }} />
            <span>{isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா' : 'Apostolic Council of India'}</span>
          </div>
          <h2 className="auth-modal-title">
            {isTa ? 'விண்ணப்பப் பதிவு மற்றும் உள்நுழைவு' : 'Membership Application Portal'}
          </h2>
          <p className="auth-modal-subtitle">
            {isTa
              ? 'விண்ணப்பத்தை தொடர, சேமிக்க மற்றும் நிலையை அறிய கூகுள் கணக்குடன் உள்நுழையவும்.'
              : 'Sign in with your Google account to start, auto-save drafts, and track your official application.'}
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="auth-modal-body">
          {/* Direct Google One-Click CTA */}
          <form onSubmit={handleManualGoogleSubmit} className="auth-form-wrap">
            <div className="auth-field-group">
              <label className="auth-label">
                {isTa ? 'கூகுள் மின்னஞ்சல் (Google Email)' : 'Google Account Email'} <span className="req">*</span>
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="pastor.name@gmail.com"
                className="auth-input"
                autoFocus
              />
            </div>

            <div className="auth-field-group">
              <label className="auth-label">
                {isTa ? 'முழுப் பெயர் (Applicant Full Name)' : 'Applicant Full Name'}
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Pastor / Rev. Name"
                className="auth-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-google-btn-submit"
            >
              {loading ? (
                <span>{isTa ? 'சரிபார்க்கிறது...' : 'Connecting...'}</span>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" className="google-icon" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{isTa ? 'கூகுள் கணக்குடன் தொடரவும்' : 'Continue with Google Account'}</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-privacy-notice">
            🔒 {isTa
              ? 'உங்கள் தரவு அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தின் அதிகாரப்பூர்வ பதிவேட்டில் பாதுகாப்பாக வைக்கப்படும்.'
              : 'Zero-fee diocesan portal. All submitted records and documents are privately secured.'}
          </div>
        </div>

      </div>
    </div>
  )
}
