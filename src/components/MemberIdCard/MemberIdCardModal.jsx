import { useEffect } from 'react'
import { CloseIcon, PrintIcon, ShieldIcon, ChurchIcon, LocationIcon, PhoneIcon, EmailIcon } from '../Icons/SvgIcons'
import './MemberIdCardModal.css'

export default function MemberIdCardModal({ pastor, onClose, isTa }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [onClose])

  if (!pastor) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="idcard-backdrop" onClick={onClose}>
      <div className="idcard-container" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="idcard-close-btn" onClick={onClose} aria-label="Close ID Card">
          <CloseIcon size={18} />
        </button>

        {/* Card Body */}
        <div className="idcard-card">
          <div className="idcard-watermark">ACI DIOCESE</div>

          {/* Header */}
          <div className="idcard-header">
            <img src="/aci-logo.png" alt="ACI Diocese Emblem" className="idcard-logo" onError={(e) => { e.target.src = '/aci-logo.jpg' }} />
            <div className="idcard-header-titles">
              <h3 className="idcard-header-main">Apostolic Council of India Diocese</h3>
              <p className="idcard-header-sub">
                {isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயம்' : 'Episcopal Ministerial Credential Card'}
              </p>
              <p className="idcard-header-reg">
                Reg. No: 62/B.k.4/2013 · Central Trust Secretariat
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="idcard-body">
            {/* Top Row: Photo + Main Meta */}
            <div className="idcard-top-row">
              <div className="idcard-photo-box">
                <div className="idcard-avatar-icon">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="idcard-photo-tag">{pastor.status || 'Active'}</span>
              </div>

              <div className="idcard-main-meta">
                <span className="idcard-reg-pill">{pastor.regNo}</span>
                <h4 className="idcard-name">{pastor.name}</h4>
                <div className="idcard-office-badge">
                  <ShieldIcon size={13} color="#c8a96e" />
                  <span>{pastor.office || pastor.designation || 'Episcopal Minister'}</span>
                </div>
              </div>
            </div>

            {/* Fields Grid */}
            <div className="idcard-fields-grid">
              {pastor.church && (
                <div className="idcard-field idcard-field-full">
                  <span className="idcard-label">{isTa ? 'சபை பெயர் / ஊழியம்' : 'Church / Ministry'}</span>
                  <span className="idcard-value">{pastor.church}</span>
                </div>
              )}

              <div className="idcard-field">
                <span className="idcard-label">{isTa ? 'மாவட்டம்' : 'District'}</span>
                <span className="idcard-value">{pastor.district || 'Tamil Nadu'}</span>
              </div>

              <div className="idcard-field">
                <span className="idcard-label">{isTa ? 'மாநிலம்' : 'State'}</span>
                <span className="idcard-value">{pastor.state || 'Tamil Nadu'}</span>
              </div>

              {pastor.phone && (
                <div className="idcard-field">
                  <span className="idcard-label">{isTa ? 'தொலைபேசி' : 'Phone'}</span>
                  <span className="idcard-value">{pastor.phone}</span>
                </div>
              )}

              {pastor.email && (
                <div className="idcard-field">
                  <span className="idcard-label">{isTa ? 'மின்னஞ்சல்' : 'Email'}</span>
                  <span className="idcard-value">{pastor.email}</span>
                </div>
              )}

              {pastor.ordinationDate && (
                <div className="idcard-field">
                  <span className="idcard-label">{isTa ? 'பிரதிஷ்டை தேதி' : 'Ordination Date'}</span>
                  <span className="idcard-value">{pastor.ordinationDate}</span>
                </div>
              )}

              {pastor.address && (
                <div className="idcard-field idcard-field-full">
                  <span className="idcard-label">{isTa ? 'முகவரி' : 'Contact Address'}</span>
                  <span className="idcard-value">{pastor.address}</span>
                </div>
              )}
            </div>

            {/* Footer / Seal */}
            <div className="idcard-footer">
              <div className="idcard-status-seal">
                <ShieldIcon size={16} color="#4ade80" />
                <span>{isTa ? 'அங்கீகரிக்கப்பட்ட பேராய ஊழியர்' : 'Verified Diocesan Minister'}</span>
              </div>

              <div className="idcard-signature-box">
                <p className="idcard-signature-line">Rt. Rev. S. Johnson Durai</p>
                <p className="idcard-sign-title">{isTa ? 'பேராயர் கையொப்பம்' : 'Archbishop Signature'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="idcard-actions">
          <button className="idcard-print-btn" onClick={handlePrint}>
            <PrintIcon size={16} color="#000" />
            <span>{isTa ? 'அடையாள அட்டையை அச்சிடு (Print)' : 'Print ID Credential'}</span>
          </button>
          <button className="idcard-dismiss-btn" onClick={onClose}>
            {isTa ? 'மூடு (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}
