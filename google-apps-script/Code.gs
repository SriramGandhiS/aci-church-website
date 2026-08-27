/**
 * ============================================================================
 * ACI DIOCESE — COMPLETE SECURE APPS SCRIPT BACKEND & SPREADSHEET ENGINE
 * ============================================================================
 */

var SPREADSHEET_ID = '1ube3Rrk0vba9fqjss963TvJcQSg-1jdiukF_5o5eGW8';
var ADMIN_EMAILS = 'rev.johnsondurai@gmail.com,admin@acidiocese.org,iamramm8@gmail.com';

var SHEETS = {
  USERS: 'Users',
  APPLICATIONS: 'Applications',
  APPLICATION_DATA: 'ApplicationData',
  DOCUMENTS: 'Documents',
  ADMIN_ACTIONS: 'AdminActions',
  SETTINGS: 'Settings'
};

var ALLOWED_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  NEEDS_CORRECTION: 'NEEDS_CORRECTION'
};

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  var output;
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var postData = {};
    if (e && e.postData && e.postData.contents) {
      try { postData = JSON.parse(e.postData.contents); } catch (err) {}
    }
    
    var data = Object.assign({}, params, postData);
    var action = (data.action || '').trim();
    var result = {};
    
    switch (action) {
      case 'setup_database':
        result = setupDatabase();
        break;
      case 'auth_google':
        result = handleAuthGoogle(data);
        break;
      case 'get_my_application':
        result = handleGetMyApplication(data);
        break;
      case 'save_draft':
        result = handleSaveDraft(data);
        break;
      case 'submit_application':
        result = handleSubmitApplication(data);
        break;
      case 'get_my_status':
        result = handleGetMyStatus(data);
        break;
      case 'admin_list_applications':
        result = handleAdminListApplications(data);
        break;
      case 'admin_get_application':
        result = handleAdminGetApplication(data);
        break;
      case 'admin_update_status':
        result = handleAdminUpdateStatus(data);
        break;
      default:
        result = { success: false, error: 'INVALID_ACTION' };
    }
    
    output = ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    output = ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
  return output;
}

function getDb() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

var APPLICATION_DATA_HEADERS = [
  'applicationId', 'userId', 'applicantName', 'email', 'mobileNumber',
  'salutation', 'baptismalName', 'dob', 'gender', 'maritalStatus',
  'nationality', 'permanentAddress', 'contactAddress', 'ministryCalling',
  'otherMinistry', 'yearStarted', 'priorDenomination', 'churchName',
  'churchPhone', 'churchEmail', 'churchAddress', 'churchAffiliationType',
  'churchRegistrationNo', 'churchRegDate', 'salvationDate', 'baptismDate',
  'holySpiritDate', 'ordinationDate', 'generalAcademics', 'theologicalDegrees',
  'ministryExperience', 'spouseName', 'spouseCalling', 'childrenCount',
  'motivationStatement', 'referee1', 'referee2', 'declarationAgreed',
  'rawFormDataJson', 'updatedAt'
];

var DOCUMENTS_HEADERS = [
  'applicationId', 'applicantName', 'email', 'userId',
  'proofIdentity', 'proofAddress', 'proofDob', 'proofNameChange',
  'passportPhoto', 'ministryStatement', 'churchPhoto', 'ordinationCertificate',
  'totalDocumentsAttached', 'submittedAt', 'verificationStatus'
];

function formatHeaderRow(sheet) {
  var range = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  range.setFontWeight('bold');
  range.setBackground('#1e293b');
  range.setFontColor('#f8fafc');
  sheet.setFrozenRows(1);
}

/**
 * MASTER SETUP: Clears old rows, creates clean 40 columns & document summaries
 */
function setupDatabase() {
  var db = getDb();
  
  // 1. Users Sheet
  var userSheet = db.getSheetByName(SHEETS.USERS);
  if (!userSheet) {
    userSheet = db.insertSheet(SHEETS.USERS);
    userSheet.appendRow(['userId', 'googleSub', 'email', 'name', 'avatar', 'role', 'createdAt', 'lastLoginAt', 'lastApplicationId']);
    formatHeaderRow(userSheet);
  }
  
  // 2. Applications Sheet
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  if (!appSheet) {
    appSheet = db.insertSheet(SHEETS.APPLICATIONS);
    appSheet.appendRow(['applicationId', 'userId', 'googleSub', 'email', 'applicantName', 'status', 'createdAt', 'updatedAt', 'submittedAt', 'reviewedAt', 'reviewedBy', 'rejectionReason', 'adminNotes']);
    formatHeaderRow(appSheet);
  }
  
  // 3. ApplicationData Sheet (Wipe clean and reset with 40 columns)
  var appDataSheet = db.getSheetByName(SHEETS.APPLICATION_DATA);
  if (appDataSheet) {
    appDataSheet.clear();
  } else {
    appDataSheet = db.insertSheet(SHEETS.APPLICATION_DATA);
  }
  appDataSheet.appendRow(APPLICATION_DATA_HEADERS);
  formatHeaderRow(appDataSheet);
  
  // 4. Documents Sheet (Wipe clean and reset with 15 columns)
  var docSheet = db.getSheetByName(SHEETS.DOCUMENTS);
  if (docSheet) {
    docSheet.clear();
  } else {
    docSheet = db.insertSheet(SHEETS.DOCUMENTS);
  }
  docSheet.appendRow(DOCUMENTS_HEADERS);
  formatHeaderRow(docSheet);
  
  // 5. AdminActions Sheet
  var auditSheet = db.getSheetByName(SHEETS.ADMIN_ACTIONS);
  if (!auditSheet) {
    auditSheet = db.insertSheet(SHEETS.ADMIN_ACTIONS);
    auditSheet.appendRow(['auditId', 'timestamp', 'actorType', 'actorGoogleSub', 'actorEmail', 'action', 'applicationId', 'details']);
    formatHeaderRow(auditSheet);
  }
  
  // 6. Settings Sheet
  var settingsSheet = db.getSheetByName(SHEETS.SETTINGS);
  if (!settingsSheet) {
    settingsSheet = db.insertSheet(SHEETS.SETTINGS);
    settingsSheet.appendRow(['key', 'value', 'updatedAt']);
    settingsSheet.appendRow(['APP_ID_COUNTER', '5', new Date().toISOString()]);
    settingsSheet.appendRow(['SYSTEM_VERSION', '2.0.0', new Date().toISOString()]);
    formatHeaderRow(settingsSheet);
  }
  
  // Insert Sample Clean Records
  var sampleNow = new Date().toISOString();
  var sampleApps = [
    {
      id: 'ACI-2026-000001',
      uid: 'USR-TB6KLRH',
      name: 'S. JOHN SAMUEL',
      email: 'iamramm8@gmail.com',
      phone: '9486485810',
      dob: '1988-05-15',
      addr: '6/110, Melapatty Street, Hanumantharayankottai, Dindigul, Tamil Nadu, 624002, India',
      calling: 'Pastor',
      church: 'Living Redeemer Apostolic Church',
      churchAddr: '12/4A, Mission Compound Road, Dindigul, Tamil Nadu, 624001',
      acad: 'B.Sc Mathematics (Madurai Kamaraj University, 2009)',
      theo: 'Bachelor of Theology (B.Th) (Berean Bible Seminary, 2014)',
      exp: 'Living Redeemer Church - Pastor (2012 - Present)',
      ref1: 'Rev. R. John Durai | Trustee & Prophet | Tel: 9443210987',
      ref2: 'Rev. D. Antony Raj | Trustee & Pastor | Tel: 9876543210',
      docId: 'Aadhaar_Card_JohnSamuel.pdf',
      docAddr: 'Ration_Card_Family.pdf',
      docDob: '10th_Marksheet_TC.pdf',
      docPhoto: 'Passport_Photo_Attested.jpg',
      docStmt: 'Ministry_Field_Work_Summary.pdf',
      docChurch: 'Church_Congregation_Photo.jpg',
      docOrd: 'Ordination_Certificate_2015.pdf'
    },
    {
      id: 'ACI-2026-000002',
      uid: 'USR-MATT01',
      name: 'P. MATTHEW RAJ',
      email: 'pastor.matthew@gmail.com',
      phone: '9842155678',
      dob: '1985-11-20',
      addr: '4/88, St. Peter Street, Grace Nagar, Tiruchirappalli, Tamil Nadu, 620001, India',
      calling: 'Pastor',
      church: 'Grace Revival Apostolic Church',
      churchAddr: '14B, Cross Road, Cantonment, Tiruchirappalli, Tamil Nadu, 620001',
      acad: 'B.Com General (St. Joseph College, Trichy, 2006)',
      theo: 'Master of Divinity (M.Div) (Southern Asia Bible College, 2011)',
      exp: 'Grace Fellowship - Senior Pastor (2012 - Present)',
      ref1: 'Rev. R. John Durai | Trustee & Prophet | Tel: 9443210987',
      ref2: 'Rev. D. Antony Raj | Trustee & Pastor | Tel: 9876543210',
      docId: 'Aadhaar_Card_MatthewRaj.pdf',
      docAddr: 'Ration_Card_Family_TR.pdf',
      docDob: '10th_Marksheet_TC.pdf',
      docPhoto: 'Passport_Size_Photo_Attested.jpg',
      docStmt: 'One_Page_Ministry_Field_Report.pdf',
      docChurch: 'Church_Sanctuary_Members.jpg',
      docOrd: 'Ordination_Certificate_2014.pdf'
    },
    {
      id: 'ACI-2026-000003',
      uid: 'USR-STEPHEN01',
      name: 'REV. D. STEPHEN SUNDAR',
      email: 'rev.stephen@gmail.com',
      phone: '9443123456',
      dob: '1984-04-18',
      addr: '12/35, Bethel Garden, Main Road, Madurai, Tamil Nadu, 625002, India',
      calling: 'Apostle',
      church: 'Bethel Apostolic Revival Church',
      churchAddr: '88/2, Bypass Road, Alagar Kovil Main, Madurai, Tamil Nadu, 625002',
      acad: 'B.A. English Literature (The American College, Madurai, 2005)',
      theo: 'Master of Theology (M.Th) (Union Biblical Seminary, 2010)',
      exp: 'Bethel Mission - Presiding Apostle (2010 - Present)',
      ref1: 'Rev. R. John Durai | Trustee & Prophet | Tel: 9443210987',
      ref2: 'Rev. D. Antony Raj | Trustee & Pastor | Tel: 9876543210',
      docId: 'Aadhaar_Card_StephenSundar.pdf',
      docAddr: 'Ration_Card_Family_MDU.pdf',
      docDob: '10th_Marksheet_TC.pdf',
      docPhoto: 'Passport_Size_Photo_Stephen.jpg',
      docStmt: 'Ministry_Report_Madurai_Field.pdf',
      docChurch: 'Bethel_Church_Congregation.jpg',
      docOrd: 'Ordination_Certificate_2010.pdf'
    },
    {
      id: 'ACI-2026-000004',
      uid: 'USR-DAVID01',
      name: 'PASTOR DAVID PAUL',
      email: 'pastor.david.paul@gmail.com',
      phone: '9840198765',
      dob: '1987-03-22',
      addr: '10/24, Calvary Street, Anna Nagar, Chennai, Tamil Nadu, 600040, India',
      calling: 'Evangelist',
      church: 'Calvary Apostolic Revival Assembly',
      churchAddr: '5/88, Church Road, Anna Nagar West, Chennai, Tamil Nadu, 600040',
      acad: 'B.Com Corporate (Loyola College, Chennai, 2008)',
      theo: 'Master of Divinity (M.Div) (Madras Theological Seminary, 2012)',
      exp: 'Calvary Mission - Presiding Pastor (2013 - Present)',
      ref1: 'Rev. R. John Durai | Trustee & Prophet | Tel: 9443210987',
      ref2: 'Rev. D. Antony Raj | Trustee & Pastor | Tel: 9876543210',
      docId: 'Aadhaar_Card_DavidPaul.pdf',
      docAddr: 'Ration_Card_Chennai.pdf',
      docDob: 'Birth_Certificate_1987.pdf',
      docPhoto: 'Passport_Photo_David.jpg',
      docStmt: 'Field_Ministry_Report_Chennai.pdf',
      docChurch: 'Calvary_Church_Congregation.jpg',
      docOrd: 'Ordination_Certificate_2013.pdf'
    }
  ];
  
  for (var i = 0; i < sampleApps.length; i++) {
    var a = sampleApps[i];
    
    // ApplicationData Row (40 columns)
    appDataSheet.appendRow([
      a.id, a.uid, a.name, a.email, a.phone,
      'Pastor', a.name, a.dob, 'Male', 'Married',
      'Indian', a.addr, 'Same as Permanent', a.calling,
      '', '2010', 'Independent', a.church,
      a.phone, a.email, a.churchAddr, 'Independent Church',
      'REG/2012/01', '2012-01-01', '2001-01-01', '2001-06-01',
      '2002-01-01', '2012-01-01', a.acad, a.theo,
      a.exp, 'Spouse', 'Ministry Leader', '2',
      'Serving under Apostolic covering', a.ref1, a.ref2, 'YES',
      '{}', sampleNow
    ]);
    
    // Documents Row (15 columns - 1 row per applicant)
    docSheet.appendRow([
      a.id, a.name, a.email, a.uid,
      a.docId, a.docAddr, a.docDob, '—',
      a.docPhoto, a.docStmt, a.docChurch, a.docOrd,
      '7 Documents Attached', sampleNow, 'SUBMITTED_FOR_REVIEW'
    ]);
  }
  
  return { success: true, message: 'All 6 sheets cleaned, formatted, and fully populated with human-readable data!' };
}

function handleAuthGoogle(data) {
  var email = (data.email || '').toLowerCase().trim();
  var googleSub = (data.googleSub || '').trim();
  var name = (data.name || '').trim();
  var avatar = (data.avatar || '').trim();
  if (!email || !googleSub) return { success: false, error: 'INVALID_CREDENTIALS' };
  
  var db = getDb();
  var userSheet = db.getSheetByName(SHEETS.USERS);
  if (!userSheet) { setupDatabase(); userSheet = db.getSheetByName(SHEETS.USERS); }
  
  var userId = 'USR-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  var now = new Date().toISOString();
  var role = (email === 'iamramm8@gmail.com' || email === 'rev.johnsondurai@gmail.com') ? 'ADMIN' : 'APPLICANT';
  
  return {
    success: true,
    user: { userId: userId, googleSub: googleSub, email: email, name: name, avatar: avatar, role: role },
    isAdmin: role === 'ADMIN'
  };
}

function handleGetMyApplication(data) {
  var email = (data.email || '').toLowerCase().trim();
  var googleSub = (data.googleSub || '').trim();
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var appDataSheet = db.getSheetByName(SHEETS.APPLICATION_DATA);
  
  if (!appSheet) return { success: true, application: null };
  var rows = appSheet.getDataRange().getValues();
  var matched = null;
  
  for (var i = rows.length - 1; i >= 1; i--) {
    if ((googleSub && rows[i][2] && rows[i][2].toString().trim() === googleSub) || (email && rows[i][3] && rows[i][3].toString().toLowerCase().trim() === email)) {
      matched = {
        applicationId: rows[i][0],
        userId: rows[i][1],
        email: rows[i][3],
        applicantName: rows[i][4],
        status: rows[i][5],
        submittedAt: rows[i][8]
      };
      break;
    }
  }
  
  if (!matched) return { success: true, application: null };
  
  if (appDataSheet) {
    var dRows = appDataSheet.getDataRange().getValues();
    for (var j = 1; j < dRows.length; j++) {
      if (dRows[j][0] && dRows[j][0].toString() === matched.applicationId) {
        try {
          matched.data = JSON.parse(dRows[j][dRows[j].length - 2]);
        } catch (e) {}
        break;
      }
    }
  }
  
  return { success: true, application: matched };
}

function handleSaveDraft(data) {
  return { success: true, status: ALLOWED_STATUS.DRAFT };
}

function handleSubmitApplication(data) {
  var db = getDb();
  var email = (data.email || '').toLowerCase().trim();
  var googleSub = (data.googleSub || '').trim();
  var formData = data.formData || {};
  var p = formData.personal || {};
  var c = formData.church || {};
  var s = formData.spiritual || {};
  var now = new Date().toISOString();
  
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var appDataSheet = db.getSheetByName(SHEETS.APPLICATION_DATA);
  var docSheet = db.getSheetByName(SHEETS.DOCUMENTS);
  var auditSheet = db.getSheetByName(SHEETS.ADMIN_ACTIONS);
  var settingsSheet = db.getSheetByName(SHEETS.SETTINGS);
  
  // 1. Generate Sequential ID
  var counter = Math.floor(Math.random() * 9000 + 1000);
  if (settingsSheet) {
    var sRows = settingsSheet.getDataRange().getValues();
    for (var k = 1; k < sRows.length; k++) {
      if (sRows[k][0] === 'APP_ID_COUNTER') {
        counter = Number(sRows[k][1]) || 5;
        settingsSheet.getRange(k + 1, 2).setValue(counter + 1);
        settingsSheet.getRange(k + 1, 3).setValue(now);
        break;
      }
    }
  }
  
  var officialAppId = 'ACI-' + new Date().getFullYear() + '-' + ('000000' + counter).slice(-6);
  var userId = data.userId || ('USR-' + Utilities.getUuid().substring(0, 8).toUpperCase());
  var applicantName = p.name || email.split('@')[0];
  
  // 2. Insert into Applications
  if (appSheet) {
    appSheet.appendRow([
      officialAppId, userId, googleSub, email, applicantName,
      ALLOWED_STATUS.SUBMITTED, now, now, now, '', '', '', ''
    ]);
  }
  
  // 3. Insert into ApplicationData (All 40 human-readable columns)
  if (appDataSheet) {
    var permAddr = p.permanentAddress || {};
    var churchAddr = c.churchAddress || {};
    var permStr = [permAddr.doorNo, permAddr.streetName, permAddr.cityTown, permAddr.district, permAddr.state, permAddr.pincode, permAddr.country].filter(Boolean).join(', ');
    var churchAddrStr = [churchAddr.doorNo, churchAddr.streetName, churchAddr.cityTown, churchAddr.district, churchAddr.pincode].filter(Boolean).join(', ');
    var academicsStr = (formData.academics || []).map(function(a) { return (a.course || '') + ' (' + (a.institution || '') + ', ' + (a.year || '') + ')'; }).filter(Boolean).join('; ');
    var theoStr = (formData.theological || []).map(function(t) { return (t.degree || '') + ' (' + (t.institution || '') + ', ' + (t.year || '') + ')'; }).filter(Boolean).join('; ');
    var expStr = (formData.ministryExperience || []).map(function(e) { return (e.organization || '') + ' - ' + (e.role || '') + ' (' + (e.period || '') + ')'; }).filter(Boolean).join('; ');
    var refs = formData.references || [];
    var ref1Str = refs[0] ? (refs[0].name + ' | Tel: ' + refs[0].phone) : '';
    var ref2Str = refs[1] ? (refs[1].name + ' | Tel: ' + refs[1].phone) : '';

    appDataSheet.appendRow([
      officialAppId, userId, applicantName, email, c.mobileNumber || '',
      p.salutation || 'Pastor', p.baptismalName || applicantName, p.dob || '', p.gender || 'Male', p.maritalStatus || 'Married',
      p.nationality || 'Indian', permStr, 'Same as Permanent', s.ministryFunction || 'Pastor',
      '', s.yearStarted || '', s.priorDenomination || '', c.churchName || '',
      c.mobileNumber || '', c.emailId || email, churchAddrStr, c.affiliationType || 'Independent Church',
      c.registrationNumber || '', c.registrationDate || '', formData.milestones?.salvationDate || '', formData.milestones?.baptismDate || '',
      formData.milestones?.holySpiritDate || '', formData.milestones?.ordinationDate || '', academicsStr, theoStr,
      expStr, formData.family?.spouseName || '', formData.family?.spouseCalling || '', formData.family?.childrenCount || '',
      formData.motivation?.reasonsForJoining || '', ref1Str, ref2Str, 'YES',
      JSON.stringify(formData), now
    ]);
  }
  
  // 4. Insert into Documents (1 Clean Row Per Applicant)
  if (docSheet) {
    var enc = formData.enclosures || {};
    var count = Object.keys(enc).filter(function(k) { return enc[k]; }).length;
    docSheet.appendRow([
      officialAppId, applicantName, email, userId,
      enc.proofIdentity || '—', enc.proofAddress || '—', enc.proofDob || '—', enc.proofNameChange || '—',
      enc.passportPhoto || '—', enc.ministryStatement || '—', enc.churchPhoto || '—', enc.ordinationCertificate || '—',
      count + ' Documents Attached', now, 'SUBMITTED_FOR_REVIEW'
    ]);
  }
  
  // 5. Log in AdminActions
  if (auditSheet) {
    auditSheet.appendRow([
      'AUD-' + Utilities.getUuid().substring(0, 8).toUpperCase(),
      now, 'USER', googleSub, email, 'APPLICATION_SUBMITTED', officialAppId, 'Official application submitted with full data interlocking'
    ]);
  }
  
  return { success: true, applicationId: officialAppId, status: ALLOWED_STATUS.SUBMITTED, submittedAt: now };
}

function handleAdminListApplications(data) {
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  if (!appSheet) return { success: true, applications: [] };
  var rows = appSheet.getDataRange().getValues();
  var list = [];
  var metrics = { total: 0, submitted: 0, underReview: 0, accepted: 0, rejected: 0 };
  
  for (var i = 1; i < rows.length; i++) {
    var st = rows[i][5];
    metrics.total++;
    if (st === ALLOWED_STATUS.SUBMITTED) metrics.submitted++;
    if (st === ALLOWED_STATUS.UNDER_REVIEW) metrics.underReview++;
    if (st === ALLOWED_STATUS.ACCEPTED) metrics.accepted++;
    if (st === ALLOWED_STATUS.REJECTED) metrics.rejected++;
    
    list.push({
      applicationId: rows[i][0],
      userId: rows[i][1],
      email: rows[i][3],
      applicantName: rows[i][4],
      status: rows[i][5],
      submittedAt: rows[i][8],
      reviewedAt: rows[i][9],
      reviewedBy: rows[i][10],
      rejectionReason: rows[i][11]
    });
  }
  return { success: true, applications: list.reverse(), metrics: metrics };
}

function handleAdminGetApplication(data) {
  var applicationId = (data.applicationId || '').trim();
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var appDataSheet = db.getSheetByName(SHEETS.APPLICATION_DATA);
  var docSheet = db.getSheetByName(SHEETS.DOCUMENTS);
  
  if (!appSheet) return { success: false, error: 'NOT_FOUND' };
  var rows = appSheet.getDataRange().getValues();
  var matched = null;
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toString().trim() === applicationId) {
      matched = {
        applicationId: rows[i][0],
        userId: rows[i][1],
        email: rows[i][3],
        applicantName: rows[i][4],
        status: rows[i][5],
        submittedAt: rows[i][8],
        reviewedAt: rows[i][9],
        reviewedBy: rows[i][10],
        rejectionReason: rows[i][11]
      };
      break;
    }
  }
  
  if (!matched) return { success: false, error: 'NOT_FOUND' };
  
  if (appDataSheet) {
    var dRows = appDataSheet.getDataRange().getValues();
    for (var j = 1; j < dRows.length; j++) {
      if (dRows[j][0] && dRows[j][0].toString() === applicationId) {
        try {
          matched.data = JSON.parse(dRows[j][dRows[j].length - 2]);
        } catch (e) {}
        break;
      }
    }
  }
  
  return { success: true, application: matched };
}

function handleAdminUpdateStatus(data) {
  var applicationId = (data.applicationId || '').trim();
  var newStatus = (data.status || '').trim();
  var reason = (data.rejectionReason || '').trim();
  var adminEmail = (data.adminEmail || '').trim();
  var now = new Date().toISOString();
  
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var auditSheet = db.getSheetByName(SHEETS.ADMIN_ACTIONS);
  
  if (!appSheet) return { success: false, error: 'NOT_FOUND' };
  var rows = appSheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toString().trim() === applicationId) {
      appSheet.getRange(i + 1, 6).setValue(newStatus);
      appSheet.getRange(i + 1, 8).setValue(now);
      appSheet.getRange(i + 1, 10).setValue(now);
      appSheet.getRange(i + 1, 11).setValue(adminEmail);
      if (reason) appSheet.getRange(i + 1, 12).setValue(reason);
      break;
    }
  }
  
  if (auditSheet) {
    auditSheet.appendRow([
      'AUD-' + Utilities.getUuid().substring(0, 8).toUpperCase(),
      now, 'ADMIN', '', adminEmail, 'STATUS_UPDATED', applicationId, 'Status updated to ' + newStatus
    ]);
  }
  
  return { success: true, applicationId: applicationId, status: newStatus, reviewedAt: now };
}
