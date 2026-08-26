import React from 'react'
import './OfficialApplicationForm.css'

// Helper for digital character boxes with strict uniform geometry
function UniformDigitBoxes({ text = '', count = 24, className = '' }) {
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
    <div className={`digi-grid-boxes ${className}`}>
      {chars.map((ch, idx) => (
        <div key={idx} className={`digi-box-unit ${ch ? 'filled' : 'empty'}`}>
          {ch || '\u00A0'}
        </div>
      ))}
    </div>
  )
}

// Segmented Date: [D][D] [M][M] [Y][Y][Y][Y]
function UniformSegmentedDate({ dateStr = '' }) {
  const parts = (dateStr || '').split('-')
  const yyyy = parts[0] || ''
  const mm = parts[1] || ''
  const dd = parts[2] || ''

  return (
    <div className="digi-date-triplet">
      <div className="digi-date-cell">
        <span className="digi-date-tag">Date</span>
        <UniformDigitBoxes text={dd} count={2} className="w-2" />
      </div>
      <div className="digi-date-cell">
        <span className="digi-date-tag">Month</span>
        <UniformDigitBoxes text={mm} count={2} className="w-2" />
      </div>
      <div className="digi-date-cell">
        <span className="digi-date-tag">Year</span>
        <UniformDigitBoxes text={yyyy} count={4} className="w-4" />
      </div>
    </div>
  )
}

// Continuous 8-box date for office and milestones (DDMMYYYY)
function UniformDate8({ dateStr = '' }) {
  const parts = (dateStr || '').split('-')
  const formatted = parts.length === 3 ? `${parts[2]}${parts[1]}${parts[0]}` : ''
  return <UniformDigitBoxes text={formatted} count={8} className="w-8" />
}

// Strict uniform digital checkbox square
function UniformCheckbox({ checked = false, labelEn = '', labelTa = '' }) {
  return (
    <div className={`digi-chk-item ${checked ? 'checked' : ''}`}>
      <span className="digi-chk-box">
        {checked ? '✓' : ''}
      </span>
      <span className="digi-chk-txt">
        <strong>{labelEn}</strong>
        {labelTa && <span className="digi-chk-ta">{labelTa}</span>}
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

  return (
    <div className="digi-form-wrapper">

      {/* ============================================================
          PAGE 1 OF 4: APPLICANT'S INFORMATIONS & PERSONAL DETAILS
          ============================================================ */}
      <div className="digi-page-sheet" id="official-page-1">
        
        {/* Top Header */}
        <div className="digi-sheet-header">
          <div className="digi-crest-col">
            <img
              src="/aci-logo.png"
              alt="ACI Crest"
              className="digi-crest"
              onError={(e) => { e.target.src = '/aci-logo.jpg' }}
            />
          </div>
          <div className="digi-header-center">
            <h1 className="digi-title-diocesan">APOSTOLIC COUNCIL OF INDIA DIOCESE</h1>
            <p className="digi-meta-1">
              An Episcopal Diocese & Public Religious Trust (Indian Trust Act 1882 - Regd No: 62/Bk.4/2013)
            </p>
            <p className="digi-meta-2">
              Under Part I, Section 5(1) Part IV Sections 10, 12, 14, 15, Part VI Section 64 of The Indian Christian Marriage Act 1872
            </p>
            <p className="digi-meta-3">
              Constituent and/or The Christian Clergy Rights and Traditions
            </p>
            <p className="digi-meta-office">
              Central Office: 1/153, Melapatty, Hanumantharayankottai - 624 054, Dindigul District, Tamil Nadu, India.
            </p>
            <p className="digi-meta-contact">
              Phone: 0451 2490100 • E-mail: info@acidiocese.org / rev.johnsondurai@gmail.com
            </p>
          </div>
        </div>

        {/* Title Bar + Date of Issue */}
        <div className="digi-title-strip">
          <div className="digi-title-block">
            <h2 className="digi-doc-heading">DIOCESAN MEMBERSHIP APPLICATION FORM</h2>
            <h3 className="digi-doc-subheading">பேராய உறுப்பினர் விண்ணப்பப் படிவம்</h3>
          </div>
          <div className="digi-issue-box">
            <div className="digi-issue-title">Date of issue</div>
            <div className="digi-issue-date">{appDate}</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="digi-instructions-bar">
          Read the Application carefully, fill in CAPITAL LETTERS, DO NOT OVERWRITE, select the appropriate box by ticking it (✓) and leave the inappropriate fields blank. / விண்ணப்பத்தை கவனமாக வாசித்து ஆங்கில பெரிய எழுத்துக்களில் தெளிவாக எழுதவும். பொருத்தமான தகவல்களுக்குரிய இடத்தில் (✓) குறியிடவும்.
        </div>

        {/* TOP THREE-SECTION RESERVED BLOCK: Office Use | Reserved Official Seal | Photo Box */}
        <div className="digi-top-office-seal-photo-block">
          
          {/* Section 1: Office Use Fields */}
          <div className="digi-office-fields-card">
            <div className="digi-section-bar-inner">
              FOR OFFICE USE ONLY / அலுவலகப் பணிக்கு மட்டும்
            </div>
            <div className="digi-office-card-body">
              <div className="digi-off-line">
                <span className="digi-off-title">Application Number :</span>
                <span className="digi-off-val-appno">002093 / ACI-2026</span>
                <span className="digi-approval-badge">APPROVAL</span>
              </div>

              <div className="digi-off-line">
                <span className="digi-off-title">Application Received on :</span>
                <UniformDate8 dateStr={appDate} />
              </div>

              <div className="digi-off-line">
                <span className="digi-off-title">Application Approved on :</span>
                <UniformDate8 dateStr="" />
              </div>

              <div className="digi-off-line">
                <span className="digi-off-title">Membership Code :</span>
                <UniformDigitBoxes text="" count={10} className="w-10" />
              </div>
            </div>
          </div>

          {/* Section 2: RESERVED OFFICIAL SEAL AREA */}
          <div className="digi-seal-reserved-zone">
            <div className="digi-seal-circle-frame">
              <div className="digi-seal-text-top">OFFICIAL</div>
              <div className="digi-seal-crest-icon">✠</div>
              <div className="digi-seal-text-bot">SEAL</div>
            </div>
            <span className="digi-seal-reserved-tag">RESERVED FOR SEAL</span>
          </div>

          {/* Section 3: PASSPORT PHOTO CONTAINER */}
          <div className="digi-photo-frame-zone">
            {p.photoUrl ? (
              <img src={p.photoUrl} alt="Applicant Passport" className="digi-uploaded-photo" />
            ) : (
              <div className="digi-photo-wireframe">
                <span className="ph-t1">Affix Recent</span>
                <span className="ph-t2">Passport size</span>
                <span className="ph-t3">Photo</span>
                <span className="ph-t4">To be Self attested</span>
                <span className="ph-t5">சமீபத்திய புகைப்படம்</span>
              </div>
            )}
          </div>

        </div>

        {/* Section Divider Banner */}
        <div className="digi-black-banner">
          APPLICANT'S INFORMATIONS / விண்ணப்பதாரரின் தகவல்கள்
        </div>

        {/* I. Personal Details */}
        <div className="digi-section-content">
          <div className="digi-sub-heading">
            I. Personal Details / சுய விவரங்கள்
          </div>

          {/* 1. Name */}
          <div className="digi-field-row">
            <div className="digi-field-header">
              <span className="f-en">Name</span>
              <span className="f-ta">பெயர்</span>
              <span className="f-hint">(Salutation - Mr., Mrs., Rev., Dr., Bro., Pastor)</span>
            </div>
            <UniformDigitBoxes text={fullName} count={24} />
          </div>

          {/* 2. Baptismal Name */}
          <div className="digi-field-row">
            <div className="digi-field-header">
              <span className="f-en">Baptismal Name</span>
              <span className="f-ta">ஞானஸ்நானப் பெயர்</span>
            </div>
            <UniformDigitBoxes text={p.baptismalName} count={24} />
          </div>

          {/* 3. DOB & Nationality */}
          <div className="digi-two-col-grid">
            <div className="digi-col-box">
              <div className="digi-field-header">
                <span className="f-en">Date of Birth</span>
                <span className="f-ta">பிறந்த தேதி</span>
              </div>
              <UniformSegmentedDate dateStr={p.dob} />
            </div>

            <div className="digi-col-box">
              <div className="digi-field-header">
                <span className="f-en">Nationality</span>
                <span className="f-ta">நாட்டுரிமை</span>
              </div>
              <UniformDigitBoxes text={p.nationality || 'INDIAN'} count={12} className="w-12" />
            </div>
          </div>

          {/* 4. Gender & Marital Status */}
          <div className="digi-two-col-grid">
            <div className="digi-col-box">
              <div className="digi-field-header">
                <span className="f-en">Gender</span>
                <span className="f-ta">பாலினம்</span>
              </div>
              <div className="digi-chk-row">
                <UniformCheckbox checked={p.gender === 'Male'} labelEn="Male" labelTa="ஆண்" />
                <UniformCheckbox checked={p.gender === 'Female'} labelEn="Female" labelTa="பெண்" />
              </div>
            </div>

            <div className="digi-col-box">
              <div className="digi-field-header">
                <span className="f-en">Marital Status</span>
                <span className="f-ta">திருமண நிலை</span>
              </div>
              <div className="digi-chk-row">
                <UniformCheckbox checked={p.maritalStatus === 'Married'} labelEn="Married" />
                <UniformCheckbox checked={p.maritalStatus === 'Bachelor'} labelEn="Bachelor" />
                <UniformCheckbox checked={p.maritalStatus === 'Spinster'} labelEn="Spinster" />
                <UniformCheckbox checked={p.maritalStatus === 'Widowed'} labelEn="Widowed" />
              </div>
            </div>
          </div>

          {/* 5. Permanent Address */}
          <div className="digi-address-table-frame">
            <div className="digi-addr-banner">
              <strong>Permanent Address</strong>
              <span>நிரந்தர முகவரி</span>
            </div>

            <div className="digi-addr-tr">
              <div className="digi-addr-td" style={{ width: '28%' }}>
                <span className="lbl">Door No (கதவு எண்)</span>
                <span className="val">{perm.doorNo || '\u00A0'}</span>
              </div>
              <div className="digi-addr-td" style={{ width: '72%' }}>
                <span className="lbl">Street Name (தெருப் பெயர்)</span>
                <span className="val">{perm.streetName || '\u00A0'}</span>
              </div>
            </div>

            <div className="digi-addr-tr">
              <div className="digi-addr-td" style={{ width: '65%' }}>
                <span className="lbl">City / Town (நகரம் / ஊர்)</span>
                <span className="val">{perm.cityTown || '\u00A0'}</span>
              </div>
              <div className="digi-addr-td" style={{ width: '35%' }}>
                <span className="lbl">Pincode (பின்கோடு)</span>
                <UniformDigitBoxes text={perm.pincode} count={6} className="w-6" />
              </div>
            </div>

            <div className="digi-addr-tr">
              <div className="digi-addr-td" style={{ width: '50%' }}>
                <span className="lbl">Taluk (தாலுகா)</span>
                <span className="val">{perm.taluk || '\u00A0'}</span>
              </div>
              <div className="digi-addr-td" style={{ width: '50%' }}>
                <span className="lbl">District (மாவட்டம்)</span>
                <span className="val">{perm.district || '\u00A0'}</span>
              </div>
            </div>

            <div className="digi-addr-tr">
              <div className="digi-addr-td" style={{ width: '50%' }}>
                <span className="lbl">State (மாநிலம்)</span>
                <span className="val">{perm.state || '\u00A0'}</span>
              </div>
              <div className="digi-addr-td" style={{ width: '50%' }}>
                <span className="lbl">Country (நாடு)</span>
                <span className="val">{perm.country || 'India'}</span>
              </div>
            </div>
          </div>

          {/* 6. Contact Address */}
          <div className="digi-address-table-frame">
            <div className="digi-addr-banner">
              <strong>Contact Address</strong>
              <span>தொடர்பு முகவரி</span>
            </div>

            <div className="digi-addr-tr">
              <div className="digi-addr-td" style={{ width: '28%' }}>
                <span className="lbl">Door No (கதவு எண்)</span>
                <span className="val">{contact.doorNo || '\u00A0'}</span>
              </div>
              <div className="digi-addr-td" style={{ width: '72%' }}>
                <span className="lbl">Street Name (தெருப் பெயர்)</span>
                <span className="val">{contact.streetName || '\u00A0'}</span>
              </div>
            </div>

            <div className="digi-addr-tr">
              <div className="digi-addr-td" style={{ width: '65%' }}>
                <span className="lbl">City / Town (நகரம் / ஊர்)</span>
                <span className="val">{contact.cityTown || '\u00A0'}</span>
              </div>
              <div className="digi-addr-td" style={{ width: '35%' }}>
                <span className="lbl">Pincode (பின்கோடு)</span>
                <UniformDigitBoxes text={contact.pincode} count={6} className="w-6" />
              </div>
            </div>

            <div className="digi-addr-tr">
              <div className="digi-addr-td" style={{ width: '50%' }}>
                <span className="lbl">Taluk (தாலுகா)</span>
                <span className="val">{contact.taluk || '\u00A0'}</span>
              </div>
              <div className="digi-addr-td" style={{ width: '50%' }}>
                <span className="lbl">District (மாவட்டம்)</span>
                <span className="val">{contact.district || '\u00A0'}</span>
              </div>
            </div>

            <div className="digi-addr-tr">
              <div className="digi-addr-td" style={{ width: '50%' }}>
                <span className="lbl">State (மாநிலம்)</span>
                <span className="val">{contact.state || '\u00A0'}</span>
              </div>
              <div className="digi-addr-td" style={{ width: '50%' }}>
                <span className="lbl">Country (நாடு)</span>
                <span className="val">{contact.country || 'India'}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="digi-sheet-footer">
          Apostolic Council of India Diocese, Membership Application Form, Page 1/4
        </div>
      </div>

      {/* ============================================================
          PAGE 2 OF 4: SPIRITUAL INFORMATION, AFFILIATION & CHURCH DETAILS
          ============================================================ */}
      <div className="digi-page-sheet" id="official-page-2">
        
        {/* II. Spiritual Information */}
        <div className="digi-black-banner">
          II. Spiritual Information / ஆவிக்குரிய தகவல்கள்
        </div>

        <div className="digi-fivefold-grid">
          <UniformCheckbox checked={sp.ministryFunction === 'Apostle'} labelEn="Apostle" labelTa="அப்போஸ்தலர்" />
          <UniformCheckbox checked={sp.ministryFunction === 'Prophet'} labelEn="Prophet" labelTa="தீர்க்கதரிசி" />
          <UniformCheckbox checked={sp.ministryFunction === 'Pastor'} labelEn="Pastor" labelTa="மேய்ப்பர்" />
          <UniformCheckbox checked={sp.ministryFunction === 'Teacher'} labelEn="Teacher" labelTa="போதகர்" />
          <UniformCheckbox checked={sp.ministryFunction === 'Evangelist'} labelEn="Evangelist" labelTa="சுவிசேஷகர்" />
        </div>

        <div className="digi-fivefold-subrow">
          <UniformCheckbox checked={sp.ministryFunction === 'Associate Pastor'} labelEn="Associate Pastor" labelTa="உதவி மேய்ப்பர்" />
          <div className="digi-inline-other">
            <UniformCheckbox checked={sp.ministryFunction === 'Other Ministry'} labelEn="Other Ministry" labelTa="மற்ற ஊழியங்கள்" />
            <span className="digi-fill-underline">Specify: <strong>{sp.otherMinistrySpecify || '___________________________'}</strong></span>
          </div>
        </div>

        {/* III. Affiliation */}
        <div className="digi-black-banner">
          III. Affiliation / பேராயம் / நிறுவனம் / ஐக்கிய இணைப்பு
        </div>

        <div className="digi-affiliation-group">
          <div className="digi-aff-item">
            <UniformCheckbox checked={aff.affiliationType === 'Independent Church'} labelEn="Independent Church" labelTa="ஸ்தல சுயாட்சி சபை" />
            <span className="digi-fill-underline">Founder's Name (நிறுவனர் பெயர்): <strong>{aff.founderName || '___________________________'}</strong></span>
          </div>

          <div className="digi-aff-item">
            <UniformCheckbox checked={aff.affiliationType === 'Denomination'} labelEn="Denomination" labelTa="சபைப் பிரிவு" />
            <span className="digi-fill-underline">Specify: <strong>{aff.denominationSpecify || '___________________________'}</strong></span>
          </div>

          <div className="digi-aff-item">
            <UniformCheckbox checked={aff.affiliationType === 'Associate / Assistant'} labelEn="Associate / Assistant" labelTa="துணை / உதவி" />
            <span className="digi-fill-underline">Name of Chief Pastor: <strong>{aff.associateChiefPastorName || '___________________________'}</strong></span>
          </div>

          <div className="digi-aff-item" style={{ paddingLeft: '32px' }}>
            <span className="digi-fill-underline">Name of Church: <strong>{aff.associateChurchName || '___________________________'}</strong></span>
          </div>

          <div className="digi-aff-item">
            <span className="digi-fill-underline"><strong>Name of your Trust (உங்களது டிரஸ்டின் பெயர்):</strong> <strong>{aff.trustName || '___________________________'}</strong></span>
          </div>
        </div>

        {/* IV. Church Details */}
        <div className="digi-black-banner">
          IV. Church Details / சபையின் தகவல்கள்
        </div>

        <div className="digi-section-content">
          {/* Church Name */}
          <div className="digi-field-row">
            <div className="digi-field-header">
              <span className="f-en">Church Name</span>
              <span className="f-ta">சபையின் பெயர்</span>
            </div>
            <UniformDigitBoxes text={ch.churchName} count={24} />
          </div>

          {/* Church Address Table */}
          <div className="digi-address-table-frame" style={{ marginTop: '6px' }}>
            <div className="digi-addr-tr">
              <div className="digi-addr-td" style={{ width: '28%' }}>
                <span className="lbl">Door No (கதவு எண்)</span>
                <span className="val">{ch.doorNo || '\u00A0'}</span>
              </div>
              <div className="digi-addr-td" style={{ width: '72%' }}>
                <span className="lbl">Street Name (தெருப் பெயர்)</span>
                <span className="val">{ch.streetName || '\u00A0'}</span>
              </div>
            </div>

            <div className="digi-addr-tr">
              <div className="digi-addr-td" style={{ width: '65%' }}>
                <span className="lbl">City / Town (நகரம் / ஊர்)</span>
                <span className="val">{ch.cityTown || '\u00A0'}</span>
              </div>
              <div className="digi-addr-td" style={{ width: '35%' }}>
                <span className="lbl">Pincode (பின்கோடு)</span>
                <UniformDigitBoxes text={ch.pincode} count={6} className="w-6" />
              </div>
            </div>

            <div className="digi-addr-tr">
              <div className="digi-addr-td" style={{ width: '50%' }}>
                <span className="lbl">Taluk (தாலுகா)</span>
                <span className="val">{ch.taluk || '\u00A0'}</span>
              </div>
              <div className="digi-addr-td" style={{ width: '50%' }}>
                <span className="lbl">District (மாவட்டம்)</span>
                <span className="val">{ch.district || '\u00A0'}</span>
              </div>
            </div>

            <div className="digi-addr-tr">
              <div className="digi-addr-td" style={{ width: '50%' }}>
                <span className="lbl">State (மாநிலம்)</span>
                <span className="val">{ch.state || '\u00A0'}</span>
              </div>
              <div className="digi-addr-td" style={{ width: '50%' }}>
                <span className="lbl">Country (நாடு)</span>
                <span className="val">{ch.country || 'India'}</span>
              </div>
            </div>

            <div className="digi-addr-tr">
              <div className="digi-addr-td" style={{ width: '50%' }}>
                <span className="lbl">Telephone (தொலைபேசி எண்)</span>
                <span className="val">{ch.telephone || '\u00A0'}</span>
              </div>
              <div className="digi-addr-td" style={{ width: '50%' }}>
                <span className="lbl">Mobile (கைப்பேசி எண்)</span>
                <span className="val">{ch.mobileNumber || '\u00A0'}</span>
              </div>
            </div>

            <div className="digi-addr-tr">
              <div className="digi-addr-td" style={{ width: '100%' }}>
                <span className="lbl">Email ID (மின்னஞ்சல் முகவரி)</span>
                <span className="val">{ch.emailId || '\u00A0'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* V. Ministry Milestone Questions */}
        <div className="digi-black-banner">
          V. Ministry Milestones / ஆவிக்குரிய அனுபவங்கள்
        </div>

        <div className="digi-milestones-container">
          <div className="digi-milestone-tr">
            <div className="digi-milestone-txt">
              1. When were you Born Again? எப்பொழுது மறுபிறப்பின் அனுபவத்தைப் பெற்றீர்கள்?
            </div>
            <UniformDate8 dateStr={mh.bornAgainDate} />
          </div>

          <div className="digi-milestone-tr">
            <div className="digi-milestone-txt">
              2. When were you Baptized in full immersion? எப்பொழுது முழுக்கு ஞானஸ்நானம் பெற்றீர்கள்?
            </div>
            <UniformDate8 dateStr={mh.waterBaptismDate} />
          </div>

          <div className="digi-milestone-tr">
            <div className="digi-milestone-txt">
              3. When were you filled with the Holy Spirit? எப்பொழுது பரிசுத்த ஆவியின் அபிஷேகத்தைப் பெற்றீர்கள்?
            </div>
            <UniformDate8 dateStr={mh.holySpiritBaptismDate} />
          </div>

          <div className="digi-milestone-tr">
            <div className="digi-milestone-txt">
              4. When were you called for Ministry? எப்பொழுது ஊழிய அழைப்பைப் பெற்றீர்கள்?
            </div>
            <UniformDate8 dateStr={mh.callingDate} />
          </div>

          <div className="digi-milestone-tr">
            <div className="digi-milestone-txt">
              5. When did you start active Ministry? எப்பொழுது ஊழியத்தைத் துவக்கினீர்கள்?
            </div>
            <UniformDate8 dateStr={mh.ministryStartDate} />
          </div>
        </div>

        <div className="digi-sheet-footer">
          Apostolic Council of India Diocese, Membership Application Form, Page 2/4
        </div>
      </div>

      {/* ============================================================
          PAGE 3 OF 4: QUALIFICATIONS, FAMILY DETAILS & MOTIVATION
          ============================================================ */}
      <div className="digi-page-sheet" id="official-page-3">
        
        {/* Ordination & Affiliation Questions */}
        <div className="digi-questions-box">
          <div className="digi-q-row">
            <span className="digi-q-title">
              6. Do you want to be ordained by ACI Diocese? இந்தப் பேராயத்தால் பிரதிஷ்டை பெற விரும்புகிறீர்களா?
            </span>
            <div className="digi-q-answers">
              <UniformCheckbox checked={mh.wantOrdination === 'Yes'} labelEn="Yes" labelTa="ஆம்" />
              <UniformCheckbox checked={mh.wantOrdination === 'No'} labelEn="No" labelTa="இல்லை" />
            </div>
          </div>

          <div className="digi-q-row">
            <span className="digi-q-title">
              7. Do you want to be affiliated with ACI Diocese? இந்தப் பேராயத்தின் இணைப்பைப் பெற விரும்புகிறீர்களா?
            </span>
            <div className="digi-q-answers">
              <UniformCheckbox checked={mh.wantAffiliation === 'Yes'} labelEn="Yes" labelTa="ஆம்" />
              <UniformCheckbox checked={mh.wantAffiliation === 'No'} labelEn="No" labelTa="இல்லை" />
            </div>
          </div>
        </div>

        {/* VI. Academic Qualification Table */}
        <div className="digi-black-banner">
          VI. Academic Qualification / பொதுக் கல்வித் தகுதி
        </div>

        <table className="digi-grid-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>S.No</th>
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
        <div className="digi-black-banner">
          VII. Theological Qualification / இறையியல் தகுதி
        </div>

        <table className="digi-grid-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>S.No</th>
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
        <div className="digi-black-banner">
          VIII. Family Details / குடும்ப விவரங்கள்
        </div>

        <table className="digi-grid-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>S.No</th>
              <th>Name / பெயர்</th>
              <th style={{ width: '105px' }}>DOB / பிறந்த தேதி</th>
              <th style={{ width: '115px' }}>Relationship / உறவுமுறை</th>
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
        <div className="digi-black-banner">
          IX. What prompts you to join APOSTOLIC COUNCIL OF INDIA DIOCESE? / பேராயத்தில் இணையக் காரணம்
        </div>

        <div className="digi-essay-box">
          {mot.reasonToJoin ? (
            <p className="digi-essay-body">{mot.reasonToJoin}</p>
          ) : (
            <div className="digi-blank-rules">
              <div className="r-line"></div>
              <div className="r-line"></div>
              <div className="r-line"></div>
              <div className="r-line"></div>
            </div>
          )}
        </div>

        <div className="digi-sheet-footer">
          Apostolic Council of India Diocese, Membership Application Form, Page 3/4
        </div>
      </div>

      {/* ============================================================
          PAGE 4 OF 4: REFERENCES, STATUTORY DECLARATION & SIGNATURE
          ============================================================ */}
      <div className="digi-page-sheet" id="official-page-4">
        
        {/* X. References */}
        <div className="digi-black-banner">
          X. Details of Two References (Must) / இரண்டு பேராய அங்கத்தினர்களின் பரிந்துரை
        </div>

        <div className="digi-two-refs-grid">
          {/* Reference 1 */}
          <div className="digi-ref-column-card">
            <div className="digi-ref-badge-header">
              1. District Overseer / பேராய உறுப்பினர்
            </div>
            <div className="digi-ref-content">
              <div className="digi-ref-field">
                <span className="lbl">Name :</span>
                <span className="val">{ref.ref1?.name || '___________________________'}</span>
              </div>
              <div className="digi-ref-field">
                <span className="lbl">Diocese ID No :</span>
                <span className="val">{ref.ref1?.diocesanId || '___________________________'}</span>
              </div>
              <div className="digi-ref-field">
                <span className="lbl">Telephone / Mobile :</span>
                <span className="val">{ref.ref1?.phone || '___________________________'}</span>
              </div>
              <div className="digi-ref-field">
                <span className="lbl">Known Since :</span>
                <span className="val">{ref.ref1?.knownSince || '___________________________'}</span>
              </div>
              <div className="digi-ref-field">
                <span className="lbl">Mode :</span>
                <div className="digi-chk-row">
                  <UniformCheckbox checked={ref.ref1?.relationshipType === 'Personally' || !ref.ref1?.relationshipType} labelEn="Personally" labelTa="நேரில்" />
                  <UniformCheckbox checked={ref.ref1?.relationshipType === 'Professionally'} labelEn="Professionally" labelTa="ஊழியத்தில்" />
                </div>
              </div>
              <div className="digi-ref-attest-row">
                <span>Signature of Referrer :</span>
                <span className="digi-attest-badge">[ Attested ]</span>
              </div>
            </div>
          </div>

          {/* Reference 2 */}
          <div className="digi-ref-column-card">
            <div className="digi-ref-badge-header">
              2. Taluk Co-ordinator / பேராய உறுப்பினர்
            </div>
            <div className="digi-ref-content">
              <div className="digi-ref-field">
                <span className="lbl">Name :</span>
                <span className="val">{ref.ref2?.name || '___________________________'}</span>
              </div>
              <div className="digi-ref-field">
                <span className="lbl">Diocese ID No :</span>
                <span className="val">{ref.ref2?.diocesanId || '___________________________'}</span>
              </div>
              <div className="digi-ref-field">
                <span className="lbl">Telephone / Mobile :</span>
                <span className="val">{ref.ref2?.phone || '___________________________'}</span>
              </div>
              <div className="digi-ref-field">
                <span className="lbl">Known Since :</span>
                <span className="val">{ref.ref2?.knownSince || '___________________________'}</span>
              </div>
              <div className="digi-ref-field">
                <span className="lbl">Mode :</span>
                <div className="digi-chk-row">
                  <UniformCheckbox checked={ref.ref2?.relationshipType === 'Personally'} labelEn="Personally" labelTa="நேரில்" />
                  <UniformCheckbox checked={ref.ref2?.relationshipType === 'Professionally' || !ref.ref2?.relationshipType} labelEn="Professionally" labelTa="ஊழியத்தில்" />
                </div>
              </div>
              <div className="digi-ref-attest-row">
                <span>Signature of Referrer :</span>
                <span className="digi-attest-badge">[ Attested ]</span>
              </div>
            </div>
          </div>
        </div>

        {/* XI. Statutory Declaration */}
        <div className="digi-black-banner">
          XI. Statutory Declaration / உறுதிமொழி மற்றும் கையெழுத்து
        </div>

        <div className="digi-declaration-container">
          <p className="digi-declaration-en">
            &ldquo;I hereby declare that the information furnished above is true to the best of my knowledge. I am fully in agreement with the Faith Statement of ACI Diocese. I understand that this is the united Ministry and I shall give attention to this ministry apart from my church ministry. I shall abide by the terms and conditions of ACI Diocese, in force from time to time.&rdquo;
          </p>
          <p className="digi-declaration-ta">
            &ldquo;மேற்குறிப்பிட்ட விவரங்கள் அனைத்தும் உண்மை என்றும், ஏசிஐ பேராயத்தின் விசுவாச அறிக்கையை முழுமையாக ஏற்றுக்கொள்கிறேன் என்றும், சபை ஊழியத்தோடு இந்த ஐக்கிய ஊழியத்திலும் உற்சாகமாக செயல்படுவேன் என்றும், பேராயத்தின் சட்டதிட்டங்களுக்கு கீழ்ப்படிவேன் என்றும் உறுதியளிக்கிறேன்.&rdquo;
          </p>

          <div className="digi-declaration-footer-grid">
            <div className="digi-dec-left-meta">
              <div className="digi-dec-row">
                <span className="lbl">Place / இடம் :</span>
                <span className="val">{dec.place || 'Dindigul'}</span>
              </div>
              <div className="digi-dec-row">
                <span className="lbl">Date / தேதி :</span>
                <span className="val">{dec.date || appDate}</span>
              </div>
            </div>

            <div className="digi-signature-zone">
              <div className="digi-cursive-signature">
                {sigName}
              </div>
              <div className="digi-sig-line-bar"></div>
              <div className="digi-sig-caption">
                Signature of the Applicant / விண்ணப்பதாரரின் கையொப்பம்
              </div>
              <div className="digi-sig-auth-badge">[ Digitally Verified ]</div>
            </div>
          </div>
        </div>

        {/* XII. Required Enclosures Checklist */}
        <div className="digi-black-banner">
          XII. Checklist of Required Enclosures / இணைக்கப்பட வேண்டிய சான்றிதழ்கள்
        </div>

        <div className="digi-enclosures-checklist">
          <div className="chk-item">☑ 1. Proof of Identity (Aadhaar / Passport / Voter ID)</div>
          <div className="chk-item">☑ 2. Proof of Address (Ration Card / Gas Bill / EB Bill)</div>
          <div className="chk-item">☑ 3. Proof of Date of Birth (Birth Certificate / 10th Marks / TC)</div>
          <div className="chk-item">☑ 4. Attested Recent Passport Size Photographs (3 copies)</div>
          <div className="chk-item">☑ 5. Academic & Theological Qualification Certificates</div>
          <div className="chk-item">☑ 6. Ministry Summary / Field Work Statement</div>
          <div className="chk-item">☑ 7. Church Ministry Photograph with Congregation</div>
          <div className="chk-item">☑ 8. Existing Ordination / Affiliation Certificate (if any)</div>
        </div>

        <div className="digi-sheet-footer">
          Apostolic Council of India Diocese, Membership Application Form, Page 4/4
        </div>
      </div>

    </div>
  )
}
