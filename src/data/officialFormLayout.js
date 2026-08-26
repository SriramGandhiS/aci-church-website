/**
 * Calibrated Field Coordinate Map for Official 4-Page ACI Diocese Form
 * Exact alignment against 1240 x 1755 px scan pages (A4 150 DPI).
 */

export const FORM_CANVAS = {
  width: 1240,
  height: 1755,
}

export const PAGE_1_FIELDS = {
  // Date of Issue (Top Right Box)
  issueDate: { x: 1018, y: 160, width: 125, height: 55 },

  // Office Use Boxes
  officeReceivedDate: { startX: 390, y: 390, boxW: 30, boxH: 42, count: 8 },
  officeApprovedDate: { startX: 390, y: 465, boxW: 30, boxH: 42, count: 8 },
  officeMembershipCode: { startX: 390, y: 535, boxW: 30, boxH: 42, count: 10 },

  // Passport Photo Box (Top Right under Issue Date)
  photo: { x: 955, y: 310, width: 195, height: 245 },

  // 1. Full Name (24 Boxes)
  name: { startX: 310, y: 692, boxW: 34.5, boxH: 44, count: 24 },

  // 2. Baptismal Name (24 Boxes)
  baptismalName: { startX: 310, y: 752, boxW: 34.5, boxH: 44, count: 24 },

  // 3. Date of Birth (2 + 2 + 4 = 8 Boxes)
  dobDay: { startX: 310, y: 818, boxW: 34.5, boxH: 44, count: 2 },
  dobMonth: { startX: 392, y: 818, boxW: 34.5, boxH: 44, count: 2 },
  dobYear: { startX: 474, y: 818, boxW: 34.5, boxH: 44, count: 4 },

  // 4. Nationality (12 Boxes)
  nationality: { startX: 710, y: 818, boxW: 34.5, boxH: 44, count: 12 },

  // 5. Gender Checkboxes
  genderMale: { x: 372, y: 885, size: 24 },
  genderFemale: { x: 520, y: 885, size: 24 },

  // 6. Marital Status Checkboxes
  maritalMarried: { x: 772, y: 885, size: 24 },
  maritalBachelor: { x: 876, y: 885, size: 24 },
  maritalSpinster: { x: 980, y: 885, size: 24 },
  maritalWidowed: { x: 1084, y: 885, size: 24 },

  // 7. Permanent Address
  permDoorNo: { x: 290, y: 985, width: 240 },
  permStreet: { x: 600, y: 985, width: 540 },
  permCity: { x: 290, y: 1045, width: 660 },
  permPincode: { startX: 985, y: 1045, boxW: 26, boxH: 40, count: 6 },
  permTaluk: { x: 290, y: 1105, width: 430 },
  permDistrict: { x: 760, y: 1105, width: 380 },
  permState: { x: 290, y: 1165, width: 430 },
  permCountry: { x: 760, y: 1165, width: 380 },

  // 8. Contact Address
  contactDoorNo: { x: 290, y: 1260, width: 240 },
  contactStreet: { x: 600, y: 1260, width: 540 },
  contactCity: { x: 290, y: 1320, width: 660 },
  contactPincode: { startX: 985, y: 1320, boxW: 26, boxH: 40, count: 6 },
  contactTaluk: { x: 290, y: 1380, width: 430 },
  contactDistrict: { x: 760, y: 1380, width: 380 },
  contactState: { x: 290, y: 1440, width: 430 },
  contactCountry: { x: 760, y: 1440, width: 380 },
}

export const PAGE_2_FIELDS = {
  // II. Calling Checkboxes
  callingApostle: { x: 270, y: 200, size: 24 },
  callingProphet: { x: 430, y: 200, size: 24 },
  callingPastor: { x: 580, y: 200, size: 24 },
  callingTeacher: { x: 730, y: 200, size: 24 },
  callingEvangelist: { x: 880, y: 200, size: 24 },
  callingAssociate: { x: 270, y: 245, size: 24 },
  callingOther: { x: 580, y: 245, size: 24 },
  callingOtherText: { x: 780, y: 242, width: 360 },

  // III. Affiliation
  affIndependent: { x: 310, y: 330, size: 24 },
  affFounderName: { x: 720, y: 326, width: 420 },
  affDenomination: { x: 310, y: 380, size: 24 },
  affDenomSpecify: { x: 720, y: 376, width: 420 },
  affAssociate: { x: 310, y: 430, size: 24 },
  affChiefPastor: { x: 620, y: 426, width: 520 },
  affMotherChurch: { x: 620, y: 472, width: 520 },
  affTrustName: { x: 450, y: 522, width: 690 },

  // IV. Church Details
  churchName: { startX: 310, y: 615, boxW: 34.5, boxH: 44, count: 24 },
  churchDoorNo: { x: 290, y: 685, width: 240 },
  churchStreet: { x: 600, y: 685, width: 540 },
  churchCity: { x: 290, y: 745, width: 660 },
  churchPincode: { startX: 985, y: 745, boxW: 26, boxH: 40, count: 6 },
  churchTaluk: { x: 290, y: 805, width: 430 },
  churchDistrict: { x: 760, y: 805, width: 380 },
  churchState: { x: 290, y: 865, width: 430 },
  churchTelephone: { x: 290, y: 925, width: 430 },
  churchMobile: { x: 760, y: 925, width: 380 },
  churchEmail: { x: 290, y: 985, width: 850 },

  // V. Spiritual Milestone Dates (Day 2 + Month 2 + Year 4)
  bornAgainDate: { startX: 910, y: 1090, boxW: 28, boxH: 40, count: 8 },
  waterBaptismDate: { startX: 910, y: 1165, boxW: 28, boxH: 40, count: 8 },
  holySpiritDate: { startX: 910, y: 1240, boxW: 28, boxH: 40, count: 8 },
  callingDate: { startX: 910, y: 1315, boxW: 28, boxH: 40, count: 8 },
  ministryStartDate: { startX: 910, y: 1390, boxW: 28, boxH: 40, count: 8 },
}

export const PAGE_3_FIELDS = {
  // Questions 6 & 7
  wantOrdinationYes: { x: 920, y: 185, size: 24 },
  wantOrdinationNo: { x: 1040, y: 185, size: 24 },
  wantAffiliationYes: { x: 920, y: 235, size: 24 },
  wantAffiliationNo: { x: 1040, y: 235, size: 24 },

  // VI. Academic Table Rows
  academicRows: [
    { y: 350, colExam: 190, colYear: 530, colInst: 750 },
    { y: 405, colExam: 190, colYear: 530, colInst: 750 },
    { y: 460, colExam: 190, colYear: 530, colInst: 750 },
  ],

  // VII. Theological Table Rows
  theologicalRows: [
    { y: 575, colExam: 190, colYear: 530, colInst: 750 },
    { y: 630, colExam: 190, colYear: 530, colInst: 750 },
  ],

  // VIII. Family Table Rows
  familyRows: [
    { y: 745, colName: 180, colDob: 460, colRel: 660, colProf: 880 },
    { y: 795, colName: 180, colDob: 460, colRel: 660, colProf: 880 },
    { y: 845, colName: 180, colDob: 460, colRel: 660, colProf: 880 },
    { y: 895, colName: 180, colDob: 460, colRel: 660, colProf: 880 },
  ],

  // IX. Motivation Box
  motivation: { x: 105, y: 1040, width: 1030, height: 420 },
}

export const PAGE_4_FIELDS = {
  // Reference 1: District Overseer
  ref1Name: { x: 320, y: 280, width: 440 },
  ref1Id: { x: 320, y: 330, width: 440 },
  ref1Phone: { x: 320, y: 380, width: 440 },
  ref1Since: { x: 320, y: 430, width: 440 },
  ref1Personally: { x: 230, y: 485, size: 24 },
  ref1Professionally: { x: 430, y: 485, size: 24 },

  // Reference 2: Taluk Co-ordinator
  ref2Name: { x: 820, y: 280, width: 340 },
  ref2Id: { x: 820, y: 330, width: 340 },
  ref2Phone: { x: 820, y: 380, width: 340 },
  ref2Since: { x: 820, y: 430, width: 340 },
  ref2Personally: { x: 730, y: 485, size: 24 },
  ref2Professionally: { x: 930, y: 485, size: 24 },

  // XI. Declaration
  decPlace: { x: 200, y: 1140, width: 300 },
  decDate: { x: 200, y: 1195, width: 300 },
  decSignature: { x: 760, y: 1160, width: 360 },
}
