import React from 'react'
import {
  FORM_CANVAS,
  PAGE_1_FIELDS,
  PAGE_2_FIELDS,
  PAGE_3_FIELDS,
  PAGE_4_FIELDS,
} from '../../data/officialFormLayout'
import './OfficialApplicationForm.css'

const toLeft = (x) => `${(x / FORM_CANVAS.width) * 100}%`
const toTop = (y) => `${(y / FORM_CANVAS.height) * 100}%`
const toWidth = (w) => `${(w / FORM_CANVAS.width) * 100}%`
const toHeight = (h) => `${(h / FORM_CANVAS.height) * 100}%`

// Render Character-by-Character in exact boxes
function renderBoxedChars(text, startX, y, boxW, boxH, count) {
  const chars = (text || '').toUpperCase().replace(/[^A-Z0-9\s\.\-]/g, '').slice(0, count).split('')
  while (chars.length < count) {
    chars.push('')
  }

  const totalW = boxW * count

  return (
    <div
      className="oaf-boxed-row"
      style={{
        left: toLeft(startX),
        top: toTop(y),
        width: toWidth(totalW),
        height: toHeight(boxH),
      }}
    >
      {chars.map((char, idx) => (
        <span
          key={idx}
          className="oaf-char-cell"
          style={{
            width: `${(1 / count) * 100}%`,
            height: '100%',
          }}
        >
          {char || ''}
        </span>
      ))}
    </div>
  )
}

// Render Date String (YYYY-MM-DD) into segmented boxes
function renderSegmentedDate(dateStr, dayCoords, monthCoords, yearCoords) {
  if (!dateStr) return null
  const parts = dateStr.split('-') // [YYYY, MM, DD]
  const yyyy = parts[0] || ''
  const mm = parts[1] || ''
  const dd = parts[2] || ''

  return (
    <>
      {dayCoords && renderBoxedChars(dd, dayCoords.startX, dayCoords.y, dayCoords.boxW, dayCoords.boxH, 2)}
      {monthCoords && renderBoxedChars(mm, monthCoords.startX, monthCoords.y, monthCoords.boxW, monthCoords.boxH, 2)}
      {yearCoords && renderBoxedChars(yyyy, yearCoords.startX, yearCoords.y, yearCoords.boxW, yearCoords.boxH, 4)}
    </>
  )
}

// Render 8-digit continuous Date (DDMMYYYY)
function renderDate8(dateStr, startX, y, boxW, boxH) {
  if (!dateStr) return null
  const parts = dateStr.split('-') // [YYYY, MM, DD]
  const formatted = `${parts[2] || ''}${parts[1] || ''}${parts[0] || ''}`
  return renderBoxedChars(formatted, startX, y, boxW, boxH, 8)
}

// Render Checkmark inside original Checkbox square
function renderCheck(checked, x, y, size = 24) {
  if (!checked) return null
  return (
    <div
      className="oaf-check-mark"
      style={{
        left: toLeft(x),
        top: toTop(y),
        width: toWidth(size),
        height: toHeight(size),
      }}
    >
      ✓
    </div>
  )
}

// Render single text value on line
function renderLine(text, x, y, width = 300) {
  if (!text) return null
  return (
    <div
      className="oaf-text-line"
      style={{
        left: toLeft(x),
        top: toTop(y),
        width: toWidth(width),
      }}
    >
      {text}
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

  // Name without salutation in boxes, or with salutation
  const fullName = [p.salutation, p.name].filter(Boolean).join(' ').toUpperCase()

  return (
    <div className={`oaf-document-container ${isMini ? 'is-mini' : ''}`}>

      {/* ============================================================
          PAGE 1 OF 4: APPLICANT INFORMATION & ADDRESS
          ============================================================ */}
      <div className="oaf-page-canvas" id="official-page-1">
        <img
          src="/official-forms/page_1.png"
          alt="ACI Application Page 1 Template"
          className="oaf-template-bg"
        />

        <div className="oaf-dynamic-layer">
          {/* Issue Date on Top Right */}
          {renderLine(p.applicationDate || '2026-08-26', PAGE_1_FIELDS.issueDate.x + 10, PAGE_1_FIELDS.issueDate.y + 16, 110)}

          {/* Office Use Received Date (8 boxes) */}
          {renderDate8(p.applicationDate || '2026-08-26', PAGE_1_FIELDS.officeReceivedDate.startX, PAGE_1_FIELDS.officeReceivedDate.y, PAGE_1_FIELDS.officeReceivedDate.boxW, PAGE_1_FIELDS.officeReceivedDate.boxH)}

          {/* Passport Photo Box (Top Right) */}
          {p.photoUrl && (
            <div
              className="oaf-photo-container"
              style={{
                left: toLeft(PAGE_1_FIELDS.photo.x),
                top: toTop(PAGE_1_FIELDS.photo.y),
                width: toWidth(PAGE_1_FIELDS.photo.width),
                height: toHeight(PAGE_1_FIELDS.photo.height),
              }}
            >
              <img src={p.photoUrl} alt="Applicant Passport Photo" />
            </div>
          )}

          {/* 1. Full Name in Character Boxes (ONE single location) */}
          {renderBoxedChars(fullName, PAGE_1_FIELDS.name.startX, PAGE_1_FIELDS.name.y, PAGE_1_FIELDS.name.boxW, PAGE_1_FIELDS.name.boxH, PAGE_1_FIELDS.name.count)}

          {/* 2. Baptismal Name in Character Boxes */}
          {renderBoxedChars(p.baptismalName, PAGE_1_FIELDS.baptismalName.startX, PAGE_1_FIELDS.baptismalName.y, PAGE_1_FIELDS.baptismalName.boxW, PAGE_1_FIELDS.baptismalName.boxH, PAGE_1_FIELDS.baptismalName.count)}

          {/* 3. Date of Birth (Date 2 + Month 2 + Year 4) */}
          {renderSegmentedDate(p.dob, PAGE_1_FIELDS.dobDay, PAGE_1_FIELDS.dobMonth, PAGE_1_FIELDS.dobYear)}

          {/* 4. Nationality in Character Boxes */}
          {renderBoxedChars(p.nationality || 'INDIAN', PAGE_1_FIELDS.nationality.startX, PAGE_1_FIELDS.nationality.y, PAGE_1_FIELDS.nationality.boxW, PAGE_1_FIELDS.nationality.boxH, PAGE_1_FIELDS.nationality.count)}

          {/* 5. Gender Checkboxes */}
          {renderCheck(p.gender === 'Male', PAGE_1_FIELDS.genderMale.x, PAGE_1_FIELDS.genderMale.y, PAGE_1_FIELDS.genderMale.size)}
          {renderCheck(p.gender === 'Female', PAGE_1_FIELDS.genderFemale.x, PAGE_1_FIELDS.genderFemale.y, PAGE_1_FIELDS.genderFemale.size)}

          {/* 6. Marital Status Checkboxes */}
          {renderCheck(p.maritalStatus === 'Married', PAGE_1_FIELDS.maritalMarried.x, PAGE_1_FIELDS.maritalMarried.y, PAGE_1_FIELDS.maritalMarried.size)}
          {renderCheck(p.maritalStatus === 'Bachelor', PAGE_1_FIELDS.maritalBachelor.x, PAGE_1_FIELDS.maritalBachelor.y, PAGE_1_FIELDS.maritalBachelor.size)}
          {renderCheck(p.maritalStatus === 'Spinster', PAGE_1_FIELDS.maritalSpinster.x, PAGE_1_FIELDS.maritalSpinster.y, PAGE_1_FIELDS.maritalSpinster.size)}
          {renderCheck(p.maritalStatus === 'Widowed', PAGE_1_FIELDS.maritalWidowed.x, PAGE_1_FIELDS.maritalWidowed.y, PAGE_1_FIELDS.maritalWidowed.size)}

          {/* 7. Permanent Address */}
          {renderLine(perm.doorNo, PAGE_1_FIELDS.permDoorNo.x, PAGE_1_FIELDS.permDoorNo.y, PAGE_1_FIELDS.permDoorNo.width)}
          {renderLine(perm.streetName, PAGE_1_FIELDS.permStreet.x, PAGE_1_FIELDS.permStreet.y, PAGE_1_FIELDS.permStreet.width)}
          {renderLine(perm.cityTown, PAGE_1_FIELDS.permCity.x, PAGE_1_FIELDS.permCity.y, PAGE_1_FIELDS.permCity.width)}
          {renderBoxedChars(perm.pincode, PAGE_1_FIELDS.permPincode.startX, PAGE_1_FIELDS.permPincode.y, PAGE_1_FIELDS.permPincode.boxW, PAGE_1_FIELDS.permPincode.boxH, 6)}
          {renderLine(perm.taluk, PAGE_1_FIELDS.permTaluk.x, PAGE_1_FIELDS.permTaluk.y, PAGE_1_FIELDS.permTaluk.width)}
          {renderLine(perm.district, PAGE_1_FIELDS.permDistrict.x, PAGE_1_FIELDS.permDistrict.y, PAGE_1_FIELDS.permDistrict.width)}
          {renderLine(perm.state, PAGE_1_FIELDS.permState.x, PAGE_1_FIELDS.permState.y, PAGE_1_FIELDS.permState.width)}
          {renderLine(perm.country || 'India', PAGE_1_FIELDS.permCountry.x, PAGE_1_FIELDS.permCountry.y, PAGE_1_FIELDS.permCountry.width)}

          {/* 8. Contact Address */}
          {renderLine(contact.doorNo, PAGE_1_FIELDS.contactDoorNo.x, PAGE_1_FIELDS.contactDoorNo.y, PAGE_1_FIELDS.contactDoorNo.width)}
          {renderLine(contact.streetName, PAGE_1_FIELDS.contactStreet.x, PAGE_1_FIELDS.contactStreet.y, PAGE_1_FIELDS.contactStreet.width)}
          {renderLine(contact.cityTown, PAGE_1_FIELDS.contactCity.x, PAGE_1_FIELDS.contactCity.y, PAGE_1_FIELDS.contactCity.width)}
          {renderBoxedChars(contact.pincode, PAGE_1_FIELDS.contactPincode.startX, PAGE_1_FIELDS.contactPincode.y, PAGE_1_FIELDS.contactPincode.boxW, PAGE_1_FIELDS.contactPincode.boxH, 6)}
          {renderLine(contact.taluk, PAGE_1_FIELDS.contactTaluk.x, PAGE_1_FIELDS.contactTaluk.y, PAGE_1_FIELDS.contactTaluk.width)}
          {renderLine(contact.district, PAGE_1_FIELDS.contactDistrict.x, PAGE_1_FIELDS.contactDistrict.y, PAGE_1_FIELDS.contactDistrict.width)}
          {renderLine(contact.state, PAGE_1_FIELDS.contactState.x, PAGE_1_FIELDS.contactState.y, PAGE_1_FIELDS.contactState.width)}
          {renderLine(contact.country || 'India', PAGE_1_FIELDS.contactCountry.x, PAGE_1_FIELDS.contactCountry.y, PAGE_1_FIELDS.contactCountry.width)}
        </div>
      </div>

      {/* ============================================================
          PAGE 2 OF 4: SPIRITUAL INFORMATION, AFFILIATION & CHURCH DETAILS
          ============================================================ */}
      <div className="oaf-page-canvas" id="official-page-2">
        <img
          src="/official-forms/page_2.png"
          alt="ACI Application Page 2 Template"
          className="oaf-template-bg"
        />

        <div className="oaf-dynamic-layer">
          {/* II. Ministry Calling Checkboxes */}
          {renderCheck(sp.ministryFunction === 'Apostle', PAGE_2_FIELDS.callingApostle.x, PAGE_2_FIELDS.callingApostle.y, PAGE_2_FIELDS.callingApostle.size)}
          {renderCheck(sp.ministryFunction === 'Prophet', PAGE_2_FIELDS.callingProphet.x, PAGE_2_FIELDS.callingProphet.y, PAGE_2_FIELDS.callingProphet.size)}
          {renderCheck(sp.ministryFunction === 'Pastor', PAGE_2_FIELDS.callingPastor.x, PAGE_2_FIELDS.callingPastor.y, PAGE_2_FIELDS.callingPastor.size)}
          {renderCheck(sp.ministryFunction === 'Teacher', PAGE_2_FIELDS.callingTeacher.x, PAGE_2_FIELDS.callingTeacher.y, PAGE_2_FIELDS.callingTeacher.size)}
          {renderCheck(sp.ministryFunction === 'Evangelist', PAGE_2_FIELDS.callingEvangelist.x, PAGE_2_FIELDS.callingEvangelist.y, PAGE_2_FIELDS.callingEvangelist.size)}
          {renderCheck(sp.ministryFunction === 'Associate Pastor', PAGE_2_FIELDS.callingAssociate.x, PAGE_2_FIELDS.callingAssociate.y, PAGE_2_FIELDS.callingAssociate.size)}
          {renderCheck(sp.ministryFunction === 'Other Ministry', PAGE_2_FIELDS.callingOther.x, PAGE_2_FIELDS.callingOther.y, PAGE_2_FIELDS.callingOther.size)}
          {sp.ministryFunction === 'Other Ministry' && renderLine(sp.otherMinistrySpecify, PAGE_2_FIELDS.callingOtherText.x, PAGE_2_FIELDS.callingOtherText.y, PAGE_2_FIELDS.callingOtherText.width)}

          {/* III. Affiliation */}
          {renderCheck(aff.affiliationType === 'Independent Church', PAGE_2_FIELDS.affIndependent.x, PAGE_2_FIELDS.affIndependent.y, PAGE_2_FIELDS.affIndependent.size)}
          {aff.affiliationType === 'Independent Church' && renderLine(aff.founderName, PAGE_2_FIELDS.affFounderName.x, PAGE_2_FIELDS.affFounderName.y, PAGE_2_FIELDS.affFounderName.width)}
          {renderCheck(aff.affiliationType === 'Denomination', PAGE_2_FIELDS.affDenomination.x, PAGE_2_FIELDS.affDenomination.y, PAGE_2_FIELDS.affDenomination.size)}
          {aff.affiliationType === 'Denomination' && renderLine(aff.denominationSpecify, PAGE_2_FIELDS.affDenomSpecify.x, PAGE_2_FIELDS.affDenomSpecify.y, PAGE_2_FIELDS.affDenomSpecify.width)}
          {renderCheck(aff.affiliationType === 'Associate / Assistant', PAGE_2_FIELDS.affAssociate.x, PAGE_2_FIELDS.affAssociate.y, PAGE_2_FIELDS.affAssociate.size)}
          {aff.affiliationType === 'Associate / Assistant' && (
            <>
              {renderLine(aff.associateChiefPastorName, PAGE_2_FIELDS.affChiefPastor.x, PAGE_2_FIELDS.affChiefPastor.y, PAGE_2_FIELDS.affChiefPastor.width)}
              {renderLine(aff.associateChurchName, PAGE_2_FIELDS.affMotherChurch.x, PAGE_2_FIELDS.affMotherChurch.y, PAGE_2_FIELDS.affMotherChurch.width)}
            </>
          )}
          {renderLine(aff.trustName, PAGE_2_FIELDS.affTrustName.x, PAGE_2_FIELDS.affTrustName.y, PAGE_2_FIELDS.affTrustName.width)}

          {/* IV. Church Details */}
          {renderBoxedChars(ch.churchName, PAGE_2_FIELDS.churchName.startX, PAGE_2_FIELDS.churchName.y, PAGE_2_FIELDS.churchName.boxW, PAGE_2_FIELDS.churchName.boxH, PAGE_2_FIELDS.churchName.count)}
          {renderLine(ch.doorNo, PAGE_2_FIELDS.churchDoorNo.x, PAGE_2_FIELDS.churchDoorNo.y, PAGE_2_FIELDS.churchDoorNo.width)}
          {renderLine(ch.streetName, PAGE_2_FIELDS.churchStreet.x, PAGE_2_FIELDS.churchStreet.y, PAGE_2_FIELDS.churchStreet.width)}
          {renderLine(ch.cityTown, PAGE_2_FIELDS.churchCity.x, PAGE_2_FIELDS.churchCity.y, PAGE_2_FIELDS.churchCity.width)}
          {renderBoxedChars(ch.pincode, PAGE_2_FIELDS.churchPincode.startX, PAGE_2_FIELDS.churchPincode.y, PAGE_2_FIELDS.churchPincode.boxW, PAGE_2_FIELDS.churchPincode.boxH, 6)}
          {renderLine(ch.taluk, PAGE_2_FIELDS.churchTaluk.x, PAGE_2_FIELDS.churchTaluk.y, PAGE_2_FIELDS.churchTaluk.width)}
          {renderLine(ch.district, PAGE_2_FIELDS.churchDistrict.x, PAGE_2_FIELDS.churchDistrict.y, PAGE_2_FIELDS.churchDistrict.width)}
          {renderLine(ch.state, PAGE_2_FIELDS.churchState.x, PAGE_2_FIELDS.churchState.y, PAGE_2_FIELDS.churchState.width)}
          {renderLine(ch.telephone, PAGE_2_FIELDS.churchTelephone.x, PAGE_2_FIELDS.churchTelephone.y, PAGE_2_FIELDS.churchTelephone.width)}
          {renderLine(ch.mobileNumber, PAGE_2_FIELDS.churchMobile.x, PAGE_2_FIELDS.churchMobile.y, PAGE_2_FIELDS.churchMobile.width)}
          {renderLine(ch.emailId, PAGE_2_FIELDS.churchEmail.x, PAGE_2_FIELDS.churchEmail.y, PAGE_2_FIELDS.churchEmail.width)}

          {/* V. Spiritual Milestone Dates (8 Boxes each) */}
          {renderDate8(mh.bornAgainDate, PAGE_2_FIELDS.bornAgainDate.startX, PAGE_2_FIELDS.bornAgainDate.y, PAGE_2_FIELDS.bornAgainDate.boxW, PAGE_2_FIELDS.bornAgainDate.boxH)}
          {renderDate8(mh.waterBaptismDate, PAGE_2_FIELDS.waterBaptismDate.startX, PAGE_2_FIELDS.waterBaptismDate.y, PAGE_2_FIELDS.waterBaptismDate.boxW, PAGE_2_FIELDS.waterBaptismDate.boxH)}
          {renderDate8(mh.holySpiritBaptismDate, PAGE_2_FIELDS.holySpiritDate.startX, PAGE_2_FIELDS.holySpiritDate.y, PAGE_2_FIELDS.holySpiritDate.boxW, PAGE_2_FIELDS.holySpiritDate.boxH)}
          {renderDate8(mh.callingDate, PAGE_2_FIELDS.callingDate.startX, PAGE_2_FIELDS.callingDate.y, PAGE_2_FIELDS.callingDate.boxW, PAGE_2_FIELDS.callingDate.boxH)}
          {renderDate8(mh.ministryStartDate, PAGE_2_FIELDS.ministryStartDate.startX, PAGE_2_FIELDS.ministryStartDate.y, PAGE_2_FIELDS.ministryStartDate.boxW, PAGE_2_FIELDS.ministryStartDate.boxH)}
        </div>
      </div>

      {/* ============================================================
          PAGE 3 OF 4: QUALIFICATIONS, FAMILY & MOTIVATION
          ============================================================ */}
      <div className="oaf-page-canvas" id="official-page-3">
        <img
          src="/official-forms/page_3.png"
          alt="ACI Application Page 3 Template"
          className="oaf-template-bg"
        />

        <div className="oaf-dynamic-layer">
          {/* Questions 6 & 7 Checkboxes */}
          {renderCheck(mh.wantOrdination === 'Yes', PAGE_3_FIELDS.wantOrdinationYes.x, PAGE_3_FIELDS.wantOrdinationYes.y, PAGE_3_FIELDS.wantOrdinationYes.size)}
          {renderCheck(mh.wantOrdination === 'No', PAGE_3_FIELDS.wantOrdinationNo.x, PAGE_3_FIELDS.wantOrdinationNo.y, PAGE_3_FIELDS.wantOrdinationNo.size)}
          {renderCheck(mh.wantAffiliation === 'Yes', PAGE_3_FIELDS.wantAffiliationYes.x, PAGE_3_FIELDS.wantAffiliationYes.y, PAGE_3_FIELDS.wantAffiliationYes.size)}
          {renderCheck(mh.wantAffiliation === 'No', PAGE_3_FIELDS.wantAffiliationNo.x, PAGE_3_FIELDS.wantAffiliationNo.y, PAGE_3_FIELDS.wantAffiliationNo.size)}

          {/* VI. Academic Table */}
          {q.academic?.slice(0, 3).map((row, idx) => {
            const coords = PAGE_3_FIELDS.academicRows[idx]
            if (!coords) return null
            return (
              <React.Fragment key={row.id || idx}>
                {renderLine(row.examinationPassed, coords.colExam, coords.y, 320)}
                {renderLine(row.year, coords.colYear, coords.y, 200)}
                {renderLine(row.institution, coords.colInst, coords.y, 380)}
              </React.Fragment>
            )
          })}

          {/* VII. Theological Table */}
          {q.theological?.slice(0, 2).map((row, idx) => {
            const coords = PAGE_3_FIELDS.theologicalRows[idx]
            if (!coords) return null
            return (
              <React.Fragment key={row.id || idx}>
                {renderLine(row.examinationPassed, coords.colExam, coords.y, 320)}
                {renderLine(row.year, coords.colYear, coords.y, 200)}
                {renderLine(row.institution, coords.colInst, coords.y, 380)}
              </React.Fragment>
            )
          })}

          {/* VIII. Family Table */}
          {fam?.slice(0, 4).map((f, idx) => {
            const coords = PAGE_3_FIELDS.familyRows[idx]
            if (!coords) return null
            return (
              <React.Fragment key={f.id || idx}>
                {renderLine(f.name, coords.colName, coords.y, 260)}
                {renderLine(f.dob, coords.colDob, coords.y, 180)}
                {renderLine(f.relationship, coords.colRel, coords.y, 200)}
                {renderLine(f.professionEducation, coords.colProf, coords.y, 250)}
              </React.Fragment>
            )
          })}

          {/* IX. Motivation Box */}
          {mot.reasonToJoin && (
            <div
              className="oaf-motivation-text"
              style={{
                left: toLeft(PAGE_3_FIELDS.motivation.x),
                top: toTop(PAGE_3_FIELDS.motivation.y),
                width: toWidth(PAGE_3_FIELDS.motivation.width),
                height: toHeight(PAGE_3_FIELDS.motivation.height),
              }}
            >
              {mot.reasonToJoin}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================
          PAGE 4 OF 4: REFERENCES & DECLARATION
          ============================================================ */}
      <div className="oaf-page-canvas" id="official-page-4">
        <img
          src="/official-forms/page_4.png"
          alt="ACI Application Page 4 Template"
          className="oaf-template-bg"
        />

        <div className="oaf-dynamic-layer">
          {/* Reference 1 */}
          {renderLine(ref.ref1?.name, PAGE_4_FIELDS.ref1Name.x, PAGE_4_FIELDS.ref1Name.y, PAGE_4_FIELDS.ref1Name.width)}
          {renderLine(ref.ref1?.diocesanId, PAGE_4_FIELDS.ref1Id.x, PAGE_4_FIELDS.ref1Id.y, PAGE_4_FIELDS.ref1Id.width)}
          {renderLine(ref.ref1?.phone, PAGE_4_FIELDS.ref1Phone.x, PAGE_4_FIELDS.ref1Phone.y, PAGE_4_FIELDS.ref1Phone.width)}
          {renderLine(ref.ref1?.knownSince, PAGE_4_FIELDS.ref1Since.x, PAGE_4_FIELDS.ref1Since.y, PAGE_4_FIELDS.ref1Since.width)}
          {renderCheck(ref.ref1?.relationshipType === 'Personally' || !ref.ref1?.relationshipType, PAGE_4_FIELDS.ref1Personally.x, PAGE_4_FIELDS.ref1Personally.y, PAGE_4_FIELDS.ref1Personally.size)}
          {renderCheck(ref.ref1?.relationshipType === 'Professionally', PAGE_4_FIELDS.ref1Professionally.x, PAGE_4_FIELDS.ref1Professionally.y, PAGE_4_FIELDS.ref1Professionally.size)}

          {/* Reference 2 */}
          {renderLine(ref.ref2?.name, PAGE_4_FIELDS.ref2Name.x, PAGE_4_FIELDS.ref2Name.y, PAGE_4_FIELDS.ref2Name.width)}
          {renderLine(ref.ref2?.diocesanId, PAGE_4_FIELDS.ref2Id.x, PAGE_4_FIELDS.ref2Id.y, PAGE_4_FIELDS.ref2Id.width)}
          {renderLine(ref.ref2?.phone, PAGE_4_FIELDS.ref2Phone.x, PAGE_4_FIELDS.ref2Phone.y, PAGE_4_FIELDS.ref2Phone.width)}
          {renderLine(ref.ref2?.knownSince, PAGE_4_FIELDS.ref2Since.x, PAGE_4_FIELDS.ref2Since.y, PAGE_4_FIELDS.ref2Since.width)}
          {renderCheck(ref.ref2?.relationshipType === 'Personally', PAGE_4_FIELDS.ref2Personally.x, PAGE_4_FIELDS.ref2Personally.y, PAGE_4_FIELDS.ref2Personally.size)}
          {renderCheck(ref.ref2?.relationshipType === 'Professionally' || !ref.ref2?.relationshipType, PAGE_4_FIELDS.ref2Professionally.x, PAGE_4_FIELDS.ref2Professionally.y, PAGE_4_FIELDS.ref2Professionally.size)}

          {/* Declaration Fields */}
          {renderLine(dec.place || 'Dindigul', PAGE_4_FIELDS.decPlace.x, PAGE_4_FIELDS.decPlace.y, PAGE_4_FIELDS.decPlace.width)}
          {renderLine(dec.date || p.applicationDate || '2026-08-26', PAGE_4_FIELDS.decDate.x, PAGE_4_FIELDS.decDate.y, PAGE_4_FIELDS.decDate.width)}

          {/* Digital Signature */}
          <div
            className="oaf-signature-block"
            style={{
              left: toLeft(PAGE_4_FIELDS.decSignature.x),
              top: toTop(PAGE_4_FIELDS.decSignature.y),
              width: toWidth(PAGE_4_FIELDS.decSignature.width),
            }}
          >
            <div className="oaf-signature-text">{p.name || 'S. JOHN SAMUEL'}</div>
            <div className="oaf-signature-badge">[ Digitally Confirmed ]</div>
          </div>
        </div>
      </div>

    </div>
  )
}
