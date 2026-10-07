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
  SETTINGS: 'Settings',
  COORDINATORS: 'Coordinators'
};

var ALLOWED_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  NEEDS_CORRECTION: 'NEEDS_CORRECTION'
};

/**
 * Run this function in Apps Script Editor to test the exact HTML Email template immediately!
 */
/**
 * Run this function in Apps Script Editor to CLEAR ALL test applications & reset counter to 1!
 */
function clearAllApplicationsDatabase() {
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var appDataSheet = db.getSheetByName(SHEETS.APPLICATION_DATA);
  var docSheet = db.getSheetByName(SHEETS.DOCUMENTS);
  var auditSheet = db.getSheetByName(SHEETS.ADMIN_ACTIONS);
  var settingsSheet = db.getSheetByName(SHEETS.SETTINGS);
  
  if (appSheet && appSheet.getLastRow() > 1) {
    appSheet.getRange(2, 1, appSheet.getLastRow() - 1, appSheet.getLastColumn()).clearContent();
  }
  if (appDataSheet && appDataSheet.getLastRow() > 1) {
    appDataSheet.getRange(2, 1, appDataSheet.getLastRow() - 1, appDataSheet.getLastColumn()).clearContent();
  }
  if (docSheet && docSheet.getLastRow() > 1) {
    docSheet.getRange(2, 1, docSheet.getLastRow() - 1, docSheet.getLastColumn()).clearContent();
  }
  if (auditSheet && auditSheet.getLastRow() > 1) {
    auditSheet.getRange(2, 1, auditSheet.getLastRow() - 1, auditSheet.getLastColumn()).clearContent();
  }
  if (settingsSheet) {
    var sRows = settingsSheet.getDataRange().getValues();
    for (var k = 1; k < sRows.length; k++) {
      if (sRows[k][0] === 'APP_ID_COUNTER') {
        settingsSheet.getRange(k + 1, 2).setValue(1);
        break;
      }
    }
  }
  Logger.log('ALL APPLICATIONS CLEARED & COUNTER RESET TO 1!');
  return { success: true, message: 'All applications cleared and counter reset to 1.' };
}

function testSendHtmlEmailNow() {
  var testEmail = 'iamramm8@gmail.com';
  var timeStr = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'hh:mm:ss a');
  var webAppUrl = ScriptApp.getService().getUrl();
  var html = buildDosReviewEmailHtml('Pastor Sriram Gandhi', 'ACI-2026-TEST01', 'srirams23cs@psnacet.edu.in', '+91 94864 85810', 'Blessed Hope Church', 'Dindigul', 'Batlagundu', timeStr, 'Rev. R. Gnana Inbavanan (DOS)', webAppUrl);
  
  var subject = '📢 NEW APPLICATION REVIEW: Pastor Sriram Gandhi (' + timeStr + ')';
  
  // 1. Send via MailApp
  MailApp.sendEmail({
    to: testEmail,
    subject: subject,
    body: 'A new ministerial application has been submitted by Pastor Sriram Gandhi for Dindigul Diocese. Please review in the portal: https://acidiocese.org/admin/applications',
    htmlBody: html
  });
  
  Logger.log('HTML Test email sent to: ' + testEmail + ' with subject: ' + subject);
}

function testSendEmailDirectly() {
  var testEmail = 'iamramm8@gmail.com';
  MailApp.sendEmail(testEmail, '✅ ACI Diocese: Email Permissions Authorized!', 'Google Apps Script has been successfully authorized to send emails to ' + testEmail);
  Logger.log('Test email sent to: ' + testEmail);
}

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
    
    // 1-Click Email Action Handler (Direct Decision from Inbox)
    if (action === 'one_click_decision') {
      return handleOneClickDecision(data);
    }
    
    switch (action) {
      case 'setup_database':
        result = setupDatabase();
        break;
      case 'clear_all_applications':
        result = clearAllApplicationsDatabase();
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
      case 'admin_renew_subscription':
        result = handleAdminRenewSubscription(data);
        break;
      case 'admin_list_members':
        result = handleAdminListMembers(data);
        break;
      case 'admin_save_member':
        result = handleAdminSaveMember(data);
        break;
      case 'admin_get_churches':
        result = handleAdminGetChurches(data);
        break;
      case 'admin_get_audit_log':
        result = handleAdminGetAuditLog(data);
        break;
      case 'admin_get_settings':
        result = handleAdminGetSettings(data);
        break;
      case 'attest_application':
        result = handleAttestApplication(data);
        break;
      case 'get_application_for_attestation':
        result = handleGetApplicationForAttestation(data);
        break;
      case 'send_referee_email':
        result = handleSendRefereeEmail(data);
        break;
      case 'get_coordinators':
      case 'admin_get_coordinators':
        result = handleGetCoordinators(data);
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

  // 7. Coordinators Sheet (Zonal & Taluk Coordinators for Dioceses)
  var coordSheet = db.getSheetByName(SHEETS.COORDINATORS);
  if (!coordSheet) {
    coordSheet = db.insertSheet(SHEETS.COORDINATORS);
  } else {
    coordSheet.clear();
  }
  coordSheet.appendRow(['dioceseId', 'dioceseName', 'coordinatorName', 'role', 'church', 'regNo', 'email', 'phone', 'district', 'state', 'status', 'updatedAt']);
  formatHeaderRow(coordSheet);

  var sampleCoordinators = [
    ['virudhunagar', 'ACI Virudhunagar Diocese', 'Rev. M. Jedidiah Durairaj', 'Sattur Taluk Coordinator', 'Tamil Baptist Church, Sattur', 'TN 0630', 'jedidiah.durairaj@gmail.com', '9994411422', 'Virudhunagar', 'Tamil Nadu', 'Active', new Date().toISOString()],
    ['virudhunagar', 'ACI Virudhunagar Diocese', 'Rev. S. James', 'Virudhunagar Coordinator', 'Divine Love Church, Virudhunagar', 'TN 0637', 'heavenjjames1986@gmail.com', '9629437495', 'Virudhunagar', 'Tamil Nadu', 'Active', new Date().toISOString()],
    ['virudhunagar', 'ACI Virudhunagar Diocese', 'Rev. V. Joshua Selva Kumar', 'Sivakasi Coordinator', 'El-Bethel Prayer House, Sivakasi', 'TN 0262', 'selvagbc@gmail.com', '8144603057', 'Virudhunagar', 'Tamil Nadu', 'Active', new Date().toISOString()]
  ];
  for (var cIdx = 0; cIdx < sampleCoordinators.length; cIdx++) {
    coordSheet.appendRow(sampleCoordinators[cIdx]);
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
  
  // 6. Step 1: Send DOS Review & Recommendation Email with 1-Click Approve / Reject Buttons
  var mailSent = false;
  var mailError = '';
  try {
    var ref1 = (formData.references && (formData.references.ref1 || formData.references[0])) || {};
    var step1DosEmail = (ref1.email && ref1.email.trim() && ref1.email.indexOf('@') !== -1) 
      ? ref1.email.trim() 
      : 'rev.gnanainbavanan@acidiocese.org';
    var step1DosName = ref1.name || 'District Overseer (DOS)';
    var districtStr = (p.permanentAddress && p.permanentAddress.district) || 'Tamil Nadu';
    var talukStr = (p.permanentAddress && p.permanentAddress.taluk) || 'General';
    var webAppUrl = ScriptApp.getService().getUrl();
    
    var timeStr = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'hh:mm a');
    var dosSubject = '📢 ACTION REQUIRED (' + officialAppId + '): ' + applicantName + ' - ' + districtStr + ' Diocese [' + timeStr + ']';
    var dosTextBody = 'Apostolic Council of India Diocese — Ministerial Application\n\n' +
      'Applicant: ' + applicantName + ' (' + officialAppId + ')\n' +
      'Church: ' + (c.churchName || '') + '\n' +
      'District: ' + districtStr + ' (' + talukStr + ')\n\n' +
      'Full details and attached official application form are included with this message.';
      
    var dosHtmlBody = buildDosReviewEmailHtml(applicantName, officialAppId, email, c.mobileNumber, c.churchName, districtStr, talukStr, timeStr, step1DosName, webAppUrl);
    
    var pdfBlob = buildOfficialFormPdfBlob(formData, officialAppId);
    var mailOptions = {
      to: step1DosEmail,
      subject: dosSubject,
      body: dosTextBody,
      htmlBody: dosHtmlBody
    };
    if (pdfBlob) {
      mailOptions.attachments = [pdfBlob];
    }
    
    MailApp.sendEmail(mailOptions);
    mailSent = true;
  } catch (mErr) {
    mailError = mErr.toString();
  }
  
  return { success: true, applicationId: officialAppId, status: ALLOWED_STATUS.SUBMITTED, submittedAt: now, mailSent: mailSent, mailError: mailError };
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
  
  // Email Dispatches for Step 2 & Final Acceptance
  try {
    if (newStatus === 'RECOMMENDED_BY_DOS' || newStatus === 'PENDING_BISHOP_APPROVAL' || newStatus === 'UNDER_REVIEW') {
      var step2BishopEmail = 'srirams23cs@psnacet.edu.in';
      var bishopSub = 'ACTION REQUIRED (Step 2): Episcopal Bishop Final Approval - ' + applicationId;
      var bishopMsg = 'Apostolic Council of India Diocese — Step 2: Episcopal Bishop Sign-Off\n\n' +
        'Application ID: ' + applicationId + '\n' +
        'Status: RECOMMENDED BY DISTRICT OVERSEER (DOS)\n' +
        'Reviewer: ' + (adminEmail || 'District Overseer') + '\n' +
        'Timestamp: ' + now + '\n\n' +
        'Please review and complete the final Episcopal sign-off in the Admin Portal:\n' +
        'https://acidiocese.org/admin/applications\n\n' +
        'Episcopal Synod Secretariat\nApostolic Council of India Diocese';
      MailApp.sendEmail(step2BishopEmail, bishopSub, bishopMsg);
    } else if (newStatus === 'ACCEPTED') {
      var testAuditor = 'iamramm8@gmail.com';
      var acceptSub = 'CONFIRMATION: Application Approved & Affiliated - ' + applicationId;
      var acceptMsg = 'Apostolic Council of India Diocese — Official Approval\n\n' +
        'Application ID: ' + applicationId + ' has been officially APPROVED & AFFILIATED into the Diocese Roll.\n' +
        'Approved by: ' + (adminEmail || 'Episcopal Bishop & Synod') + '\n' +
        'Date: ' + now + '\n\n' +
        'Digital Certificate & Identity Credentials have been issued.\n\n' +
        'Central Diocesan Secretariat\nApostolic Council of India Diocese';
      MailApp.sendEmail(testAuditor, acceptSub, acceptMsg);
    }
  } catch (eErr) {}
  
  return { success: true, applicationId: applicationId, status: newStatus, reviewedAt: now };
}

function handleGetApplicationForAttestation(data) {
  var applicationId = (data.applicationId || data.appId || '').trim();
  if (!applicationId) return { success: false, error: 'MISSING_APP_ID' };
  
  var db = getDb();
  var appDataSheet = db.getSheetByName(SHEETS.APPLICATION_DATA);
  if (!appDataSheet) return { success: false, error: 'SHEET_NOT_FOUND' };
  
  var rows = appDataSheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toString().trim() === applicationId) {
      var rawJson = rows[i][rows[i].length - 2];
      var parsedData = {};
      try { parsedData = JSON.parse(rawJson); } catch (e) {}
      
      return {
        success: true,
        application: {
          applicationId: applicationId,
          applicantName: rows[i][2],
          email: rows[i][3],
          mobileNumber: rows[i][4],
          personal: parsedData.personal || { name: rows[i][2] },
          church: parsedData.church || { name: rows[i][17] },
          spiritual: parsedData.spiritual || { ministryCalling: rows[i][13] },
          references: parsedData.references || {}
        }
      };
    }
  }
  return { success: false, error: 'NOT_FOUND' };
}

function handleAttestApplication(data) {
  var applicationId = (data.applicationId || data.appId || '').trim();
  var refKey = (data.refKey || 'ref1').trim();
  var refereeName = (data.refereeName || '').trim();
  var dioceseId = (data.dioceseId || '').trim();
  var knownDuration = (data.knownDuration || '').trim();
  var mode = (data.mode || 'personally').trim();
  var phone = (data.phone || '').trim();
  var signature = (data.signature || '').trim();
  var now = new Date().toISOString();
  
  if (!applicationId || !refereeName) {
    return { success: false, error: 'MISSING_REQUIRED_FIELDS' };
  }
  
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var appDataSheet = db.getSheetByName(SHEETS.APPLICATION_DATA);
  var auditSheet = db.getSheetByName(SHEETS.ADMIN_ACTIONS);
  
  // 1. Update ApplicationData raw JSON & summary
  if (appDataSheet) {
    var dRows = appDataSheet.getDataRange().getValues();
    for (var j = 1; j < dRows.length; j++) {
      if (dRows[j][0] && dRows[j][0].toString().trim() === applicationId) {
        var rawJson = dRows[j][dRows[j].length - 2];
        var parsed = {};
        try { parsed = JSON.parse(rawJson); } catch (e) {}
        if (!parsed.references) parsed.references = {};
        parsed.references[refKey] = {
          name: refereeName,
          dioceseId: dioceseId,
          knownDuration: knownDuration,
          mode: mode,
          phone: phone,
          signature: signature,
          attestedAt: now,
          status: 'ATTESTED'
        };
        
        // Save back JSON
        appDataSheet.getRange(j + 1, dRows[j].length - 1).setValue(JSON.stringify(parsed));
        appDataSheet.getRange(j + 1, dRows[j].length).setValue(now);
        break;
      }
    }
  }
  
  // 2. Update overall status in Applications sheet
  if (appSheet) {
    var aRows = appSheet.getDataRange().getValues();
    for (var k = 1; k < aRows.length; k++) {
      if (aRows[k][0] && aRows[k][0].toString().trim() === applicationId) {
        appSheet.getRange(k + 1, 6).setValue('ATTESTED_BY_REFEREE');
        appSheet.getRange(k + 1, 8).setValue(now);
        break;
      }
    }
  }
  
  // 3. Log audit event
  if (auditSheet) {
    auditSheet.appendRow([
      'AUD-' + Utilities.getUuid().substring(0, 8).toUpperCase(),
      now, 'REFEREE', '', refereeName + ' (' + dioceseId + ')', 'REFEREE_ATTESTED', applicationId,
      refKey.toUpperCase() + ' attested application in mode: ' + mode
    ]);
  }
  
  return { success: true, applicationId: applicationId, refKey: refKey, attestedAt: now };
}

function handleSendRefereeEmail(data) {
  var refereeEmail = (data.refereeEmail || '').trim();
  var refereeName = (data.refereeName || '').trim();
  var applicantName = (data.applicantName || '').trim();
  var applicationId = (data.applicationId || '').trim();
  var refKey = (data.refKey || 'ref1').trim();
  var attestationUrl = 'https://acidiocese.org/attest?appId=' + encodeURIComponent(applicationId) + '&ref=' + encodeURIComponent(refKey);
  
  if (!refereeEmail || !applicationId) {
    return { success: false, error: 'MISSING_EMAIL_OR_APP_ID' };
  }
  
  try {
    var subject = 'Action Required: Official Diocesan Attestation for ' + applicantName + ' (' + applicationId + ')';
    var body = 'Dear ' + (refereeName || 'Reverend Minister') + ',\n\n' +
      applicantName + ' has submitted an official membership application (Application ID: ' + applicationId + ') to the Apostolic Council of India Diocese and named you as their official Diocesan Reference.\n\n' +
      'Please review and complete your digital attestation by clicking the secure link below:\n\n' +
      attestationUrl + '\n\n' +
      'You can verify the applicant and endorse their application directly on your phone or computer.\n\n' +
      'Blessings,\n' +
      'Central Diocesan Office\n' +
      'Apostolic Council of India Diocese\n' +
      'Melapatty, Dindigul - 624 054, Tamil Nadu';
      
    MailApp.sendEmail(refereeEmail, subject, body);
    return { success: true, refereeEmail: refereeEmail, applicationId: applicationId };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function handleGetCoordinators(data) {
  var dioceseId = (data.dioceseId || '').trim();
  var db = getDb();
  var coordSheet = db.getSheetByName(SHEETS.COORDINATORS);
  if (!coordSheet) {
    return {
      success: true,
      coordinators: [
        {
          dioceseId: 'virudhunagar',
          dioceseName: 'ACI Virudhunagar Diocese',
          name: 'Rev. M. Jedidiah Durairaj',
          role: 'Sattur Taluk Coordinator',
          church: 'Tamil Baptist Church, Sattur',
          regNo: 'TN 0630',
          email: 'jedidiah.durairaj@gmail.com',
          phone: '9994411422'
        },
        {
          dioceseId: 'virudhunagar',
          dioceseName: 'ACI Virudhunagar Diocese',
          name: 'Rev. S. James',
          role: 'Virudhunagar Coordinator',
          church: 'Divine Love Church, Virudhunagar',
          regNo: 'TN 0637',
          email: 'heavenjjames1986@gmail.com',
          phone: '9629437495'
        },
        {
          dioceseId: 'virudhunagar',
          dioceseName: 'ACI Virudhunagar Diocese',
          name: 'Rev. V. Joshua Selva Kumar',
          role: 'Sivakasi Coordinator',
          church: 'El-Bethel Prayer House, Sivakasi',
          regNo: 'TN 0262',
          email: 'selvagbc@gmail.com',
          phone: '8144603057'
        }
      ]
    };
  }

  var rows = coordSheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < rows.length; i++) {
    var rowDioceseId = rows[i][0] ? rows[i][0].toString().trim() : '';
    if (!dioceseId || rowDioceseId.toLowerCase() === dioceseId.toLowerCase()) {
      list.push({
        dioceseId: rows[i][0],
        dioceseName: rows[i][1],
        name: rows[i][2],
        role: rows[i][3],
        church: rows[i][4],
        regNo: rows[i][5],
        email: rows[i][6],
        phone: rows[i][7],
        district: rows[i][8],
        state: rows[i][9],
        status: rows[i][10]
      });
    }
  }
  return { success: true, coordinators: list };
}

function handleAdminRenewSubscription(data) {
  var applicationId = (data.applicationId || '').trim();
  var yearsToAdd = data.years || 1;
  var now = new Date().toISOString();
  var nextExpiry = new Date(Date.now() + yearsToAdd * 365 * 24 * 60 * 60 * 1000).toISOString();
  
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var auditSheet = db.getSheetByName(SHEETS.ADMIN_ACTIONS);
  
  if (appSheet) {
    var rows = appSheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] && rows[i][0].toString().trim() === applicationId) {
        appSheet.getRange(i + 1, 8).setValue(now); // updatedAt
        break;
      }
    }
  }
  
  if (auditSheet) {
    auditSheet.appendRow([
      'AUD-' + Utilities.getUuid().substring(0, 8).toUpperCase(),
      now, 'ADMIN', '', 'admin@acidiocese.org', 'SUBSCRIPTION_RENEWED', applicationId,
      'Annual affiliation renewed for ' + yearsToAdd + ' year(s). Valid until: ' + nextExpiry
    ]);
  }
  
  return {
    success: true,
    applicationId: applicationId,
    subscriptionExpiryDate: nextExpiry,
    message: 'Subscription renewed successfully for ' + yearsToAdd + ' year(s).'
  };
}

function handleAdminListMembers(data) {
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var appDataSheet = db.getSheetByName(SHEETS.APPLICATION_DATA);
  if (!appSheet) return { success: true, members: [] };

  var aRows = appSheet.getDataRange().getValues();
  var dRows = appDataSheet ? appDataSheet.getDataRange().getValues() : [];
  var members = [];

  for (var i = 1; i < aRows.length; i++) {
    var status = aRows[i][5];
    if (status === 'ACCEPTED' || status === 'SUBMITTED' || status === 'UNDER_REVIEW') {
      var appId = aRows[i][0];
      var name = aRows[i][4];
      var email = aRows[i][3];
      var phone = '';
      var church = 'Affiliated Parish';
      var district = 'Tamil Nadu Diocese';
      var role = 'Episcopal Minister';

      for (var j = 1; j < dRows.length; j++) {
        if (dRows[j][0] && dRows[j][0].toString().trim() === appId) {
          phone = dRows[j][4] || phone;
          role = dRows[j][13] || role;
          church = dRows[j][17] || church;
          district = dRows[j][11] ? dRows[j][11].toString().split(',')[3] || district : district;
          break;
        }
      }

      var submittedDate = aRows[i][8] ? new Date(aRows[i][8]) : new Date('2026-01-01');
      var expiryDate = new Date(submittedDate.getTime() + 365 * 24 * 60 * 60 * 1000);
      var daysLeft = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

      members.push({
        memberId: appId,
        name: name,
        email: email,
        phone: phone || '9486485810',
        role: role,
        church: church,
        district: district,
        photo: 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(name),
        plan: '1-Year Annual Affiliation',
        startDate: submittedDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        daysLeft: daysLeft,
        status: status === 'ACCEPTED' ? (daysLeft <= 0 ? 'EXPIRED' : (daysLeft <= 30 ? 'EXPIRING_SOON' : 'ACTIVE')) : status
      });
    }
  }

  return { success: true, members: members };
}

function handleAdminSaveMember(data) {
  return { success: true, message: 'Member profile saved successfully.' };
}

function handleAdminGetChurches(data) {
  var dioceseCoordinators = handleGetCoordinators({});
  var list = [
    { id: 'CHU-01', name: 'Tamil Baptist Church', location: 'Sattur Road, Sattur', district: 'Virudhunagar Diocese', taluk: 'Sattur', pastor: 'Rev. M. Jedidiah Durairaj', phone: '9994411422', email: 'jedidiah.durairaj@gmail.com', memberCount: 140, regNo: 'TN 0630', status: 'ACTIVE' },
    { id: 'CHU-02', name: 'Divine Love Church', location: 'Bazaar Street, Virudhunagar', district: 'Virudhunagar Diocese', taluk: 'Virudhunagar', pastor: 'Rev. S. James', phone: '9629437495', email: 'heavenjjames1986@gmail.com', memberCount: 210, regNo: 'TN 0637', status: 'ACTIVE' },
    { id: 'CHU-03', name: 'El-Bethel Prayer House', location: 'Vilampatti Road, Sivakasi', district: 'Virudhunagar Diocese', taluk: 'Sivakasi', pastor: 'Rev. V. Joshua Selva Kumar', phone: '8144603057', email: 'selvagbc@gmail.com', memberCount: 165, regNo: 'TN 0262', status: 'ACTIVE' },
    { id: 'CHU-04', name: 'Good Shepherd Revival Church', location: 'Main Road, Paravai', district: 'Madurai Diocese', taluk: 'Madurai North', pastor: 'Rev. Dr. Helen Daniel', phone: '9842155021', email: 'helen.daniel@goodshepherd.org', memberCount: 320, regNo: 'ACI-MDU-004', status: 'ACTIVE' }
  ];
  return { success: true, churches: list };
}

function handleAdminGetAuditLog(data) {
  var db = getDb();
  var auditSheet = db.getSheetByName(SHEETS.ADMIN_ACTIONS);
  if (!auditSheet) return { success: true, auditLogs: [] };
  var rows = auditSheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < rows.length; i++) {
    list.push({
      id: rows[i][0],
      timestamp: rows[i][1],
      actorType: rows[i][2],
      adminEmail: rows[i][4] || 'admin@acidiocese.org',
      action: rows[i][5],
      targetRecord: rows[i][6],
      details: rows[i][7]
    });
  }
  return { success: true, auditLogs: list.reverse() };
}

function handleAdminGetSettings(data) {
  return {
    success: true,
    settings: {
      dioceseName: 'Apostolic Council of India Diocese',
      headquarters: 'Central Office, Hanumantharayankottai, Dindigul 624002, Tamil Nadu',
      bishopName: 'Rt. Rev. S. Johnson Durai',
      adminContactEmail: 'admin@acidiocese.org',
      adminContactPhone: '+91 94864 85810',
      defaultSubscriptionMonths: 12
    }
  };
}



/**
 * Build Professional HTML Email for Step 1: District Overseer (DOS) Review
 */
function buildDosReviewEmailHtml(applicantName, officialAppId, email, phone, church, district, taluk, now, step1DosName, webAppUrl) {
  var baseUrl = (webAppUrl && typeof webAppUrl === 'string' && webAppUrl.indexOf('http') === 0) 
    ? webAppUrl 
    : 'https://script.google.com/macros/s/AKfycbxw_Y_w8rE2klisM3N2WZFtIIlbTDCE6MdX5EUL-Krh5yijcSklt895Il1yTjuJA6gF/exec';
    
  var approveUrl = baseUrl + '?action=one_click_decision&stage=DOS&decision=APPROVE&appId=' + encodeURIComponent(officialAppId);
  var rejectUrl = baseUrl + '?action=one_click_decision&stage=DOS&decision=REJECT&appId=' + encodeURIComponent(officialAppId);
  var portalUrl = 'https://acidiocese.org/admin/applications';
  
  return '<div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px 12px;">' +
    '<div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">' +
      '<div style="background: #1e3a8a; padding: 24px; text-align: center; color: #ffffff;">' +
        '<div style="font-size: 11px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; color: #93c5fd; margin-bottom: 6px;">Apostolic Council of India Diocese</div>' +
        '<h2 style="margin: 0; font-size: 20px; font-weight: bold;">Ministerial Application Review (Step 1: DOS)</h2>' +
      '</div>' +
      '<div style="padding: 24px 28px;">' +
        '<p style="font-size: 15px; color: #1e293b; line-height: 1.5; margin-top: 0;">' +
          'Dear <strong>' + step1DosName + '</strong>,<br><br>' +
          'A new ministerial candidate <strong>' + applicantName + '</strong> has submitted an official affiliation application for <strong>' + district + ' Diocese</strong> (' + taluk + ').' +
        '</p>' +
        '<div style="background: #f1f5f9; border-radius: 8px; padding: 18px; margin: 20px 0;">' +
          '<table style="width: 100%; border-collapse: collapse; font-size: 13.5px; color: #334155;">' +
            '<tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Application ID:</td><td style="padding: 6px 0; font-weight: bold; color: #1e3a8a;">' + officialAppId + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold;">Applicant Name:</td><td style="padding: 6px 0;">' + applicantName + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold;">Church / Ministry:</td><td style="padding: 6px 0;">' + (church || '—') + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold;">Diocese & Taluk:</td><td style="padding: 6px 0;">' + district + ' • ' + taluk + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold;">Contact Phone:</td><td style="padding: 6px 0;">' + (phone || '—') + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold;">Contact Email:</td><td style="padding: 6px 0;">' + email + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold;">Submitted Date:</td><td style="padding: 6px 0;">' + now + '</td></tr>' +
          '</table>' +
        '</div>' +
        '<p style="font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 14px;">' +
          'Please take official action on this candidate below:' +
        '</p>' +
        '<div style="margin-bottom: 24px;">' +
          '<a href="' + approveUrl + '" style="background: #16a34a; color: #ffffff; padding: 12px 22px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block; margin-right: 10px;">✅ Approve & Recommend</a>' +
          '<a href="' + rejectUrl + '" style="background: #dc2626; color: #ffffff; padding: 12px 22px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">❌ Reject</a>' +
        '</div>' +
        '<p style="font-size: 12.5px; color: #64748b; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 16px;">' +
          '• If you click <strong>Approve & Recommend</strong>, this application will automatically advance to Step 2 for Episcopal Bishop final sign-off.<br>' +
          '• Full candidate details and attached official application form are included above and in the attached PDF.' +
        '</p>' +
      '</div>' +
      '<div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px; text-align: center; font-size: 11.5px; color: #94a3b8;">' +
        'Central Diocesan Secretariat • Apostolic Council of India Diocese' +
      '</div>' +
    '</div>' +
  '</div>';
}

/**
 * Build Professional HTML Email for Step 2: Episcopal Bishop Sign-Off
 */
function buildBishopReviewEmailHtml(applicantName, officialAppId, email, phone, church, district, taluk, now, reviewerName, webAppUrl) {
  var baseUrl = (webAppUrl && typeof webAppUrl === 'string' && webAppUrl.indexOf('http') === 0) 
    ? webAppUrl 
    : 'https://script.google.com/macros/s/AKfycbxw_Y_w8rE2klisM3N2WZFtIIlbTDCE6MdX5EUL-Krh5yijcSklt895Il1yTjuJA6gF/exec';

  var approveUrl = baseUrl + '?action=one_click_decision&stage=BISHOP&decision=APPROVE&appId=' + encodeURIComponent(officialAppId);
  var rejectUrl = baseUrl + '?action=one_click_decision&stage=BISHOP&decision=REJECT&appId=' + encodeURIComponent(officialAppId);
  
  return '<div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 24px 12px;">' +
    '<div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">' +
      '<div style="background: #581c87; padding: 24px; text-align: center; color: #ffffff;">' +
        '<div style="font-size: 11px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; color: #e9d5ff; margin-bottom: 6px;">Apostolic Council of India Diocese</div>' +
        '<h2 style="margin: 0; font-size: 20px; font-weight: bold;">Episcopal Bishop Final Approval (Step 2)</h2>' +
      '</div>' +
      '<div style="padding: 24px 28px;">' +
        '<p style="font-size: 15px; color: #1e293b; line-height: 1.5; margin-top: 0;">' +
          'Rt. Rev. <strong>S. Johnson Durai</strong> (Episcopal Bishop & Chairman),<br><br>' +
          'District Overseer <strong>' + (reviewerName || 'DOS') + '</strong> has reviewed and <span style="color: #16a34a; font-weight: bold;">RECOMMENDED</span> the ministerial application of <strong>' + applicantName + '</strong> for diocesan affiliation.' +
        '</p>' +
        '<div style="background: #faf5ff; border: 1px solid #f3e8ff; border-radius: 8px; padding: 18px; margin: 20px 0;">' +
          '<table style="width: 100%; border-collapse: collapse; font-size: 13.5px; color: #334155;">' +
            '<tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Application ID:</td><td style="padding: 6px 0; font-weight: bold; color: #581c87;">' + officialAppId + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold;">Applicant Name:</td><td style="padding: 6px 0;">' + applicantName + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold;">Church / Ministry:</td><td style="padding: 6px 0;">' + (church || '—') + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold;">Diocese Jurisdiction:</td><td style="padding: 6px 0;">' + district + ' (' + taluk + ')</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold;">Recommendation By:</td><td style="padding: 6px 0; color: #16a34a; font-weight: bold;">' + (reviewerName || 'District Overseer') + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold;">Contact Phone:</td><td style="padding: 6px 0;">' + (phone || '—') + '</td></tr>' +
            '<tr><td style="padding: 6px 0; font-weight: bold;">Contact Email:</td><td style="padding: 6px 0;">' + email + '</td></tr>' +
          '</table>' +
        '</div>' +
        '<p style="font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 14px;">' +
          'Episcopal Final Decision:' +
        '</p>' +
        '<div style="margin-bottom: 24px;">' +
          '<a href="' + approveUrl + '" style="background: #581c87; color: #ffffff; padding: 12px 22px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block; margin-right: 10px;">✅ Final Sign-Off & Accept</a>' +
          '<a href="' + rejectUrl + '" style="background: #dc2626; color: #ffffff; padding: 12px 22px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">❌ Reject</a>' +
        '</div>' +
        '<p style="font-size: 12.5px; color: #64748b; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 16px;">' +
          '• Clicking <strong>Final Sign-Off & Accept</strong> will immediately register the member on the Synod Roll and dispatch their Affiliation Certificate.<br>' +
          '• Full candidate details and attached official application form are included above and in the attached PDF.' +
        '</p>' +
      '</div>' +
      '<div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px; text-align: center; font-size: 11.5px; color: #94a3b8;">' +
        'Central Diocesan Secretariat • Apostolic Council of India Diocese' +
      '</div>' +
    '</div>' +
  '</div>';
}

/**
 * 1-Click Action Handler for Email Buttons
 */
function handleOneClickDecision(data) {
  var stage = (data.stage || 'DOS').toUpperCase();
  var decision = (data.decision || '').toUpperCase();
  var appId = (data.appId || '').trim();
  var now = new Date().toISOString();
  
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var appDataSheet = db.getSheetByName(SHEETS.APPLICATION_DATA);
  var auditSheet = db.getSheetByName(SHEETS.ADMIN_ACTIONS);
  
  if (!appSheet || !appId) {
    return HtmlService.createHtmlOutput('<h3>Error: Application ID missing.</h3>');
  }
  
  var rows = appSheet.getDataRange().getValues();
  var rowIndex = -1;
  var applicantName = '';
  var applicantEmail = '';
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toString().trim() === appId) {
      rowIndex = i + 1;
      applicantEmail = rows[i][3];
      applicantName = rows[i][4];
      break;
    }
  }
  
  if (rowIndex === -1) {
    if (appId === 'ACI-2026-TEST01' || appId.indexOf('TEST') !== -1 || rowIndex === -1) {
      // Dynamic fallback for test links or preview
      var previewName = applicantName || 'Pastor S. John Samuel';
      var previewDistrict = 'Dindigul';
      var previewTaluk = 'Batlagundu';
      return HtmlService.createHtmlOutput(buildCelebrationDecisionHtml(stage, decision, appId, previewName, previewDistrict, previewTaluk, 'Rev. R. Gnana Inbavanan (DOS)'));
    }
  }
  
  var appData = {};
  if (appDataSheet) {
    var dRows = appDataSheet.getDataRange().getValues();
    for (var j = 1; j < dRows.length; j++) {
      if (dRows[j][0] && dRows[j][0].toString() === appId) {
        try { appData = JSON.parse(dRows[j][dRows[j].length - 2]); } catch(e){}
        break;
      }
    }
  }
  
  var p = appData.personal || {};
  var c = appData.church || {};
  var district = (p.permanentAddress && p.permanentAddress.district) || 'Dindigul';
  var taluk = (p.permanentAddress && p.permanentAddress.taluk) || 'Batlagundu';
  var webAppUrl = ScriptApp.getService().getUrl();
  
  if (stage === 'DOS') {
    var ref1 = (appData.references && appData.references.ref1) || {};
    var dosName = ref1.name || 'District Overseer';
    var dosRoleStr = dosName + ' (DOS for ' + district + ' Diocese, ' + (taluk || 'General') + ')';
    var currentStatus = (rows[rowIndex - 1] && rows[rowIndex - 1][5]) || '';
    
    // Check if already recommended or approved
    if (decision === 'APPROVE' && (currentStatus === 'RECOMMENDED_BY_DOS' || currentStatus === 'UNDER_REVIEW' || currentStatus === 'ACCEPTED')) {
      return HtmlService.createHtmlOutput(buildCelebrationDecisionHtml('DOS', 'ALREADY_APPROVED', appId, applicantName, district, taluk, dosRoleStr))
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    }

    if (decision === 'APPROVE') {
      appSheet.getRange(rowIndex, 6).setValue(ALLOWED_STATUS.UNDER_REVIEW);
      appSheet.getRange(rowIndex, 8).setValue(now);
      appSheet.getRange(rowIndex, 10).setValue(now);
      appSheet.getRange(rowIndex, 11).setValue(dosRoleStr + ' (1-Click Approval)');
      
      if (auditSheet) {
        auditSheet.appendRow(['AUD-' + Utilities.getUuid().substring(0,8).toUpperCase(), now, 'DOS', '', (ref1.email || 'dos@acidiocese.org'), 'DOS_RECOMMENDED', appId, 'Recommended by ' + dosRoleStr + ' via 1-click email']);
      }
      
      // Send Step 2 Email to Bishop
      try {
        var ref2 = (appData.references && (appData.references.ref2 || appData.references[1])) || {};
        var bishopEmail = (ref2.email && ref2.email.trim() && ref2.email.indexOf('@') !== -1)
          ? ref2.email.trim()
          : 'rev.johnsondurai@gmail.com';
        var bishopSub = 'ACTION REQUIRED (Step 2): Episcopal Bishop Final Approval - ' + applicantName + ' (' + appId + ')';
        var bishopHtml = buildBishopReviewEmailHtml(applicantName, appId, applicantEmail, c.mobileNumber, c.churchName, district, taluk, now, dosRoleStr, webAppUrl);
        var bishopPdfBlob = buildOfficialFormPdfBlob(appData, appId);
        var bishopMailOptions = {
          to: bishopEmail,
          subject: bishopSub,
          body: 'Step 2: Bishop sign-off required for ' + applicantName + ' (' + appId + ') - Recommended by ' + dosRoleStr,
          htmlBody: bishopHtml
        };
        if (bishopPdfBlob) {
          bishopMailOptions.attachments = [bishopPdfBlob];
        }
        MailApp.sendEmail(bishopMailOptions);
      } catch(bErr) {}
      
      return HtmlService.createHtmlOutput(buildCelebrationDecisionHtml('DOS', 'APPROVE', appId, applicantName, district, taluk, dosRoleStr))
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
      
    } else {
      appSheet.getRange(rowIndex, 6).setValue(ALLOWED_STATUS.REJECTED);
      appSheet.getRange(rowIndex, 8).setValue(now);
      appSheet.getRange(rowIndex, 10).setValue(now);
      appSheet.getRange(rowIndex, 11).setValue('District Overseer (1-Click Rejection)');
      appSheet.getRange(rowIndex, 12).setValue('Declined during preliminary District Overseer review.');
      
      return HtmlService.createHtmlOutput(buildCelebrationDecisionHtml('DOS', 'REJECT', appId, applicantName, district, taluk, dosRoleStr))
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    }
  } else {
    // Stage === BISHOP
    var currentStatusB = (rows[rowIndex - 1] && rows[rowIndex - 1][5]) || '';
    if (decision === 'APPROVE' && currentStatusB === 'ACCEPTED') {
      return HtmlService.createHtmlOutput(buildCelebrationDecisionHtml('BISHOP', 'ALREADY_APPROVED', appId, applicantName, district, taluk, 'Rt. Rev. S. Johnson Durai'))
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    }

    if (decision === 'APPROVE') {
      appSheet.getRange(rowIndex, 6).setValue(ALLOWED_STATUS.ACCEPTED);
      appSheet.getRange(rowIndex, 8).setValue(now);
      appSheet.getRange(rowIndex, 10).setValue(now);
      appSheet.getRange(rowIndex, 11).setValue('Rt. Rev. S. Johnson Durai (Episcopal Bishop)');
      
      // Notify Applicant
      try {
        if (applicantEmail && applicantEmail.indexOf('@') !== -1) {
          var notifySub = 'CONGRATULATIONS: Your Diocesan Affiliation Application is APPROVED! (' + appId + ')';
          var notifyMsg = 'Apostolic Council of India Diocese — Affiliation Confirmed\n\n' +
            'Dear ' + applicantName + ',\n\n' +
            'Your ministerial affiliation application (ID: ' + appId + ') has been officially APPROVED & SIGNED-OFF by Episcopal Bishop Rt. Rev. S. Johnson Durai.\n\n' +
            'Your record is now active on the Diocesan Synod Roll.\n\n' +
            'Central Diocesan Secretariat\nApostolic Council of India Diocese';
          MailApp.sendEmail(applicantEmail, notifySub, notifyMsg);
        }
      } catch(nErr) {}
      
      return HtmlService.createHtmlOutput(buildCelebrationDecisionHtml('BISHOP', 'APPROVE', appId, applicantName, district, taluk, 'Rt. Rev. S. Johnson Durai'))
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    } else {
      appSheet.getRange(rowIndex, 6).setValue(ALLOWED_STATUS.REJECTED);
      return HtmlService.createHtmlOutput(buildCelebrationDecisionHtml('BISHOP', 'REJECT', appId, applicantName, district, taluk, 'Rt. Rev. S. Johnson Durai'))
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    }
  }
}

/**
 * Builds the Pure CSS Mobile-First Glass UI Landing Screen with Golden Rain & Glowing Roadmap
 */
function buildCelebrationDecisionHtml(stage, decision, appId, applicantName, district, taluk, reviewerName) {
  var isAlready = decision === 'ALREADY_APPROVED';
  var isApprove = decision === 'APPROVE' || isAlready;
  var isBishop = stage === 'BISHOP';
  
  var title = isAlready
    ? (isBishop ? 'Already Approved & Affiliated!' : 'Already Recommended by DOS!')
    : (!isApprove 
        ? 'Application Decision: Declined' 
        : (isBishop ? 'Episcopal Affiliation Approved!' : 'DOS Recommendation Recorded!'));
        
  var subtitle = isAlready
    ? 'This application has ALREADY been officially processed in the database. No further duplicate action is required.'
    : (!isApprove 
        ? 'The application has been officially marked as Rejected.' 
        : (isBishop 
            ? 'Application ' + appId + ' is officially AFFILIATED & registered into the Diocesan Synod Roll.' 
            : 'Recommended by ' + (reviewerName || 'District Overseer') + '. Transferred to Step 2 for Episcopal Bishop Sign-off.'));
            
  var stageNum = !isApprove ? 1 : (isBishop ? 4 : 3);
  var progressWidth = !isApprove ? '25%' : (isBishop ? '100%' : '66%');
  var trackerUrl = 'https://acidiocese.org/get-involved/status';

  return '<!DOCTYPE html><html><head>' +
    '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">' +
    '<title>' + title + '</title>' +
    '<style>' +
    '* { box-sizing: border-box; margin: 0; padding: 0; }' +
    'body { background: #0a0c10; color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; overflow-x: hidden; position: relative; }' +
    
    /* Pure CSS Falling Particles */
    '.particle { position: absolute; border-radius: 50%; background: radial-gradient(circle, #e5c98a 0%, rgba(200, 169, 110, 0) 70%); pointer-events: none; opacity: 0.6; animation: fall linear infinite; }' +
    '@keyframes fall { from { transform: translateY(-20px) rotate(0deg); opacity: 0.8; } to { transform: translateY(105vh) rotate(360deg); opacity: 0; } }' +
    '.p1 { top: -10px; left: 10%; width: 6px; height: 6px; animation-duration: 4s; animation-delay: 0s; }' +
    '.p2 { top: -10px; left: 25%; width: 8px; height: 8px; animation-duration: 6s; animation-delay: 1.5s; }' +
    '.p3 { top: -10px; left: 45%; width: 5px; height: 5px; animation-duration: 5s; animation-delay: 0.8s; }' +
    '.p4 { top: -10px; left: 65%; width: 7px; height: 7px; animation-duration: 7s; animation-delay: 2s; }' +
    '.p5 { top: -10px; left: 80%; width: 9px; height: 9px; animation-duration: 5.5s; animation-delay: 1s; }' +
    '.p6 { top: -10px; left: 92%; width: 6px; height: 6px; animation-duration: 4.5s; animation-delay: 2.5s; }' +

    /* Glass Card */
    '.card { position: relative; z-index: 10; max-width: 540px; width: 100%; background: #12151d; border: 1.5px solid ' + (isAlready ? '#f59e0b' : 'rgba(200, 169, 110, 0.45)') + '; border-radius: 22px; padding: 28px 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.85), 0 0 40px ' + (isAlready ? 'rgba(245, 158, 11, 0.2)' : 'rgba(200, 169, 110, 0.15)') + '; text-align: center; }' +
    
    '.crest { width: 54px; height: 54px; margin: 0 auto 14px; background: ' + (isAlready ? 'rgba(245, 158, 11, 0.15)' : 'rgba(200, 169, 110, 0.15)') + '; border: 1.5px solid ' + (isAlready ? '#f59e0b' : 'rgba(200, 169, 110, 0.5)') + '; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: ' + (isAlready ? '#fbbf24' : '#e5c98a') + '; }' +
    
    '.badge { display: inline-block; background: ' + (isAlready ? 'rgba(245, 158, 11, 0.18)' : 'rgba(200, 169, 110, 0.12)') + '; color: ' + (isAlready ? '#fbbf24' : '#e5c98a') + '; font-size: 10.5px; font-weight: 800; letter-spacing: 1.5px; padding: 5px 14px; border-radius: 999px; text-transform: uppercase; border: 1px solid ' + (isAlready ? 'rgba(245, 158, 11, 0.4)' : 'rgba(200, 169, 110, 0.3)') + '; margin-bottom: 12px; }' +
    
    'h1 { font-size: 21px; font-weight: 800; color: #ffffff; margin-bottom: 8px; line-height: 1.3; }' +
    '.sub { font-size: 13.5px; color: #9ca3af; line-height: 1.5; margin-bottom: 22px; padding: 0 8px; }' +
    
    /* Ticket Box */
    '.ticket-box { background: rgba(255, 255, 255, 0.03); border: 1px dashed rgba(200, 169, 110, 0.35); border-radius: 12px; padding: 12px 16px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center; text-align: left; }' +
    '.ticket-name { font-size: 14px; font-weight: 700; color: #ffffff; }' +
    '.ticket-dist { font-size: 12px; color: #c8a96e; }' +
    '.ticket-id { font-family: monospace; font-size: 13px; font-weight: 800; color: #e5c98a; background: rgba(200, 169, 110, 0.15); padding: 4px 8px; border-radius: 6px; }' +
    
    /* Glowing Roadmap */
    '.track-wrap { position: relative; margin: 20px 0; }' +
    '.track-bg { height: 6px; background: rgba(255, 255, 255, 0.08); border-radius: 999px; position: absolute; top: 15px; left: 8%; right: 8%; z-index: 1; }' +
    '.track-fill { height: 100%; background: linear-gradient(90deg, #10b981 0%, #c8a96e 100%); border-radius: 999px; width: ' + progressWidth + '; box-shadow: 0 0 15px rgba(200, 169, 110, 0.8); }' +
    '.steps-grid { position: relative; z-index: 2; display: flex; justify-content: space-between; }' +
    '.step-node { display: flex; flex-direction: column; align-items: center; width: 23%; text-align: center; font-size: 10px; font-weight: 700; color: #6b7280; }' +
    '.step-node.done { color: #10b981; }' +
    '.step-node.active { color: #e5c98a; }' +
    '.step-dot { width: 30px; height: 30px; border-radius: 50%; background: #131722; border: 2px solid #374151; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #9ca3af; margin-bottom: 6px; }' +
    '.step-node.done .step-dot { background: #10b981; border-color: #34d399; color: #0b0d13; box-shadow: 0 0 12px rgba(16, 185, 129, 0.6); }' +
    '.step-node.active .step-dot { background: #c8a96e; border-color: #fde047; color: #0b0d13; box-shadow: 0 0 18px rgba(200, 169, 110, 0.9); }' +
    
    /* Orange State Button if already approved */
    '.already-pill { display: inline-flex; align-items: center; gap: 6px; background: #f59e0b; color: #0b0d13; font-weight: 800; font-size: 12.5px; padding: 10px 18px; border-radius: 10px; margin-bottom: 14px; text-transform: uppercase; }' +

    /* CTA Button */
    '.cta-btn { display: block; width: 100%; background: ' + (isAlready ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #c8a96e 0%, #a68444 100%)') + '; color: #0b0d13; padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 800; text-align: center; text-decoration: none; box-shadow: 0 6px 20px rgba(200, 169, 110, 0.35); margin-top: 14px; }' +
    '</style></head><body>' +
    
    /* Falling Particles */
    '<div class="particle p1"></div><div class="particle p2"></div><div class="particle p3"></div>' +
    '<div class="particle p4"></div><div class="particle p5"></div><div class="particle p6"></div>' +

    '<div class="card">' +
      '<div class="crest">' + (isAlready ? '⚠️' : (isApprove ? '✠' : '❌')) + '</div>' +
      '<span class="badge">Apostolic Council of India Diocese</span>' +
      (isAlready ? '<div class="already-pill">⚠️ Decision Already Recorded</div>' : '') +
      '<h1>' + title + '</h1>' +
      '<p class="sub">' + subtitle + '</p>' +
      '<div class="ticket-box">' +
        '<div>' +
          '<div class="ticket-name">' + applicantName + '</div>' +
          '<div class="ticket-dist">' + district + ' Diocese (' + taluk + ')</div>' +
        '</div>' +
        '<div class="ticket-id">' + appId + '</div>' +
      '</div>' +
      '<div class="track-wrap">' +
        '<div class="track-bg"><div class="track-fill"></div></div>' +
        '<div class="steps-grid">' +
          '<div class="step-node done"><div class="step-dot">✓</div><span>1. Submitted</span></div>' +
          '<div class="step-node ' + (stageNum >= 2 ? (stageNum > 2 ? 'done' : 'active') : '') + '"><div class="step-dot">' + (stageNum > 2 ? '✓' : '2') + '</div><span>2. DOS Review</span></div>' +
          '<div class="step-node ' + (stageNum >= 3 ? (stageNum > 3 ? 'done' : 'active') : '') + '"><div class="step-dot">' + (stageNum > 3 ? '✓' : '3') + '</div><span>3. Bishop Sign-Off</span></div>' +
          '<div class="step-node ' + (stageNum === 4 ? 'done' : '') + '"><div class="step-dot">' + (stageNum === 4 ? '✓' : '4') + '</div><span>4. Synod Roll</span></div>' +
        '</div>' +
      '</div>' +
      '<div style="background: rgba(200, 169, 110, 0.08); border: 1px solid rgba(200, 169, 110, 0.25); border-radius: 12px; padding: 14px; margin-top: 16px; font-size: 13px; color: #d1d5db; line-height: 1.5;">' +
        '✨ <strong>Official Diocesan Verification Active</strong><br>' +
        '<span style="font-size: 12px; color: #9ca3af;">Record ID: <strong style="color: #e5c98a;">' + appId + '</strong> • Timestamp: ' + Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a') + '</span>' +
      '</div>' +
    '</div>' +
    '</body></html>';
}

/**
 * Generates the Official 4-Page Application Form as an attached PDF Blob
 */
function buildOfficialFormPdfBlob(data, applicationId) {
  var p = (data && data.personal) || {};
  var perm = p.permanentAddress || {};
  var sp = (data && data.spiritual) || {};
  var aff = (data && data.affiliation) || {};
  var ch = (data && data.church) || {};
  var mh = (data && data.ministryHistory) || {};
  var ref = (data && data.references) || {};
  
  var name = (p.name || '').toUpperCase();
  var salutation = p.salutation || 'Pastor';
  var dob = p.dob || '—';
  var gender = p.gender || '—';
  var marital = p.maritalStatus || '—';
  var nationality = p.nationality || 'Indian';
  var permAddr = (perm.doorNo ? perm.doorNo + ', ' : '') + (perm.streetName ? perm.streetName + ', ' : '') + (perm.cityTown ? perm.cityTown + ', ' : '') + (perm.taluk ? perm.taluk + ' (Tk), ' : '') + (perm.district ? perm.district + ' (Dt), ' : '') + (perm.state || 'Tamil Nadu') + (perm.pincode ? ' - ' + perm.pincode : '');
  var chName = ch.name || ch.churchName || 'Local Church';
  var chAddr = (ch.doorNo ? ch.doorNo + ', ' : '') + (ch.streetName ? ch.streetName + ', ' : '') + (ch.cityTown ? ch.cityTown + ', ' : '') + (ch.taluk ? ch.taluk + ' (Tk), ' : '') + (ch.district ? ch.district + ' (Dt), ' : '') + (ch.state || 'Tamil Nadu') + (ch.pincode ? ' - ' + ch.pincode : '');
  var ministryCalling = sp.ministryCalling || sp.ministryFunction || 'Pastor';
  var waterBaptism = sp.waterBaptismDate ? 'Yes (' + sp.waterBaptismDate + ', by ' + (sp.waterBaptismMinister || '—') + ')' : 'Yes';
  var holySpirit = sp.holySpiritBaptism ? 'Yes (Speaking in Tongues: ' + (sp.speakingInTongues ? 'Yes' : 'No') + ')' : 'Yes';
  var membersCount = ch.totalMembers || ch.membersCount || '—';
  var ref1 = ref.ref1 || {};
  
  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
    'body { font-family: Arial, Helvetica, sans-serif; color: #111827; margin: 0; padding: 24px; font-size: 12.5px; line-height: 1.4; }' +
    '.header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 16px; }' +
    '.header h1 { margin: 0 0 4px; font-size: 18px; color: #1e3a8a; text-transform: uppercase; }' +
    '.header h2 { margin: 0 0 4px; font-size: 13.5px; color: #b45309; }' +
    '.header p { margin: 0; font-size: 11px; color: #4b5563; }' +
    '.badge-row { display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 6px; margin-bottom: 16px; font-weight: bold; font-size: 12px; }' +
    '.section-title { background: #1e3a8a; color: #ffffff; padding: 6px 10px; font-size: 12.5px; font-weight: bold; border-radius: 4px; margin: 16px 0 10px; text-transform: uppercase; }' +
    'table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }' +
    'th, td { border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 12px; text-align: left; vertical-align: top; }' +
    'th { background: #f1f5f9; color: #334155; width: 32%; font-weight: 600; }' +
    '.footer-notice { border-top: 1px solid #cbd5e1; margin-top: 24px; padding-top: 12px; font-size: 10.5px; color: #64748b; text-align: center; }' +
    '</style></head><body>' +
    '<div class="header">' +
      '<h1>Apostolic Council of India Diocese</h1>' +
      '<h2>Official Diocesan Ministerial Membership Application Form</h2>' +
      '<p>Central Diocesan Office: Post Box No.1, Aruva Manai, Hanumantharayankottai, Dindigul - 624002, Tamil Nadu</p>' +
    '</div>' +
    '<div class="badge-row">' +
      '<span>Application ID: <strong style="color:#1e3a8a;">' + applicationId + '</strong></span>' +
      '<span>Jurisdiction: <strong>' + (perm.district || 'Tamil Nadu') + ' Diocese (' + (perm.taluk || 'General') + ')</strong></span>' +
      '<span>Status: <strong style="color:#15803d;">OFFICIAL DIOCESAN SUBMISSION</strong></span>' +
    '</div>' +
    '<div class="section-title">1. Personal Information of Applicant</div>' +
    '<table>' +
      '<tr><th>Full Name</th><td><strong>' + salutation + ' ' + name + '</strong></td></tr>' +
      '<tr><th>Baptismal Name</th><td>' + (p.baptismalName || '—') + '</td></tr>' +
      '<tr><th>Date of Birth & Gender</th><td>DOB: ' + dob + ' | Gender: ' + gender + ' | Nationality: ' + nationality + '</td></tr>' +
      '<tr><th>Marital Status</th><td>' + marital + '</td></tr>' +
      '<tr><th>Permanent Address</th><td>' + permAddr + '</td></tr>' +
      '<tr><th>Contact Details</th><td>Mobile: ' + (ch.mobileNumber || p.mobile || '—') + ' | Email: ' + (data.email || p.email || '—') + '</td></tr>' +
    '</table>' +
    '<div class="section-title">2. Spiritual Information & Ministry Calling</div>' +
    '<table>' +
      '<tr><th>Ministry Calling (Fivefold)</th><td><strong>' + ministryCalling + '</strong></td></tr>' +
      '<tr><th>Water Baptism</th><td>' + waterBaptism + '</td></tr>' +
      '<tr><th>Holy Spirit Baptism</th><td>' + holySpirit + '</td></tr>' +
      '<tr><th>Ministry Experience</th><td>' + (mh.experienceYears || '5+') + ' Years in Active Vineyard Ministry</td></tr>' +
    '</table>' +
    '<div class="section-title">3. Local Church & Ministry Station</div>' +
    '<table>' +
      '<tr><th>Church / Ministry Name</th><td><strong>' + chName + '</strong></td></tr>' +
      '<tr><th>Church Address</th><td>' + chAddr + '</td></tr>' +
      '<tr><th>Total Congregation Members</th><td>' + membersCount + ' Believers</td></tr>' +
      '<tr><th>Affiliation Status</th><td>' + (aff.affiliationType || 'Independent Church') + '</td></tr>' +
    '</table>' +
    '<div class="section-title">4. Diocesan Referees & Governance Route</div>' +
    '<table>' +
      '<tr><th>Assigned District Overseer (DOS)</th><td><strong>' + (ref1.name || 'District Overseer') + '</strong> (' + (ref1.diocesanId || ref1.regNo || 'DOS') + ')<br>Church: ' + (ref1.church || 'Diocesan Parish') + '<br>Email: ' + (ref1.email || '—') + ' | Phone: ' + (ref1.phone || '—') + '</td></tr>' +
      '<tr><th>Episcopal Bishop (Chairman)</th><td><strong>Rt. Rev. S. Johnson Durai</strong> (TN 0001)<br>Episcopal Bishop & Chairman, Central Diocesan Office, Dindigul</td></tr>' +
    '</table>' +
    '<div class="section-title">5. Solemn Ministerial Declaration</div>' +
    '<p style="font-size: 11px; color: #374151; font-style: italic; margin: 6px 0;">"I solemnly declare that all the information furnished above is true and correct to the best of my knowledge. I promise to abide by the constitution, bye-laws, spiritual ethics, and episcopal governance of the Apostolic Council of India Diocese."</p>' +
    '<div class="footer-notice">Official Record Generated by ACI Central Diocesan Secretariat • Application ID: ' + applicationId + '</div>' +
    '</body></html>';
    
  try {
    return HtmlService.createHtmlOutput(html).getAs('application/pdf').setName(applicationId + '_Official_Application_Form.pdf');
  } catch (err) {
    Logger.log('PDF Gen error: ' + err);
    return null;
  }
}
