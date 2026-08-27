import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { decodeGoogleJwt } from '../../utils/jwtDecode'
import './AuthModal.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '103829581920-placeholder.apps.googleusercontent.com'

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogleCredential } = useAuth()
  const { lang } = useLanguage()
  const isTa = lang === 'ta'

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const googleBtnRef = useRef(null)

  // Initialize official Google Identity Services button
  useEffect(() => {
    if (!isAuthModalOpen) return

    const handleCredentialResponse = async (response) => {
      if (!response || !response.credential) {
        setErrorMsg(isTa ? 'கூகுள் உள்நுழைவு தோல்வியடைந்தது.' : 'Google authentication response was empty.')
        return
      }

      setLoading(true)
      setErrorMsg('')

      const payload = decodeGoogleJwt(response.credential)
      if (!payload || !payload.email) {
        setErrorMsg(isTa ? 'கூகுள் கணக்கு தகவலை பெற முடியவில்லை.' : 'Unable to decode Google identity token.')
        setLoading(false)
        return
      }

      const result = await loginWithGoogleCredential(response.credential, payload)
      if (!result.success) {
        setErrorMsg(result.error || (isTa ? 'உள்நுழைவு தோல்வியடைந்தது.' : 'Authentication failed.'))
      }
      setLoading(false)
    }

    if (window.google?.accounts?.id && googleBtnRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        })

        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'continue_with',
          logo_alignment: 'left',
          width: 340,
        })
      } catch (err) {
        console.warn('GIS Button render error:', err)
      }
    }
  }, [isAuthModalOpen, isTa])

  if (!isAuthModalOpen) return null

  // Fallback OAuth Simulator for Local Testing when Google Client ID is pending setup
  const handleLocalOAuthSim = async (simulatedEmail, simulatedName) => {
    setLoading(true)
    setErrorMsg('')

    const mockGoogleSub = '10928374619283' + Math.floor(1000 + Math.random() * 9000)
    const mockPayload = {
      sub: mockGoogleSub,
      email: simulatedEmail,
      email_verified: true,
      name: simulatedName,
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(simulatedName)}`,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }

    const mockToken = `mock-header.${btoa(JSON.stringify(mockPayload))}.mock-signature`
    const result = await loginWithGoogleCredential(mockToken, mockPayload)
    if (!result.success) {
      setErrorMsg(result.error || 'Authentication failed.')
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
            {isTa ? 'அதிகாரப்பூர்வ கூகுள் உள்நுழைவு' : 'Google Identity Sign-In'}
          </h2>
          <p className="auth-modal-subtitle">
            {isTa
              ? 'விண்ணப்பத்தை தொடங்க உங்கள் சரிபார்க்கப்பட்ட கூகுள் கணக்குடன் உள்நுழையவும்.'
              : 'Sign in with your verified Google account to open your application, auto-save drafts, and track progress.'}
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="auth-modal-body">
          {/* Official Google Identity Button Container */}
          <div className="google-gis-container">
            <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center', minHeight: '44px' }} />
          </div>

          {/* Direct Local Developer Sandbox Shortcuts */}
          <div className="auth-sandbox-divider">
            <span>{isTa ? 'அல்லது விரைவு உள்நுழைவு' : 'or Select Account'}</span>
          </div>

          <div className="auth-quick-accounts-grid">
            <button
              type="button"
              disabled={loading}
              className="quick-account-btn applicant"
              onClick={() => handleLocalOAuthSim('pastor.john.samuel@gmail.com', 'Pastor S. John Samuel')}
            >
              <div className="account-avatar">JS</div>
              <div className="account-text">
                <strong>Pastor S. John Samuel</strong>
                <span>pastor.john.samuel@gmail.com</span>
              </div>
              <span className="account-tag applicant">{isTa ? 'விண்ணப்பதாரர்' : 'Applicant'}</span>
            </button>

            <button
              type="button"
              disabled={loading}
              className="quick-account-btn admin"
              onClick={() => handleLocalOAuthSim('rev.johnsondurai@gmail.com', 'Rt. Rev. S. Johnson Durai')}
            >
              <div className="account-avatar admin">JD</div>
              <div className="account-text">
                <strong>Rt. Rev. S. Johnson Durai</strong>
                <span>rev.johnsondurai@gmail.com</span>
              </div>
              <span className="account-tag admin">{isTa ? 'நிர்வாகி' : 'Administrator'}</span>
            </button>
          </div>

          <div className="auth-privacy-notice">
            🔒 {isTa
              ? 'கூகுள் OAuth 2.0 மூலம் பாதுகாக்கப்பட்டது • கடவுச்சொற்கள் சேமிக்கப்படாது.'
              : 'Secured via Google Identity Services • No passwords stored.'}
          </div>
        </div>

      </div>
    </div>
  )
}
