import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import './AuthModal.css'

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, requestOtp, verifyOtp } = useAuth()
  const { lang } = useLanguage()
  const isTa = lang === 'ta'

  const [step, setStep] = useState('EMAIL') // 'EMAIL' | 'OTP'
  const [emailInput, setEmailInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [infoMsg, setInfoMsg] = useState('')

  if (!isAuthModalOpen) return null

  // Step 1: Send OTP to email
  const handleRequestOtp = async (e) => {
    e.preventDefault()
    if (!emailInput || !emailInput.includes('@')) {
      setErrorMsg(isTa ? 'சரியான மின்னஞ்சலை உள்ளிடவும்.' : 'Please enter a valid Google email address.')
      return
    }

    setLoading(true)
    setErrorMsg('')
    setInfoMsg('')

    const result = await requestOtp(emailInput.toLowerCase().trim())
    if (result && result.success) {
      setStep('OTP')
      setInfoMsg(isTa ? `சரிபார்ப்புக் குறியீடு ${emailInput} மின்னஞ்சலுக்கு அனுப்பப்பட்டுள்ளது.` : `A 6-digit verification code has been sent to ${emailInput}.`)
    } else {
      setErrorMsg(result?.error || result?.message || (isTa ? 'குறியீடு அனுப்புவதில் பிழை.' : 'Failed to send verification code.'))
    }
    setLoading(false)
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otpInput || otpInput.trim().length < 6) {
      setErrorMsg(isTa ? '6-இலக்க சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்.' : 'Please enter the 6-digit verification code.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    const result = await verifyOtp(
      emailInput.toLowerCase().trim(),
      otpInput.trim(),
      nameInput.trim() || emailInput.split('@')[0]
    )

    if (!result.success) {
      setErrorMsg(result.error || (isTa ? 'தவறான குறியீடு. மீண்டும் சரிபார்க்கவும்.' : 'Invalid verification code. Please check and try again.'))
    } else {
      // Reset state on successful login
      setStep('EMAIL')
      setOtpInput('')
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
            {step === 'EMAIL'
              ? (isTa ? 'விண்ணப்பப் பதிவு மற்றும் உள்நுழைவு' : 'Membership Application Portal')
              : (isTa ? 'மின்னஞ்சல் குறியீட்டு சரிபார்ப்பு' : 'Email OTP Verification')}
          </h2>
          <p className="auth-modal-subtitle">
            {step === 'EMAIL'
              ? (isTa
                  ? 'விண்ணப்பத்தை தொடங்க உங்கள் கூகுள் மின்னஞ்சலை உள்ளிடவும்.'
                  : 'Enter your Google email to receive a single-use verification code and begin your application.')
              : (isTa
                  ? `உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்ட 6-இலக்க குறியீட்டை உள்ளிடவும்.`
                  : `Please enter the 6-digit verification code sent to ${emailInput}.`)}
          </p>
        </div>

        {errorMsg && (
          <div className="auth-error-banner">
            ⚠️ {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="auth-info-banner" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '10px 14px', borderRadius: '6px', fontSize: '12.5px', marginBottom: '16px' }}>
            ✉️ {infoMsg}
          </div>
        )}

        <div className="auth-modal-body">
          {step === 'EMAIL' ? (
            /* Step 1: Email Form */
            <form onSubmit={handleRequestOtp} className="auth-form-wrap">
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
                  <span>{isTa ? 'குறியீடு அனுப்பப்படுகிறது...' : 'Sending Code...'}</span>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" className="google-icon" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>{isTa ? 'சரிபார்ப்புக் குறியீடு பெறுக' : 'Send Verification OTP'}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: OTP Verification Form */
            <form onSubmit={handleVerifyOtp} className="auth-form-wrap">
              <div className="auth-field-group">
                <label className="auth-label">
                  {isTa ? '6-இலக்க சரிபார்ப்புக் குறியீடு (6-Digit OTP)' : '6-Digit Verification Code'} <span className="req">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="• • • • • •"
                  className="auth-input font-mono font-bold text-center text-lg"
                  style={{ letterSpacing: '6px', fontSize: '20px' }}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || otpInput.trim().length < 6}
                className="auth-google-btn-submit"
              >
                {loading ? (
                  <span>{isTa ? 'சரிபார்க்கிறது...' : 'Verifying OTP...'}</span>
                ) : (
                  <span>{isTa ? 'சரிபார்த்து விண்ணப்பத்தை திறக்க' : 'Verify Code & Open Application'} →</span>
                )}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px' }}>
                <button
                  type="button"
                  onClick={() => setStep('EMAIL')}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  ← {isTa ? 'மின்னஞ்சலை மாற்றுக' : 'Change Email'}
                </button>

                <button
                  type="button"
                  onClick={handleRequestOtp}
                  style={{ background: 'none', border: 'none', color: '#1e40af', fontWeight: 600, cursor: 'pointer' }}
                >
                  🔄 {isTa ? 'மீண்டும் அனுப்பு' : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

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
