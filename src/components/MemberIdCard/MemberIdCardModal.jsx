import { useState, useEffect } from 'react'
import { CloseIcon, PrintIcon, ShieldIcon, ChurchIcon, LocationIcon, PhoneIcon, EmailIcon, IdCardIcon } from '../Icons/SvgIcons'
import './MemberIdCardModal.css'

export default function MemberIdCardModal({ pastor, onClose, isTa }) {
  const [copied, setCopied] = useState(false)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Prevent background scrolling while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  if (!pastor) return null

  const handlePrint = () => {
    window.print()
  }

  const handleCopyDetails = () => {
    const info = `
Apostolic Council of India Diocese - Ministerial Credential
Reg. No: ${pastor.regNo}
Name: ${pastor.name}
Designation: ${pastor.designation || pastor.office || 'Minister'}
Church: ${pastor.church || 'N/A'}
District: ${pastor.district || 'N/A'}, ${pastor.state || 'Tamil Nadu'}
Phone: ${pastor.phone || 'N/A'}
Email: ${pastor.email || 'N/A'}
Status: ${pastor.status || 'Active'}
    `.trim()

    navigator.clipboard.writeText(info).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div
      className="idcard-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="idcard-name-title"
    >
      <div className="idcard-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="idcard-close-btn"
          onClick={onClose}
          aria-label="Close Profile"
        >
          <CloseIcon size={20} />
        </button>

        {/* The Animated Credential Card */}
        <div className="idcard-card">
          {/* Card Top Header */}
          <div className="idcard-header">
            <div className="idcard-header-left">
              <img
                src="/aci-logo.png"
                alt="ACI Diocese Logo"
                className="idcard-logo"
                onError={(e) => { e.target.src = '/aci-logo.jpg' }}
              />
              <div className="idcard-header-titles">
                <span className="idcard-header-main">
                  {isTa ? 'அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயம்' : 'Apostolic Council of India Diocese'}
                </span>
                <span className="idcard-header-sub">
                  {isTa ? 'அதிகாரப்பூர்வ ஊழியர் சான்றிதழ் விவரக்குறிப்பு' : 'Official Ministerial Credential Dossier'}
                </span>
                <span className="idcard-header-reg">
                  Reg. Under Indian Trust Act · Reg. No: 62/B.k.4/2013
                </span>
              </div>
            </div>

            <div className="idcard-header-right">
              <span className="idcard-reg-pill">{pastor.regNo}</span>
            </div>
          </div>

          {/* Card Body */}
          <div className="idcard-body">
            {/* Top Identity Row */}
            <div className="idcard-top-row">
              <div className="idcard-photo-box">
                <IdCardIcon size={44} className="idcard-avatar-icon" />
              </div>

              <div className="idcard-main-meta">
                <h3 id="idcard-name-title" className="idcard-name">
                  {pastor.name}
                </h3>

                <div className="idcard-office-row">
                  <span className="idcard-office-badge">
                    <ShieldIcon size={12} color="#c8a96e" />
                    {pastor.designation || pastor.office || 'Ordained Minister'}
                  </span>

                  <span className="idcard-live-tag">
                    <span className="idcard-live-dot"></span>
                    {pastor.status || 'Active Member'}
                  </span>
                </div>
              </div>
            </div>

            {/* Credential Data Grid */}
            <div className="idcard-fields-grid">
              {pastor.church && (
                <div className="idcard-field">
                  <span className="idcard-label">
                    {isTa ? 'திருச்சபை பெயர்' : 'Church Name'}
                  </span>
                  <span className="idcard-value">{pastor.church}</span>
                </div>
              )}

              {pastor.office && (
                <div className="idcard-field">
                  <span className="idcard-label">
                    {isTa ? 'ஊழியப் பதவி / அழைப்பு' : 'Calling / Office'}
                  </span>
                  <span className="idcard-value">{pastor.office}</span>
                </div>
              )}

              {pastor.district && (
                <div className="idcard-field">
                  <span className="idcard-label">
                    {isTa ? 'மாவட்டம் & மாநிலம்' : 'District & State'}
                  </span>
                  <span className="idcard-value">
                    {pastor.district}{pastor.state ? `, ${pastor.state}` : ', Tamil Nadu'}
                  </span>
                </div>
              )}

              {pastor.ordinationDate && (
                <div className="idcard-field">
                  <span className="idcard-label">
                    {isTa ? 'பிரதிஷ்டை செய்யப்பட்ட நாள்' : 'Ordination Date'}
                  </span>
                  <span className="idcard-value">{pastor.ordinationDate}</span>
                </div>
              )}

              {pastor.phone && (
                <div className="idcard-field">
                  <span className="idcard-label">
                    {isTa ? 'தொடர்பு தொலைபேசி' : 'Contact Phone'}
                  </span>
                  <a href={`tel:${pastor.phone}`} className="idcard-value idcard-link">
                    {pastor.phone}
                  </a>
                </div>
              )}

              {pastor.email && (
                <div className="idcard-field">
                  <span className="idcard-label">
                    {isTa ? 'மின்னஞ்சல் முகவரி' : 'Email Address'}
                  </span>
                  <a href={`mailto:${pastor.email}`} className="idcard-value idcard-link">
                    {pastor.email}
                  </a>
                </div>
              )}

              {pastor.address && (
                <div className="idcard-field idcard-field-full">
                  <span className="idcard-label">
                    {isTa ? 'தொடர்பு முகவரி' : 'Contact Address'}
                  </span>
                  <span className="idcard-value">{pastor.address}</span>
                </div>
              )}
            </div>

            {/* Card Footer Verification */}
            <div className="idcard-footer">
              <div className="idcard-status-seal">
                <ShieldIcon size={16} color="#c8a96e" />
                <span>
                  {isTa ? 'அங்கீகரிக்கப்பட்ட எபிஸ்கோபல் ஊழியர்' : 'Verified Diocesan Minister'}
                </span>
              </div>

              <div className="idcard-signature-box">
                <div className="idcard-signature-line">Rt. Rev. S. Johnson Durai</div>
                <div className="idcard-sign-title">
                  {isTa ? 'தலைமை பேராயர் & அறங்காவலர்' : 'Managing Trustee & Bishop'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="idcard-actions">
          <button className="idcard-print-btn" onClick={handlePrint}>
            <PrintIcon size={16} color="#000000" />
            <span>{isTa ? 'சான்றிதழை அச்சிடுக (Print)' : 'Print Credential'}</span>
          </button>

          <button className="idcard-copy-btn" onClick={handleCopyDetails}>
            <span>{copied ? (isTa ? '✓ நகலெடுக்கப்பட்டது!' : '✓ Copied to Clipboard!') : (isTa ? 'விவரங்களை நகலெடு' : 'Copy Details')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
