/**
 * Official ACI Diocese 4-Page Form Layout & Field Coordinates Map
 * Calibrated directly against original 1240 x 1755 px scan pages (A4 150 DPI).
 * 
 * Standard Canvas Base: Width = 1240px, Height = 1755px
 * Percentage coordinates: (x / 1240 * 100)%, (y / 1755 * 100)%
 */

export const FORM_CANVAS = {
  width: 1240,
  height: 1755,
  aspectRatio: 1240 / 1755,
}

export const PAGE_1_FIELDS = {
  // Office Use Date
  receivedDate: { x: 576, y: 535, boxW: 32, boxH: 34, count: 8, type: 'dateBoxes' },
  
  // Passport Photo Box (Right side of Office Use)
  photo: { x: 712, y: 585, width: 330, height: 420, type: 'photo' },
  
  // 1. Full Name (Character boxes row 1 & row 2 if needed)
  name: { x: 104, y: 844, boxW: 39.5, boxH: 40, count: 28, type: 'charBoxes' },
  
  // 2. Baptismal Name
  baptismalName: { x: 104, y: 928, boxW: 39.5, boxH: 40, count: 28, type: 'charBoxes' },
  
  // 3. Date of Birth
  dob: { x: 104, y: 1008, boxW: 39.5, boxH: 40, count: 8, type: 'dateBoxes' },
  
  // 4. Nationality
  nationality: { x: 504, y: 1008, boxW: 39.5, boxH: 40, count: 18, type: 'charBoxes' },
  
  // 5. Gender Checkboxes
  genderMale: { x: 260, y: 1072, size: 24, type: 'checkbox' },
  genderFemale: { x: 420, y: 1072, size: 24, type: 'checkbox' },
  
  // 6. Marital Status Checkboxes
  maritalMarried: { x: 260, y: 1120, size: 24, type: 'checkbox' },
  maritalBachelor: { x: 420, y: 1120, size: 24, type: 'checkbox' },
  maritalSpinster: { x: 600, y: 1120, size: 24, type: 'checkbox' },
  maritalWidowed: { x: 790, y: 1120, size: 24, type: 'checkbox' },
  
  // 7. Permanent Address (Lines)
  permDoorNo: { x: 240, y: 1198, type: 'lineText', fontSize: 18 },
  permStreet: { x: 500, y: 1198, type: 'lineText', fontSize: 18 },
  permCity: { x: 240, y: 1242, type: 'lineText', fontSize: 18 },
  permTaluk: { x: 680, y: 1242, type: 'lineText', fontSize: 18 },
  permDistrict: { x: 240, y: 1286, type: 'lineText', fontSize: 18 },
  permState: { x: 680, y: 1286, type: 'lineText', fontSize: 18 },
  permPincode: { x: 240, y: 1330, type: 'lineText', fontSize: 18 },
  permCountry: { x: 680, y: 1330, type: 'lineText', fontSize: 18 },

  // 8. Contact Address (Lines)
  contactDoorNo: { x: 240, y: 1420, type: 'lineText', fontSize: 18 },
  contactStreet: { x: 500, y: 1420, type: 'lineText', fontSize: 18 },
  contactCity: { x: 240, y: 1464, type: 'lineText', fontSize: 18 },
  contactTaluk: { x: 680, y: 1464, type: 'lineText', fontSize: 18 },
  contactDistrict: { x: 240, y: 1508, type: 'lineText', fontSize: 18 },
  contactState: { x: 680, y: 1508, type: 'lineText', fontSize: 18 },
  contactPincode: { x: 240, y: 1552, type: 'lineText', fontSize: 18 },
  contactCountry: { x: 680, y: 1552, type: 'lineText', fontSize: 18 },
}

export const PAGE_2_FIELDS = {
  // II. Spiritual Information Checkboxes
  callingApostle: { x: 104, y: 220, size: 24, type: 'checkbox' },
  callingProphet: { x: 280, y: 220, size: 24, type: 'checkbox' },
  callingPastor: { x: 450, y: 220, size: 24, type: 'checkbox' },
  callingTeacher: { x: 620, y: 220, size: 24, type: 'checkbox' },
  callingEvangelist: { x: 800, y: 220, size: 24, type: 'checkbox' },
  callingAssociate: { x: 104, y: 270, size: 24, type: 'checkbox' },
  callingOther: { x: 450, y: 270, size: 24, type: 'checkbox' },
  callingOtherText: { x: 680, y: 266, type: 'lineText', fontSize: 16 },

  // III. Affiliation Checkboxes & Details
  affIndependent: { x: 104, y: 380, size: 24, type: 'checkbox' },
  affFounderName: { x: 620, y: 376, type: 'lineText', fontSize: 16 },
  affDenomination: { x: 104, y: 430, size: 24, type: 'checkbox' },
  affDenomSpecify: { x: 620, y: 426, type: 'lineText', fontSize: 16 },
  affAssociate: { x: 104, y: 480, size: 24, type: 'checkbox' },
  affChiefPastor: { x: 420, y: 476, type: 'lineText', fontSize: 16 },
  affMotherChurch: { x: 420, y: 516, type: 'lineText', fontSize: 16 },
  affTrustName: { x: 420, y: 566, type: 'lineText', fontSize: 16 },

  // IV. Church Details
  churchName: { x: 104, y: 690, boxW: 39.5, boxH: 40, count: 28, type: 'charBoxes' },
  churchDoorNo: { x: 240, y: 770, type: 'lineText', fontSize: 18 },
  churchStreet: { x: 500, y: 770, type: 'lineText', fontSize: 18 },
  churchCity: { x: 240, y: 814, type: 'lineText', fontSize: 18 },
  churchTaluk: { x: 680, y: 814, type: 'lineText', fontSize: 18 },
  churchDistrict: { x: 240, y: 858, type: 'lineText', fontSize: 18 },
  churchState: { x: 680, y: 858, type: 'lineText', fontSize: 18 },
  churchPincode: { x: 240, y: 902, type: 'lineText', fontSize: 18 },
  churchTelephone: { x: 240, y: 946, type: 'lineText', fontSize: 18 },
  churchMobile: { x: 680, y: 946, type: 'lineText', fontSize: 18 },
  churchEmail: { x: 240, y: 990, type: 'lineText', fontSize: 18 },

  // V. Spiritual Milestone Dates
  bornAgainDate: { x: 860, y: 1140, boxW: 32, boxH: 34, count: 8, type: 'dateBoxes' },
  waterBaptismDate: { x: 860, y: 1220, boxW: 32, boxH: 34, count: 8, type: 'dateBoxes' },
  holySpiritDate: { x: 860, y: 1300, boxW: 32, boxH: 34, count: 8, type: 'dateBoxes' },
  callingDate: { x: 860, y: 1380, boxW: 32, boxH: 34, count: 8, type: 'dateBoxes' },
  ministryStartDate: { x: 860, y: 1460, boxW: 32, boxH: 34, count: 8, type: 'dateBoxes' },
}

export const PAGE_3_FIELDS = {
  // Ordination & Affiliation Questions
  wantOrdinationYes: { x: 880, y: 180, size: 24, type: 'checkbox' },
  wantOrdinationNo: { x: 980, y: 180, size: 24, type: 'checkbox' },
  wantAffiliationYes: { x: 880, y: 240, size: 24, type: 'checkbox' },
  wantAffiliationNo: { x: 980, y: 240, size: 24, type: 'checkbox' },

  // VI. Academic Qualifications Rows (StartY: 360, RowH: 42)
  academicRows: [
    { sNo: 1, y: 365, colExam: 240, colYear: 580, colInst: 840 },
    { sNo: 2, y: 407, colExam: 240, colYear: 580, colInst: 840 },
    { sNo: 3, y: 449, colExam: 240, colYear: 580, colInst: 840 },
  ],

  // VII. Theological Qualifications Rows (StartY: 580, RowH: 42)
  theologicalRows: [
    { sNo: 1, y: 585, colExam: 240, colYear: 580, colInst: 840 },
    { sNo: 2, y: 627, colExam: 240, colYear: 580, colInst: 840 },
  ],

  // VIII. Family Details Rows (StartY: 790, RowH: 42)
  familyRows: [
    { sNo: 1, y: 800, colName: 200, colDob: 480, colRel: 690, colProf: 930 },
    { sNo: 2, y: 842, colName: 200, colDob: 480, colRel: 690, colProf: 930 },
    { sNo: 3, y: 884, colName: 200, colDob: 480, colRel: 690, colProf: 930 },
    { sNo: 4, y: 926, colName: 200, colDob: 480, colRel: 690, colProf: 930 },
  ],

  // IX. Motivation Response Box
  motivation: { x: 104, y: 1080, width: 1032, height: 420, type: 'multiline', fontSize: 18 },
}

export const PAGE_4_FIELDS = {
  // Reference 1: District Overseer
  ref1Name: { x: 340, y: 270, type: 'lineText', fontSize: 18 },
  ref1Id: { x: 340, y: 315, type: 'lineText', fontSize: 18 },
  ref1Phone: { x: 340, y: 360, type: 'lineText', fontSize: 18 },
  ref1Since: { x: 340, y: 405, type: 'lineText', fontSize: 18 },
  ref1Personally: { x: 260, y: 450, size: 22, type: 'checkbox' },
  ref1Professionally: { x: 440, y: 450, size: 22, type: 'checkbox' },

  // Reference 2: Taluk Co-ordinator
  ref2Name: { x: 860, y: 270, type: 'lineText', fontSize: 18 },
  ref2Id: { x: 860, y: 315, type: 'lineText', fontSize: 18 },
  ref2Phone: { x: 860, y: 360, type: 'lineText', fontSize: 18 },
  ref2Since: { x: 860, y: 405, type: 'lineText', fontSize: 18 },
  ref2Personally: { x: 780, y: 450, size: 22, type: 'checkbox' },
  ref2Professionally: { x: 960, y: 450, size: 22, type: 'checkbox' },

  // XI. Declaration Fields
  decPlace: { x: 220, y: 1050, type: 'lineText', fontSize: 18 },
  decDate: { x: 220, y: 1100, type: 'lineText', fontSize: 18 },
  decSignature: { x: 780, y: 1080, type: 'signature', fontSize: 20 },
}
