import React from 'react'
import { PrintIcon, ArrowLeftIcon, CheckIcon } from '../Icons/SvgIcons'
import './FilledApplicationPdf.css'

export default function FilledApplicationPdf({ data, onEdit, isTa = false }) {
  const handlePrint = () => {
    window.print()
  }

  const p = data.personal || {}
  const perm = p.permanentAddress || {}
  const contact = p.contactAddressSameAsPermanent ? perm : (p.contactAddress || {})
  const sp = data.spiritual || {}
  const aff = data.affiliation || {}
  const ch = data.church || {}
  const mh = data.ministryHistory || {}
  const q = data.qualifications || { academic: [], theological: [] }
  const fam = data.family || []
  const mot = data.motivation || {}
  const ref = data.references || {}
  const dec = data.declaration || {}

  return (
    <div className="filled-pdf-viewer">

      {/* Action Toolbar */}
      <div className="pdf-toolbar">
        <div>
          <h3 className="pdf-toolbar-title">
            📄 {isTa ? 'அதிகாரப்பூர்வ பேராய விண்ணப்பப் படிவம் (முழுமையாக நிரப்பப்பட்டது)' : 'Official Diocesan Membership Application (Filled Form)'}
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748b', margin: '2px 0 0' }}>
            {isTa ? 'கீழே உள்ள அச்சு / பதிவிறக்க பொத்தானைப் பயன்படுத்தி PDF ஆக சேமிக்கலாம்.' : 'Ready to print or save as PDF matching the official 4-page template.'}
          </p>
        </div>

        <div className="pdf-toolbar-actions">
          <button type="button" onClick={onEdit} className="pdf-edit-btn">
            <ArrowLeftIcon size={13} />
            <span>{isTa ? 'விவரங்களை திருத்த' : 'Edit Application'}</span>
          </button>

          <button type="button" onClick={handlePrint} className="pdf-print-btn">
            <PrintIcon size={15} color="#ffffff" />
            <span>{isTa ? 'படிவத்தை அச்சிடுக / PDF சேமி' : 'Print / Save as PDF'}</span>
          </button>
        </div>
      </div>

      {/* 4-Page Sheet Container */}
      <div className="pdf-sheets-container">

        {/* ============================================================
            PAGE 1 OF 4: PERSONAL DETAILS
            ============================================================ */}
        <div className="pdf-page-sheet">
          <div className="pdf-header-top">
            <img src="/aci-logo.png" alt="ACI Seal" className="pdf-logo-crest" onError={(e) => { e.target.src = '/aci-logo.jpg' }} />
            <h1 className="pdf-main-heading">APOSTOLIC COUNCIL OF INDIA DIOCESE</h1>
            <p className="pdf-reg-sub">Registered Under Indian Trust Act 1882 • Regd No: 62/B.k.4/2013</p>
            <p className="pdf-addr-sub">1/153, Melapatty, Hanumantharayankottai, Dindigul District, Tamil Nadu - 624 002, India.</p>
            <p className="pdf-addr-sub">Phone: 0451 2490100 • Email: info@acidiocese.org / rev.johnsondurai@gmail.com</p>
          </div>

          <div className="pdf-doc-title-row">
            <h2 className="pdf-doc-title">DIOCESAN MEMBERSHIP APPLICATION FORM</h2>
            <p className="pdf-doc-sub-ta">பேராய உறுப்பினர் விண்ணப்பப் படிவம்</p>
          </div>

          {/* Office Use & Photo Frame Box */}
          <div className="pdf-office-box">
            <div>
              <div className="pdf-office-title">FOR OFFICE USE ONLY / அலுவலகப் பணிக்கு மட்டும்</div>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '6px', fontSize: '11px', marginTop: '6px' }}>
                <div><strong>Application Number:</strong></div>
                <div>002093 / ACI-2026</div>
                <div><strong>Application Received on:</strong></div>
                <div>{p.applicationDate || new Date().toISOString().split('T')[0]}</div>
                <div><strong>Application Approved on:</strong></div>
                <div>[ OFFICIAL REVIEW PENDING ]</div>
                <div><strong>Membership Code:</strong></div>
                <div>[ TO BE ASSIGNED BY SYNOD ]</div>
              </div>
            </div>

            <div className="pdf-photo-frame">
              {p.photoUrl ? (
                <img src={p.photoUrl} alt="Applicant" className="pdf-photo-img" />
              ) : (
                <>
                  <span>Affix Recent Passport size Photo</span>
                  <span style={{ fontSize: '8px', color: '#666', marginTop: '4px' }}>To be Self attested</span>
                </>
              )}
            </div>
          </div>

          <div className="pdf-section-title-bar">
            APPLICANT'S INFORMATIONS / விண்ணப்பதாரரின் தகவல்கள் • Application Date: {p.applicationDate || '—'}
          </div>

          <div style={{ marginTop: '12px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '8px' }}>
              I. Personal Details / சுய விவரங்கள்
            </h4>

            <div className="pdf-field-row">
              <span className="pdf-field-label">Name / பெயர்:</span>
              <span className="pdf-field-val"><strong>{p.salutation} {p.name || '—'}</strong></span>
            </div>

            <div className="pdf-field-row">
              <span className="pdf-field-label">Baptismal Name / ஞானஸ்நானப் பெயர்:</span>
              <span className="pdf-field-val">{p.baptismalName || '—'}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="pdf-field-row">
                <span className="pdf-field-label" style={{ minWidth: '110px' }}>Date of Birth:</span>
                <span className="pdf-field-val">{p.dob || '—'}</span>
              </div>
              <div className="pdf-field-row">
                <span className="pdf-field-label" style={{ minWidth: '100px' }}>Nationality:</span>
                <span className="pdf-field-val">{p.nationality || 'Indian'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="pdf-field-row">
                <span className="pdf-field-label" style={{ minWidth: '110px' }}>Gender / பாலினம்:</span>
                <span className="pdf-field-val">{p.gender || '—'}</span>
              </div>
              <div className="pdf-field-row">
                <span className="pdf-field-label" style={{ minWidth: '100px' }}>Marital Status:</span>
                <span className="pdf-field-val">{p.maritalStatus || '—'}</span>
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <strong>Permanent Address / நிரந்தர முகவரி:</strong>
              <div className="pdf-field-val" style={{ margin: '4px 0 10px', padding: '4px' }}>
                {[perm.doorNo, perm.streetName, perm.cityTown, perm.taluk, perm.district, perm.state, perm.pincode, perm.country].filter(Boolean).join(', ') || '—'}
              </div>
            </div>

            <div>
              <strong>Contact Address / தொடர்பு முகவரி:</strong>
              <div className="pdf-field-val" style={{ margin: '4px 0 10px', padding: '4px' }}>
                {[contact.doorNo, contact.streetName, contact.cityTown, contact.taluk, contact.district, contact.state, contact.pincode, contact.country].filter(Boolean).join(', ') || '—'}
              </div>
            </div>
          </div>

          <div className="pdf-footer-bar">
            <span>Apostolic Council of India Diocese</span>
            <span>Membership Application Form, Page 1/4</span>
          </div>
        </div>


        {/* ============================================================
            PAGE 2 OF 4: SPIRITUAL INFO, AFFILIATION & CHURCH DETAILS
            ============================================================ */}
        <div className="pdf-page-sheet">
          <div className="pdf-header-top" style={{ paddingBottom: '6px', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>
              ACI - Diocese Membership Application Form
            </h3>
          </div>

          {/* II. Spiritual Informations */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '8px' }}>
              II. Spiritual Informations / ஆவிக்குரிய தகவல்கள்
            </h4>
            <p style={{ fontSize: '11.5px', margin: '0 0 6px' }}>
              Please specify by selecting current ministry function / தாங்கள் செய்யும் ஊழியத்தை குறிப்பிடவும்:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', fontSize: '12px' }}>
              {['Apostle', 'Prophet', 'Pastor', 'Teacher', 'Evangelist', 'Associate Pastor'].map((role) => (
                <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ border: '1px solid #000', width: '13px', height: '13px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                    {sp.ministryFunction === role ? '✓' : ''}
                  </span>
                  <span>{role}</span>
                </div>
              ))}
            </div>
            {sp.ministryFunction === 'Other Ministry' && (
              <div className="pdf-field-row" style={{ marginTop: '6px' }}>
                <span className="pdf-field-label">Other Ministry:</span>
                <span className="pdf-field-val">{sp.otherMinistrySpecify || 'Specified Other Ministry'}</span>
              </div>
            )}
          </div>

          {/* III. Affiliation */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '8px' }}>
              III. Affiliation / பேராயம், நிறுவனம், ஐக்கிய இணைப்பு
            </h4>
            <div className="pdf-field-row">
              <span className="pdf-field-label">Affiliation Status:</span>
              <span className="pdf-field-val">{aff.affiliationType || 'Independent Church'}</span>
            </div>
            {aff.founderName && (
              <div className="pdf-field-row">
                <span className="pdf-field-label">Founder's Name:</span>
                <span className="pdf-field-val">{aff.founderName}</span>
              </div>
            )}
            {aff.denominationSpecify && (
              <div className="pdf-field-row">
                <span className="pdf-field-label">Denomination:</span>
                <span className="pdf-field-val">{aff.denominationSpecify}</span>
              </div>
            )}
            {aff.trustName && (
              <div className="pdf-field-row">
                <span className="pdf-field-label">Name of Your Trust:</span>
                <span className="pdf-field-val">{aff.trustName}</span>
              </div>
            )}
          </div>

          {/* IV. Church Details */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '8px' }}>
              IV. Church Details / சபையின் விவரங்கள்
            </h4>
            <div className="pdf-field-row">
              <span className="pdf-field-label">Church Name:</span>
              <span className="pdf-field-val"><strong>{ch.churchName || '—'}</strong></span>
            </div>
            <div className="pdf-field-row">
              <span className="pdf-field-label">Church Address:</span>
              <span className="pdf-field-val">
                {[ch.doorNo, ch.streetName, ch.cityTown, ch.taluk, ch.district, ch.state, ch.pincode].filter(Boolean).join(', ') || '—'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="pdf-field-row">
                <span className="pdf-field-label" style={{ minWidth: '100px' }}>Mobile No:</span>
                <span className="pdf-field-val">{ch.mobileNumber || '—'}</span>
              </div>
              <div className="pdf-field-row">
                <span className="pdf-field-label" style={{ minWidth: '100px' }}>Telephone:</span>
                <span className="pdf-field-val">{ch.telephone || '— (Optional)'}</span>
              </div>
            </div>
            <div className="pdf-field-row">
              <span className="pdf-field-label">Email ID:</span>
              <span className="pdf-field-val">{ch.emailId || '—'}</span>
            </div>
          </div>

          {/* V. Spiritual Milestones */}
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '8px' }}>
              V. Spiritual Milestones & Calling Dates / ஆவிக்குரிய மைல்கற்கள்
            </h4>
            <div className="pdf-field-row">
              <span className="pdf-field-label">1. Born Again Date:</span>
              <span className="pdf-field-val">{mh.bornAgainDate || '—'}</span>
            </div>
            <div className="pdf-field-row">
              <span className="pdf-field-label">2. Water Baptism (Full Immersion):</span>
              <span className="pdf-field-val">{mh.waterBaptismDate || '—'}</span>
            </div>
            <div className="pdf-field-row">
              <span className="pdf-field-label">3. Filled with Holy Spirit:</span>
              <span className="pdf-field-val">{mh.holySpiritBaptismDate || '—'}</span>
            </div>
            <div className="pdf-field-row">
              <span className="pdf-field-label">4. Called for Ministry:</span>
              <span className="pdf-field-val">{mh.callingDate || '—'}</span>
            </div>
            <div className="pdf-field-row">
              <span className="pdf-field-label">5. Started Active Ministry:</span>
              <span className="pdf-field-val">{mh.ministryStartDate || '—'}</span>
            </div>
          </div>

          <div className="pdf-footer-bar">
            <span>Apostolic Council of India Diocese</span>
            <span>Membership Application Form, Page 2/4</span>
          </div>
        </div>


        {/* ============================================================
            PAGE 3 OF 4: QUALIFICATIONS, FAMILY & MOTIVATION
            ============================================================ */}
        <div className="pdf-page-sheet">
          <div className="pdf-header-top" style={{ paddingBottom: '6px', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>
              ACI Diocese Membership Application Form
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
            <div className="pdf-field-row">
              <span className="pdf-field-label" style={{ minWidth: '190px' }}>6. Do you want to be Ordained by us?</span>
              <span className="pdf-field-val"><strong>{mh.wantOrdination || 'Yes'}</strong></span>
            </div>
            <div className="pdf-field-row">
              <span className="pdf-field-label" style={{ minWidth: '190px' }}>7. Do you want to be Affiliated with us?</span>
              <span className="pdf-field-val"><strong>{mh.wantAffiliation || 'No'}</strong></span>
            </div>
          </div>

          {/* VI. Academic Qualifications */}
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ fontSize: '12.5px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '4px' }}>
              VI. Academic Qualification / கல்வித் தகுதி
            </h4>
            <table className="pdf-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>S.No</th>
                  <th>Examination Passed</th>
                  <th style={{ width: '70px' }}>Year</th>
                  <th>School / College / University</th>
                </tr>
              </thead>
              <tbody>
                {q.academic.length > 0 ? (
                  q.academic.map((row, idx) => (
                    <tr key={row.id || idx}>
                      <td>{idx + 1}</td>
                      <td>{row.examinationPassed || '—'}</td>
                      <td>{row.year || '—'}</td>
                      <td>{row.institution || '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: '#888' }}>No entries provided</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* VII. Theological Qualifications */}
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ fontSize: '12.5px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '4px' }}>
              VII. Theological Qualification / இறையியல் தகுதி
            </h4>
            <table className="pdf-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>S.No</th>
                  <th>Course / Degree Passed</th>
                  <th style={{ width: '70px' }}>Year</th>
                  <th>School / Seminary / University</th>
                </tr>
              </thead>
              <tbody>
                {q.theological.length > 0 ? (
                  q.theological.map((row, idx) => (
                    <tr key={row.id || idx}>
                      <td>{idx + 1}</td>
                      <td>{row.examinationPassed || '—'}</td>
                      <td>{row.year || '—'}</td>
                      <td>{row.institution || '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: '#888' }}>No theological qualification entries</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* VIII. Family Details */}
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ fontSize: '12.5px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '4px' }}>
              VIII. Family Details / குடும்ப விவரங்கள்
            </h4>
            <table className="pdf-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>S.No</th>
                  <th>Name</th>
                  <th style={{ width: '90px' }}>Date of Birth</th>
                  <th>Applicant's Relationship</th>
                  <th>Profession / Education</th>
                </tr>
              </thead>
              <tbody>
                {fam.length > 0 ? (
                  fam.map((row, idx) => (
                    <tr key={row.id || idx}>
                      <td>{idx + 1}</td>
                      <td>{row.name || '—'}</td>
                      <td>{row.dob || '—'}</td>
                      <td>{row.relationship || '—'}</td>
                      <td>{row.professionEducation || '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>No family entries recorded</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* IX. Motivation */}
          <div>
            <h4 style={{ fontSize: '12.5px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '4px' }}>
              IX. What prompts you to join APOSTOLIC COUNCIL OF INDIA DIOCESE?
            </h4>
            <div style={{ border: '1px solid #000', padding: '8px 10px', minHeight: '60px', fontSize: '12px', lineHeight: '1.5' }}>
              {mot.reasonToJoin || 'Seeking spiritual shelter, episcopal fellowship and doctrinal shepherding under Apostolic Council of India Diocese.'}
            </div>
          </div>

          <div className="pdf-footer-bar">
            <span>Apostolic Council of India Diocese</span>
            <span>Membership Application Form, Page 3/4</span>
          </div>
        </div>


        {/* ============================================================
            PAGE 4 OF 4: REFERENCES, DECLARATION & ENCLOSURES
            ============================================================ */}
        <div className="pdf-page-sheet">
          <div className="pdf-header-top" style={{ paddingBottom: '6px', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, textTransform: 'uppercase' }}>
              ACI Diocese Membership Application Form
            </h3>
          </div>

          {/* X. Details of Two References */}
          <div style={{ marginBottom: '14px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '6px' }}>
              X. Details of two references (Must) / பரிந்துரை விவரங்கள்
            </h4>

            {/* Ref 1 */}
            <div style={{ border: '1px solid #cbd5e1', padding: '6px 10px', marginBottom: '8px', fontSize: '12px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                Reference 1: District Overseer (Diocesan Member)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>Name: <strong>{ref.ref1?.name || '—'}</strong></div>
                <div>Diocesan ID: <strong>{ref.ref1?.diocesanId || '—'}</strong></div>
                <div>Phone: <strong>{ref.ref1?.phone || '—'}</strong></div>
                <div>Known Since: <strong>{ref.ref1?.knownSince || '—'} ({ref.ref1?.relationshipType || 'Personally'})</strong></div>
              </div>
            </div>

            {/* Ref 2 */}
            <div style={{ border: '1px solid #cbd5e1', padding: '6px 10px', fontSize: '12px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                Reference 2: Taluk Co-ordinator (Diocesan Member)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>Name: <strong>{ref.ref2?.name || '—'}</strong></div>
                <div>Diocesan ID: <strong>{ref.ref2?.diocesanId || '—'}</strong></div>
                <div>Phone: <strong>{ref.ref2?.phone || '—'}</strong></div>
                <div>Known Since: <strong>{ref.ref2?.knownSince || '—'} ({ref.ref2?.relationshipType || 'Professionally'})</strong></div>
              </div>
            </div>
          </div>

          {/* XI. Disclaimer and Statutory Signature */}
          <div style={{ border: '1.5px solid #000', padding: '10px 14px', marginBottom: '14px' }}>
            <div className="pdf-office-title" style={{ margin: '0 0 6px' }}>
              Disclaimer and Signature / உறுதிமொழி மற்றும் கையெழுத்து
            </div>
            <p style={{ fontSize: '11px', lineHeight: '1.4', margin: '0 0 6px' }}>
              I hereby declare that the information furnished above is true to the best of my knowledge. I am fully in agreement with the Faith Statement of ACI Diocese. I understand that this is the united Ministry and I shall give attention to this ministry apart from my church ministry. I shall abide by the terms and conditions of ACI Diocese, in force from time to time.
            </p>
            <p style={{ fontSize: '10.5px', lineHeight: '1.4', margin: 0 }}>
              மேலே குறிப்பிட்டுள்ள தகவல்கள் எல்லாம் உண்மை என்றும், இந்தப் பேராயத்தின் விசுவாச அறிக்கையை முழுமையாக சம்மதிக்கிறேன் என்றும், இந்த ஐக்கியத்தின் ஊழியத்தைப் புரிந்துகொண்டு, எனது தனிப்பட்ட ஊழியத்தின் மத்தியிலும், இதில் கவனம் செலுத்துவேன் என்றும் உறுதி கூறுகிறேன்.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px', fontSize: '11.5px' }}>
              <div>
                <div><strong>Place / இடம்:</strong> {dec.place || 'Tamil Nadu'}</div>
                <div style={{ marginTop: '4px' }}><strong>Date / தேதி:</strong> {dec.date || p.applicationDate || '—'}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ borderBottom: '1px solid #000', width: '180px', paddingBottom: '2px', fontWeight: 'bold' }}>
                  {p.salutation} {p.name || 'Digital Confirmation'}
                </div>
                <span style={{ fontSize: '10px' }}>Applicant's Signature / விண்ணப்பதாரரின் கையொப்பம்</span>
              </div>
            </div>
          </div>

          {/* XII. Enclosures List */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '4px' }}>
              Enclosures to be attached / இணைக்க வேண்டிய இணைப்புகள்
            </h4>
            <ol style={{ fontSize: '10.5px', paddingLeft: '18px', margin: 0, lineHeight: '1.45' }}>
              <li>Proof of Identity / அடையாளச் சான்று (Driving License / Passport / Voter ID / Ration Card / Aadhaar)</li>
              <li>Proof of Address / வீட்டு முகவரிச் சான்று (Ration Card / Aadhaar / Resident Cert / Affidavit / DL)</li>
              <li>Proof of Date of Birth / பிறந்த தேதிக்கான சான்று (TC / 10th, 12th Marksheet / DL / Passport)</li>
              <li>Proof of Name Change / பெயர் மாற்றத்திற்கான சான்று (Baptism Certificate / Affidavit)</li>
              <li>Two Copies of recent passport size photos / சமீபத்தில் எடுத்த இரண்டு புகைப்படங்கள்</li>
              <li>Your Ministry Statement / தங்களது ஊழியத்தை பற்றிய விளக்கம் (One-page summary)</li>
              <li>Your Ministry or Church Photo / தங்களது ஊழியம் / சபையின் புகைப்படம்</li>
              <li>Ordination Certificate copy / பிரதிஷ்டை சான்றிதழ் நகல் (if applying for affiliation)</li>
            </ol>
          </div>

          <div className="pdf-footer-bar">
            <span>Note: This application is valid for one month from the date of issue.</span>
            <span>Apostolic Council of India Diocese, Membership Application Form, Page 4/4</span>
          </div>
        </div>

      </div>

    </div>
  )
}
