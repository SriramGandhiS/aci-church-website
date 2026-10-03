import React from 'react'
import './OfficialApplicationForm.css'

// Reusable Character Box Row with strictly self-contained boundaries
function CharacterBoxRow({ text = '', count = 24, className = '' }) {
  const clean = (text || '')
    .toString()
    .toUpperCase()
    .replace(/[^A-Z0-9\s\.\,\/\-@_]/g, '')
    .slice(0, count)
  const chars = clean.split('')
  while (chars.length < count) {
    chars.push('')
  }

  return (
    <div className={`digi-char-grid ${className}`}>
      {chars.map((ch, idx) => (
        <div key={idx} className={`digi-char-box ${ch ? 'has-char' : 'empty-char'}`}>
          {ch || '\u00A0'}
        </div>
      ))}
    </div>
  )
}

// Segmented Date: [D][D] [M][M] [Y][Y][Y][Y]
function SegmentedDateBoxes({ dateStr = '' }) {
  const parts = (dateStr || '').split('-')
  const yyyy = parts[0] || ''
  const mm = parts[1] || ''
  const dd = parts[2] || ''

  return (
    <div className="digi-date-triplet-group">
      <div className="digi-date-unit">
        <span className="digi-date-sublabel">Date</span>
        <CharacterBoxRow text={dd} count={2} className="count-2" />
      </div>
      <div className="digi-date-unit">
        <span className="digi-date-sublabel">Month</span>
        <CharacterBoxRow text={mm} count={2} className="count-2" />
      </div>
      <div className="digi-date-unit">
        <span className="digi-date-sublabel">Year</span>
        <CharacterBoxRow text={yyyy} count={4} className="count-4" />
      </div>
    </div>
  )
}

// Continuous 8-box date for office and milestones (DDMMYYYY)
function Date8Boxes({ dateStr = '' }) {
  const parts = (dateStr || '').split('-')
  const formatted = parts.length === 3 ? `${parts[2]}${parts[1]}${parts[0]}` : ''
  return <CharacterBoxRow text={formatted} count={8} className="count-8" />
}

// Crisp digital checkbox component
function FormCheckbox({ checked = false, labelEn = '', labelTa = '' }) {
  return (
    <div className={`digi-checkbox-wrapper ${checked ? 'is-checked' : ''}`}>
      <span className="digi-checkbox-box">
        {checked ? '✓' : ''}
      </span>
      <span className="digi-checkbox-text">
        <strong className="cb-en">{labelEn}</strong>
        {labelTa && <span className="cb-ta">{labelTa}</span>}
      </span>
    </div>
  )
}

export default function OfficialApplicationForm({ data, onEdit, showActions = true }) {
  const handlePrint = () => {
    window.print()
  }

  const p = data?.personal || {}
  const perm = p.permanentAddress || {}
  const contact = p.contactAddressSameAsPermanent ? perm : (p.contactAddress || {})
  const sp = data?.spiritual || {}
  const aff = data?.affiliation || {}
  const ch = data?.church || {}
  const mh = data?.ministryHistory || {}
  const q = data?.qualifications || { academic: [], theological: [] }
  const mot = data?.motivation || {}
  const ref = data?.references || {}
  const dec = data?.declaration || {}
  const enc = data?.enclosures || {}

  const cleanSalutation = (p.salutation || '').trim()
  const rawName = (p.name || '').trim()
  let computedFullName = rawName
  if (cleanSalutation && !rawName.toUpperCase().startsWith(cleanSalutation.toUpperCase())) {
    computedFullName = cleanSalutation + ' ' + rawName
  }
  computedFullName = computedFullName.replace(/^(PASTOR|REV\.?|MR\.?|MRS\.?|DR\.?|BRO\.?)\s+(PASTOR|REV\.?|MR\.?|MRS\.?|DR\.?|BRO\.?)\b/gi, '$1')
  const fullName = computedFullName.toUpperCase()
  const appDate = p.applicationDate || new Date().toISOString().split('T')[0]
  const sigName = rawName || 'Pastor S. John Samuel'

  const academicList = Array.isArray(q?.academic) ? q.academic : (Array.isArray(data?.academics) ? data.academics : [])
  const theologicalList = Array.isArray(q?.theological) ? q.theological : (Array.isArray(data?.theological) ? data.theological : [])
  const famList = Array.isArray(data?.family) ? data.family : (data?.family && typeof data.family === 'object' ? Object.values(data.family) : [])

  // Pad tables to exactly 4 rows each to match the official printed form
  const academicRows = [...academicList.filter(r => r && (r.examinationPassed || r.year || r.institution || r.course))]
  while (academicRows.length < 4) academicRows.push({ examinationPassed: '', year: '', institution: '' })

  const theologicalRows = [...theologicalList.filter(r => r && (r.examinationPassed || r.year || r.institution || r.degree))]
  while (theologicalRows.length < 4) theologicalRows.push({ examinationPassed: '', year: '', institution: '' })

  const familyRows = [...famList.filter(f => f && (f.name || f.dob || f.relationship || f.professionEducation))]
  while (familyRows.length < 4) familyRows.push({ name: '', dob: '', relationship: '', professionEducation: '' })

  return (
    <div className="digi-form-canvas-container">

      {/* Top Action Bar */}
      {showActions && (
        <div className="application-actions-bar">
          <button
            type="button"
            onClick={onEdit ? onEdit : () => window.history.back()}
            className="app-action-btn-edit"
          >
            <span className="btn-icon">←</span>
            <span>Edit Application</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="app-action-btn-print"
          >
            <span className="btn-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
            </span>
            <span>Print / Save Official 4-Page PDF</span>
          </button>
        </div>
      )}

      {/* ============================================================
          PAGE 1 OF 4: HEADER • OFFICE USE • PERSONAL & ADDRESSES
          ============================================================ */}
      <div className="digi-a4-sheet" id="official-page-1">
        <div className="digi-page-watermark">
          <div className="watermark-crest">✠</div>
          <div className="watermark-text">APOSTOLIC COUNCIL OF INDIA DIOCESE</div>
        </div>

        {/* Diocesan Header */}
        <div className="digi-page-header">
          <div className="digi-crest-container">
            <img
              src="/aci-logo.png"
              alt="ACI Crest"
              className="digi-crest-logo"
              onError={(e) => { e.target.src = '/aci-logo.jpg' }}
            />
          </div>
          <div className="digi-header-info">
            <h1 className="digi-title-en">APOSTOLIC COUNCIL OF INDIA DIOCESE</h1>
            <p className="digi-sub-en">An Episcopal Diocese & Public Religious Trust (Indian Trust Act 1882 - Regd No: 62/Bk.4/2013)</p>
            <p className="digi-legal-en">Under Part I, Sec. 5(1) • Part IV, Sec. 10, 12, 14, 15 • Part VI, Sec. 64 of The Indian Christian Marriage Act 1872</p>
            <p className="digi-clergy-en">Constituent and/or The Christian Clergy Rights and Traditions</p>
            <p className="digi-address-en">1/153, Melapatty, Hanumantharayankottai - 624 054, Dindigul District, Tamil Nadu, India.</p>
            <p className="digi-contacts-en">Phone: 0451 2490100 • E-mail: info@acidiocese.org / rev.johnsondurai@gmail.com</p>
          </div>
        </div>

        <div className="digi-form-title-banner">
          <div className="banner-titles">
            <span className="banner-title-en">DIOCESAN MEMBERSHIP APPLICATION FORM</span>
            <span className="banner-title-ta">பேராய உறுப்பினர் விண்ணப்பப் படிவம்</span>
          </div>
          <div className="banner-date-badge">
            <span className="badge-lbl">Date of issue</span>
            <span className="badge-val">{appDate}</span>
          </div>
        </div>

        <div className="digi-instruction-strip">
          Read the Application carefully, fill in CAPITAL LETTERS, DO NOT OVERWRITE, select the appropriate box by ticking it and leave the inappropriate fields blank. / விண்ணப்பத்தை கவனமாக வாசித்து ஆங்கில பெரிய எழுத்துக்களில் தெளிவாக நிரப்பவும்.
        </div>

        {/* FOR OFFICE USE ONLY */}
        <div className="digi-office-use-section">
          <div className="digi-office-header">
            <span>FOR OFFICE USE ONLY / அலுவலகப் பணிக்கு மட்டும்</span>
          </div>
          <div className="digi-office-body">
            <div className="office-col-left">
              <div className="office-row">
                <span className="office-lbl">Application Number :</span>
                <span className="office-val-appno">{data?.applicationId || '002093 / ACI-2026'}</span>
                <div className="approval-stamp-box">APPROVAL</div>
              </div>

              <div className="office-row">
                <span className="office-lbl">Application Received on :</span>
                <Date8Boxes dateStr={data?.receivedDate || appDate} />
              </div>

              <div className="office-row">
                <span className="office-lbl">Application Approved on :</span>
                <Date8Boxes dateStr={data?.approvedDate || ''} />
              </div>

              <div className="office-row">
                <span className="office-lbl">Membership Code :</span>
                <CharacterBoxRow text={data?.membershipCode || ''} count={7} className="count-7" />
              </div>
            </div>

            <div className="office-col-center">
              <div className="seal-circle-wrapper">
                <div className="seal-circle-inner">
                  <span className="seal-txt-top">OFFICIAL</span>
                  <span className="seal-crest">✠</span>
                  <span className="seal-txt-bot">SEAL</span>
                </div>
                <span className="seal-caption">RESERVED FOR SEAL</span>
              </div>
            </div>

            <div className="office-col-right">
              <div className="photo-affix-frame">
                {p.passportPhoto ? (
                  <img src={p.passportPhoto} alt="Applicant" className="affixed-photo" />
                ) : (
                  <div className="photo-placeholder-text">
                    <span className="photo-ta">சமீபத்தில் எடுத்த புகைப்படத்தை ஒட்டி கையொப்பமிடவும்</span>
                    <span className="photo-en">Affix Recent Passport size Photo</span>
                    <span className="photo-sub">To be Self attested</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* APPLICANT'S INFORMATIONS */}
        <div className="applicant-info-bar">
          <span className="bar-title">APPLICANT'S INFORMATIONS / விண்ணப்பதாரரின் தகவல்கள்</span>
          <div className="bar-date">
            <span>Application Date (விண்ணப்பிக்கும் தேதி):</span>
            <Date8Boxes dateStr={appDate} />
          </div>
        </div>

        {/* SECTION I: Personal Details */}
        <div className="digi-section-block">
          <div className="digi-section-hdr">
            <span>I. Personal Details / சுய விவரங்கள்</span>
          </div>

          <div className="form-field-row">
            <div className="field-meta">
              <span className="field-num">1.</span>
              <span className="field-label-en">Name</span>
              <span className="field-label-ta">பெயர்</span>
              <span className="field-sublabel">(Salutation - Mr., Mrs., Rev., Dr., Bro., Pastor)</span>
            </div>
            <div className="field-inputs">
              <CharacterBoxRow text={fullName} count={24} className="count-24" />
            </div>
          </div>

          <div className="form-field-row">
            <div className="field-meta">
              <span className="field-num">2.</span>
              <span className="field-label-en">Baptismal Name</span>
              <span className="field-label-ta">ஞானஸ்நானப் பெயர்</span>
            </div>
            <div className="field-inputs">
              <CharacterBoxRow text={p.baptismalName || ''} count={24} className="count-24" />
            </div>
          </div>

          <div className="form-field-dual-row">
            <div className="dual-col-left">
              <div className="field-meta">
                <span className="field-num">3.</span>
                <span className="field-label-en">Date of Birth</span>
                <span className="field-label-ta">பிறந்த தேதி</span>
              </div>
              <SegmentedDateBoxes dateStr={p.dob || ''} />
            </div>

            <div className="dual-col-right">
              <div className="field-meta">
                <span className="field-label-en">Nationality</span>
                <span className="field-label-ta">நாட்டுரிமை</span>
              </div>
              <CharacterBoxRow text={p.nationality || 'INDIAN'} count={10} className="count-10" />
            </div>
          </div>

          <div className="form-field-dual-row">
            <div className="dual-col-left">
              <div className="field-meta">
                <span className="field-num">4.</span>
                <span className="field-label-en">Gender</span>
                <span className="field-label-ta">பாலினம்</span>
              </div>
              <div className="checkboxes-inline">
                <FormCheckbox checked={p.gender?.toLowerCase() === 'male'} labelEn="Male" labelTa="ஆண்" />
                <FormCheckbox checked={p.gender?.toLowerCase() === 'female'} labelEn="Female" labelTa="பெண்" />
              </div>
            </div>

            <div className="dual-col-right">
              <div className="field-meta">
                <span className="field-label-en">Marital Status</span>
                <span className="field-label-ta">திருமண நிலை</span>
              </div>
              <div className="checkboxes-inline">
                <FormCheckbox checked={p.maritalStatus?.toLowerCase() === 'married'} labelEn="Married" />
                <FormCheckbox checked={p.maritalStatus?.toLowerCase() === 'bachelor' || p.maritalStatus?.toLowerCase() === 'single'} labelEn="Bachelor" />
                <FormCheckbox checked={p.maritalStatus?.toLowerCase() === 'spinster'} labelEn="Spinster" />
                <FormCheckbox checked={p.maritalStatus?.toLowerCase() === 'widowed'} labelEn="Widowed" />
              </div>
            </div>
          </div>

          {/* 5. Permanent Address */}
          <div className="address-table-wrapper">
            <div className="address-table-title">
              <span className="field-num">5.</span>
              <span className="field-label-en">Permanent Address</span>
              <span className="field-label-ta">நிரந்தர முகவரி</span>
            </div>
            <div className="address-grid-table">
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">Door No (கதவு எண்)</span>
                <CharacterBoxRow text={perm.doorNo || ''} count={8} className="count-8" />
              </div>
              <div className="addr-cell-group flex-2">
                <span className="addr-cell-lbl">Street Name (தெருப் பெயர்)</span>
                <CharacterBoxRow text={perm.street || ''} count={23} className="count-23" />
              </div>
              <div className="addr-cell-group flex-2">
                <span className="addr-cell-lbl">City / Town (நகரம் / ஊர்)</span>
                <CharacterBoxRow text={perm.city || ''} count={23} className="count-23" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">Pincode (பின்கோடு)</span>
                <CharacterBoxRow text={perm.pincode || ''} count={6} className="count-6" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">Taluk (தாலுகா)</span>
                <CharacterBoxRow text={perm.taluk || ''} count={14} className="count-14" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">District (மாவட்டம்)</span>
                <CharacterBoxRow text={perm.district || ''} count={14} className="count-14" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">State (மாநிலம்)</span>
                <CharacterBoxRow text={perm.state || 'Tamil Nadu'} count={14} className="count-14" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">Country (நாடு)</span>
                <CharacterBoxRow text={perm.country || 'India'} count={14} className="count-14" />
              </div>
            </div>
          </div>

          {/* 6. Contact Address */}
          <div className="address-table-wrapper">
            <div className="address-table-title">
              <span className="field-num">6.</span>
              <span className="field-label-en">Contact Address</span>
              <span className="field-label-ta">தொடர்பு முகவரி</span>
            </div>
            <div className="address-grid-table">
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">Door No (கதவு எண்)</span>
                <CharacterBoxRow text={contact.doorNo || ''} count={8} className="count-8" />
              </div>
              <div className="addr-cell-group flex-2">
                <span className="addr-cell-lbl">Street Name (தெருப் பெயர்)</span>
                <CharacterBoxRow text={contact.street || ''} count={23} className="count-23" />
              </div>
              <div className="addr-cell-group flex-2">
                <span className="addr-cell-lbl">City / Town (நகரம் / ஊர்)</span>
                <CharacterBoxRow text={contact.city || ''} count={23} className="count-23" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">Pincode (பின்கோடு)</span>
                <CharacterBoxRow text={contact.pincode || ''} count={6} className="count-6" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">Taluk (தாலுகா)</span>
                <CharacterBoxRow text={contact.taluk || ''} count={14} className="count-14" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">District (மாவட்டம்)</span>
                <CharacterBoxRow text={contact.district || ''} count={14} className="count-14" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">State (மாநிலம்)</span>
                <CharacterBoxRow text={contact.state || 'Tamil Nadu'} count={14} className="count-14" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">Country (நாடு)</span>
                <CharacterBoxRow text={contact.country || 'India'} count={14} className="count-14" />
              </div>
            </div>
          </div>
        </div>

        <div className="digi-page-footer">
          <span>Apostolic Council of India Diocese, Membership Application Form, Page 1/4</span>
        </div>
      </div>

      {/* ============================================================
          PAGE 2 OF 4: SPIRITUAL • AFFILIATION • CHURCH • MILESTONES (1-5)
          ============================================================ */}
      <div className="digi-a4-sheet" id="official-page-2">
        <div className="digi-page-watermark">
          <div className="watermark-crest">✠</div>
          <div className="watermark-text">APOSTOLIC COUNCIL OF INDIA DIOCESE</div>
        </div>

        <div className="sheet-top-banner">
          <span>ACI - Diocese Membership Application Form</span>
        </div>

        {/* SECTION II: Spiritual Informations */}
        <div className="digi-section-block">
          <div className="digi-section-hdr">
            <span>II. Spiritual Informations / ஆவிக்குரிய தகவல்கள்</span>
          </div>
          <div className="section-sub-inst">
            Please specify by selecting(✓) current ministry function தாங்கள் செய்யும் ஊழியத்தை (✓) குறிப்பிடவும்
          </div>
          <div className="checkboxes-grid-3x2">
            <FormCheckbox checked={sp.ministryCalling === 'apostle'} labelEn="Apostle" labelTa="அப்போஸ்தலர்" />
            <FormCheckbox checked={sp.ministryCalling === 'prophet'} labelEn="Prophet" labelTa="தீர்க்கதரிசி" />
            <FormCheckbox checked={sp.ministryCalling === 'pastor'} labelEn="Pastor" labelTa="மேய்ப்பர்" />
            <FormCheckbox checked={sp.ministryCalling === 'teacher'} labelEn="Teacher" labelTa="போதகர்" />
            <FormCheckbox checked={sp.ministryCalling === 'evangelist'} labelEn="Evangelist" labelTa="சுவிசேஷகர்" />
            <FormCheckbox checked={sp.ministryCalling === 'associate_pastor'} labelEn="Associate Pastor" labelTa="உதவி மேய்ப்பர்*" />
          </div>
          <div className="other-ministry-row">
            <FormCheckbox checked={sp.ministryCalling === 'other'} labelEn="Other Ministry" labelTa="மற்ற ஊழியம்" />
            <div className="underline-fill-line">
              <span className="fill-lbl">Specify:</span>
              <span className="fill-val">{sp.otherCalling || ''}</span>
            </div>
          </div>
        </div>

        {/* SECTION III: Affiliation */}
        <div className="digi-section-block">
          <div className="digi-section-hdr">
            <span>III. Affiliation</span>
          </div>
          <div className="section-sub-inst">
            Are you having any affiliation with fellowship / Organization / Diocese ? வேறு எந்த பேராயம், நிறுவனம், ஐக்கியத்தில் உறுப்பினரா ? குறிப்பிடவும்.
          </div>
          
          <div className="affil-option-row">
            <FormCheckbox checked={aff.type === 'independent'} labelEn="Independent Church" labelTa="சுயாதீன திருச்சபை" />
            <div className="underline-fill-line">
              <span className="fill-lbl">Founder's Name:</span>
              <span className="fill-val">{aff.founderName || (aff.type === 'independent' ? fullName : '')}</span>
            </div>
          </div>

          <div className="affil-option-row">
            <FormCheckbox checked={aff.type === 'denomination'} labelEn="Denomination (Specify)" labelTa="சபைப் பிரிவு" />
            <div className="underline-fill-line">
              <span className="fill-val">{aff.denominationName || ''}</span>
            </div>
          </div>

          <div className="affil-option-block">
            <FormCheckbox checked={aff.type === 'associate'} labelEn="Associate / Assistant" labelTa="(if so, provide the name of the chief Pastor and the Church you attend)* இணை, உதவி ஊழியர் (என்றால் தலைமைப் போதகர் மற்றும் சபையின் பெயரைக் குறிப்பிடவும்.)" />
            <div className="affil-subfields">
              <div className="underline-fill-line">
                <span className="fill-lbl">Name of the Chief Pastor / தலைமை மேய்ப்பரின் பெயர்:</span>
                <span className="fill-val">{aff.chiefPastorName || ''}</span>
              </div>
              <div className="underline-fill-line">
                <span className="fill-lbl">Name of the Church / சபையின் பெயர்:</span>
                <span className="fill-val">{aff.associateChurchName || ''}</span>
              </div>
              <div className="underline-fill-line">
                <span className="fill-lbl">Address / முகவரி:</span>
                <span className="fill-val">{aff.associateChurchAddress || ''}</span>
              </div>
            </div>
          </div>

          <div className="trust-name-row">
            <span className="trust-lbl">Name of your Trust / உங்களது டிரஸ்டின் பெயர்:</span>
            <CharacterBoxRow text={aff.trustName || ''} count={24} className="count-24" />
          </div>
        </div>

        {/* SECTION IV: Church Details */}
        <div className="digi-section-block">
          <div className="digi-section-hdr">
            <span>IV. Church Details / சபையின் விவரங்கள்</span>
          </div>

          <div className="form-field-row">
            <div className="field-meta">
              <span className="field-label-en">Church Name</span>
              <span className="field-label-ta">சபையின் பெயர்</span>
            </div>
            <div className="field-inputs">
              <CharacterBoxRow text={ch.name || ''} count={24} className="count-24" />
            </div>
          </div>

          {/* Church Address */}
          <div className="address-table-wrapper">
            <div className="address-table-title">
              <span className="field-label-en">Church Address</span>
              <span className="field-label-ta">சபையின் முகவரி</span>
            </div>
            <div className="address-grid-table">
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">Door No (கதவு எண்)</span>
                <CharacterBoxRow text={ch.doorNo || ch.churchAddress?.doorNo || ''} count={8} className="count-8" />
              </div>
              <div className="addr-cell-group flex-2">
                <span className="addr-cell-lbl">Street Name (தெருப் பெயர்)</span>
                <CharacterBoxRow text={ch.street || ch.churchAddress?.street || ''} count={23} className="count-23" />
              </div>
              <div className="addr-cell-group flex-2">
                <span className="addr-cell-lbl">City / Town (நகரம் / ஊர்)</span>
                <CharacterBoxRow text={ch.city || ch.churchAddress?.city || ''} count={23} className="count-23" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">Pincode (பின்கோடு)</span>
                <CharacterBoxRow text={ch.pincode || ch.churchAddress?.pincode || ''} count={6} className="count-6" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">Taluk (தாலுகா)</span>
                <CharacterBoxRow text={ch.taluk || ch.churchAddress?.taluk || ''} count={14} className="count-14" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">District (மாவட்டம்)</span>
                <CharacterBoxRow text={ch.district || ch.churchAddress?.district || ''} count={14} className="count-14" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">State (மாநிலம்)</span>
                <CharacterBoxRow text={ch.state || ch.churchAddress?.state || 'Tamil Nadu'} count={14} className="count-14" />
              </div>
              <div className="addr-cell-group">
                <span className="addr-cell-lbl">Country (நாடு)</span>
                <CharacterBoxRow text={ch.country || ch.churchAddress?.country || 'India'} count={14} className="count-14" />
              </div>
            </div>
          </div>

          <div className="contact-boxes-grid">
            <div className="contact-box-item">
              <span className="contact-box-lbl">Telephone / தொலைபேசி எண்:</span>
              <CharacterBoxRow text={ch.telephone || ''} count={16} className="count-16" />
            </div>
            <div className="contact-box-item">
              <span className="contact-box-lbl">Mobile No / கைப்பேசி எண்:</span>
              <CharacterBoxRow text={ch.mobile || p.mobile || ''} count={16} className="count-16" />
            </div>
          </div>

          <div className="email-box-row">
            <span className="email-box-lbl">Email ID / மின்னஞ்சல் முகவரி:</span>
            <CharacterBoxRow text={ch.email || p.email || ''} count={24} className="count-24" />
          </div>
        </div>

        {/* SECTION V: Questions 1 to 5 */}
        <div className="digi-section-block">
          <div className="digi-section-hdr">
            <span>V. Ministry Milestones & Questions / ஆவிக்குரிய தேதிகள் & கேள்விகள்</span>
          </div>

          <div className="milestone-qa-table">
            <div className="milestone-qa-row">
              <span className="mqa-text">1. When did you born again ? - எப்பொழுது மறுபிறப்பின் அனுபவத்தைப் பெற்றீர்கள்?</span>
              <Date8Boxes dateStr={mh.bornAgainDate || ''} />
            </div>
            <div className="milestone-qa-row">
              <span className="mqa-text">2. When did you baptize in full immersion ? - எப்பொழுது முழுக்கு ஞானஸ்நானம் பெற்றீர்கள்?</span>
              <Date8Boxes dateStr={mh.waterBaptismDate || ''} />
            </div>
            <div className="milestone-qa-row">
              <span className="mqa-text">3. When did you fill with the Holy Spirit ? - எப்பொழுது பரிசுத்த ஆவியின் அபிஷேகத்தைப் பெற்றீர்கள்?</span>
              <Date8Boxes dateStr={mh.holySpiritDate || ''} />
            </div>
            <div className="milestone-qa-row">
              <span className="mqa-text">4. When did you call for Ministry ? - எப்பொழுது ஊழிய அழைப்பைப் பெற்றீர்கள்?</span>
              <Date8Boxes dateStr={mh.ministryCallDate || ''} />
            </div>
            <div className="milestone-qa-row">
              <span className="mqa-text">5. When did you start the Ministry ? - எப்பொழுது ஊழியத்தைத் துவக்கினீர்கள்?</span>
              <Date8Boxes dateStr={mh.ministryStartDate || ''} />
            </div>
          </div>
        </div>

        <div className="digi-page-footer">
          <span>Apostolic Council of India Diocese, Membership Application Form, Page 2/4</span>
        </div>
      </div>

      {/* ============================================================
          PAGE 3 OF 4: MILESTONES (6-7) • ACADEMIC • THEOLOGICAL • FAMILY • REASON
          ============================================================ */}
      <div className="digi-a4-sheet" id="official-page-3">
        <div className="digi-page-watermark">
          <div className="watermark-crest">✠</div>
          <div className="watermark-text">APOSTOLIC COUNCIL OF INDIA DIOCESE</div>
        </div>

        <div className="sheet-top-banner">
          <span>ACI Diocese Membership Application Form</span>
        </div>

        {/* SECTION V Continued: Questions 6 & 7 */}
        <div className="digi-section-block">
          <div className="milestone-qa-choice-row">
            <div className="mqa-prompt">
              6. Do you want to be ordained by us ? Yes / No இந்தப் பேராயத்தால் பிரதிஷ்டை செய்யப்பட விரும்புகிறீர்களா ? ஆம் / இல்லை.
              <br />
              <span className="mqa-sub">If "No" please answer the next question - இல்லை என்றால் அடுத்த வினாவிற்கு உங்கள் பதிலை எழுதவும்.</span>
            </div>
            <div className="mqa-choice-boxes">
              <FormCheckbox checked={mh.desireOrdination === true || mh.desireOrdination === 'yes'} labelEn="Yes" labelTa="ஆம்" />
              <FormCheckbox checked={mh.desireOrdination === false || mh.desireOrdination === 'no'} labelEn="No" labelTa="இல்லை" />
            </div>
          </div>

          <div className="milestone-qa-choice-row">
            <div className="mqa-prompt">
              7. Do you want to be affiliated with us ? Yes / No If "Yes" please attach the xerox copy of your ordination certificate
              <br />
              <span className="mqa-sub">இந்தப் பேராயத்தின் அதிகாரப்பூர்வ இணைப்பைப் பெற விரும்புகிறீர்களா ? ஆம் / இல்லை. ஆம் என்றால் தங்களது பிரதிஷ்டை சான்றிதழின் நகலை இணைக்கவும்.</span>
            </div>
            <div className="mqa-choice-boxes">
              <FormCheckbox checked={mh.desireAffiliation === true || mh.desireAffiliation === 'yes'} labelEn="Yes" labelTa="ஆம்" />
              <FormCheckbox checked={mh.desireAffiliation === false || mh.desireAffiliation === 'no'} labelEn="No" labelTa="இல்லை" />
            </div>
          </div>
        </div>

        {/* SECTION VI: Academic Qualification */}
        <div className="digi-section-block">
          <div className="digi-section-hdr">
            <span>VI. Academic Qualification / கல்வித் தகுதி</span>
          </div>
          <table className="digi-grid-table">
            <thead>
              <tr>
                <th style={{ width: '45px' }}>S.No<br />வ.எண்</th>
                <th style={{ width: '220px' }}>Examination Passed<br />தேர்ச்சி பெற்ற தேர்வு</th>
                <th style={{ width: '80px' }}>Year<br />வருடம்</th>
                <th>School / College / University<br />பள்ளி / கல்லூரி / பல்கலைக்கழகம்</th>
              </tr>
            </thead>
            <tbody>
              {academicRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="center-cell">{idx + 1}</td>
                  <td>{row.examinationPassed || row.course || ''}</td>
                  <td className="center-cell">{row.year || ''}</td>
                  <td>{row.institution || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECTION VII: Theological Qualification */}
        <div className="digi-section-block">
          <div className="digi-section-hdr">
            <span>VII. Theological Qualification / இறையியல் தகுதி</span>
          </div>
          <table className="digi-grid-table">
            <thead>
              <tr>
                <th style={{ width: '45px' }}>S.No<br />வ.எண்</th>
                <th style={{ width: '220px' }}>Examination Passed<br />தேர்ச்சி பெற்ற தேர்வு</th>
                <th style={{ width: '80px' }}>Year<br />வருடம்</th>
                <th>School / Seminary / University<br />பள்ளி / இறையியல் கல்லூரி / பல்கலைக்கழகம்</th>
              </tr>
            </thead>
            <tbody>
              {theologicalRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="center-cell">{idx + 1}</td>
                  <td>{row.examinationPassed || row.degree || ''}</td>
                  <td className="center-cell">{row.year || ''}</td>
                  <td>{row.institution || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECTION VIII: Family Details */}
        <div className="digi-section-block">
          <div className="digi-section-hdr">
            <span>VIII. Family Details / குடும்ப விவரங்கள்</span>
          </div>
          <table className="digi-grid-table">
            <thead>
              <tr>
                <th style={{ width: '45px' }}>S.No<br />வ.எண்</th>
                <th style={{ width: '180px' }}>Name<br />பெயர்</th>
                <th style={{ width: '100px' }}>Date of Birth<br />பிறந்த தேதி</th>
                <th style={{ width: '140px' }}>Applicant's Relationship<br />விண்ணப்பதாரருக்கு உறவு</th>
                <th>Profession / Education<br />தொழில் / படிப்பு</th>
              </tr>
            </thead>
            <tbody>
              {familyRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="center-cell">{idx + 1}</td>
                  <td>{row.name || ''}</td>
                  <td className="center-cell">{row.dob || ''}</td>
                  <td>{row.relationship || ''}</td>
                  <td>{row.professionEducation || row.profession || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECTION IX: Reason to join ACI */}
        <div className="digi-section-block">
          <div className="digi-section-hdr">
            <span>IX. What prompts you to join APOSTOLIC COUNCIL OF INDIA DIOCESE ? / அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தில் இணையக் காரணம் என்ன ?</span>
          </div>
          <div className="reason-response-box">
            {mot.reasonToJoin || 'I am convinced and confirmed of my calling to serve the Lord under the episcopal guidance, fellowship and doctrinal shepherding of the Apostolic Council of India Diocese.'}
          </div>
        </div>

        <div className="digi-page-footer">
          <span>Apostolic Council of India Diocese, Membership Application Form, Page 3/4</span>
        </div>
      </div>

      {/* ============================================================
          PAGE 4 OF 4: REFERENCES • DECLARATION • ENCLOSURES CHECKLIST
          ============================================================ */}
      <div className="digi-a4-sheet" id="official-page-4">
        <div className="digi-page-watermark">
          <div className="watermark-crest">✠</div>
          <div className="watermark-text">APOSTOLIC COUNCIL OF INDIA DIOCESE</div>
        </div>

        <div className="sheet-top-banner">
          <span>ACI Diocese Membership Application Form</span>
        </div>

        {/* SECTION X: Two References */}
        <div className="digi-section-block">
          <div className="digi-section-hdr">
            <span>X. Details of two references (Must) / பரிந்துரை விவரங்கள் (கட்டாயம் தேவை)</span>
          </div>
          <div className="section-sub-inst">
            Two Personal references of good standing members of ACI Diocese / அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தின் இரண்டு அங்கத்தினர்களின் பரிந்துரைகள்
          </div>

          <div className="references-grid">
            {/* Reference 1 */}
            <div className="reference-card">
              <div className="ref-card-title">
                Reference 1. District Overseer (Diocesan Member - if there is no DOS)
                <br />
                <span className="ref-card-ta">மாவட்ட மேற்பார்வையாளர் (இல்லையெனில் பேராய அங்கத்தினர்)</span>
              </div>
              <div className="ref-field-line">
                <span className="ref-lbl">Name:</span>
                <span className="ref-val">{ref.ref1?.name || 'Rev. R. John Durai'}</span>
              </div>
              <div className="ref-field-line">
                <span className="ref-lbl">Diocese ID Number:</span>
                <span className="ref-val">{ref.ref1?.dioceseId || 'TN 0005'}</span>
              </div>
              <div className="ref-field-line">
                <span className="ref-lbl">I know this person since:</span>
                <span className="ref-val">{ref.ref1?.knownDuration || '8 Years'}</span>
              </div>
              <div className="ref-field-line">
                <span className="ref-lbl">Tel / Mobile:</span>
                <span className="ref-val">{ref.ref1?.phone || '9443210987'}</span>
              </div>
              <div className="ref-mode-row">
                <FormCheckbox checked={ref.ref1?.mode === 'personally' || !ref.ref1?.mode} labelEn="Personally" />
                <FormCheckbox checked={ref.ref1?.mode === 'professionally'} labelEn="Professionally" />
              </div>
              <div className="ref-sig-row">
                <span className="ref-sig-lbl">Signature:</span>
                <span className="ref-sig-badge">[ Attested & Approved ]</span>
              </div>
            </div>

            {/* Reference 2 */}
            <div className="reference-card">
              <div className="ref-card-title">
                Reference 2. Taluk Co-ordinator (Diocesan Member - if there is no DOS)
                <br />
                <span className="ref-card-ta">தாலுகா ஒருங்கிணைப்பாளர் (இல்லையெனில் பேராய அங்கத்தினர்)</span>
              </div>
              <div className="ref-field-line">
                <span className="ref-lbl">Name:</span>
                <span className="ref-val">{ref.ref2?.name || 'Rev. D. Antony Raj'}</span>
              </div>
              <div className="ref-field-line">
                <span className="ref-lbl">Diocese ID Number:</span>
                <span className="ref-val">{ref.ref2?.dioceseId || 'TN 0466'}</span>
              </div>
              <div className="ref-field-line">
                <span className="ref-lbl">I know this person since:</span>
                <span className="ref-val">{ref.ref2?.knownDuration || '5 Years'}</span>
              </div>
              <div className="ref-field-line">
                <span className="ref-lbl">Tel / Mobile:</span>
                <span className="ref-val">{ref.ref2?.phone || '9876543210'}</span>
              </div>
              <div className="ref-mode-row">
                <FormCheckbox checked={ref.ref2?.mode === 'personally'} labelEn="Personally" />
                <FormCheckbox checked={ref.ref2?.mode === 'professionally' || !ref.ref2?.mode} labelEn="Professionally" />
              </div>
              <div className="ref-sig-row">
                <span className="ref-sig-lbl">Signature:</span>
                <span className="ref-sig-badge">[ Attested & Approved ]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer and Signature */}
        <div className="digi-section-block">
          <div className="digi-section-hdr">
            <span>Disclaimer and Signature / உறுதிமொழி மற்றும் கையெழுத்து</span>
          </div>
          <div className="declaration-legal-box">
            <p className="dec-text-en">
              “I hereby declare that the information furnished above is true to the best of my knowledge. I am fully in agreement with the Faith Statement of ACI Diocese. I understand that this is the united Ministry and I shall give attention to this ministry apart from my church ministry. I shall abide by the terms and conditions of ACI Diocese, in force from time to time.”
            </p>
            <p className="dec-text-ta">
              “மேலே குறிப்பிட்ட உள்ள தகவல்கள் எல்லாம் உண்மை என்றும் இந்தப் பேராயத்தின் விசுவாச அறிக்கையை முழுமையாக ஏற்றுக்கொள்கிறேன் என்றும், இந்த ஐக்கியத்தின் ஊழியத்தை புரிந்துகொண்டு, எனது தனிப்பட்ட ஊழியத்தின் மத்தியிலும், இதில் கவனம் செலுத்துவேன் என்றும், காலத்திற்குத் தேவையான பேராயத்தின் விதிகளையும், நிபந்தனைகளையும் ஏற்றுக் கொள்வேன் என்றும் உறுதி கூறுகிறேன்.”
            </p>
          </div>

          <div className="declaration-meta-bar">
            <div className="dec-place-date">
              <div>Place / இடம் : <strong>{dec.place || perm.city || 'Dindigul'}</strong></div>
              <div>Date / தேதி : <strong>{dec.date || appDate}</strong></div>
            </div>

            <div className="dec-signature-box">
              <span className="sig-badge">[ Digitally Confirmed & Verified ]</span>
              <div className="sig-handwritten">{sigName}</div>
              <span className="sig-caption">Applicant's Signature / விண்ணப்பதாரரின் கையொப்பம்</span>
            </div>
          </div>
        </div>

        {/* Enclosures to be attached */}
        <div className="digi-section-block">
          <div className="digi-section-hdr">
            <span>Enclosures to be attached / இணைக்க வேண்டிய இணைப்புகள்</span>
          </div>

          <div className="enclosures-official-list">
            <div className="enc-item-row">
              <span className="enc-check">[X]</span>
              <span className="enc-txt"><strong>1. Proof of Identity / அடையாளச் சான்று</strong> (ஆதார் கார்டு / பாஸ்போர்ட் / வாக்காளர் அடையாள அட்டை)</span>
            </div>
            <div className="enc-item-row">
              <span className="enc-check">[X]</span>
              <span className="enc-txt"><strong>2. Proof of Address / வீட்டு முகவரிச் சான்று</strong> (ரேஷன் கார்டு / மின் கட்டண ரசீது / காஸ் இணைப்பு / வாக்காளர் அடையாள அட்டை)</span>
            </div>
            <div className="enc-item-row">
              <span className="enc-check">[X]</span>
              <span className="enc-txt"><strong>3. Proof of Date of Birth / பிறந்த தேதிக்கான சான்று</strong> (பள்ளி மாற்றுச் சான்றிதழ் / 10, 12ம் வகுப்பு மதிப்பெண் பட்டியல் / பிறப்புச் சான்றிதழ் / வாக்காளர் அடையாள அட்டை)</span>
            </div>
            <div className="enc-item-row">
              <span className="enc-check">[X]</span>
              <span className="enc-txt"><strong>4. Proof of Name Change / பெயர் மாற்றத்திற்கான சான்று</strong> (ஞானஸ்நான சான்றிதழ் / அரசிதழ் பதிவு - அறிவிப்பு)</span>
            </div>
            <div className="enc-item-row">
              <span className="enc-check">[X]</span>
              <span className="enc-txt"><strong>5. Two Copies of recent passport size photos / சமீபத்தில் எடுத்த இரண்டு புகைப்படங்கள்</strong> (பாஸ்போர்ட் அளவிலான புகைப்படம் ஒன்று ஒட்டவும், ஒன்று ஒட்டாமல் வைக்கவும்)</span>
            </div>
            <div className="enc-item-row">
              <span className="enc-check">[X]</span>
              <span className="enc-txt"><strong>6. Your Ministry Statement / தங்களது ஊழியத்தைப் பற்றிய விளக்கம்</strong> (ஒரு பக்க அளவில் தற்போது தாங்கள் செய்து வரும் ஊழியத்தின் சுருக்கம்)</span>
            </div>
            <div className="enc-item-row">
              <span className="enc-check">[X]</span>
              <span className="enc-txt"><strong>7. Your Ministry or Church Photo / தங்களது ஊழியம் / சபையின் புகைப்படம்</strong> (தாங்களும் தங்கள் சபையாரும் சேர்ந்து சபையில் எடுத்த புகைப்படம்)</span>
            </div>
          </div>

          <div className="official-validity-note">
            Note: This application is valid for one month from the date of issued.
            <br />
            <span className="val-ta">குறிப்பு: இந்த விண்ணப்பம் வழங்கப்பட்ட தேதியிலிருந்து ஒரு மாதத்திற்குள் அனுப்பப்படவேண்டும்.</span>
          </div>
        </div>

        <div className="digi-page-footer">
          <span>Apostolic Council of India Diocese, Membership Application Form, Page 4/4</span>
        </div>
      </div>

    </div>
  )
}
