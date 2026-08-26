import React from 'react'
import './OfficialApplicationForm.css'

// Helper to render an array of individual digital character boxes
function DigitBoxes({ text = '', count = 24, className = '' }) {
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
    <div className={`digi-box-row ${className}`}>
      {chars.map((ch, idx) => (
        <span key={idx} className={`digi-box-cell ${ch ? 'has-val' : 'is-empty'}`}>
          {ch || '\u00A0'}
        </span>
      ))}
    </div>
  )
}

// Helper to render date into [D][D] [M][M] [Y][Y][Y][Y] segmented boxes
function SegmentedDateBoxes({ dateStr = '' }) {
  const parts = (dateStr || '').split('-') // YYYY-MM-DD
  const yyyy = parts[0] || ''
  const mm = parts[1] || ''
  const dd = parts[2] || ''

  return (
    <div className="digi-date-segments">
      <div className="digi-date-group">
        <span className="digi-date-lbl">Date</span>
        <DigitBoxes text={dd} count={2} className="date-2" />
      </div>
      <div className="digi-date-group">
        <span className="digi-date-lbl">Month</span>
        <DigitBoxes text={mm} count={2} className="date-2" />
      </div>
      <div className="digi-date-group">
        <span className="digi-date-lbl">Year</span>
        <DigitBoxes text={yyyy} count={4} className="date-4" />
      </div>
    </div>
  )
}

// Helper for continuous 8-box date (DDMMYYYY)
function DateBoxes8({ dateStr = '' }) {
  const parts = (dateStr || '').split('-')
  const formatted = parts.length === 3 ? `${parts[2]}${parts[1]}${parts[0]}` : ''
  return <DigitBoxes text={formatted} count={8} className="date-8" />
}

// Helper to render checkbox box
function CheckboxBox({ checked = false, labelEn = '', labelTa = '' }) {
  return (
    <div className={`digi-check-item ${checked ? 'is-checked' : ''}`}>
      <span className="digi-check-square">
        {checked ? '✓' : ''}
      </span>
      <span className="digi-check-labels">
        <span className="chk-en">{labelEn}</span>
        {labelTa && <span className="chk-ta">{labelTa}</span>}
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

  return (
    <div className="digi-official-document">

      {/* ============================================================
          PAGE 1 OF 4: APPLICANT'S INFORMATIONS & PERSONAL DETAILS
          ============================================================ */}
      <div className="digi-a4-page" id="digi-page-1">
        
        {/* Top Header */}
        <div className="digi-header">
          <div className="digi-crest-wrap">
            <img src="/aci-logo.png" alt="ACI Crest" className="digi-crest-img" onError={(e) => { e.target.src = '/aci-logo.jpg' }} />
          </div>
          <div className="digi-header-text">
            <h1 className="digi-diocesan-name">APOSTOLIC COUNCIL OF INDIA DIOCESE</h1>
            <p className="digi-reg-line-1">
              An Episcopal Diocese & Public Religious Trust (Indian Trust Act 1882 - Regd No: 62/Bk.4/2013)
            </p>
            <p className="digi-reg-line-2">
              Under Part I, Section 5(1) Part IV Sections 10, 12, 14, 15, Part VI Section 64 of The Indian Christian Marriage Act 1872
            </p>
            <p className="digi-reg-line-3">
              Constituent and/or The Christian Clergy Rights and Traditions
            </p>
            <p className="digi-office-line">
              Central Office: 1/153, Melapatty, Hanumantharayankottai - 624 054, Dindigul District, Tamil Nadu, India.
            </p>
            <p className="digi-contact-line">
              Phone: 0451 2490100 • E-mail: info@acidiocese.org / rev.johnsondurai@gmail.com
            </p>
          </div>
        </div>

        {/* Title Bar + Date of Issue */}
        <div className="digi-title-section">
          <div className="digi-title-center">
            <h2 className="digi-main-title">DIOCESAN MEMBERSHIP APPLICATION FORM</h2>
            <h3 className="digi-tamil-title">பேராய உறுப்பினர் விண்ணப்பப் படிவம்</h3>
          </div>
          <div className="digi-issue-date-box">
            <span className="digi-issue-lbl">Date of issue</span>
            <span className="digi-issue-val">{appDate}</span>
          </div>
        </div>

        {/* Mandatory Instructions */}
        <p className="digi-instructions-text">
          Read the Application carefully, fill in CAPITAL LETTERS, DO NOT OVERWRITE, select the appropriate box by ticking it (✓) and leave the inappropriate fields blank. / விண்ணப்பத்தை கவனமாக வாசித்து ஆங்கில பெரிய எழுத்துக்களில் தெளிவாக எழுதவும். பொருத்தமான தகவல்களுக்குரிய இடத்தில் (✓) குறியிடவும்.
        </p>

        {/* Office Use & Photo Block */}
        <div className="digi-office-photo-grid">
          
          {/* Office Use Box */}
          <div className="digi-office-box">
            <div className="digi-office-header">
              FOR OFFICE USE ONLY / அலுவலகப் பணிக்கு மட்டும்
            </div>
            <div className="digi-office-body">
              <div className="digi-office-row">
                <span className="digi-off-lbl">Application Number:</span>
                <span className="digi-off-appno">002093 / ACI-2026</span>
                <div className="digi-approval-tag">APPROVAL</div>
              </div>

              <div className="digi-office-row">
                <span className="digi-off-lbl">Application Received on:</span>
                <DateBoxes8 dateStr={appDate} />
              </div>

              <div className="digi-office-row">
                <span className="digi-off-lbl">Application Approved on:</span>
                <DateBoxes8 dateStr="" />
                <div className="digi-seal-circle">OFFICIAL SEAL</div>
              </div>

              <div className="digi-office-row">
                <span className="digi-off-lbl">Membership Code:</span>
                <DigitBoxes text="" count={10} className="code-10" />
              </div>
            </div>
          </div>

          {/* Dedicated Photo Box */}
          <div className="digi-photo-box">
            {p.photoUrl ? (
              <img src={p.photoUrl} alt="Applicant Passport" className="digi-photo-img" />
            ) : (
              <div className="digi-photo-placeholder">
                <span className="ph-line-1">Affix Recent Passport size Photo</span>
                <span className="ph-line-2">To be Self attested</span>
                <span className="ph-line-3">சமீபத்திய புகைப்படம்</span>
              </div>
            )}
          </div>
        </div>

        {/* Section Divider Banner */}
        <div className="digi-section-banner">
          APPLICANT'S INFORMATIONS / விண்ணப்பதாரரின் தகவல்கள்
        </div>

        {/* I. Personal Details */}
        <div className="digi-field-group">
          <div className="digi-section-title">
            I. Personal Details / சுய விவரங்கள்
          </div>

          {/* 1. Name */}
          <div className="digi-row-field">
            <div className="digi-row-label">
              <strong>Name</strong>
              <span>பெயர்</span>
              <span className="digi-sub-note">(Salutation - Mr., Mrs., Rev., Dr., Bro., Pastor)</span>
            </div>
            <div className="digi-row-boxes">
              <DigitBoxes text={fullName} count={24} />
            </div>
          </div>

          {/* 2. Baptismal Name */}
          <div className="digi-row-field">
            <div className="digi-row-label">
              <strong>Baptismal Name</strong>
              <span>ஞானஸ்நானப் பெயர்</span>
            </div>
            <div className="digi-row-boxes">
              <DigitBoxes text={p.baptismalName} count={24} />
            </div>
          </div>

          {/* 3. DOB & Nationality */}
          <div className="digi-two-col-row">
            <div className="digi-col-field">
              <div className="digi-row-label">
                <strong>Date of Birth</strong>
                <span>பிறந்த தேதி</span>
              </div>
              <SegmentedDateBoxes dateStr={p.dob} />
            </div>

            <div className="digi-col-field">
              <div className="digi-row-label">
                <strong>Nationality</strong>
                <span>நாட்டுரிமை</span>
              </div>
              <DigitBoxes text={p.nationality || 'INDIAN'} count={12} />
            </div>
          </div>

          {/* 4. Gender & Marital Status */}
          <div className="digi-two-col-row">
            <div className="digi-col-field">
              <div className="digi-row-label">
                <strong>Gender</strong>
                <span>பாலினம்</span>
              </div>
              <div className="digi-checkbox-group">
                <CheckboxBox checked={p.gender === 'Male'} labelEn="Male" labelTa="ஆண்" />
                <CheckboxBox checked={p.gender === 'Female'} labelEn="Female" labelTa="பெண்" />
              </div>
            </div>

            <div className="digi-col-field">
              <div className="digi-row-label">
                <strong>Marital Status</strong>
                <span>திருமண நிலை</span>
              </div>
              <div className="digi-checkbox-group">
                <CheckboxBox checked={p.maritalStatus === 'Married'} labelEn="Married" />
                <CheckboxBox checked={p.maritalStatus === 'Bachelor'} labelEn="Bachelor" />
                <CheckboxBox checked={p.maritalStatus === 'Spinster'} labelEn="Spinster" />
                <CheckboxBox checked={p.maritalStatus === 'Widowed'} labelEn="Widowed" />
              </div>
            </div>
          </div>

          {/* 5. Permanent Address */}
          <div className="digi-address-block">
            <div className="digi-address-title">
              <strong>Permanent Address</strong>
              <span>நிரந்தர முகவரி</span>
            </div>

            <div className="digi-addr-grid">
              <div className="digi-addr-cell" style={{ flex: '0 0 25%' }}>
                <span className="digi-addr-lbl">Door No (கதவு எண்)</span>
                <span className="digi-addr-val">{perm.doorNo || '\u00A0'}</span>
              </div>
              <div className="digi-addr-cell" style={{ flex: '1' }}>
                <span className="digi-addr-lbl">Street Name (தெருப் பெயர்)</span>
                <span className="digi-addr-val">{perm.streetName || '\u00A0'}</span>
              </div>
            </div>

            <div className="digi-addr-grid">
              <div className="digi-addr-cell" style={{ flex: '1' }}>
                <span className="digi-addr-lbl">City / Town (நகரம் / ஊர்)</span>
                <span className="digi-addr-val">{perm.cityTown || '\u00A0'}</span>
              </div>
              <div className="digi-addr-cell" style={{ flex: '0 0 35%' }}>
                <span className="digi-addr-lbl">Pincode (பின்கோடு)</span>
                <DigitBoxes text={perm.pincode} count={6} className="pin-6" />
              </div>
            </div>

            <div className="digi-addr-grid">
              <div className="digi-addr-cell" style={{ flex: '1' }}>
                <span className="digi-addr-lbl">Taluk (தாலுகா)</span>
                <span className="digi-addr-val">{perm.taluk || '\u00A0'}</span>
              </div>
              <div className="digi-addr-cell" style={{ flex: '1' }}>
                <span className="digi-addr-lbl">District (மாவட்டம்)</span>
                <span className="digi-addr-val">{perm.district || '\u00A0'}</span>
              </div>
            </div>

            <div className="digi-addr-grid">
              <div className="digi-addr-cell" style={{ flex: '1' }}>
                <span className="digi-addr-lbl">State (மாநிலம்)</span>
                <span className="digi-addr-val">{perm.state || '\u00A0'}</span>
              </div>
              <div className="digi-addr-cell" style={{ flex: '1' }}>
                <span className="digi-addr-lbl">Country (நாடு)</span>
                <span className="digi-addr-val">{perm.country || 'India'}</span>
              </div>
            </div>
          </div>

          {/* 6. Contact Address */}
          <div className="digi-address-block">
            <div className="digi-address-title">
              <strong>Contact Address</strong>
              <span>தொடர்பு முகவரி</span>
            </div>

            <div className="digi-addr-grid">
              <div className="digi-addr-cell" style={{ flex: '0 0 25%' }}>
                <span className="digi-addr-lbl">Door No (கதவு எண்)</span>
                <span className="digi-addr-val">{contact.doorNo || '\u00A0'}</span>
              </div>
              <div className="digi-addr-cell" style={{ flex: '1' }}>
                <span className="digi-addr-lbl">Street Name (தெருப் பெயர்)</span>
                <span className="digi-addr-val">{contact.streetName || '\u00A0'}</span>
              </div>
            </div>

            <div className="digi-addr-grid">
              <div className="digi-addr-cell" style={{ flex: '1' }}>
                <span className="digi-addr-lbl">City / Town (நகரம் / ஊர்)</span>
                <span className="digi-addr-val">{contact.cityTown || '\u00A0'}</span>
              </div>
              <div className="digi-addr-cell" style={{ flex: '0 0 35%' }}>
                <span className="digi-addr-lbl">Pincode (பின்கோடு)</span>
                <DigitBoxes text={contact.pincode} count={6} className="pin-6" />
              </div>
            </div>

            <div className="digi-addr-grid">
              <div className="digi-addr-cell" style={{ flex: '1' }}>
                <span className="digi-addr-lbl">Taluk (தாலுகா)</span>
                <span className="digi-addr-val">{contact.taluk || '\u00A0'}</span>
              </div>
              <div className="digi-addr-cell" style={{ flex: '1' }}>
                <span className="digi-addr-lbl">District (மாவட்டம்)</span>
                <span className="digi-addr-val">{contact.district || '\u00A0'}</span>
              </div>
            </div>

            <div className="digi-addr-grid">
              <div className="digi-addr-cell" style={{ flex: '1' }}>
                <span className="digi-addr-lbl">State (மாநிலம்)</span>
                <span className="digi-addr-val">{contact.state || '\u00A0'}</span>
              </div>
              <div className="digi-addr-cell" style={{ flex: '1' }}>
                <span className="digi-addr-lbl">Country (நாடு)</span>
                <span className="digi-addr-val">{contact.country || 'India'}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="digi-page-footer">
          Apostolic Council of India Diocese, Membership Application Form, Page 1/4
        </div>
      </div>

      {/* ============================================================
          PAGE 2 OF 4: SPIRITUAL INFORMATION, AFFILIATION & CHURCH DETAILS
          ============================================================ */}
      <div className="digi-a4-page" id="digi-page-2">
        
        {/* II. Spiritual Information */}
        <div className="digi-section-banner">
          II. Spiritual Information / ஆவிக்குரிய தகவல்கள்
        </div>

        <div className="digi-spiritual-calling-grid">
          <CheckboxBox checked={sp.ministryFunction === 'Apostle'} labelEn="Apostle" labelTa="அப்போஸ்தலர்" />
          <CheckboxBox checked={sp.ministryFunction === 'Prophet'} labelEn="Prophet" labelTa="தீர்க்கதரிசி" />
          <CheckboxBox checked={sp.ministryFunction === 'Pastor'} labelEn="Pastor" labelTa="மேய்ப்பர்" />
          <CheckboxBox checked={sp.ministryFunction === 'Teacher'} labelEn="Teacher" labelTa="போதகர்" />
          <CheckboxBox checked={sp.ministryFunction === 'Evangelist'} labelEn="Evangelist" labelTa="சுவிசேஷகர்" />
        </div>

        <div className="digi-calling-subrow">
          <CheckboxBox checked={sp.ministryFunction === 'Associate Pastor'} labelEn="Associate Pastor" labelTa="உதவி மேய்ப்பர்" />
          <div className="digi-other-calling">
            <CheckboxBox checked={sp.ministryFunction === 'Other Ministry'} labelEn="Other Ministry" labelTa="மற்ற ஊழியங்கள்" />
            <span className="digi-fill-line">Specify: {sp.otherMinistrySpecify || '___________________________'}</span>
          </div>
        </div>

        {/* III. Affiliation */}
        <div className="digi-section-banner">
          III. Affiliation / பேராயம் / நிறுவனம் / ஐக்கிய இணைப்பு
        </div>

        <div className="digi-affiliation-block">
          <div className="digi-aff-row">
            <CheckboxBox checked={aff.affiliationType === 'Independent Church'} labelEn="Independent Church" labelTa="ஸ்தல சுயாட்சி சபை" />
            <span className="digi-fill-line">Founder's Name (நிறுவனர் பெயர்): {aff.founderName || '___________________________'}</span>
          </div>

          <div className="digi-aff-row">
            <CheckboxBox checked={aff.affiliationType === 'Denomination'} labelEn="Denomination" labelTa="சபைப் பிரிவு" />
            <span className="digi-fill-line">Specify: {aff.denominationSpecify || '___________________________'}</span>
          </div>

          <div className="digi-aff-row">
            <CheckboxBox checked={aff.affiliationType === 'Associate / Assistant'} labelEn="Associate / Assistant" labelTa="துணை / உதவி" />
            <span className="digi-fill-line">Name of Chief Pastor: {aff.associateChiefPastorName || '___________________________'}</span>
          </div>

          <div className="digi-aff-row" style={{ paddingLeft: '32px' }}>
            <span className="digi-fill-line">Name of Church: {aff.associateChurchName || '___________________________'}</span>
          </div>

          <div className="digi-aff-row">
            <span className="digi-fill-line"><strong>Name of your Trust (உங்களது டிரஸ்டின் பெயர்):</strong> {aff.trustName || '___________________________'}</span>
          </div>
        </div>

        {/* IV. Church Details */}
        <div className="digi-section-banner">
          IV. Church Details / சபையின் தகவல்கள்
        </div>

        <div className="digi-field-group">
          {/* Church Name */}
          <div className="digi-row-field">
            <div className="digi-row-label">
              <strong>Church Name</strong>
              <span>சபையின் பெயர்</span>
            </div>
            <div className="digi-row-boxes">
              <DigitBoxes text={ch.churchName} count={24} />
            </div>
          </div>

          {/* Church Address Grid */}
          <div className="digi-addr-grid">
            <div className="digi-addr-cell" style={{ flex: '0 0 25%' }}>
              <span className="digi-addr-lbl">Door No (கதவு எண்)</span>
              <span className="digi-addr-val">{ch.doorNo || '\u00A0'}</span>
            </div>
            <div className="digi-addr-cell" style={{ flex: '1' }}>
              <span className="digi-addr-lbl">Street Name (தெருப் பெயர்)</span>
              <span className="digi-addr-val">{ch.streetName || '\u00A0'}</span>
            </div>
          </div>

          <div className="digi-addr-grid">
            <div className="digi-addr-cell" style={{ flex: '1' }}>
              <span className="digi-addr-lbl">City / Town (நகரம் / ஊர்)</span>
              <span className="digi-addr-val">{ch.cityTown || '\u00A0'}</span>
            </div>
            <div className="digi-addr-cell" style={{ flex: '0 0 35%' }}>
              <span className="digi-addr-lbl">Pincode (பின்கோடு)</span>
              <DigitBoxes text={ch.pincode} count={6} className="pin-6" />
            </div>
          </div>

          <div className="digi-addr-grid">
            <div className="digi-addr-cell" style={{ flex: '1' }}>
              <span className="digi-addr-lbl">Taluk (தாலுகா)</span>
              <span className="digi-addr-val">{ch.taluk || '\u00A0'}</span>
            </div>
            <div className="digi-addr-cell" style={{ flex: '1' }}>
              <span className="digi-addr-lbl">District (மாவட்டம்)</span>
              <span className="digi-addr-val">{ch.district || '\u00A0'}</span>
            </div>
          </div>

          <div className="digi-addr-grid">
            <div className="digi-addr-cell" style={{ flex: '1' }}>
              <span className="digi-addr-lbl">State (மாநிலம்)</span>
              <span className="digi-addr-val">{ch.state || '\u00A0'}</span>
            </div>
            <div className="digi-addr-cell" style={{ flex: '1' }}>
              <span className="digi-addr-lbl">Country (நாடு)</span>
              <span className="digi-addr-val">{ch.country || 'India'}</span>
            </div>
          </div>

          <div className="digi-addr-grid">
            <div className="digi-addr-cell" style={{ flex: '1' }}>
              <span className="digi-addr-lbl">Telephone (தொலைபேசி எண்)</span>
              <span className="digi-addr-val">{ch.telephone || '\u00A0'}</span>
            </div>
            <div className="digi-addr-cell" style={{ flex: '1' }}>
              <span className="digi-addr-lbl">Mobile (கைப்பேசி எண்)</span>
              <span className="digi-addr-val">{ch.mobileNumber || '\u00A0'}</span>
            </div>
          </div>

          <div className="digi-addr-grid">
            <div className="digi-addr-cell" style={{ flex: '1' }}>
              <span className="digi-addr-lbl">Email ID (மின்னஞ்சல் முகவரி)</span>
              <span className="digi-addr-val">{ch.emailId || '\u00A0'}</span>
            </div>
          </div>
        </div>

        {/* V. Ministry Milestone Questions */}
        <div className="digi-section-banner">
          V. Ministry Milestones / ஆவிக்குரிய அனுபவங்கள்
        </div>

        <div className="digi-milestones-list">
          <div className="digi-milestone-row">
            <div className="digi-milestone-text">
              1. When were you Born Again? எப்பொழுது மறுபிறப்பின் அனுபவத்தைப் பெற்றீர்கள்?
            </div>
            <DateBoxes8 dateStr={mh.bornAgainDate} />
          </div>

          <div className="digi-milestone-row">
            <div className="digi-milestone-text">
              2. When were you Baptized in full immersion? எப்பொழுது முழுக்கு ஞானஸ்நானம் பெற்றீர்கள்?
            </div>
            <DateBoxes8 dateStr={mh.waterBaptismDate} />
          </div>

          <div className="digi-milestone-row">
            <div className="digi-milestone-text">
              3. When were you filled with the Holy Spirit? எப்பொழுது பரிசுத்த ஆவியின் அபிஷேகத்தைப் பெற்றீர்கள்?
            </div>
            <DateBoxes8 dateStr={mh.holySpiritBaptismDate} />
          </div>

          <div className="digi-milestone-row">
            <div className="digi-milestone-text">
              4. When were you called for Ministry? எப்பொழுது ஊழிய அழைப்பைப் பெற்றீர்கள்?
            </div>
            <DateBoxes8 dateStr={mh.callingDate} />
          </div>

          <div className="digi-milestone-row">
            <div className="digi-milestone-text">
              5. When did you start active Ministry? எப்பொழுது ஊழியத்தைத் துவக்கினீர்கள்?
            </div>
            <DateBoxes8 dateStr={mh.ministryStartDate} />
          </div>
        </div>

        <div className="digi-page-footer">
          Apostolic Council of India Diocese, Membership Application Form, Page 2/4
        </div>
      </div>

      {/* ============================================================
          PAGE 3 OF 4: QUALIFICATIONS, FAMILY DETAILS & MOTIVATION
          ============================================================ */}
      <div className="digi-a4-page" id="digi-page-3">
        
        {/* Ordination & Affiliation Questions */}
        <div className="digi-intent-block">
          <div className="digi-intent-row">
            <span className="digi-intent-q">
              6. Do you want to be ordained by ACI Diocese? இந்தப் பேராயத்தால் பிரதிஷ்டை பெற விரும்புகிறீர்களா?
            </span>
            <div className="digi-intent-opts">
              <CheckboxBox checked={mh.wantOrdination === 'Yes'} labelEn="Yes" labelTa="ஆம்" />
              <CheckboxBox checked={mh.wantOrdination === 'No'} labelEn="No" labelTa="இல்லை" />
            </div>
          </div>

          <div className="digi-intent-row">
            <span className="digi-intent-q">
              7. Do you want to be affiliated with ACI Diocese? இந்தப் பேராயத்தின் இணைப்பைப் பெற விரும்புகிறீர்களா?
            </span>
            <div className="digi-intent-opts">
              <CheckboxBox checked={mh.wantAffiliation === 'Yes'} labelEn="Yes" labelTa="ஆம்" />
              <CheckboxBox checked={mh.wantAffiliation === 'No'} labelEn="No" labelTa="இல்லை" />
            </div>
          </div>
        </div>

        {/* VI. Academic Qualification Table */}
        <div className="digi-section-banner">
          VI. Academic Qualification / பொதுக் கல்வித் தகுதி
        </div>

        <table className="digi-official-table">
          <thead>
            <tr>
              <th style={{ width: '45px' }}>S.No</th>
              <th>Examination Passed / தேர்ச்சி பெற்ற தேர்வு</th>
              <th style={{ width: '90px' }}>Year / ஆண்டு</th>
              <th>School / College / University பள்ளி / கல்லூரி / பல்கலைக் கழகம்</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2].map((idx) => {
              const row = q.academic?.[idx] || {}
              return (
                <tr key={idx}>
                  <td className="center">{idx + 1}</td>
                  <td>{row.examinationPassed || '\u00A0'}</td>
                  <td className="center">{row.year || '\u00A0'}</td>
                  <td>{row.institution || '\u00A0'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* VII. Theological Qualification Table */}
        <div className="digi-section-banner">
          VII. Theological Qualification / இறையியல் தகுதி
        </div>

        <table className="digi-official-table">
          <thead>
            <tr>
              <th style={{ width: '45px' }}>S.No</th>
              <th>Course Passed / தேர்ச்சி பெற்ற படிப்பு</th>
              <th style={{ width: '90px' }}>Year / ஆண்டு</th>
              <th>Seminary / Bible College வேத பள்ளி / கல்லூரி</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1].map((idx) => {
              const row = q.theological?.[idx] || {}
              return (
                <tr key={idx}>
                  <td className="center">{idx + 1}</td>
                  <td>{row.examinationPassed || '\u00A0'}</td>
                  <td className="center">{row.year || '\u00A0'}</td>
                  <td>{row.institution || '\u00A0'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* VIII. Family Details Table */}
        <div className="digi-section-banner">
          VIII. Family Details / குடும்ப விவரங்கள்
        </div>

        <table className="digi-official-table">
          <thead>
            <tr>
              <th style={{ width: '45px' }}>S.No</th>
              <th>Name / பெயர்</th>
              <th style={{ width: '110px' }}>DOB / பிறந்த தேதி</th>
              <th style={{ width: '120px' }}>Relationship / உறவுமுறை</th>
              <th>Profession & Education / தொழில் & படிப்பு</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3].map((idx) => {
              const f = fam?.[idx] || {}
              return (
                <tr key={idx}>
                  <td className="center">{idx + 1}</td>
                  <td>{f.name || '\u00A0'}</td>
                  <td className="center">{f.dob || '\u00A0'}</td>
                  <td>{f.relationship || '\u00A0'}</td>
                  <td>{f.professionEducation || '\u00A0'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* IX. Motivation */}
        <div className="digi-section-banner">
          IX. What prompts you to join APOSTOLIC COUNCIL OF INDIA DIOCESE? / பேராயத்தில் இணையக் காரணம்
        </div>

        <div className="digi-motivation-box">
          {mot.reasonToJoin ? (
            <p className="digi-motivation-text">{mot.reasonToJoin}</p>
          ) : (
            <div className="digi-empty-lines">
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
            </div>
          )}
        </div>

        <div className="digi-page-footer">
          Apostolic Council of India Diocese, Membership Application Form, Page 3/4
        </div>
      </div>

      {/* ============================================================
          PAGE 4 OF 4: REFERENCES, STATUTORY DECLARATION & SIGNATURE
          ============================================================ */}
      <div className="digi-a4-page" id="digi-page-4">
        
        {/* X. References */}
        <div className="digi-section-banner">
          X. Details of Two References (Must) / இரண்டு பேராய அங்கத்தினர்களின் பரிந்துரை
        </div>

        <div className="digi-references-grid">
          {/* Reference 1 */}
          <div className="digi-ref-card">
            <div className="digi-ref-header">
              1. District Overseer / பேராய உறுப்பினர்
            </div>
            <div className="digi-ref-body">
              <div className="digi-ref-row">
                <span className="lbl">Name:</span>
                <span className="val">{ref.ref1?.name || '___________________________'}</span>
              </div>
              <div className="digi-ref-row">
                <span className="lbl">Diocese ID No:</span>
                <span className="val">{ref.ref1?.diocesanId || '___________________________'}</span>
              </div>
              <div className="digi-ref-row">
                <span className="lbl">Telephone / Mobile:</span>
                <span className="val">{ref.ref1?.phone || '___________________________'}</span>
              </div>
              <div className="digi-ref-row">
                <span className="lbl">Known Since:</span>
                <span className="val">{ref.ref1?.knownSince || '___________________________'}</span>
              </div>
              <div className="digi-ref-row">
                <span className="lbl">Mode:</span>
                <div className="digi-checkbox-group">
                  <CheckboxBox checked={ref.ref1?.relationshipType === 'Personally' || !ref.ref1?.relationshipType} labelEn="Personally" labelTa="நேரில்" />
                  <CheckboxBox checked={ref.ref1?.relationshipType === 'Professionally'} labelEn="Professionally" labelTa="ஊழியத்தில்" />
                </div>
              </div>
              <div className="digi-ref-sig-row">
                <span>Signature of the Referrer:</span>
                <span className="sig-placeholder">[ Verified ]</span>
              </div>
            </div>
          </div>

          {/* Reference 2 */}
          <div className="digi-ref-card">
            <div className="digi-ref-header">
              2. Taluk Co-ordinator / பேராய உறுப்பினர்
            </div>
            <div className="digi-ref-body">
              <div className="digi-ref-row">
                <span className="lbl">Name:</span>
                <span className="val">{ref.ref2?.name || '___________________________'}</span>
              </div>
              <div className="digi-ref-row">
                <span className="lbl">Diocese ID No:</span>
                <span className="val">{ref.ref2?.diocesanId || '___________________________'}</span>
              </div>
              <div className="digi-ref-row">
                <span className="lbl">Telephone / Mobile:</span>
                <span className="val">{ref.ref2?.phone || '___________________________'}</span>
              </div>
              <div className="digi-ref-row">
                <span className="lbl">Known Since:</span>
                <span className="val">{ref.ref2?.knownSince || '___________________________'}</span>
              </div>
              <div className="digi-ref-row">
                <span className="lbl">Mode:</span>
                <div className="digi-checkbox-group">
                  <CheckboxBox checked={ref.ref2?.relationshipType === 'Personally'} labelEn="Personally" labelTa="நேரில்" />
                  <CheckboxBox checked={ref.ref2?.relationshipType === 'Professionally' || !ref.ref2?.relationshipType} labelEn="Professionally" labelTa="ஊழியத்தில்" />
                </div>
              </div>
              <div className="digi-ref-sig-row">
                <span>Signature of the Referrer:</span>
                <span className="sig-placeholder">[ Verified ]</span>
              </div>
            </div>
          </div>
        </div>

        {/* XI. Statutory Declaration */}
        <div className="digi-section-banner">
          XI. Statutory Declaration / உறுதிமொழி மற்றும் கையெழுத்து
        </div>

        <div className="digi-declaration-box">
          <p className="digi-dec-en">
            &ldquo;I hereby declare that the information furnished above is true to the best of my knowledge. I am fully in agreement with the Faith Statement of ACI Diocese. I understand that this is the united Ministry and I shall give attention to this ministry apart from my church ministry. I shall abide by the terms and conditions of ACI Diocese, in force from time to time.&rdquo;
          </p>
          <p className="digi-dec-ta">
            &ldquo;மேற்குறிப்பிட்ட விவரங்கள் அனைத்தும் உண்மை என்றும், ஏசிஐ பேராயத்தின் விசுவாச அறிக்கையை முழுமையாக ஏற்றுக்கொள்கிறேன் என்றும், சபை ஊழியத்தோடு இந்த ஐக்கிய ஊழியத்திலும் உற்சாகமாக செயல்படுவேன் என்றும், பேராயத்தின் சட்டதிட்டங்களுக்கு கீழ்ப்படிவேன் என்றும் உறுதியளிக்கிறேன்.&rdquo;
          </p>

          <div className="digi-dec-bottom-grid">
            <div className="digi-dec-left">
              <div className="digi-dec-line">
                <strong>Place / இடம் :</strong> <span>{dec.place || 'Dindigul'}</span>
              </div>
              <div className="digi-dec-line">
                <strong>Date / தேதி :</strong> <span>{dec.date || appDate}</span>
              </div>
            </div>

            <div className="digi-dec-right">
              <div className="digi-signature-container">
                <span className="digi-sig-name">{p.name || 'S. JOHN SAMUEL'}</span>
                <span className="digi-sig-badge">[ Digitally Confirmed by Applicant ]</span>
              </div>
              <span className="digi-sig-label">Signature of the Applicant / விண்ணப்பதாரரின் கையொப்பம்</span>
            </div>
          </div>
        </div>

        {/* XII. Required Enclosures Checklist */}
        <div className="digi-section-banner">
          XII. Checklist of Required Enclosures / இணைக்கப்பட வேண்டிய சான்றிதழ்கள்
        </div>

        <div className="digi-enclosures-grid">
          <div className="digi-enc-item">☑ 1. Proof of Identity (Aadhaar / Passport / Voter ID)</div>
          <div className="digi-enc-item">☑ 2. Proof of Address (Ration Card / Gas Bill / EB Bill)</div>
          <div className="digi-enc-item">☑ 3. Proof of Date of Birth (Birth Certificate / 10th Marks / TC)</div>
          <div className="digi-enc-item">☑ 4. Attested Recent Passport Size Photographs (3 copies)</div>
          <div className="digi-enc-item">☑ 5. Academic & Theological Qualification Certificates</div>
          <div className="digi-enc-item">☑ 6. Ministry Summary / Field Work Statement</div>
          <div className="digi-enc-item">☑ 7. Church Ministry Photograph with Congregation</div>
          <div className="digi-enc-item">☑ 8. Existing Ordination / Affiliation Certificate (if any)</div>
        </div>

        <div className="digi-page-footer">
          Apostolic Council of India Diocese, Membership Application Form, Page 4/4
        </div>
      </div>

    </div>
  )
}
