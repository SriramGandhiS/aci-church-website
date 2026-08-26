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

// Render boxed characters (e.g. [J][O][H][N])
function renderBoxes(text, x, y, boxW, boxH, count) {
  const chars = (text || '').toUpperCase().slice(0, count).split('')
  while (chars.length < count) {
    chars.push('')
  }

  return (
    <div
      className="oaf-overlay-boxes"
      style={{
        left: toLeft(x),
        top: toTop(y),
        height: toHeight(boxH),
      }}
    >
      {chars.map((c, i) => (
        <span
          key={i}
          className="oaf-overlay-char"
          style={{
            width: `${(boxW / FORM_CANVAS.width) * 100}vw`,
            maxWidth: `${boxW * 0.65}px`,
            minWidth: `${boxW * 0.65}px`,
          }}
        >
          {c || ''}
        </span>
      ))}
    </div>
  )
}

// Render Date in boxes [D D M M Y Y Y Y]
function renderDateBoxes(dateStr, x, y, boxW = 32, boxH = 34) {
  if (!dateStr) return null
  const parts = dateStr.split('-') // [YYYY, MM, DD]
  const yyyy = (parts[0] || '    ').split('')
  const mm = (parts[1] || '  ').split('')
  const dd = (parts[2] || '  ').split('')
  const chars = [...dd, ...mm, ...yyyy]

  return (
    <div
      className="oaf-overlay-boxes"
      style={{
        left: toLeft(x),
        top: toTop(y),
        height: toHeight(boxH),
      }}
    >
      {chars.map((c, i) => (
        <span
          key={i}
          className="oaf-overlay-char date-char"
          style={{
            width: `${boxW * 0.65}px`,
            minWidth: `${boxW * 0.65}px`,
          }}
        >
          {c || ''}
        </span>
      ))}
    </div>
  )
}

// Render checkmark inside official checkbox
function renderCheck(checked, x, y, size = 24) {
  if (!checked) return null
  return (
    <div
      className="oaf-overlay-check"
      style={{
        left: toLeft(x),
        top: toTop(y),
        width: `${size * 0.7}px`,
        height: `${size * 0.7}px`,
      }}
    >
      ✓
    </div>
  )
}

// Render single text line
function renderLine(text, x, y, fontSize = 16) {
  if (!text) return null
  return (
    <div
      className="oaf-overlay-line"
      style={{
        left: toLeft(x),
        top: toTop(y),
        fontSize: `${fontSize * 0.75}px`,
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

  const fullName = [p.salutation, p.name].filter(Boolean).join(' ').toUpperCase()

  return (
    <div className={`oaf-document-wrapper ${isMini ? 'is-mini-view' : ''}`}>

      {/* ============================================================
          PAGE 1: APPLICANT INFORMATION & ADDRESS
          ============================================================ */}
      <div className="oaf-page-sheet" id="oaf-page-sheet-1">
        <img
          src="/official-forms/page_1.png"
          alt="ACI Official Application Page 1"
          className="oaf-scanned-bg"
        />

        <div className="oaf-overlay-layer">
          {/* Office Use Received Date */}
          {renderDateBoxes(p.applicationDate || '2026-08-26', PAGE_1_FIELDS.receivedDate.x, PAGE_1_FIELDS.receivedDate.y)}

          {/* Passport Photo */}
          {p.photoUrl && (
            <div
              className="oaf-overlay-photo"
              style={{
                left: toLeft(PAGE_1_FIELDS.photo.x),
                top: toTop(PAGE_1_FIELDS.photo.y),
                width: toWidth(PAGE_1_FIELDS.photo.width),
                height: toHeight(PAGE_1_FIELDS.photo.height),
              }}
            >
              <img src={p.photoUrl} alt="Applicant Passport" />
            </div>
          )}

          {/* 1. Full Name in Character Boxes (ONE single location) */}
          {renderBoxes(fullName, PAGE_1_FIELDS.name.x, PAGE_1_FIELDS.name.y, PAGE_1_FIELDS.name.boxW, PAGE_1_FIELDS.name.boxH, 28)}

          {/* 2. Baptismal Name */}
          {renderBoxes(p.baptismalName, PAGE_1_FIELDS.baptismalName.x, PAGE_1_FIELDS.baptismalName.y, PAGE_1_FIELDS.baptismalName.boxW, PAGE_1_FIELDS.baptismalName.boxH, 28)}

          {/* 3. DOB */}
          {renderDateBoxes(p.dob, PAGE_1_FIELDS.dob.x, PAGE_1_FIELDS.dob.y)}

          {/* 4. Nationality */}
          {renderBoxes(p.nationality || 'INDIAN', PAGE_1_FIELDS.nationality.x, PAGE_1_FIELDS.nationality.y, PAGE_1_FIELDS.nationality.boxW, PAGE_1_FIELDS.nationality.boxH, 18)}

          {/* 5. Gender Checkboxes */}
          {renderCheck(p.gender === 'Male', PAGE_1_FIELDS.genderMale.x, PAGE_1_FIELDS.genderMale.y)}
          {renderCheck(p.gender === 'Female', PAGE_1_FIELDS.genderFemale.x, PAGE_1_FIELDS.genderFemale.y)}

          {/* 6. Marital Status Checkboxes */}
          {renderCheck(p.maritalStatus === 'Married', PAGE_1_FIELDS.maritalMarried.x, PAGE_1_FIELDS.maritalMarried.y)}
          {renderCheck(p.maritalStatus === 'Bachelor', PAGE_1_FIELDS.maritalBachelor.x, PAGE_1_FIELDS.maritalBachelor.y)}
          {renderCheck(p.maritalStatus === 'Spinster', PAGE_1_FIELDS.maritalSpinster.x, PAGE_1_FIELDS.maritalSpinster.y)}
          {renderCheck(p.maritalStatus === 'Widowed', PAGE_1_FIELDS.maritalWidowed.x, PAGE_1_FIELDS.maritalWidowed.y)}

          {/* 7. Permanent Address Lines */}
          {renderLine(perm.doorNo, PAGE_1_FIELDS.permDoorNo.x, PAGE_1_FIELDS.permDoorNo.y)}
          {renderLine(perm.streetName, PAGE_1_FIELDS.permStreet.x, PAGE_1_FIELDS.permStreet.y)}
          {renderLine(perm.cityTown, PAGE_1_FIELDS.permCity.x, PAGE_1_FIELDS.permCity.y)}
          {renderLine(perm.taluk, PAGE_1_FIELDS.permTaluk.x, PAGE_1_FIELDS.permTaluk.y)}
          {renderLine(perm.district, PAGE_1_FIELDS.permDistrict.x, PAGE_1_FIELDS.permDistrict.y)}
          {renderLine(perm.state, PAGE_1_FIELDS.permState.x, PAGE_1_FIELDS.permState.y)}
          {renderLine(perm.pincode, PAGE_1_FIELDS.permPincode.x, PAGE_1_FIELDS.permPincode.y)}
          {renderLine(perm.country || 'India', PAGE_1_FIELDS.permCountry.x, PAGE_1_FIELDS.permCountry.y)}

          {/* 8. Contact Address Lines */}
          {renderLine(contact.doorNo, PAGE_1_FIELDS.contactDoorNo.x, PAGE_1_FIELDS.contactDoorNo.y)}
          {renderLine(contact.streetName, PAGE_1_FIELDS.contactStreet.x, PAGE_1_FIELDS.contactStreet.y)}
          {renderLine(contact.cityTown, PAGE_1_FIELDS.contactCity.x, PAGE_1_FIELDS.contactCity.y)}
          {renderLine(contact.taluk, PAGE_1_FIELDS.contactTaluk.x, PAGE_1_FIELDS.contactTaluk.y)}
          {renderLine(contact.district, PAGE_1_FIELDS.contactDistrict.x, PAGE_1_FIELDS.contactDistrict.y)}
          {renderLine(contact.state, PAGE_1_FIELDS.contactState.x, PAGE_1_FIELDS.contactState.y)}
          {renderLine(contact.pincode, PAGE_1_FIELDS.contactPincode.x, PAGE_1_FIELDS.contactPincode.y)}
          {renderLine(contact.country || 'India', PAGE_1_FIELDS.contactCountry.x, PAGE_1_FIELDS.contactCountry.y)}
        </div>
      </div>

      {/* ============================================================
          PAGE 2: SPIRITUAL INFORMATION, AFFILIATION & CHURCH DETAILS
          ============================================================ */}
      <div className="oaf-page-sheet" id="oaf-page-sheet-2">
        <img
          src="/official-forms/page_2.png"
          alt="ACI Official Application Page 2"
          className="oaf-scanned-bg"
        />

        <div className="oaf-overlay-layer">
          {/* II. Calling Checkboxes */}
          {renderCheck(sp.ministryFunction === 'Apostle', PAGE_2_FIELDS.callingApostle.x, PAGE_2_FIELDS.callingApostle.y)}
          {renderCheck(sp.ministryFunction === 'Prophet', PAGE_2_FIELDS.callingProphet.x, PAGE_2_FIELDS.callingProphet.y)}
          {renderCheck(sp.ministryFunction === 'Pastor', PAGE_2_FIELDS.callingPastor.x, PAGE_2_FIELDS.callingPastor.y)}
          {renderCheck(sp.ministryFunction === 'Teacher', PAGE_2_FIELDS.callingTeacher.x, PAGE_2_FIELDS.callingTeacher.y)}
          {renderCheck(sp.ministryFunction === 'Evangelist', PAGE_2_FIELDS.callingEvangelist.x, PAGE_2_FIELDS.callingEvangelist.y)}
          {renderCheck(sp.ministryFunction === 'Associate Pastor', PAGE_2_FIELDS.callingAssociate.x, PAGE_2_FIELDS.callingAssociate.y)}
          {renderCheck(sp.ministryFunction === 'Other Ministry', PAGE_2_FIELDS.callingOther.x, PAGE_2_FIELDS.callingOther.y)}
          {sp.ministryFunction === 'Other Ministry' && renderLine(sp.otherMinistrySpecify, PAGE_2_FIELDS.callingOtherText.x, PAGE_2_FIELDS.callingOtherText.y)}

          {/* III. Affiliation */}
          {renderCheck(aff.affiliationType === 'Independent Church', PAGE_2_FIELDS.affIndependent.x, PAGE_2_FIELDS.affIndependent.y)}
          {aff.affiliationType === 'Independent Church' && renderLine(aff.founderName, PAGE_2_FIELDS.affFounderName.x, PAGE_2_FIELDS.affFounderName.y)}
          {renderCheck(aff.affiliationType === 'Denomination', PAGE_2_FIELDS.affDenomination.x, PAGE_2_FIELDS.affDenomination.y)}
          {aff.affiliationType === 'Denomination' && renderLine(aff.denominationSpecify, PAGE_2_FIELDS.affDenomSpecify.x, PAGE_2_FIELDS.affDenomSpecify.y)}
          {renderCheck(aff.affiliationType === 'Associate / Assistant', PAGE_2_FIELDS.affAssociate.x, PAGE_2_FIELDS.affAssociate.y)}
          {aff.affiliationType === 'Associate / Assistant' && (
            <>
              {renderLine(aff.associateChiefPastorName, PAGE_2_FIELDS.affChiefPastor.x, PAGE_2_FIELDS.affChiefPastor.y)}
              {renderLine(aff.associateChurchName, PAGE_2_FIELDS.affMotherChurch.x, PAGE_2_FIELDS.affMotherChurch.y)}
            </>
          )}
          {renderLine(aff.trustName, PAGE_2_FIELDS.affTrustName.x, PAGE_2_FIELDS.affTrustName.y)}

          {/* IV. Church Details */}
          {renderBoxes(ch.churchName, PAGE_2_FIELDS.churchName.x, PAGE_2_FIELDS.churchName.y, PAGE_2_FIELDS.churchName.boxW, PAGE_2_FIELDS.churchName.boxH, 28)}
          {renderLine(ch.doorNo, PAGE_2_FIELDS.churchDoorNo.x, PAGE_2_FIELDS.churchDoorNo.y)}
          {renderLine(ch.streetName, PAGE_2_FIELDS.churchStreet.x, PAGE_2_FIELDS.churchStreet.y)}
          {renderLine(ch.cityTown, PAGE_2_FIELDS.churchCity.x, PAGE_2_FIELDS.churchCity.y)}
          {renderLine(ch.taluk, PAGE_2_FIELDS.churchTaluk.x, PAGE_2_FIELDS.churchTaluk.y)}
          {renderLine(ch.district, PAGE_2_FIELDS.churchDistrict.x, PAGE_2_FIELDS.churchDistrict.y)}
          {renderLine(ch.state, PAGE_2_FIELDS.churchState.x, PAGE_2_FIELDS.churchState.y)}
          {renderLine(ch.pincode, PAGE_2_FIELDS.churchPincode.x, PAGE_2_FIELDS.churchPincode.y)}
          {renderLine(ch.telephone, PAGE_2_FIELDS.churchTelephone.x, PAGE_2_FIELDS.churchTelephone.y)}
          {renderLine(ch.mobileNumber, PAGE_2_FIELDS.churchMobile.x, PAGE_2_FIELDS.churchMobile.y)}
          {renderLine(ch.emailId, PAGE_2_FIELDS.churchEmail.x, PAGE_2_FIELDS.churchEmail.y)}

          {/* V. Spiritual Milestones */}
          {renderDateBoxes(mh.bornAgainDate, PAGE_2_FIELDS.bornAgainDate.x, PAGE_2_FIELDS.bornAgainDate.y)}
          {renderDateBoxes(mh.waterBaptismDate, PAGE_2_FIELDS.waterBaptismDate.x, PAGE_2_FIELDS.waterBaptismDate.y)}
          {renderDateBoxes(mh.holySpiritBaptismDate, PAGE_2_FIELDS.holySpiritDate.x, PAGE_2_FIELDS.holySpiritDate.y)}
          {renderDateBoxes(mh.callingDate, PAGE_2_FIELDS.callingDate.x, PAGE_2_FIELDS.callingDate.y)}
          {renderDateBoxes(mh.ministryStartDate, PAGE_2_FIELDS.ministryStartDate.x, PAGE_2_FIELDS.ministryStartDate.y)}
        </div>
      </div>

      {/* ============================================================
          PAGE 3: QUALIFICATIONS, FAMILY DETAILS & MOTIVATION
          ============================================================ */}
      <div className="oaf-page-sheet" id="oaf-page-sheet-3">
        <img
          src="/official-forms/page_3.png"
          alt="ACI Official Application Page 3"
          className="oaf-scanned-bg"
        />

        <div className="oaf-overlay-layer">
          {/* Ordination & Affiliation intent */}
          {renderCheck(mh.wantOrdination === 'Yes', PAGE_3_FIELDS.wantOrdinationYes.x, PAGE_3_FIELDS.wantOrdinationYes.y)}
          {renderCheck(mh.wantOrdination === 'No', PAGE_3_FIELDS.wantOrdinationNo.x, PAGE_3_FIELDS.wantOrdinationNo.y)}
          {renderCheck(mh.wantAffiliation === 'Yes', PAGE_3_FIELDS.wantAffiliationYes.x, PAGE_3_FIELDS.wantAffiliationYes.y)}
          {renderCheck(mh.wantAffiliation === 'No', PAGE_3_FIELDS.wantAffiliationNo.x, PAGE_3_FIELDS.wantAffiliationNo.y)}

          {/* VI. Academic Table */}
          {q.academic?.slice(0, 3).map((row, idx) => {
            const coords = PAGE_3_FIELDS.academicRows[idx]
            if (!coords) return null
            return (
              <React.Fragment key={row.id || idx}>
                {renderLine(row.examinationPassed, coords.colExam, coords.y, 15)}
                {renderLine(row.year, coords.colYear, coords.y, 15)}
                {renderLine(row.institution, coords.colInst, coords.y, 15)}
              </React.Fragment>
            )
          })}

          {/* VII. Theological Table */}
          {q.theological?.slice(0, 2).map((row, idx) => {
            const coords = PAGE_3_FIELDS.theologicalRows[idx]
            if (!coords) return null
            return (
              <React.Fragment key={row.id || idx}>
                {renderLine(row.examinationPassed, coords.colExam, coords.y, 15)}
                {renderLine(row.year, coords.colYear, coords.y, 15)}
                {renderLine(row.institution, coords.colInst, coords.y, 15)}
              </React.Fragment>
            )
          })}

          {/* VIII. Family Table */}
          {fam?.slice(0, 4).map((f, idx) => {
            const coords = PAGE_3_FIELDS.familyRows[idx]
            if (!coords) return null
            return (
              <React.Fragment key={f.id || idx}>
                {renderLine(f.name, coords.colName, coords.y, 15)}
                {renderLine(f.dob, coords.colDob, coords.y, 15)}
                {renderLine(f.relationship, coords.colRel, coords.y, 15)}
                {renderLine(f.professionEducation, coords.colProf, coords.y, 15)}
              </React.Fragment>
            )
          })}

          {/* IX. Motivation Box */}
          {mot.reasonToJoin && (
            <div
              className="oaf-overlay-multiline"
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
          PAGE 4: REFERENCES, STATUTORY DECLARATION & SIGNATURE
          ============================================================ */}
      <div className="oaf-page-sheet" id="oaf-page-sheet-4">
        <img
          src="/official-forms/page_4.png"
          alt="ACI Official Application Page 4"
          className="oaf-scanned-bg"
        />

        <div className="oaf-overlay-layer">
          {/* Reference 1 */}
          {renderLine(ref.ref1?.name, PAGE_4_FIELDS.ref1Name.x, PAGE_4_FIELDS.ref1Name.y)}
          {renderLine(ref.ref1?.diocesanId, PAGE_4_FIELDS.ref1Id.x, PAGE_4_FIELDS.ref1Id.y)}
          {renderLine(ref.ref1?.phone, PAGE_4_FIELDS.ref1Phone.x, PAGE_4_FIELDS.ref1Phone.y)}
          {renderLine(ref.ref1?.knownSince, PAGE_4_FIELDS.ref1Since.x, PAGE_4_FIELDS.ref1Since.y)}
          {renderCheck(ref.ref1?.relationshipType === 'Personally' || !ref.ref1?.relationshipType, PAGE_4_FIELDS.ref1Personally.x, PAGE_4_FIELDS.ref1Personally.y)}
          {renderCheck(ref.ref1?.relationshipType === 'Professionally', PAGE_4_FIELDS.ref1Professionally.x, PAGE_4_FIELDS.ref1Professionally.y)}

          {/* Reference 2 */}
          {renderLine(ref.ref2?.name, PAGE_4_FIELDS.ref2Name.x, PAGE_4_FIELDS.ref2Name.y)}
          {renderLine(ref.ref2?.diocesanId, PAGE_4_FIELDS.ref2Id.x, PAGE_4_FIELDS.ref2Id.y)}
          {renderLine(ref.ref2?.phone, PAGE_4_FIELDS.ref2Phone.x, PAGE_4_FIELDS.ref2Phone.y)}
          {renderLine(ref.ref2?.knownSince, PAGE_4_FIELDS.ref2Since.x, PAGE_4_FIELDS.ref2Since.y)}
          {renderCheck(ref.ref2?.relationshipType === 'Personally', PAGE_4_FIELDS.ref2Personally.x, PAGE_4_FIELDS.ref2Personally.y)}
          {renderCheck(ref.ref2?.relationshipType === 'Professionally' || !ref.ref2?.relationshipType, PAGE_4_FIELDS.ref2Professionally.x, PAGE_4_FIELDS.ref2Professionally.y)}

          {/* Declaration Fields */}
          {renderLine(dec.place || 'Dindigul', PAGE_4_FIELDS.decPlace.x, PAGE_4_FIELDS.decPlace.y)}
          {renderLine(dec.date || p.applicationDate || '2026-08-26', PAGE_4_FIELDS.decDate.x, PAGE_4_FIELDS.decDate.y)}

          {/* Digital Signature */}
          <div
            className="oaf-overlay-signature"
            style={{
              left: toLeft(PAGE_4_FIELDS.decSignature.x),
              top: toTop(PAGE_4_FIELDS.decSignature.y),
            }}
          >
            <div className="oaf-sig-name">{p.name || 'S. JOHN SAMUEL'}</div>
            <div className="oaf-sig-tag">[ Digitally Signed ]</div>
          </div>
        </div>
      </div>

    </div>
  )
}
