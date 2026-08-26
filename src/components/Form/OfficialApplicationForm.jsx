import React from 'react'
import './OfficialApplicationForm.css'

// Reusable Character Box Row with strictly self-contained boundaries
function CharacterBoxRow({ text = '', count = 24, className = '' }) {
  const clean = (text || '')
    .toString()
    .toUpperCase()
    .replace(/[^A-Z0-9\s\.\,\/\-]/g, '')
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

export default function OfficialApplicationForm({ data }) {
  const p = data?.personal || {}
  const perm = p.permanentAddress || {}
  const contact = p.contactAddressSameAsPermanent ? perm : (p.contactAddress || {})
  const sp = data?.spiritual || {}
  const aff = data?.affiliation || {}
  const ch = data?.church || {}
  const mh = data?.ministryHistory || {}
  const q = data?.qualifications || { academic: [], theological: [] }
  const fam = data?.family || []
  const mot = data?.motivation || {}
  const ref = data?.references || {}
  const dec = data?.declaration || {}

  const fullName = [p.salutation, p.name].filter(Boolean).join(' ').toUpperCase()
  const appDate = p.applicationDate || new Date().toISOString().split('T')[0]
  const sigName = p.name || 'Pastor S. John Samuel'

  // Filter out blank rows dynamically
  const validAcademic = (q.academic || []).filter(r => r.examinationPassed || r.year || r.institution)
  const validTheological = (q.theological || []).filter(r => r.examinationPassed || r.year || r.institution)
  const validFamily = (fam || []).filter(f => f.name || f.dob || f.relationship || f.professionEducation)

  return (
    <div className="digi-form-canvas-container">

      {/* ============================================================
          PAGE 1 OF 2: BREATHABLE, ELEGANT, UNMERGED HEADER & CLEAN FLOW
          ============================================================ */}
      <div className="digi-a4-sheet" id="official-page-1">
        
        {/* Subtle Watermark in Background */}
        <div className="digi-page-watermark">
          <div className="watermark-crest">✠</div>
          <div className="watermark-text">APOSTOLIC COUNCIL OF INDIA DIOCESE</div>
        </div>

        {/* Breathable Header */}
        <div className="digi-page-header">
          <div className="digi-crest-container">
            <img
              src="/aci-logo.png"
              alt="ACI Crest"
              className="digi-crest-logo"
              onError={(e) => { e.target.src = '/aci-logo.jpg' }}
            />
          </div>
          <div className="digi-header-center-info">
            <h1 className="digi-diocese-title">APOSTOLIC COUNCIL OF INDIA DIOCESE</h1>
            <p className="digi-trust-line-1">
              An Episcopal Diocese & Public Religious Trust (Indian Trust Act 1882 - Regd No: 62/Bk.4/2013)
            </p>
            <p className="digi-trust-line-2">
              Under Part I, Sec. 5(1) • Part IV, Sec. 10, 12, 14, 15 • Part VI, Sec. 64 of The Indian Christian Marriage Act 1872
            </p>
            <p className="digi-trust-line-3">
              Constituent and/or The Christian Clergy Rights and Traditions
            </p>
            <p className="digi-office-address">
              Central Office: Melapatty, Hanumantharayankottai - 624 054, Dindigul, Tamil Nadu, India
            </p>
            <p className="digi-contact-details">
              Phone: 0451 2490100 • E-mail: info@acidiocese.org / rev.johnsondurai@gmail.com
            </p>
          </div>
        </div>

        {/* Title Bar & Date of Issue */}
        <div className="digi-title-date-bar">
          <div className="digi-titles-wrap">
            <h2 className="digi-heading-en">DIOCESAN MEMBERSHIP APPLICATION FORM</h2>
            <h3 className="digi-heading-ta">பேராய உறுப்பினர் விண்ணப்பப் படிவம்</h3>
          </div>
          <div className="digi-issue-date-card">
            <div className="lbl">Date of issue</div>
            <div className="val">{appDate}</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="digi-instruction-notice">
          Read the Application carefully, fill in CAPITAL LETTERS, tick (✓) appropriate boxes and leave inappropriate fields blank. / விண்ணப்பத்தை கவனமாக வாசித்து ஆங்கில பெரிய எழுத்துக்களில் தெளிவாக நிரப்பவும்.
        </div>

        {/* TOP ADMINISTRATIVE BLOCK */}
        <div className="digi-top-admin-block">
          {/* Column 1: FOR OFFICE USE ONLY */}
          <div className="digi-admin-office-col">
            <div className="digi-admin-header-strip">
              FOR OFFICE USE ONLY / அலுவலகப் பணிக்கு மட்டும்
            </div>
            <div className="digi-admin-office-body">
              <div className="digi-admin-field-row">
                <span className="admin-lbl">Application Number :</span>
                <span className="admin-appno-val">002093 / ACI-2026</span>
                <span className="admin-approval-tag">APPROVAL</span>
              </div>

              <div className="digi-admin-field-row">
                <span className="admin-lbl">Application Received on :</span>
                <Date8Boxes dateStr={appDate} />
              </div>

              <div className="digi-admin-field-row">
                <span className="admin-lbl">Application Approved on :</span>
                <Date8Boxes dateStr="" />
              </div>

              <div className="digi-admin-field-row">
                <span className="admin-lbl">Membership Code :</span>
                <CharacterBoxRow text="" count={10} className="count-10" />
              </div>
            </div>
          </div>

          {/* Column 2: PROMINENT LARGE OFFICIAL SEAL AREA */}
          <div className="digi-admin-seal-col">
            <div className="digi-seal-outer-wrapper">
              <div className="digi-large-seal-circle">
                <div className="seal-txt-top">OFFICIAL</div>
                <div className="seal-emblem">✠</div>
                <div className="seal-txt-bot">SEAL</div>
              </div>
              <div className="seal-tag-text">RESERVED FOR SEAL</div>
            </div>
          </div>

          {/* Column 3: PASSPORT PHOTO CONTAINER */}
          <div className="digi-admin-photo-col">
            {p.photoUrl ? (
              <img src={p.photoUrl} alt="Applicant Passport" className="digi-passport-img" />
            ) : (
              <div className="digi-photo-blank-guide">
                <span className="p-l1">Affix Recent</span>
                <span className="p-l2">Passport size</span>
                <span className="p-l3">Photo</span>
                <span className="p-l4">Self Attested</span>
              </div>
            )}
          </div>
        </div>

        {/* I. Personal Details */}
        <div className="digi-full-black-banner">
          I. Personal Details / சுய விவரங்கள்
        </div>

        <div className="digi-personal-details-section">
          {/* 1. Name */}
          <div className="digi-form-entry-row">
            <div className="digi-entry-label">
              <strong className="l-en">1. Name</strong> <span className="l-ta">பெயர்</span>
              <span className="l-hint">(Salutation - Mr., Mrs., Rev., Dr., Bro., Pastor)</span>
            </div>
            <div className="digi-entry-box-wrap">
              <CharacterBoxRow text={fullName} count={24} />
            </div>
          </div>

          {/* 2. Baptismal Name */}
          <div className="digi-form-entry-row">
            <div className="digi-entry-label">
              <strong className="l-en">2. Baptismal Name</strong> <span className="l-ta">ஞானஸ்நானப் பெயர்</span>
            </div>
            <div className="digi-entry-box-wrap">
              <CharacterBoxRow text={p.baptismalName} count={24} />
            </div>
          </div>

          {/* 3. DOB & Nationality */}
          <div className="digi-two-column-split">
            <div className="digi-split-col">
              <div className="digi-entry-label">
                <strong className="l-en">3. Date of Birth</strong> <span className="l-ta">பிறந்த தேதி</span>
              </div>
              <SegmentedDateBoxes dateStr={p.dob} />
            </div>

            <div className="digi-split-col">
              <div className="digi-entry-label">
                <strong className="l-en">Nationality</strong> <span className="l-ta">நாட்டுரிமை</span>
              </div>
              <div className="digi-entry-box-wrap">
                <CharacterBoxRow text={p.nationality || 'INDIAN'} count={12} className="count-12" />
              </div>
            </div>
          </div>

          {/* 4. Gender & Marital Status */}
          <div className="digi-two-column-split">
            <div className="digi-split-col">
              <div className="digi-entry-label">
                <strong className="l-en">4. Gender</strong> <span className="l-ta">பாலினம்</span>
              </div>
              <div className="digi-checkbox-cluster">
                <FormCheckbox checked={p.gender === 'Male'} labelEn="Male" labelTa="ஆண்" />
                <FormCheckbox checked={p.gender === 'Female'} labelEn="Female" labelTa="பெண்" />
              </div>
            </div>

            <div className="digi-split-col">
              <div className="digi-entry-label">
                <strong className="l-en">Marital Status</strong> <span className="l-ta">திருமண நிலை</span>
              </div>
              <div className="digi-checkbox-cluster">
                <FormCheckbox checked={p.maritalStatus === 'Married'} labelEn="Married" />
                <FormCheckbox checked={p.maritalStatus === 'Bachelor'} labelEn="Bachelor" />
                <FormCheckbox checked={p.maritalStatus === 'Spinster'} labelEn="Spinster" />
                <FormCheckbox checked={p.maritalStatus === 'Widowed'} labelEn="Widowed" />
              </div>
            </div>
          </div>

          {/* 5. Permanent Address */}
          <div className="digi-address-structured-grid">
            <div className="digi-address-grid-heading">
              <strong>5. Permanent Address</strong> <span>நிரந்தர முகவரி</span>
            </div>
            <div className="digi-grid-row">
              <div className="digi-grid-cell" style={{ width: '28%' }}>
                <span className="c-lbl">Door No</span> <span className="c-val">{perm.doorNo || '\u00A0'}</span>
              </div>
              <div className="digi-grid-cell" style={{ width: '72%' }}>
                <span className="c-lbl">Street Name</span> <span className="c-val">{perm.streetName || '\u00A0'}</span>
              </div>
            </div>
            <div className="digi-grid-row">
              <div className="digi-grid-cell" style={{ width: '64%' }}>
                <span className="c-lbl">City / Town</span> <span className="c-val">{perm.cityTown || '\u00A0'}</span>
              </div>
              <div className="digi-grid-cell" style={{ width: '36%' }}>
                <span className="c-lbl">Pincode</span> <CharacterBoxRow text={perm.pincode} count={6} className="count-6" />
              </div>
            </div>
            <div className="digi-grid-row">
              <div className="digi-grid-cell" style={{ width: '50%' }}>
                <span className="c-lbl">Taluk</span> <span className="c-val">{perm.taluk || '\u00A0'}</span>
              </div>
              <div className="digi-grid-cell" style={{ width: '50%' }}>
                <span className="c-lbl">District</span> <span className="c-val">{perm.district || '\u00A0'}</span>
              </div>
            </div>
            <div className="digi-grid-row">
              <div className="digi-grid-cell" style={{ width: '50%' }}>
                <span className="c-lbl">State</span> <span className="c-val">{perm.state || '\u00A0'}</span>
              </div>
              <div className="digi-grid-cell" style={{ width: '50%' }}>
                <span className="c-lbl">Country</span> <span className="c-val">{perm.country || 'India'}</span>
              </div>
            </div>
          </div>

          {/* 6. Contact Address */}
          <div className="digi-address-structured-grid">
            <div className="digi-address-grid-heading">
              <strong>6. Contact Address</strong> <span>தொடர்பு முகவரி</span>
            </div>
            <div className="digi-grid-row">
              <div className="digi-grid-cell" style={{ width: '28%' }}>
                <span className="c-lbl">Door No</span> <span className="c-val">{contact.doorNo || '\u00A0'}</span>
              </div>
              <div className="digi-grid-cell" style={{ width: '72%' }}>
                <span className="c-lbl">Street Name</span> <span className="c-val">{contact.streetName || '\u00A0'}</span>
              </div>
            </div>
            <div className="digi-grid-row">
              <div className="digi-grid-cell" style={{ width: '64%' }}>
                <span className="c-lbl">City / Town</span> <span className="c-val">{contact.cityTown || '\u00A0'}</span>
              </div>
              <div className="digi-grid-cell" style={{ width: '36%' }}>
                <span className="c-lbl">Pincode</span> <CharacterBoxRow text={contact.pincode} count={6} className="count-6" />
              </div>
            </div>
            <div className="digi-grid-row">
              <div className="digi-grid-cell" style={{ width: '50%' }}>
                <span className="c-lbl">Taluk</span> <span className="c-val">{contact.taluk || '\u00A0'}</span>
              </div>
              <div className="digi-grid-cell" style={{ width: '50%' }}>
                <span className="c-lbl">District</span> <span className="c-val">{contact.district || '\u00A0'}</span>
              </div>
            </div>
            <div className="digi-grid-row">
              <div className="digi-grid-cell" style={{ width: '50%' }}>
                <span className="c-lbl">State</span> <span className="c-val">{contact.state || '\u00A0'}</span>
              </div>
              <div className="digi-grid-cell" style={{ width: '50%' }}>
                <span className="c-lbl">Country</span> <span className="c-val">{contact.country || 'India'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* II. Spiritual Information */}
        <div className="digi-full-black-banner">
          II. Spiritual Information / ஆவிக்குரிய தகவல்கள்
        </div>

        <div className="digi-spiritual-content-box">
          <div className="digi-fivefold-full-grid">
            <FormCheckbox checked={sp.ministryFunction === 'Apostle'} labelEn="Apostle" labelTa="அப்போஸ்தலர்" />
            <FormCheckbox checked={sp.ministryFunction === 'Prophet'} labelEn="Prophet" labelTa="தீர்க்கதரிசி" />
            <FormCheckbox checked={sp.ministryFunction === 'Pastor'} labelEn="Pastor" labelTa="மேய்ப்பர்" />
            <FormCheckbox checked={sp.ministryFunction === 'Teacher'} labelEn="Teacher" labelTa="போதகர்" />
            <FormCheckbox checked={sp.ministryFunction === 'Evangelist'} labelEn="Evangelist" labelTa="சுவிசேஷகர்" />
          </div>

          <div className="digi-spiritual-sub-row">
            <FormCheckbox checked={sp.ministryFunction === 'Associate Pastor'} labelEn="Associate Pastor" labelTa="உதவி மேய்ப்பர்" />
            <div className="digi-other-spec-cluster">
              <FormCheckbox checked={sp.ministryFunction === 'Other Ministry'} labelEn="Other Ministry" labelTa="மற்ற ஊழியங்கள்" />
              <span className="digi-text-underline-spec">Specify: <strong>{sp.otherMinistrySpecify || '___________________________'}</strong></span>
            </div>
          </div>
        </div>

        {/* III. Affiliation */}
        <div className="digi-full-black-banner">
          III. Affiliation / பேராயம் / நிறுவனம் / ஐக்கிய இணைப்பு
        </div>

        <div className="digi-affiliation-full-list">
          <div className="digi-aff-entry">
            <FormCheckbox checked={aff.affiliationType === 'Independent Church'} labelEn="Independent Church" labelTa="ஸ்தல சுயாட்சி சபை" />
            <span className="digi-text-underline-spec">Founder's Name: <strong>{aff.founderName || '___________________________'}</strong></span>
          </div>

          <div className="digi-aff-entry">
            <FormCheckbox checked={aff.affiliationType === 'Denomination'} labelEn="Denomination" labelTa="சபைப் பிரிவு" />
            <span className="digi-text-underline-spec">Specify: <strong>{aff.denominationSpecify || '___________________________'}</strong></span>
          </div>

          <div className="digi-aff-entry">
            <FormCheckbox checked={aff.affiliationType === 'Associate / Assistant'} labelEn="Associate / Assistant" labelTa="துணை / உதவி" />
            <span className="digi-text-underline-spec">Name of Chief Pastor: <strong>{aff.associateChiefPastorName || '___________________________'}</strong></span>
          </div>

          <div className="digi-aff-entry" style={{ paddingLeft: '24px' }}>
            <span className="digi-text-underline-spec">Name of Church: <strong>{aff.associateChurchName || '___________________________'}</strong></span>
          </div>

          <div className="digi-aff-entry">
            <span className="digi-text-underline-spec"><strong>Name of your Trust (உங்களது டிரஸ்டின் பெயர்):</strong> <strong>{aff.trustName || 'Living Word Ministries Trust'}</strong></span>
          </div>
        </div>

        {/* IV. Church Details */}
        <div className="digi-full-black-banner">
          IV. Church Details / சபையின் தகவல்கள்
        </div>

        <div className="digi-personal-details-section">
          <div className="digi-form-entry-row">
            <div className="digi-entry-label">
              <strong className="l-en">Church Name</strong> <span className="l-ta">சபையின் பெயர்</span>
            </div>
            <div className="digi-entry-box-wrap">
              <CharacterBoxRow text={ch.churchName} count={24} />
            </div>
          </div>

          <div className="digi-address-structured-grid" style={{ marginTop: '3px' }}>
            <div className="digi-grid-row">
              <div className="digi-grid-cell" style={{ width: '28%' }}>
                <span className="c-lbl">Door No</span> <span className="c-val">{ch.doorNo || '\u00A0'}</span>
              </div>
              <div className="digi-grid-cell" style={{ width: '72%' }}>
                <span className="c-lbl">Street Name</span> <span className="c-val">{ch.streetName || '\u00A0'}</span>
              </div>
            </div>

            <div className="digi-grid-row">
              <div className="digi-grid-cell" style={{ width: '64%' }}>
                <span className="c-lbl">City / Town</span> <span className="c-val">{ch.cityTown || '\u00A0'}</span>
              </div>
              <div className="digi-grid-cell" style={{ width: '36%' }}>
                <span className="c-lbl">Pincode</span> <CharacterBoxRow text={ch.pincode} count={6} className="count-6" />
              </div>
            </div>

            <div className="digi-grid-row">
              <div className="digi-grid-cell" style={{ width: '50%' }}>
                <span className="c-lbl">Taluk</span> <span className="c-val">{ch.taluk || '\u00A0'}</span>
              </div>
              <div className="digi-grid-cell" style={{ width: '50%' }}>
                <span className="c-lbl">District</span> <span className="c-val">{ch.district || '\u00A0'}</span>
              </div>
            </div>

            <div className="digi-grid-row">
              <div className="digi-grid-cell" style={{ width: '50%' }}>
                <span className="c-lbl">State</span> <span className="c-val">{ch.state || '\u00A0'}</span>
              </div>
              <div className="digi-grid-cell" style={{ width: '50%' }}>
                <span className="c-lbl">Country</span> <span className="c-val">{ch.country || 'India'}</span>
              </div>
            </div>

            <div className="digi-grid-row">
              <div className="digi-grid-cell" style={{ width: '33%' }}>
                <span className="c-lbl">Telephone</span> <span className="c-val">{ch.telephone || '\u00A0'}</span>
              </div>
              <div className="digi-grid-cell" style={{ width: '33%' }}>
                <span className="c-lbl">Mobile</span> <span className="c-val">{ch.mobileNumber || '\u00A0'}</span>
              </div>
              <div className="digi-grid-cell" style={{ width: '34%' }}>
                <span className="c-lbl">Email ID</span> <span className="c-val">{ch.emailId || '\u00A0'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* V. Ministry Milestones & Questions */}
        <div className="digi-full-black-banner">
          V. Ministry Milestones & Questions / ஆவிக்குரிய தேதிகள் & கேள்விகள்
        </div>

        <div className="digi-milestones-full-block">
          <div className="digi-milestone-entry">
            <span className="m-text">1. Born Again மறுபிறப்பு :</span>
            <Date8Boxes dateStr={mh.bornAgainDate} />
          </div>
          <div className="digi-milestone-entry">
            <span className="m-text">2. Water Baptism முழுக்கு ஞானஸ்நானம் :</span>
            <Date8Boxes dateStr={mh.waterBaptismDate} />
          </div>
          <div className="digi-milestone-entry">
            <span className="m-text">3. Holy Spirit அபிஷேகம் :</span>
            <Date8Boxes dateStr={mh.holySpiritBaptismDate} />
          </div>
          <div className="digi-milestone-entry">
            <span className="m-text">4. Ministry Calling ஊழிய அழைப்பு :</span>
            <Date8Boxes dateStr={mh.callingDate} />
          </div>
          <div className="digi-milestone-entry">
            <span className="m-text">5. Started Ministry ஊழிய துவக்கம் :</span>
            <Date8Boxes dateStr={mh.ministryStartDate} />
          </div>
          <div className="digi-milestone-entry">
            <span className="m-text">6. Want Ordination பிரதிஷ்டை?</span>
            <div className="digi-inline-chk-pair">
              <FormCheckbox checked={mh.wantOrdination === 'Yes'} labelEn="Yes ஆம்" />
              <FormCheckbox checked={mh.wantOrdination === 'No'} labelEn="No இல்லை" />
            </div>
          </div>
          <div className="digi-milestone-entry" style={{ gridColumn: 'span 2' }}>
            <span className="m-text">7. Do you want to be affiliated with ACI Diocese? இந்தப் பேராயத்தின் இணைப்பைப் பெற விரும்புகிறீர்களா?</span>
            <div className="digi-inline-chk-pair">
              <FormCheckbox checked={mh.wantAffiliation === 'Yes'} labelEn="Yes ஆம்" />
              <FormCheckbox checked={mh.wantAffiliation === 'No'} labelEn="No இல்லை" />
            </div>
          </div>
        </div>

        <div className="digi-sheet-footer">
          Apostolic Council of India Diocese, Membership Application Form, Page 1/2
        </div>
      </div>

      {/* ============================================================
          PAGE 2 OF 2: QUALIFICATIONS, FAMILY, MOTIVATION, REFERENCES, DECLARATION & SINGLE-COLUMN CHECKLIST
          ============================================================ */}
      <div className="digi-a4-sheet" id="official-page-2">
        
        {/* Subtle Watermark in Background */}
        <div className="digi-page-watermark">
          <div className="watermark-crest">✠</div>
          <div className="watermark-text">APOSTOLIC COUNCIL OF INDIA DIOCESE</div>
        </div>

        {/* VI. Academic Qualification Table */}
        <div className="digi-full-black-banner">
          VI. Academic Qualification / பொதுக் கல்வித் தகுதி
        </div>

        <table className="digi-clean-form-table">
          <thead>
            <tr>
              <th style={{ width: '38px' }}>S.No</th>
              <th>Examination Passed / தேர்ச்சி பெற்ற தேர்வு</th>
              <th style={{ width: '85px' }}>Year / ஆண்டு</th>
              <th>School / College / University பள்ளி / கல்லூரி / பல்கலைக் கழகம்</th>
            </tr>
          </thead>
          <tbody>
            {validAcademic.length > 0 ? (
              validAcademic.map((row, idx) => (
                <tr key={idx}>
                  <td className="center-cell">{idx + 1}</td>
                  <td>{row.examinationPassed || '\u00A0'}</td>
                  <td className="center-cell">{row.year || '\u00A0'}</td>
                  <td>{row.institution || '\u00A0'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="center-cell">1</td>
                <td>-</td>
                <td className="center-cell">-</td>
                <td>-</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* VII. Theological Qualification Table */}
        <div className="digi-full-black-banner">
          VII. Theological Qualification / இறையியல் தகுதி
        </div>

        <table className="digi-clean-form-table">
          <thead>
            <tr>
              <th style={{ width: '38px' }}>S.No</th>
              <th>Course Passed / தேர்ச்சி பெற்ற படிப்பு</th>
              <th style={{ width: '85px' }}>Year / ஆண்டு</th>
              <th>Seminary / Bible College வேத பள்ளி / கல்லூரி</th>
            </tr>
          </thead>
          <tbody>
            {validTheological.length > 0 ? (
              validTheological.map((row, idx) => (
                <tr key={idx}>
                  <td className="center-cell">{idx + 1}</td>
                  <td>{row.examinationPassed || '\u00A0'}</td>
                  <td className="center-cell">{row.year || '\u00A0'}</td>
                  <td>{row.institution || '\u00A0'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="center-cell">1</td>
                <td>-</td>
                <td className="center-cell">-</td>
                <td>-</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* VIII. Family Details Table */}
        <div className="digi-full-black-banner">
          VIII. Family Details / குடும்ப விவரங்கள்
        </div>

        <table className="digi-clean-form-table">
          <thead>
            <tr>
              <th style={{ width: '38px' }}>S.No</th>
              <th>Name / பெயர்</th>
              <th style={{ width: '95px' }}>DOB / பிறந்த தேதி</th>
              <th style={{ width: '105px' }}>Relationship / உறவுமுறை</th>
              <th>Profession & Education / தொழில் & படிப்பு</th>
            </tr>
          </thead>
          <tbody>
            {validFamily.length > 0 ? (
              validFamily.map((f, idx) => (
                <tr key={idx}>
                  <td className="center-cell">{idx + 1}</td>
                  <td>{f.name || '\u00A0'}</td>
                  <td className="center-cell">{f.dob || '\u00A0'}</td>
                  <td>{f.relationship || '\u00A0'}</td>
                  <td>{f.professionEducation || '\u00A0'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="center-cell">1</td>
                <td>-</td>
                <td className="center-cell">-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* IX. Motivation Box */}
        <div className="digi-full-black-banner">
          IX. What prompts you to join APOSTOLIC COUNCIL OF INDIA DIOCESE? / பேராயத்தில் இணையக் காரணம்
        </div>

        <div className="digi-motivation-content-box">
          <p className="digi-motivation-text-content">
            {mot.reasonToJoin || 'I am convinced and confirmed of my calling in God\'s ministry, in the fivefold ministry. I seek episcopal guidance, fellowship, and doctrinal mentoring under the Apostolic Council of India Diocese to serve the Kingdom of God faithfully.'}
          </p>
        </div>

        {/* X. Details of Two References */}
        <div className="digi-full-black-banner">
          X. Details of Two References (Must) / இரண்டு பேராய அங்கத்தினர்களின் பரிந்துரை
        </div>

        <div className="digi-references-two-col-grid">
          {/* Reference 1 */}
          <div className="digi-ref-box-card">
            <div className="digi-ref-card-header">
              1. District Overseer / பேராய உறுப்பினர்
            </div>
            <div className="digi-ref-card-content">
              <div className="digi-ref-line">
                <span className="r-lbl">Name :</span>
                <span className="r-val">{ref.ref1?.name || 'Rev. R. John Durai'}</span>
              </div>
              <div className="digi-ref-line">
                <span className="r-lbl">Diocese ID No :</span>
                <span className="r-val">{ref.ref1?.diocesanId || 'TN 0005'}</span>
              </div>
              <div className="digi-ref-line">
                <span className="r-lbl">Telephone / Mobile :</span>
                <span className="r-val">{ref.ref1?.phone || '9486485810'}</span>
              </div>
              <div className="digi-ref-line">
                <span className="r-lbl">Known Since :</span>
                <span className="r-val">{ref.ref1?.knownSince || '5 Years'}</span>
              </div>
              <div className="digi-ref-line">
                <span className="r-lbl">Mode :</span>
                <div className="digi-checkbox-cluster">
                  <FormCheckbox checked={ref.ref1?.relationshipType === 'Personally' || !ref.ref1?.relationshipType} labelEn="Personally" labelTa="நேரில்" />
                  <FormCheckbox checked={ref.ref1?.relationshipType === 'Professionally'} labelEn="Professionally" labelTa="ஊழியத்தில்" />
                </div>
              </div>
              <div className="digi-ref-attestation-row">
                <span>Signature of Referrer :</span>
                <span className="digi-attest-seal">[ Attested & Approved ]</span>
              </div>
            </div>
          </div>

          {/* Reference 2 */}
          <div className="digi-ref-box-card">
            <div className="digi-ref-card-header">
              2. Taluk Co-ordinator / பேராய உறுப்பினர்
            </div>
            <div className="digi-ref-card-content">
              <div className="digi-ref-line">
                <span className="r-lbl">Name :</span>
                <span className="r-val">{ref.ref2?.name || 'Rev. D. Antony Raj'}</span>
              </div>
              <div className="digi-ref-line">
                <span className="r-lbl">Diocese ID No :</span>
                <span className="r-val">{ref.ref2?.diocesanId || 'TN 0466'}</span>
              </div>
              <div className="digi-ref-line">
                <span className="r-lbl">Telephone / Mobile :</span>
                <span className="r-val">{ref.ref2?.phone || '9842156789'}</span>
              </div>
              <div className="digi-ref-line">
                <span className="r-lbl">Known Since :</span>
                <span className="r-val">{ref.ref2?.knownSince || '4 Years'}</span>
              </div>
              <div className="digi-ref-line">
                <span className="r-lbl">Mode :</span>
                <div className="digi-checkbox-cluster">
                  <FormCheckbox checked={ref.ref2?.relationshipType === 'Personally'} labelEn="Personally" labelTa="நேரில்" />
                  <FormCheckbox checked={ref.ref2?.relationshipType === 'Professionally' || !ref.ref2?.relationshipType} labelEn="Professionally" labelTa="ஊழியத்தில்" />
                </div>
              </div>
              <div className="digi-ref-attestation-row">
                <span>Signature of Referrer :</span>
                <span className="digi-attest-seal">[ Attested & Approved ]</span>
              </div>
            </div>
          </div>
        </div>

        {/* XI. Statutory Declaration */}
        <div className="digi-full-black-banner">
          XI. Statutory Declaration & Signature / உறுதிமொழி மற்றும் விண்ணப்பதாரர் கையொப்பம்
        </div>

        <div className="digi-declaration-enclosing-card">
          <p className="digi-declaration-english">
            &ldquo;I hereby declare that the information furnished above is true to the best of my knowledge. I am fully in agreement with the Faith Statement of ACI Diocese. I understand that this is the united Ministry and I shall give attention to this ministry apart from my church ministry. I shall abide by the terms and conditions of ACI Diocese.&rdquo;
          </p>
          <p className="digi-declaration-tamil">
            &ldquo;மேற்குறிப்பிட்ட விவரங்கள் அனைத்தும் உண்மை என்றும், ஏசிஐ பேராயத்தின் விசுவாச அறிக்கையை முழுமையாக ஏற்றுக்கொள்கிறேன் என்றும், சபை ஊழியத்தோடு இந்த ஐக்கிய ஊழியத்திலும் உற்சாகமாக செயல்படுவேன் என்றும் உறுதியளிக்கிறேன்.&rdquo;
          </p>

          <div className="digi-declaration-sign-grid">
            <div className="digi-declaration-meta-side">
              <div className="digi-meta-item">
                <span className="lbl">Place / இடம் :</span>
                <span className="val">{dec.place || 'Dindigul'}</span>
              </div>
              <div className="digi-meta-item">
                <span className="lbl">Date / தேதி :</span>
                <span className="val">{dec.date || appDate}</span>
              </div>
            </div>

            <div className="digi-applicant-signature-side">
              <div className="digi-handwritten-signature">
                {sigName}
              </div>
              <div className="digi-sig-underline-bar"></div>
              <div className="digi-sig-title-label">
                Signature of the Applicant / விண்ணப்பதாரரின் கையொப்பம்
              </div>
              <div className="digi-sig-verified-tag">[ Digitally Confirmed & Verified ]</div>
            </div>
          </div>
        </div>

        {/* XII. Checklist of Required Enclosures (SINGLE COLUMN, 1 PER ROW, LARGER TEXT, CRISP CHECKBOXES) */}
        <div className="digi-full-black-banner">
          XII. Checklist of Required Enclosures / இணைக்கப்பட வேண்டிய சான்றிதழ்கள்
        </div>

        <div className="digi-checklist-single-col-list">
          <div className="chk-full-row">
            <span className="chk-box-dark">☑</span>
            <span className="chk-text-item">1. Proof of Identity (Aadhaar Card / Passport / Voter ID)</span>
          </div>
          <div className="chk-full-row">
            <span className="chk-box-dark">☑</span>
            <span className="chk-text-item">2. Proof of Address (Ration Card / EB Bill / Gas Connection)</span>
          </div>
          <div className="chk-full-row">
            <span className="chk-box-dark">☑</span>
            <span className="chk-text-item">3. Proof of Date of Birth (Birth Certificate / 10th Marks Certificate)</span>
          </div>
          <div className="chk-full-row">
            <span className="chk-box-dark">☑</span>
            <span className="chk-text-item">4. Passport Size Photographs (3 copies - self-attested)</span>
          </div>
          <div className="chk-full-row">
            <span className="chk-box-dark">☑</span>
            <span className="chk-text-item">5. Academic & Theological Qualification Certificates</span>
          </div>
          <div className="chk-full-row">
            <span className="chk-box-dark">☑</span>
            <span className="chk-text-item">6. Ministry Summary / Field Work Statement</span>
          </div>
          <div className="chk-full-row">
            <span className="chk-box-dark">☑</span>
            <span className="chk-text-item">7. Church Ministry Photograph with Congregation</span>
          </div>
          <div className="chk-full-row">
            <span className="chk-box-dark">☑</span>
            <span className="chk-text-item">8. Existing Ordination / Affiliation Certificate</span>
          </div>
        </div>

        <div className="digi-sheet-footer">
          Apostolic Council of India Diocese, Membership Application Form, Page 2/2
        </div>
      </div>

    </div>
  )
}
