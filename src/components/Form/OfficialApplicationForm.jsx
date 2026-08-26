import React from 'react'
import './OfficialApplicationForm.css'

// Helper to format date string YYYY-MM-DD into [D D M M Y Y Y Y] segmented boxes
function renderDateBoxes(dateStr) {
  if (!dateStr) {
    return (
      <div className="oaf-char-boxes">
        {['D','D','M','M','Y','Y','Y','Y'].map((ch, i) => (
          <span key={i} className="oaf-char-cell" style={{ color: '#aaa', fontSize: '9px' }}>{ch}</span>
        ))}
      </div>
    )
  }
  const parts = dateStr.split('-') // [YYYY, MM, DD]
  const yyyy = (parts[0] || '    ').split('')
  const mm = (parts[1] || '  ').split('')
  const dd = (parts[2] || '  ').split('')
  const chars = [...dd, ...mm, ...yyyy]

  return (
    <div className="oaf-char-boxes">
      {chars.map((c, i) => (
        <span key={i} className="oaf-char-cell">{c || ''}</span>
      ))}
    </div>
  )
}

// Helper to render letter boxes for Name / Text
function renderLetterBoxes(text, boxCount = 28) {
  const chars = (text || '').toUpperCase().slice(0, boxCount).split('')
  while (chars.length < boxCount) {
    chars.push('')
  }
  return (
    <div className="oaf-char-boxes">
      {chars.map((c, i) => (
        <span key={i} className="oaf-char-cell">{c || ''}</span>
      ))}
    </div>
  )
}

export default function OfficialApplicationForm({ data, isMini = false }) {
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
  const enc = data?.enclosures || {}

  const fullName = [p.salutation, p.name].filter(Boolean).join(' ').toUpperCase()

  return (
    <div className={`oaf-root ${isMini ? 'is-mini' : ''}`}>

      {/* ============================================================
          PAGE 1 OF 4: APPLICANT'S INFORMATIONS & PERSONAL DETAILS
          ============================================================ */}
      <div className="oaf-page" id="oaf-page-1">
        {/* Header */}
        <div className="oaf-header">
          <img src="/aci-logo.png" alt="ACI Diocese Seal" className="oaf-crest" onError={(e) => { e.target.src = '/aci-logo.jpg' }} />
          <h1 className="oaf-org-title">APOSTOLIC COUNCIL OF INDIA DIOCESE</h1>
          <p className="oaf-org-sub-1">
            An Episcopal Diocese & Public Religious Trust (Indian Trust Act 1882 - Regd No: 62/Bk.4/2013)
          </p>
          <p className="oaf-org-sub-2">
            Under Part I, Section 5(1) Part IV Sections 10, 12, 14, 15, Part VI Section 64 of The Indian Christian Marriage Act 1872
          </p>
          <p className="oaf-org-sub-3">
            Central Office: 1/153, Melapatty, Hanumantharayankottai - 624 054, Dindigul District, Tamil Nadu, India.
          </p>
          <p className="oaf-org-sub-3">
            Phone: 0451 2490100 • E-mail: info@acidiocese.org / rev.johnsondurai@gmail.com
          </p>
        </div>

        {/* Title */}
        <div className="oaf-doc-title-row">
          <h2 className="oaf-doc-title-en">DIOCESAN MEMBERSHIP APPLICATION FORM</h2>
          <h3 className="oaf-doc-title-ta">பேராய உறுப்பினர் விண்ணப்பப் படிவம்</h3>
          <div className="oaf-issue-date-tag">
            Date of issue: {p.applicationDate || '2026-08-26'}
          </div>
        </div>

        <p className="oaf-instruction-note">
          Read the Application carefully, fill in CAPITAL LETTERS, DO NOT OVERWRITE, select the appropriate box by ticking it (✓) and leave the inappropriate fields blank. / விண்ணப்பத்தை கவனமாக வாசித்து ஆங்கில பெரிய எழுத்துக்களில் தெளிவாக எழுதவும். பொருத்தமான தகவல்களுக்குரிய இடத்தில் (✓) குறியிடவும்.
        </p>

        {/* For Office Use Only + Photo Grid */}
        <div className="oaf-office-grid">
          <div className="oaf-office-left">
            <div className="oaf-office-header">
              FOR OFFICE USE ONLY / அலுவலகப் பணிக்கு மட்டும்
            </div>
            <div className="oaf-office-row">
              <span className="oaf-office-lbl">Application Number:</span>
              <strong style={{ letterSpacing: '1px' }}>002093 / ACI-2026</strong>
            </div>
            <div className="oaf-office-row">
              <span className="oaf-office-lbl">Application Received on:</span>
              {renderDateBoxes(p.applicationDate || '')}
            </div>
            <div className="oaf-office-row">
              <span className="oaf-office-lbl">Application Approved on:</span>
              {renderDateBoxes('')}
            </div>
            <div className="oaf-office-row">
              <span className="oaf-office-lbl">Membership Code:</span>
              <div className="oaf-char-boxes">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className="oaf-char-cell" style={{ color: '#ccc' }}>_</span>
                ))}
              </div>
            </div>

            <div className="oaf-stamp-row">
              <div className="oaf-approval-box">
                [ OFFICIAL REVIEW PENDING ]
              </div>
              <div className="oaf-seal-circle">
                OFFICIAL<br />SEAL
              </div>
            </div>
          </div>

          {/* Photo Box */}
          <div className="oaf-photo-box">
            <div className="oaf-photo-inner">
              {p.photoUrl ? (
                <img src={p.photoUrl} alt="Applicant Passport Photo" className="oaf-photo-img" />
              ) : (
                <div className="oaf-photo-placeholder-text">
                  <strong>Affix Recent Passport size Photo</strong><br />
                  <span style={{ fontSize: '7.5px' }}>To be Self attested</span><br />
                  <span style={{ fontSize: '7px', color: '#555' }}>சமீபத்திய புகைப்படம்</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Applicant's Information Banner */}
        <div className="oaf-banner-bar">
          <span>APPLICANT'S INFORMATIONS / விண்ணப்பதாரரின் தகவல்கள்</span>
          <span>Application Date: {p.applicationDate || '—'}</span>
        </div>

        {/* I. Personal Details */}
        <div style={{ marginTop: '6px' }}>
          <h4 className="oaf-section-heading">I. Personal Details / சுய விவரங்கள்</h4>

          {/* Name in letter boxes */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
              <span>Name / பெயர்: (Salutation - Mr., Mrs., Rev., Dr., Bro., Pastor)</span>
              <span style={{ color: '#2563eb' }}>{fullName}</span>
            </div>
            {renderLetterBoxes(fullName, 32)}
          </div>

          {/* Baptismal Name in letter boxes */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
              <span>Baptismal Name / ஞானஸ்நானப் பெயர்:</span>
              <span>{(p.baptismalName || '').toUpperCase()}</span>
            </div>
            {renderLetterBoxes(p.baptismalName, 32)}
          </div>

          {/* DOB + Nationality */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>Date of Birth / பிறந்த தேதி:</div>
              {renderDateBoxes(p.dob)}
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>Nationality / நாட்டுரிமை:</div>
              {renderLetterBoxes(p.nationality || 'INDIAN', 14)}
            </div>
          </div>

          {/* Gender + Marital Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '14px', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>Gender / பாலினம்:</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span className="oaf-check-item">
                  <span className="oaf-box-tick">{p.gender === 'Male' ? '✓' : ''}</span> Male ஆண்
                </span>
                <span className="oaf-check-item">
                  <span className="oaf-box-tick">{p.gender === 'Female' ? '✓' : ''}</span> Female பெண்
                </span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>Marital Status / திருமண நிலை:</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span className="oaf-check-item">
                  <span className="oaf-box-tick">{p.maritalStatus === 'Married' ? '✓' : ''}</span> Married
                </span>
                <span className="oaf-check-item">
                  <span className="oaf-box-tick">{p.maritalStatus === 'Bachelor' ? '✓' : ''}</span> Bachelor
                </span>
                <span className="oaf-check-item">
                  <span className="oaf-box-tick">{p.maritalStatus === 'Spinster' ? '✓' : ''}</span> Spinster
                </span>
                <span className="oaf-check-item">
                  <span className="oaf-box-tick">{p.maritalStatus === 'Widowed' ? '✓' : ''}</span> Widowed
                </span>
              </div>
            </div>
          </div>

          {/* Permanent Address */}
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 'bold' }}>Permanent Address / நிரந்தர முகவரி:</div>
            <div className="oaf-addr-grid">
              <div className="oaf-addr-line">
                <div style={{ width: '130px' }}>Door No: <strong>{perm.doorNo || '—'}</strong></div>
                <div style={{ flex: 1 }}>Street Name: <strong>{perm.streetName || '—'}</strong></div>
              </div>
              <div className="oaf-addr-line">
                <div style={{ flex: 1 }}>City / Town: <strong>{perm.cityTown || '—'}</strong></div>
                <div style={{ width: '150px' }}>Pincode: <strong>{perm.pincode || '—'}</strong></div>
              </div>
              <div className="oaf-addr-line">
                <div style={{ flex: 1 }}>Taluk: <strong>{perm.taluk || '—'}</strong></div>
                <div style={{ flex: 1 }}>District: <strong>{perm.district || '—'}</strong></div>
                <div style={{ width: '120px' }}>State: <strong>{perm.state || 'Tamil Nadu'}</strong></div>
                <div style={{ width: '90px' }}>Country: <strong>{perm.country || 'India'}</strong></div>
              </div>
            </div>
          </div>

          {/* Contact Address */}
          <div style={{ marginTop: '6px' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 'bold' }}>Contact Address / தொடர்பு முகவரி:</div>
            <div className="oaf-addr-grid">
              <div className="oaf-addr-line">
                <div style={{ width: '130px' }}>Door No: <strong>{contact.doorNo || '—'}</strong></div>
                <div style={{ flex: 1 }}>Street Name: <strong>{contact.streetName || '—'}</strong></div>
              </div>
              <div className="oaf-addr-line">
                <div style={{ flex: 1 }}>City / Town: <strong>{contact.cityTown || '—'}</strong></div>
                <div style={{ width: '150px' }}>Pincode: <strong>{contact.pincode || '—'}</strong></div>
              </div>
              <div className="oaf-addr-line">
                <div style={{ flex: 1 }}>Taluk: <strong>{contact.taluk || '—'}</strong></div>
                <div style={{ flex: 1 }}>District: <strong>{contact.district || '—'}</strong></div>
                <div style={{ width: '120px' }}>State: <strong>{contact.state || 'Tamil Nadu'}</strong></div>
                <div style={{ width: '90px' }}>Country: <strong>{contact.country || 'India'}</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 1 Footer */}
        <div className="oaf-page-footer">
          <span>Apostolic Council of India Diocese</span>
          <span>Membership Application Form, Page 1/4</span>
        </div>
      </div>


      {/* ============================================================
          PAGE 2 OF 4: SPIRITUAL INFORMATIONS, AFFILIATION & CHURCH DETAILS
          ============================================================ */}
      <div className="oaf-page" id="oaf-page-2">
        <div className="oaf-header" style={{ paddingBottom: '4px', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 900, margin: 0, textTransform: 'uppercase' }}>
            ACI - Diocese Membership Application Form
          </h2>
        </div>

        {/* II. Spiritual Informations */}
        <div style={{ marginBottom: '12px' }}>
          <h4 className="oaf-section-heading">II. Spiritual Informations / ஆவிக்குரிய தகவல்கள்</h4>
          <p style={{ fontSize: '11px', margin: '0 0 6px' }}>
            Please specify by selecting (✓) current ministry function தாங்கள் செய்யும் ஊழியத்தை (✓) குறிப்பிடவும்:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11.5px' }}>
            <span className="oaf-check-item">
              <span className="oaf-box-tick">{sp.ministryFunction === 'Apostle' ? '✓' : ''}</span> Apostle - அப்போஸ்தலர்
            </span>
            <span className="oaf-check-item">
              <span className="oaf-box-tick">{sp.ministryFunction === 'Prophet' ? '✓' : ''}</span> Prophet - தீர்க்கதரிசி
            </span>
            <span className="oaf-check-item">
              <span className="oaf-box-tick">{sp.ministryFunction === 'Pastor' ? '✓' : ''}</span> Pastor - மேய்ப்பர்
            </span>
            <span className="oaf-check-item">
              <span className="oaf-box-tick">{sp.ministryFunction === 'Teacher' ? '✓' : ''}</span> Teacher - போதகர்
            </span>
            <span className="oaf-check-item">
              <span className="oaf-box-tick">{sp.ministryFunction === 'Evangelist' ? '✓' : ''}</span> Evangelist - சுவிசேஷகர்
            </span>
            <span className="oaf-check-item">
              <span className="oaf-box-tick">{sp.ministryFunction === 'Associate Pastor' ? '✓' : ''}</span> Associate Pastor - உதவி மேய்ப்பர்
            </span>
          </div>

          <div className="oaf-field-row" style={{ marginTop: '6px' }}>
            <span className="oaf-check-item" style={{ minWidth: '170px' }}>
              <span className="oaf-box-tick">{sp.ministryFunction === 'Other Ministry' ? '✓' : ''}</span> Other Ministry - மற்ற ஊழியம்:
            </span>
            <span className="oaf-field-val">{sp.otherMinistrySpecify || '—'}</span>
          </div>
        </div>

        {/* III. Affiliation */}
        <div style={{ marginBottom: '12px' }}>
          <h4 className="oaf-section-heading">III. Affiliation / பேராயம், நிறுவனம், ஐக்கிய இணைப்பு</h4>
          <p style={{ fontSize: '10.5px', margin: '0 0 6px' }}>
            Are you having any affiliation with fellowship / Organization / Diocese? / வேறு எந்த பேராயம், நிறுவனம், ஐக்கியத்தில் உறுப்பினரா? குறிப்பிடவும்.
          </p>

          <div style={{ marginBottom: '6px' }}>
            <div className="oaf-field-row">
              <span className="oaf-check-item" style={{ minWidth: '220px' }}>
                <span className="oaf-box-tick">{aff.affiliationType === 'Independent Church' ? '✓' : ''}</span> Independent Church - சுயாதீன திருச்சபை
              </span>
              <span className="oaf-field-label">Founder's Name:</span>
              <span className="oaf-field-val">{aff.founderName || '—'}</span>
            </div>
          </div>

          <div style={{ marginBottom: '6px' }}>
            <div className="oaf-field-row">
              <span className="oaf-check-item" style={{ minWidth: '220px' }}>
                <span className="oaf-box-tick">{aff.affiliationType === 'Denomination' ? '✓' : ''}</span> Denomination (Specify) / சபைப் பிரிவு:
              </span>
              <span className="oaf-field-val">{aff.denominationSpecify || '—'}</span>
            </div>
          </div>

          <div style={{ marginBottom: '6px' }}>
            <div className="oaf-check-item" style={{ marginBottom: '4px' }}>
              <span className="oaf-box-tick">{aff.affiliationType === 'Associate / Assistant' ? '✓' : ''}</span> Associate / Assistant (if so, provide the name of the chief Pastor and the Church you attend)*
            </div>
            <div style={{ paddingLeft: '22px' }}>
              <div className="oaf-field-row">
                <span className="oaf-field-label">Name of Chief Pastor:</span>
                <span className="oaf-field-val">{aff.associateChiefPastorName || '—'}</span>
              </div>
              <div className="oaf-field-row">
                <span className="oaf-field-label">Name of Church:</span>
                <span className="oaf-field-val">{aff.associateChurchName || '—'}</span>
              </div>
            </div>
          </div>

          {/* Name of Trust */}
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>
              Name of your Trust / உங்களது டிரஸ்டின் பெயர்:
            </div>
            {renderLetterBoxes(aff.trustName || '', 32)}
          </div>
        </div>

        {/* IV. Church Details */}
        <div style={{ marginBottom: '12px' }}>
          <h4 className="oaf-section-heading">IV. Church Details / சபையின் விவரங்கள்</h4>

          <div style={{ marginBottom: '6px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '2px' }}>Church Name / சபையின் பெயர்:</div>
            {renderLetterBoxes(ch.churchName || '', 32)}
          </div>

          <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '6px' }}>Church Address / சபையின் முகவரி:</div>
          <div className="oaf-addr-grid">
            <div className="oaf-addr-line">
              <div style={{ width: '130px' }}>Door No: <strong>{ch.doorNo || '—'}</strong></div>
              <div style={{ flex: 1 }}>Street Name: <strong>{ch.streetName || '—'}</strong></div>
            </div>
            <div className="oaf-addr-line">
              <div style={{ flex: 1 }}>City / Town: <strong>{ch.cityTown || '—'}</strong></div>
              <div style={{ width: '150px' }}>Pincode: <strong>{ch.pincode || '—'}</strong></div>
            </div>
            <div className="oaf-addr-line">
              <div style={{ flex: 1 }}>Taluk: <strong>{ch.taluk || '—'}</strong></div>
              <div style={{ flex: 1 }}>District: <strong>{ch.district || '—'}</strong></div>
              <div style={{ width: '120px' }}>State: <strong>{ch.state || 'Tamil Nadu'}</strong></div>
              <div style={{ width: '90px' }}>Country: <strong>{ch.country || 'India'}</strong></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '6px' }}>
            <div className="oaf-field-row">
              <span className="oaf-field-label">Telephone:</span>
              <span className="oaf-field-val">{ch.telephone || '—'}</span>
            </div>
            <div className="oaf-field-row">
              <span className="oaf-field-label">Mobile No:</span>
              <span className="oaf-field-val"><strong>{ch.mobileNumber || '—'}</strong></span>
            </div>
          </div>

          <div className="oaf-field-row">
            <span className="oaf-field-label">Email ID:</span>
            <span className="oaf-field-val">{ch.emailId || '—'}</span>
          </div>
        </div>

        {/* V. Ministry Dates */}
        <div>
          <h4 className="oaf-section-heading">V. Ministry Dates & Milestones / ஊழிய மைல்கற்கள்</h4>

          <div className="oaf-field-row" style={{ alignItems: 'center' }}>
            <span className="oaf-field-label" style={{ minWidth: '420px', fontSize: '11px' }}>
              1. When did you born again? - எப்பொழுது மறுபிறப்பின் அனுபவத்தைப் பெற்றீர்கள்?
            </span>
            {renderDateBoxes(mh.bornAgainDate)}
          </div>

          <div className="oaf-field-row" style={{ alignItems: 'center' }}>
            <span className="oaf-field-label" style={{ minWidth: '420px', fontSize: '11px' }}>
              2. When did you baptize in full immersion? - எப்பொழுது முழுக்கு ஞானஸ்நானம் பெற்றீர்கள்?
            </span>
            {renderDateBoxes(mh.waterBaptismDate)}
          </div>

          <div className="oaf-field-row" style={{ alignItems: 'center' }}>
            <span className="oaf-field-label" style={{ minWidth: '420px', fontSize: '11px' }}>
              3. When did you fill with the Holy Spirit? - எப்பொழுது பரிசுத்த ஆவியின் அபிஷேகத்தைப் பெற்றீர்கள்?
            </span>
            {renderDateBoxes(mh.holySpiritBaptismDate)}
          </div>

          <div className="oaf-field-row" style={{ alignItems: 'center' }}>
            <span className="oaf-field-label" style={{ minWidth: '420px', fontSize: '11px' }}>
              4. When did you call for Ministry? - எப்பொழுது ஊழிய அழைப்பைப் பெற்றீர்கள்?
            </span>
            {renderDateBoxes(mh.callingDate)}
          </div>

          <div className="oaf-field-row" style={{ alignItems: 'center' }}>
            <span className="oaf-field-label" style={{ minWidth: '420px', fontSize: '11px' }}>
              5. When did you start the Ministry? - எப்பொழுது ஊழியத்தைத் துவக்கினீர்கள்?
            </span>
            {renderDateBoxes(mh.ministryStartDate)}
          </div>
        </div>

        <div className="oaf-page-footer">
          <span>Apostolic Council of India Diocese</span>
          <span>Membership Application Form, Page 2/4</span>
        </div>
      </div>


      {/* ============================================================
          PAGE 3 OF 4: QUALIFICATIONS, FAMILY & MOTIVATION
          ============================================================ */}
      <div className="oaf-page" id="oaf-page-3">
        <div className="oaf-header" style={{ paddingBottom: '4px', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 900, margin: 0, textTransform: 'uppercase' }}>
            ACI Diocese Membership Application Form
          </h2>
        </div>

        {/* Ordination & Affiliation Intent */}
        <div style={{ marginBottom: '10px' }}>
          <div className="oaf-field-row" style={{ marginBottom: '4px' }}>
            <span className="oaf-field-label" style={{ minWidth: '380px', fontSize: '11.5px' }}>
              6. Do you want to be ordained by us? இந்தப் பேராயத்தால் பிரதிஷ்டை செய்யப்பட விரும்புகிறீர்களா?
            </span>
            <div style={{ display: 'flex', gap: '14px' }}>
              <span className="oaf-check-item">
                <span className="oaf-box-tick">{mh.wantOrdination === 'Yes' ? '✓' : ''}</span> Yes ஆம்
              </span>
              <span className="oaf-check-item">
                <span className="oaf-box-tick">{mh.wantOrdination === 'No' ? '✓' : ''}</span> No இல்லை
              </span>
            </div>
          </div>

          <div className="oaf-field-row">
            <span className="oaf-field-label" style={{ minWidth: '380px', fontSize: '11.5px' }}>
              7. Do you want to be affiliated with us? இந்தப் பேராயத்தின் அதிகாரப்பூர்வ இணைப்பைப் பெற விரும்புகிறீர்களா?
            </span>
            <div style={{ display: 'flex', gap: '14px' }}>
              <span className="oaf-check-item">
                <span className="oaf-box-tick">{mh.wantAffiliation === 'Yes' ? '✓' : ''}</span> Yes ஆம்
              </span>
              <span className="oaf-check-item">
                <span className="oaf-box-tick">{mh.wantAffiliation === 'No' ? '✓' : ''}</span> No இல்லை
              </span>
            </div>
          </div>
          <p style={{ fontSize: '9px', fontStyle: 'italic', margin: '2px 0 6px', color: '#444' }}>
            * If "Yes", please attach xerox copy of your ordination certificate. ஆம் என்றால் தங்களது பிரதிஷ்டை சான்றிதழின் நகலை இணைக்கவும்.
          </p>
        </div>

        {/* VI. Academic Qualification Table */}
        <div style={{ marginBottom: '10px' }}>
          <h4 className="oaf-section-heading">VI. Academic Qualification / கல்வித் தகுதி</h4>
          <table className="oaf-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>S.No<br />வ.எண்</th>
                <th>Examination Passed<br />தேர்ச்சி பெற்ற தேர்வு</th>
                <th style={{ width: '65px' }}>Year<br />வருடம்</th>
                <th>School / College / University<br />பள்ளி / கல்லூரி / பல்கலைக்கழகம்</th>
              </tr>
            </thead>
            <tbody>
              {q.academic && q.academic.length > 0 ? (
                q.academic.map((r, idx) => (
                  <tr key={r.id || idx}>
                    <td className="center">{idx + 1}</td>
                    <td><strong>{r.examinationPassed || '—'}</strong></td>
                    <td className="center">{r.year || '—'}</td>
                    <td>{r.institution || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="center">1</td>
                  <td>—</td>
                  <td className="center">—</td>
                  <td>—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* VII. Theological Qualification Table */}
        <div style={{ marginBottom: '10px' }}>
          <h4 className="oaf-section-heading">VII. Theological Qualification / இறையியல் தகுதி</h4>
          <table className="oaf-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>S.No<br />வ.எண்</th>
                <th>Examination Passed<br />தேர்ச்சி பெற்ற தேர்வு</th>
                <th style={{ width: '65px' }}>Year<br />வருடம்</th>
                <th>School / Seminary / University<br />பள்ளி / இறையியல் கல்லூரி / பல்கலைக்கழகம்</th>
              </tr>
            </thead>
            <tbody>
              {q.theological && q.theological.length > 0 ? (
                q.theological.map((r, idx) => (
                  <tr key={r.id || idx}>
                    <td className="center">{idx + 1}</td>
                    <td><strong>{r.examinationPassed || '—'}</strong></td>
                    <td className="center">{r.year || '—'}</td>
                    <td>{r.institution || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="center">1</td>
                  <td>—</td>
                  <td className="center">—</td>
                  <td>—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* VIII. Family Details Table */}
        <div style={{ marginBottom: '10px' }}>
          <h4 className="oaf-section-heading">VIII. Family Details / குடும்ப விவரங்கள்</h4>
          <table className="oaf-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>S.No<br />வ.எண்</th>
                <th>Name<br />பெயர்</th>
                <th style={{ width: '90px' }}>Date of Birth<br />பிறந்த தேதி</th>
                <th>Relationship<br />உறவு</th>
                <th>Profession / Education<br />தொழில் / படிப்பு</th>
              </tr>
            </thead>
            <tbody>
              {fam && fam.length > 0 ? (
                fam.map((r, idx) => (
                  <tr key={r.id || idx}>
                    <td className="center">{idx + 1}</td>
                    <td><strong>{r.name || '—'}</strong></td>
                    <td className="center">{r.dob || '—'}</td>
                    <td>{r.relationship || '—'}</td>
                    <td>{r.professionEducation || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="center">1</td>
                  <td>—</td>
                  <td className="center">—</td>
                  <td>—</td>
                  <td>—</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* IX. Motivation */}
        <div>
          <h4 className="oaf-section-heading">
            IX. What prompts you to join APOSTOLIC COUNCIL OF INDIA DIOCESE? / அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தில் இணையக் காரணம் என்ன?
          </h4>
          <div className="oaf-motivation-box">
            {mot.reasonToJoin || 'I am convinced and confirmed of my calling to serve the Lord under the episcopal guidance and doctrinal shepherding of the Apostolic Council of India Diocese.'}
          </div>
        </div>

        <div className="oaf-page-footer">
          <span>Apostolic Council of India Diocese</span>
          <span>Membership Application Form, Page 3/4</span>
        </div>
      </div>


      {/* ============================================================
          PAGE 4 OF 4: REFERENCES, STATUTORY DECLARATION & ENCLOSURES
          ============================================================ */}
      <div className="oaf-page" id="oaf-page-4">
        <div className="oaf-header" style={{ paddingBottom: '4px', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 900, margin: 0, textTransform: 'uppercase' }}>
            ACI Diocese Membership Application Form
          </h2>
        </div>

        {/* X. Details of Two References */}
        <div style={{ marginBottom: '10px' }}>
          <h4 className="oaf-section-heading">X. Details of two references (Must) / பரிந்துரை விவரங்கள் (அவசியம் தேவை)</h4>
          <p style={{ fontSize: '10.5px', margin: '0 0 6px' }}>
            Two Personal references of good standing members of ACI Diocese (அப்போஸ்தல கவுன்சில் ஆஃப் இந்தியா பேராயத்தின் இரண்டு அங்கத்தினர்களின் பரிந்துரைகள்)
          </p>

          {/* Reference 1 */}
          <div style={{ border: '1px solid #000', padding: '6px 8px', marginBottom: '8px', fontSize: '11.5px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              Reference 1. District overseer (Diocesan Member - if there is no DOS) / மாவட்ட மேற்பார்வையாளர்
            </div>
            <div style={{ display: 'flex', gap: '14px', marginBottom: '4px' }}>
              <span>I know this person since: <strong>{ref.ref1?.knownSince || '5 Years'}</strong></span>
              <span className="oaf-check-item">
                <span className="oaf-box-tick">{ref.ref1?.relationshipType === 'Personally' || !ref.ref1?.relationshipType ? '✓' : ''}</span> Personally நேரில்
              </span>
              <span className="oaf-check-item">
                <span className="oaf-box-tick">{ref.ref1?.relationshipType === 'Professionally' ? '✓' : ''}</span> Professionally ஊழிய ரீதியாக
              </span>
            </div>
            <div className="oaf-field-row">
              <span className="oaf-field-label">Name:</span>
              <span className="oaf-field-val"><strong>{ref.ref1?.name || '—'}</strong></span>
              <span className="oaf-field-label" style={{ marginLeft: '12px' }}>Signature:</span>
              <span className="oaf-field-val" style={{ maxWidth: '140px' }}>{ref.ref1?.name ? `[S/d ${ref.ref1.name}]` : '—'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '8px', marginTop: '4px' }}>
              <div>Diocesan ID No: <strong>{ref.ref1?.diocesanId || '—'}</strong></div>
              <div>Tel: <strong>{ref.ref1?.tel || '—'}</strong></div>
              <div>Mobile: <strong>{ref.ref1?.phone || '—'}</strong></div>
            </div>
          </div>

          {/* Reference 2 */}
          <div style={{ border: '1px solid #000', padding: '6px 8px', fontSize: '11.5px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              Reference 2. Taluk Co-ordinator (Diocesan Member - if there is no DOS) / தாலுகா ஒருங்கிணைப்பாளர்
            </div>
            <div style={{ display: 'flex', gap: '14px', marginBottom: '4px' }}>
              <span>I know this person since: <strong>{ref.ref2?.knownSince || '3 Years'}</strong></span>
              <span className="oaf-check-item">
                <span className="oaf-box-tick">{ref.ref2?.relationshipType === 'Personally' ? '✓' : ''}</span> Personally நேரில்
              </span>
              <span className="oaf-check-item">
                <span className="oaf-box-tick">{ref.ref2?.relationshipType === 'Professionally' || !ref.ref2?.relationshipType ? '✓' : ''}</span> Professionally ஊழிய ரீதியாக
              </span>
            </div>
            <div className="oaf-field-row">
              <span className="oaf-field-label">Name:</span>
              <span className="oaf-field-val"><strong>{ref.ref2?.name || '—'}</strong></span>
              <span className="oaf-field-label" style={{ marginLeft: '12px' }}>Signature:</span>
              <span className="oaf-field-val" style={{ maxWidth: '140px' }}>{ref.ref2?.name ? `[S/d ${ref.ref2.name}]` : '—'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '8px', marginTop: '4px' }}>
              <div>Diocesan ID No: <strong>{ref.ref2?.diocesanId || '—'}</strong></div>
              <div>Tel: <strong>{ref.ref2?.tel || '—'}</strong></div>
              <div>Mobile: <strong>{ref.ref2?.phone || '—'}</strong></div>
            </div>
          </div>
        </div>

        {/* XI. Disclaimer and Statutory Signature */}
        <div style={{ border: '1.5px solid #000', padding: '8px 10px', marginBottom: '10px' }}>
          <div className="oaf-office-header" style={{ margin: '0 0 6px', background: '#000000' }}>
            XI. Disclaimer and Signature / உறுதிமொழி மற்றும் கையெழுத்து
          </div>
          <p style={{ fontSize: '10.5px', lineHeight: '1.4', margin: '0 0 6px' }}>
            I hereby declare that the information furnished above is true to the best of my knowledge. I am fully in agreement with the Faith Statement of ACI Diocese. I understand that this is the united Ministry and I shall give attention to this ministry apart from my church ministry. I shall abide by the terms and conditions of ACI Diocese, in force from time to time.
          </p>
          <p style={{ fontSize: '10px', lineHeight: '1.4', margin: 0 }}>
            மேலே குறிப்பிட்டுள்ள தகவல்கள் எல்லாம் உண்மை என்றும், இந்தப் பேராயத்தின் விசுவாச அறிக்கையை முழுமையாக சம்மதிக்கிறேன் என்றும், இந்த ஐக்கியத்தின் ஊழியத்தைப் புரிந்துகொண்டு, எனது தனிப்பட்ட ஊழியத்தின் மத்தியிலும், இதில் கவனம் செலுத்துவேன் என்றும், காலத்திற்கேற்ப தேவையான பேராயத்தின் விதிகளையும், நிபந்தனைகளையும் ஏற்றுக் கொள்வேன் என்றும் உறுதி கூறுகிறேன்.
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '14px', fontSize: '11px' }}>
            <div>
              <div><strong>Place / இடம்:</strong> {dec.place || 'Tamil Nadu'}</div>
              <div style={{ marginTop: '2px' }}><strong>Date / தேதி:</strong> {dec.date || p.applicationDate || '2026-08-26'}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #000', width: '200px', paddingBottom: '2px', fontWeight: 'bold', fontSize: '12px' }}>
                {fullName || 'DIGITAL CONFIRMATION'}
              </div>
              <span style={{ fontSize: '9.5px' }}>Applicant's Signature / விண்ணப்பதாரரின் கையொப்பம்</span>
            </div>
          </div>
        </div>

        {/* XII. Enclosures to be attached */}
        <div>
          <h4 className="oaf-section-heading" style={{ margin: '4px 0' }}>
            XII. Enclosures to be attached / இணைக்க வேண்டிய இணைப்புகள்
          </h4>
          <ol style={{ fontSize: '10px', paddingLeft: '18px', margin: 0, lineHeight: '1.4' }}>
            <li>Proof of Identity / அடையாளச் சான்று (Driving License / Passport / Voter ID / Ration Card / Aadhaar) {enc.proofIdentity ? '☑ [Attached]' : '☐'}</li>
            <li>Proof of Address / வீட்டு முகவரிச் சான்று (Ration Card / Aadhaar / Resident Cert / Affidavit / DL) {enc.proofAddress ? '☑ [Attached]' : '☐'}</li>
            <li>Proof of Date of Birth / பிறந்த தேதிக்கான சான்று (TC / 10th, 12th Marksheet / DL / Passport) {enc.proofDob ? '☑ [Attached]' : '☐'}</li>
            <li>Proof of Name Change / பெயர் மாற்றத்திற்கான சான்று (Baptism Certificate / Affidavit)</li>
            <li>Two Copies of recent passport size photos / சமீபத்தில் எடுத்த இரண்டு புகைப்படங்கள் {p.photoUrl ? '☑ [Provided]' : '☐'}</li>
            <li>Your Ministry Statement / தங்களது ஊழியத்தை பற்றிய விளக்கம் (One-page summary) {enc.ministryStatement ? '☑ [Attached]' : '☐'}</li>
            <li>Your Ministry or Church Photo / தங்களது ஊழியம் / சபையின் புகைப்படம் {enc.churchPhoto ? '☑ [Attached]' : '☐'}</li>
            <li>Ordination Certificate copy / பிரதிஷ்டை சான்றிதழ் நகல் (if applying for affiliation) {enc.ordinationCertificate ? '☑ [Attached]' : '☐'}</li>
          </ol>
          <p style={{ fontSize: '9px', fontStyle: 'italic', margin: '4px 0 0', fontWeight: 'bold' }}>
            Note : This application is valid for one month from the date of issued. / குறிப்பு : இந்த விண்ணப்பம் உங்களுக்கு வழங்கப்பட்ட தேதியிலிருந்து ஒரு மாதத்திற்குள் அனுப்பிவிட்டால் செல்லுபடியாகும்.
          </p>
        </div>

        <div className="oaf-page-footer">
          <span>Apostolic Council of India Diocese</span>
          <span>Membership Application Form, Page 4/4</span>
        </div>
      </div>

    </div>
  )
}
