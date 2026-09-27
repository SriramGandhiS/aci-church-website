import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import { ShieldIcon, CheckIcon, UserCheckIcon, AlertCircleIcon } from '../components/Icons/SvgIcons'
import './AttestApplicationPage.css'

export default function AttestApplicationPage() {
  const [searchParams] = useSearchParams()
  const appId = searchParams.get('appId') || ''
  const refKey = searchParams.get('ref') || 'ref1' // 'ref1' | 'ref2'
  const token = searchParams.get('token') || ''
  const { lang, setLang, t } = useLanguage()
  const isTa = lang === 'ta'

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [appData, setAppData] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Referee inputs
  const [refereeName, setRefereeName] = useState('')
  const [dioceseId, setDioceseId] = useState('')
  const [knownDuration, setKnownDuration] = useState('5 Years')
  const [mode, setMode] = useState('personally') // 'personally' | 'professionally'
  const [phone, setPhone] = useState('')
  const [signatureType, setSignatureType] = useState('draw') // 'draw' | 'type'
  const [typedSignature, setTypedSignature] = useState('')
  const [hasDrawn, setHasDrawn] = useState(false)

  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)

  // 1. Fetch Application Details for Attestation
  useEffect(() => {
    async function loadApp() {
      if (!appId) {
        // Fallback demo preset if no ID passed
        setAppData({
          applicationId: 'ACI-2026-000004',
          personal: { name: 'Pastor David Paul', salutation: 'Pastor', dob: '1987-03-22', city: 'Chennai' },
          church: { name: 'Calvary Gospel Mission', city: 'Chennai' },
          spiritual: { ministryCalling: 'pastor' },
          references: {
            ref1: { name: 'Rev. R. John Durai', dioceseId: 'TN 0005', phone: '9443210987', knownDuration: '8 Years' },
            ref2: { name: 'Rev. D. Antony Raj', dioceseId: 'TN 0466', phone: '9876543210', knownDuration: '5 Years' }
          }
        })
        const presetRef = refKey === 'ref2' ? { name: 'Rev. D. Antony Raj', dioceseId: 'TN 0466', phone: '9876543210' } : { name: 'Rev. R. John Durai', dioceseId: 'TN 0005', phone: '9443210987' }
        setRefereeName(presetRef.name)
        setDioceseId(presetRef.dioceseId)
        setPhone(presetRef.phone)
        setTypedSignature(presetRef.name)
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const res = await api.getApplicationForAttestation(appId)
        if (res && res.success && res.application) {
          const app = res.application
          setAppData(app)
          const targetRef = app.references?.[refKey] || {}
          setRefereeName(targetRef.name || '')
          setDioceseId(targetRef.dioceseId || '')
          setPhone(targetRef.phone || '')
          setKnownDuration(targetRef.knownDuration || '5 Years')
          setMode(targetRef.mode || (refKey === 'ref2' ? 'professionally' : 'personally'))
          setTypedSignature(targetRef.name || '')
        } else {
          setError('Application details not found or expired.')
        }
      } catch (e) {
        setError('Failed to load application: ' + e.message)
      } finally {
        setLoading(false)
      }
    }

    loadApp()
  }, [appId, refKey])

  // Canvas drawing functions
  const startDrawing = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top

    isDrawingRef.current = true
    ctx.beginPath()
    ctx.moveTo(x, y)
    setHasDrawn(true)
  }

  const draw = (e) => {
    if (!isDrawingRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top

    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#0f172a'
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    isDrawingRef.current = false
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  // Handle Attestation Submission
  const handleAttest = async (e) => {
    e.preventDefault()
    if (!refereeName.trim()) {
      alert(isTa ? 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்.' : 'Please enter your referee name.')
      return
    }

    let sigData = typedSignature
    if (signatureType === 'draw' && canvasRef.current && hasDrawn) {
      sigData = canvasRef.current.toDataURL('image/png')
    }

    setSubmitting(true)
    setError('')

    try {
      const payload = {
        appId: appData?.applicationId || appId,
        refKey,
        refereeName,
        dioceseId,
        knownDuration,
        mode,
        phone,
        signature: sigData,
        attestedAt: new Date().toISOString()
      }

      const res = await api.attestApplication(payload)
      if (res && res.success) {
        setSuccess(true)
      } else {
        setError(res?.message || 'Failed to submit attestation. Please try again.')
      }
    } catch (err) {
      setError(err.message || 'Error communicating with server.')
    } finally {
      setSubmitting(false)
    }
  }

  const isDOS = refKey === 'ref1'
  const roleTitle = isDOS 
    ? (isTa ? 'மாவட்ட மேற்பார்வையாளர் (District Overseer)' : 'District Overseer (DOS)')
    : (isTa ? 'தாலுகா ஒருங்கிணைப்பாளர் (Taluk Co-ordinator)' : 'Taluk Co-ordinator')

  return (
    <div className="attest-page-container">
      <div className="attest-page-inner">

        {/* Top Diocesan Header */}
        <div className="attest-header-card">
          <div className="attest-seal-box">
            <img src="/aci-logo.png" alt="ACI Diocese" className="attest-seal-img" onError={(e) => { e.target.src = '/aci-logo.jpg' }} />
          </div>
          <div className="attest-header-text">
            <h1 className="attest-diocese-title">APOSTOLIC COUNCIL OF INDIA DIOCESE</h1>
            <p className="attest-diocese-sub">Official Diocesan Referee Attestation Portal • பரிந்துரை உறுதிப்படுத்தல்</p>
          </div>
          <div className="attest-lang-toggle">
            <button type="button" onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} className="attest-lang-btn">
              {lang === 'en' ? 'தமிழ்' : 'English'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="attest-loading-card">
            <div className="attest-spinner" />
            <p>{isTa ? 'விண்ணப்ப தகவல்கள் ஏற்றப்படுகின்றன...' : 'Loading applicant details for verification...'}</p>
          </div>
        )}

        {/* Success State */}
        {success && (
          <div className="attest-success-card">
            <div className="success-icon-circle">
              <CheckIcon size={32} color="#ffffff" />
            </div>
            <h2 className="success-title">
              {isTa ? 'பரிந்துரை வெற்றிகரமாக பதிவு செய்யப்பட்டது!' : 'Attestation Submitted Successfully!'}
            </h2>
            <p className="success-msg">
              {isTa
                ? `விண்ணப்ப எண் ${appData?.applicationId || appId}-க்கான உங்கள் பரிந்துரை மற்றும் கையொப்பம் மத்திய அலுவலக பதிவேட்டில் உறுதிப்படுத்தப்பட்டது.`
                : `Your official attestation and digital endorsement for Application #${appData?.applicationId || appId} has been securely recorded in the Diocesan Database.`}
            </p>
            <div className="success-badge-box">
              <span>{roleTitle}: <strong>{refereeName}</strong></span>
              <span>Status: <strong style={{ color: '#15803d' }}>ATTESTED & VERIFIED</strong></span>
            </div>
            <Link to="/" className="attest-home-btn">
              {isTa ? 'முகப்புப் பக்கத்திற்குச் செல்க' : 'Go to Home Page'}
            </Link>
          </div>
        )}

        {/* Main Attestation Form */}
        {!loading && !success && (
          <div className="attest-content-grid">

            {/* Applicant Summary Card */}
            <div className="applicant-summary-card">
              <div className="summary-card-hdr">
                <UserCheckIcon size={18} />
                <span>{isTa ? 'விண்ணப்பதாரர் சுருக்கம்' : 'Applicant Overview'}</span>
              </div>
              <div className="summary-card-body">
                <div className="summary-row">
                  <span className="sum-lbl">{isTa ? 'விண்ணப்ப எண்' : 'Application ID'}:</span>
                  <span className="sum-val highlight">{appData?.applicationId || 'ACI-2026-000004'}</span>
                </div>
                <div className="summary-row">
                  <span className="sum-lbl">{isTa ? 'விண்ணப்பதாரர் பெயர்' : 'Applicant Name'}:</span>
                  <span className="sum-val">{appData?.personal?.name || 'Pastor David Paul'}</span>
                </div>
                <div className="summary-row">
                  <span className="sum-lbl">{isTa ? 'சபையின் பெயர்' : 'Church Name'}:</span>
                  <span className="sum-val">{appData?.church?.name || 'Calvary Gospel Mission'}</span>
                </div>
                <div className="summary-row">
                  <span className="sum-lbl">{isTa ? 'ஊழிய அழைப்பு' : 'Ministry Calling'}:</span>
                  <span className="sum-val uppercase">{appData?.spiritual?.ministryCalling || 'Pastor'}</span>
                </div>
                <div className="summary-row">
                  <span className="sum-lbl">{isTa ? 'இருப்பிடம்' : 'Location'}:</span>
                  <span className="sum-val">{appData?.personal?.permanentAddress?.city || appData?.personal?.city || 'Chennai'}, Tamil Nadu</span>
                </div>
              </div>

              <div className="referee-role-badge">
                <span className="role-badge-lbl">{isTa ? 'தாங்கள் பரிந்துரைக்கும் பதவி' : 'Your Endorsing Role'}:</span>
                <span className="role-badge-val">{roleTitle}</span>
              </div>
            </div>

            {/* Endorsement Form Card */}
            <form onSubmit={handleAttest} className="endorsement-form-card">
              <h2 className="endorsement-card-title">
                {isTa ? 'பரிந்துரை மற்றும் உறுதிமொழி' : 'Reference Endorsement & Signature'}
              </h2>
              <p className="endorsement-card-subtitle">
                {isTa 
                  ? 'தயவுசெய்து கீழ்கண்ட விவரங்களைச் சரிபார்த்து தங்களது கையொப்பத்தை உறுதிப்படுத்தவும்.'
                  : 'Please verify your details and provide your digital attestation below.'}
              </p>

              {error && (
                <div className="attest-error-strip">
                  <AlertCircleIcon size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Referee Name & ID */}
              <div className="attest-fields-grid">
                <div className="attest-field">
                  <label className="attest-lbl">
                    {isTa ? 'தங்கள் பெயர் (Referee Name) *' : 'Referee Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={refereeName}
                    onChange={(e) => setRefereeName(e.target.value)}
                    className="attest-input"
                    placeholder="e.g. Rev. R. John Durai"
                  />
                </div>

                <div className="attest-field">
                  <label className="attest-lbl">
                    {isTa ? 'பேராய எண் (Diocese ID No)' : 'Diocese ID No'}
                  </label>
                  <input
                    type="text"
                    value={dioceseId}
                    onChange={(e) => setDioceseId(e.target.value)}
                    className="attest-input"
                    placeholder="e.g. TN 0005"
                  />
                </div>
              </div>

              {/* Known Duration & Phone */}
              <div className="attest-fields-grid">
                <div className="attest-field">
                  <label className="attest-lbl">
                    {isTa ? 'அறிந்த காலம் (Known Since)' : 'I know this person since'}
                  </label>
                  <select
                    value={knownDuration}
                    onChange={(e) => setKnownDuration(e.target.value)}
                    className="attest-select"
                  >
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="8 Years">8 Years</option>
                    <option value="10+ Years">10+ Years</option>
                  </select>
                </div>

                <div className="attest-field">
                  <label className="attest-lbl">
                    {isTa ? 'தொடர்பு எண் (Mobile Number)' : 'Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="attest-input"
                    placeholder="e.g. 9443210987"
                  />
                </div>
              </div>

              {/* Known Mode Selection */}
              <div className="attest-field">
                <label className="attest-lbl">
                  {isTa ? 'அறிந்த விதம் (Mode of Acquaintance) *' : 'Mode of Acquaintance *'}
                </label>
                <div className="mode-radios-row">
                  <label className={`mode-radio-card ${mode === 'personally' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="mode"
                      value="personally"
                      checked={mode === 'personally'}
                      onChange={() => setMode('personally')}
                    />
                    <div>
                      <strong>{isTa ? 'நேரில் (Personally)' : 'Personally'}</strong>
                      <span className="mode-sub">{isTa ? 'நேரடியாக நன்கு அறிவேன்' : 'Known in person'}</span>
                    </div>
                  </label>

                  <label className={`mode-radio-card ${mode === 'professionally' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="mode"
                      value="professionally"
                      checked={mode === 'professionally'}
                      onChange={() => setMode('professionally')}
                    />
                    <div>
                      <strong>{isTa ? 'ஊழியத்தில் (Professionally)' : 'Professionally'}</strong>
                      <span className="mode-sub">{isTa ? 'ஊழிய செயல்பாடுகள் மூலம்' : 'Known through ministry'}</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Endorsement Statement */}
              <div className="endorsement-stat-box">
                <p>
                  {isTa
                    ? '“நான் மேலே குறிப்பிட்டுள்ள விண்ணப்பதாரரை நற்குணமும், கர்த்தருடைய ஊழியத்திற்கு அர்ப்பணிப்பும் கொண்ட ஊழியராக அறிந்து, அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தின் உறுப்புரிமைக்கு மனப்பூர்வமாக பரிந்துரைக்கிறேன்.”'
                    : '“I hereby confirm that I know the applicant named above to be of good standing, proven ministry calling, and sincere Christian faith. I happily endorse and recommend their application for ACI Diocesan Membership.”'}
                </p>
              </div>

              {/* Signature Selector */}
              <div className="signature-section">
                <div className="sig-type-toggle">
                  <button
                    type="button"
                    className={`sig-type-btn ${signatureType === 'draw' ? 'active' : ''}`}
                    onClick={() => setSignatureType('draw')}
                  >
                    {isTa ? '✍️ திரையில் கையொப்பமிட (Draw)' : '✍️ Draw on Screen'}
                  </button>
                  <button
                    type="button"
                    className={`sig-type-btn ${signatureType === 'type' ? 'active' : ''}`}
                    onClick={() => setSignatureType('type')}
                  >
                    {isTa ? '⌨️ பெயரைத் தட்டச்சு செய்ய (Type)' : '⌨️ Type Full Name'}
                  </button>
                </div>

                {signatureType === 'draw' ? (
                  <div className="canvas-wrapper">
                    <canvas
                      ref={canvasRef}
                      width={480}
                      height={140}
                      className="sig-canvas"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    <div className="canvas-ctrls">
                      <span className="canvas-hint">{isTa ? 'விரல் அல்லது மவுஸ் மூலம் கையொப்பமிடவும்' : 'Sign above with finger or mouse'}</span>
                      <button type="button" onClick={clearCanvas} className="clear-canvas-btn">
                        {isTa ? 'அழி (Clear)' : 'Clear Signature'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="typed-sig-wrapper">
                    <input
                      type="text"
                      value={typedSignature}
                      onChange={(e) => setTypedSignature(e.target.value)}
                      placeholder="Type your official name for digital stamp"
                      className="typed-sig-input"
                    />
                    {typedSignature && (
                      <div className="typed-sig-preview">
                        {typedSignature}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="attest-submit-btn"
              >
                <CheckIcon size={18} color="#ffffff" />
                <span>
                  {submitting
                    ? (isTa ? 'பதிவு செய்யப்படுகிறது...' : 'Submitting Attestation...')
                    : (isTa ? 'பரிந்துரையை உறுதி செய்து ஒப்புதலளி (Approve & Attest)' : 'Approve & Attest Application')}
                </span>
              </button>
            </form>

          </div>
        )}

      </div>
    </div>
  )
}
