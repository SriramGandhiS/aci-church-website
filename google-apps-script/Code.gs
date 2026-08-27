/**
 * ============================================================
 * ACI DIOCESE — GOOGLE APPS SCRIPT BACKEND API
 * Zero-Cost Architecture: Google Drive (Files) + Google Sheets (Metadata)
 * ============================================================
 * 
 * SCRIPT PROPERTIES CONFIGURATION:
 * - SPREADSHEET_ID: (Optional, defaults to active spreadsheet if bound)
 * - ADMIN_EMAILS: Comma-separated list of admin emails (e.g. "rev.johnsondurai@gmail.com,admin@acidiocese.org")
 * - DRIVE_FOLDER_NAME: "ACI Applications" (Default)
 */

// Global Sheet Names
var SHEETS = {
  USERS: 'Users',
  APPLICATIONS: 'Applications',
  DOCUMENTS: 'Documents',
  STATUS_HISTORY: 'StatusHistory',
  AUDIT_LOG: 'AuditLog'
};

/**
 * Handle HTTP GET Requests
 */
function doGet(e) {
  return handleRequest(e, 'GET');
}

/**
 * Handle HTTP POST Requests
 */
function doPost(e) {
  return handleRequest(e, 'POST');
}

/**
 * Unified Request Router
 */
function handleRequest(e, method) {
  var output;
  try {
    var params = {};
    if (e.parameter) {
      params = e.parameter;
    }
    
    // Parse JSON body for POST requests if available
    var postData = {};
    if (e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
      } catch (err) {
        // Raw form post fallback
      }
    }
    
    var data = Object.assign({}, params, postData);
    var action = data.action || '';
    
    var result = {};
    
    switch (action) {
      case 'setup_database':
        result = setupDatabase();
        break;
        
      case 'auth_google':
        result = handleAuthGoogle(data);
        break;
        
      case 'request_email_otp':
        result = handleRequestEmailOtp(data);
        break;
        
      case 'verify_email_otp':
        result = handleVerifyEmailOtp(data);
        break;
        
      case 'get_my_application':
        result = handleGetMyApplication(data);
        break;
        
      case 'save_draft':
        result = handleSaveDraft(data);
        break;
        
      case 'upload_document':
        result = handleUploadDocument(data);
        break;
        
      case 'submit_application':
        result = handleSubmitApplication(data);
        break;
        
      case 'get_document_data':
        result = handleGetDocumentData(data);
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
        result = { success: false, error: 'INVALID_ACTION', message: 'Action not supported: ' + action };
    }
    
    output = ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    var errResult = {
      success: false,
      error: 'SERVER_ERROR',
      message: error.toString()
    };
    output = ContentService.createTextOutput(JSON.stringify(errResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return output;
}

/**
 * Get active Spreadsheet
 */
function getDb() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('SPREADSHEET_ID');
  if (sheetId) {
    return SpreadsheetApp.openById(sheetId);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Get or create root private Drive folder
 */
function getRootDriveFolder() {
  var props = PropertiesService.getScriptProperties();
  var folderName = props.getProperty('DRIVE_FOLDER_NAME') || 'ACI Applications';
  
  var folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(folderName);
}

/**
 * Setup Database: Creates missing sheets and headers safely
 */
function setupDatabase() {
  var db = getDb();
  
  var schemas = [
    {
      name: SHEETS.USERS,
      headers: ['userId', 'googleSub', 'email', 'name', 'avatar', 'createdAt', 'lastLoginAt', 'role']
    },
    {
      name: SHEETS.APPLICATIONS,
      headers: ['applicationId', 'userId', 'email', 'applicantName', 'mobileNumber', 'cityTown', 'district', 'ministryFunction', 'status', 'submittedAt', 'reviewedAt', 'reviewedBy', 'rejectionReason', 'applicationJson']
    },
    {
      name: SHEETS.DOCUMENTS,
      headers: ['documentId', 'applicationId', 'userId', 'documentType', 'fileName', 'driveFileId', 'uploadedAt', 'verificationStatus', 'adminNotes']
    },
    {
      name: SHEETS.STATUS_HISTORY,
      headers: ['historyId', 'applicationId', 'previousStatus', 'newStatus', 'changedBy', 'timestamp', 'reason']
    },
    {
      name: SHEETS.AUDIT_LOG,
      headers: ['timestamp', 'actorType', 'actorEmail', 'action', 'applicationId', 'details']
    }
  ];
  
  schemas.forEach(function(schema) {
    var sheet = db.getSheetByName(schema.name);
    if (!sheet) {
      sheet = db.insertSheet(schema.name);
      sheet.appendRow(schema.headers);
      sheet.getRange(1, 1, 1, schema.headers.length).setFontWeight('bold').setBackground('#f1f5f9');
      sheet.setFrozenRows(1);
    }
  });
  
  // Ensure Drive Root folder exists
  getRootDriveFolder();
  
  return { success: true, message: 'Database and Drive storage initialized successfully.' };
}

/**
 * Check if an email is an administrator
 */
function isAdminEmail(email) {
  if (!email) return false;
  var props = PropertiesService.getScriptProperties();
  var adminEmailsStr = props.getProperty('ADMIN_EMAILS') || 'rev.johnsondurai@gmail.com,admin@acidiocese.org';
  var list = adminEmailsStr.split(',').map(function(e) { return e.trim().toLowerCase(); });
  return list.indexOf(email.toLowerCase().trim()) !== -1;
}

/**
 * Handle Google Authentication
 */
function handleAuthGoogle(data) {
  var email = (data.email || '').toLowerCase().trim();
  var googleSub = data.googleSub || data.sub || '';
  var name = data.name || '';
  var avatar = data.avatar || data.picture || '';
  
  if (!email) {
    return { success: false, error: 'MISSING_EMAIL', message: 'Email is required.' };
  }
  
  var db = getDb();
  var userSheet = db.getSheetByName(SHEETS.USERS);
  var rows = userSheet.getDataRange().getValues();
  
  var existingUser = null;
  var rowIndex = -1;
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][2] && rows[i][2].toString().toLowerCase().trim() === email) {
      existingUser = {
        userId: rows[i][0],
        googleSub: rows[i][1],
        email: rows[i][2],
        name: rows[i][3],
        avatar: rows[i][4],
        createdAt: rows[i][5],
        lastLoginAt: rows[i][6],
        role: rows[i][7]
      };
      rowIndex = i + 1;
      break;
    }
  }
  
  var now = new Date().toISOString();
  var role = isAdminEmail(email) ? 'ADMIN' : 'APPLICANT';
  
  if (existingUser) {
    existingUser.name = name || existingUser.name;
    existingUser.avatar = avatar || existingUser.avatar;
    existingUser.lastLoginAt = now;
    existingUser.role = role;
    
    userSheet.getRange(rowIndex, 4).setValue(existingUser.name);
    userSheet.getRange(rowIndex, 5).setValue(existingUser.avatar);
    userSheet.getRange(rowIndex, 7).setValue(now);
    userSheet.getRange(rowIndex, 8).setValue(role);
  } else {
    var userId = 'USR-' + Utilities.getUuid().substring(0, 8).toUpperCase();
    existingUser = {
      userId: userId,
      googleSub: googleSub,
      email: email,
      name: name,
      avatar: avatar,
      createdAt: now,
      lastLoginAt: now,
      role: role
    };
    userSheet.appendRow([
      userId,
      googleSub,
      email,
      name,
      avatar,
      now,
      now,
      role
    ]);
  }
  
  // Create audit log
  logAudit('USER', email, 'LOGIN', '', 'User logged in via Google Auth');
  
  return {
    success: true,
    user: existingUser,
    isAdmin: role === 'ADMIN'
  };
}

/**
 * Request 6-Digit Email OTP
 */
function handleRequestEmailOtp(data) {
  var email = (data.email || '').toLowerCase().trim();
  if (!email || email.indexOf('@') === -1) {
    return { success: false, error: 'INVALID_EMAIL', message: 'Valid Google email address is required.' };
  }

  // Generate 6-digit random code
  var otp = Math.floor(100000 + Math.random() * 900000).toString();
  var now = new Date();
  var expiresAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString(); // 10 minutes

  var db = getDb();
  var otpSheet = db.getSheetByName('OtpStore');
  if (!otpSheet) {
    otpSheet = db.insertSheet('OtpStore');
    otpSheet.appendRow(['email', 'otp', 'expiresAt', 'attempts', 'createdAt']);
  }

  var rows = otpSheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toString().toLowerCase().trim() === email) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex !== -1) {
    otpSheet.getRange(rowIndex, 2).setValue(otp);
    otpSheet.getRange(rowIndex, 3).setValue(expiresAt);
    otpSheet.getRange(rowIndex, 4).setValue(0);
    otpSheet.getRange(rowIndex, 5).setValue(now.toISOString());
  } else {
    otpSheet.appendRow([email, otp, expiresAt, 0, now.toISOString()]);
  }

  // Send OTP Email via GmailApp
  try {
    var subject = 'ACI Diocese Application Verification Code: ' + otp;
    var body = 'Dear Applicant,\n\n' +
      'Your single-use verification code for the Apostolic Council of India Diocese Membership Portal is:\n\n' +
      '  =====================\n' +
      '        ' + otp + '\n' +
      '  =====================\n\n' +
      'This code is valid for 10 minutes. Please enter it in the website verification prompt to proceed to your application.\n\n' +
      'If you did not initiate this request, you can safely ignore this email.\n\n' +
      'Blessings,\nApostolic Council of India Diocese';

    MailApp.sendEmail(email, subject, body);
  } catch (err) {
    // Non-blocking mail fallback
  }

  return {
    success: true,
    message: 'Verification code sent to ' + email
  };
}

/**
 * Verify 6-Digit Email OTP and issue Authenticated Session
 */
function handleVerifyEmailOtp(data) {
  var email = (data.email || '').toLowerCase().trim();
  var inputOtp = (data.otp || '').toString().trim();
  var name = data.name || '';

  if (!email || !inputOtp) {
    return { success: false, error: 'MISSING_DATA', message: 'Email and verification code are required.' };
  }

  var db = getDb();
  var otpSheet = db.getSheetByName('OtpStore');
  if (!otpSheet) {
    return { success: false, error: 'NO_OTP_RECORD', message: 'No verification code requested.' };
  }

  var rows = otpSheet.getDataRange().getValues();
  var record = null;
  var rowIndex = -1;

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toString().toLowerCase().trim() === email) {
      record = {
        email: rows[i][0],
        otp: rows[i][1].toString().trim(),
        expiresAt: rows[i][2],
        attempts: Number(rows[i][3]) || 0
      };
      rowIndex = i + 1;
      break;
    }
  }

  if (!record) {
    return { success: false, error: 'INVALID_REQUEST', message: 'Please request a verification code first.' };
  }

  // Check Expiry
  var now = new Date();
  var expTime = new Date(record.expiresAt);
  if (now > expTime) {
    return { success: false, error: 'OTP_EXPIRED', message: 'Verification code has expired. Please request a new one.' };
  }

  // Check Attempts
  if (record.attempts >= 5) {
    return { success: false, error: 'TOO_MANY_ATTEMPTS', message: 'Too many incorrect attempts. Please request a new code.' };
  }

  // Verify Code
  if (record.otp !== inputOtp) {
    otpSheet.getRange(rowIndex, 4).setValue(record.attempts + 1);
    return { success: false, error: 'WRONG_OTP', message: 'Invalid verification code. Please check and re-enter.' };
  }

  // Valid OTP -> Clear OTP & Authenticate User
  otpSheet.deleteRow(rowIndex);

  return handleAuthGoogle({
    email: email,
    name: name,
    avatar: '',
    googleSub: 'google-otp-' + Utilities.getUuid().substring(0, 8)
  });
}

/**
 * Get Applicant's Current Application
 */
function handleGetMyApplication(data) {
  var email = (data.email || '').toLowerCase().trim();
  if (!email) return { success: false, error: 'UNAUTHORIZED' };
  
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var rows = appSheet.getDataRange().getValues();
  
  for (var i = rows.length - 1; i >= 1; i--) {
    if (rows[i][2] && rows[i][2].toString().toLowerCase().trim() === email) {
      var appJson = {};
      try {
        appJson = JSON.parse(rows[i][13] || '{}');
      } catch (e) {}
      
      // Get associated documents
      var documents = getApplicationDocuments(rows[i][0]);
      
      return {
        success: true,
        application: {
          applicationId: rows[i][0],
          userId: rows[i][1],
          email: rows[i][2],
          applicantName: rows[i][3],
          mobileNumber: rows[i][4],
          cityTown: rows[i][5],
          district: rows[i][6],
          ministryFunction: rows[i][7],
          status: rows[i][8],
          submittedAt: rows[i][9],
          reviewedAt: rows[i][10],
          reviewedBy: rows[i][11],
          rejectionReason: rows[i][12],
          data: appJson,
          documents: documents
        }
      };
    }
  }
  
  return { success: true, application: null };
}

/**
 * Save Application Draft
 */
function handleSaveDraft(data) {
  var email = (data.email || '').toLowerCase().trim();
  var formData = data.formData || {};
  if (!email) return { success: false, error: 'UNAUTHORIZED' };
  
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var rows = appSheet.getDataRange().getValues();
  
  var now = new Date().toISOString();
  var rowIndex = -1;
  var existingAppId = '';
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][2] && rows[i][2].toString().toLowerCase().trim() === email) {
      rowIndex = i + 1;
      existingAppId = rows[i][0];
      break;
    }
  }
  
  var applicantName = (formData.personal && formData.personal.name) || '';
  var mobileNumber = (formData.church && formData.church.mobileNumber) || '';
  var cityTown = (formData.personal && formData.personal.permanentAddress && formData.personal.permanentAddress.cityTown) || '';
  var district = (formData.personal && formData.personal.permanentAddress && formData.personal.permanentAddress.district) || '';
  var ministryFunction = (formData.spiritual && formData.spiritual.ministryFunction) || '';
  
  var jsonPayload = JSON.stringify(formData);
  
  if (rowIndex !== -1) {
    // If already submitted/accepted, do not overwrite status with DRAFT
    var currentStatus = rows[rowIndex - 1][8] || 'DRAFT';
    
    appSheet.getRange(rowIndex, 4).setValue(applicantName);
    appSheet.getRange(rowIndex, 5).setValue(mobileNumber);
    appSheet.getRange(rowIndex, 6).setValue(cityTown);
    appSheet.getRange(rowIndex, 7).setValue(district);
    appSheet.getRange(rowIndex, 8).setValue(ministryFunction);
    appSheet.getRange(rowIndex, 14).setValue(jsonPayload);
    
    return {
      success: true,
      applicationId: existingAppId,
      status: currentStatus,
      message: 'Draft auto-saved successfully.'
    };
  } else {
    var appId = 'DRAFT-' + Utilities.getUuid().substring(0, 6).toUpperCase();
    var userId = data.userId || ('USR-' + Utilities.getUuid().substring(0, 8).toUpperCase());
    
    appSheet.appendRow([
      appId,
      userId,
      email,
      applicantName,
      mobileNumber,
      cityTown,
      district,
      ministryFunction,
      'DRAFT',
      '',
      '',
      '',
      '',
      jsonPayload
    ]);
    
    return {
      success: true,
      applicationId: appId,
      status: 'DRAFT',
      message: 'Draft created successfully.'
    };
  }
}

/**
 * Upload Document to Private Google Drive Folder
 */
function handleUploadDocument(data) {
  var email = (data.email || '').toLowerCase().trim();
  var documentType = data.documentType || '';
  var fileName = data.fileName || 'document.jpg';
  var base64Data = data.base64Data || '';
  var applicationId = data.applicationId || 'PENDING';
  
  if (!email || !base64Data || !documentType) {
    return { success: false, error: 'INVALID_DATA', message: 'Missing document data or authentication.' };
  }
  
  // 1. Get or Create Application Folder in Drive
  var rootFolder = getRootDriveFolder();
  var appFolder;
  var safeFolderTitle = applicationId.indexOf('DRAFT') === 0 ? ('Draft_' + email.replace(/[^a-zA-Z0-9]/g, '_')) : applicationId;
  
  var existingFolders = rootFolder.getFoldersByName(safeFolderTitle);
  if (existingFolders.hasNext()) {
    appFolder = existingFolders.next();
  } else {
    appFolder = rootFolder.createFolder(safeFolderTitle);
  }
  
  // 2. Decode and create file in Drive
  var contentType = 'image/jpeg';
  var cleanBase64 = base64Data;
  if (base64Data.indexOf(';base64,') !== -1) {
    var parts = base64Data.split(';base64,');
    contentType = parts[0].replace('data:', '');
    cleanBase64 = parts[1];
  }
  
  var decodedBytes = Utilities.base64Decode(cleanBase64);
  var blob = Utilities.newBlob(decodedBytes, contentType, fileName);
  var driveFile = appFolder.createFile(blob);
  var driveFileId = driveFile.getId();
  
  // 3. Save Document Reference in Sheet
  var db = getDb();
  var docSheet = db.getSheetByName(SHEETS.DOCUMENTS);
  var docId = 'DOC-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  var now = new Date().toISOString();
  var userId = data.userId || email;
  
  docSheet.appendRow([
    docId,
    applicationId,
    userId,
    documentType,
    fileName,
    driveFileId,
    now,
    'UPLOADED',
    ''
  ]);
  
  return {
    success: true,
    documentId: docId,
    driveFileId: driveFileId,
    fileName: fileName,
    documentType: documentType
  };
}

/**
 * Get Document Base64 Data Stream from Private Drive
 */
function handleGetDocumentData(data) {
  var email = (data.email || '').toLowerCase().trim();
  var driveFileId = data.driveFileId || '';
  
  if (!email || !driveFileId) {
    return { success: false, error: 'UNAUTHORIZED' };
  }
  
  try {
    var file = DriveApp.getFileById(driveFileId);
    var blob = file.getBlob();
    var base64 = Utilities.base64Encode(blob.getBytes());
    var mimeType = blob.getContentType();
    
    return {
      success: true,
      mimeType: mimeType,
      fileName: file.getName(),
      base64Url: 'data:' + mimeType + ';base64,' + base64
    };
  } catch (err) {
    return { success: false, error: 'FILE_NOT_FOUND', message: err.toString() };
  }
}

/**
 * Submit Final Application
 */
function handleSubmitApplication(data) {
  var email = (data.email || '').toLowerCase().trim();
  var formData = data.formData || {};
  if (!email) return { success: false, error: 'UNAUTHORIZED' };
  
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var rows = appSheet.getDataRange().getValues();
  
  var rowIndex = -1;
  var currentAppId = '';
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][2] && rows[i][2].toString().toLowerCase().trim() === email) {
      rowIndex = i + 1;
      currentAppId = rows[i][0];
      break;
    }
  }
  
  // Generate Official Sequential Application ID if currently DRAFT
  var officialAppId = currentAppId;
  if (!officialAppId || officialAppId.indexOf('DRAFT') === 0) {
    var year = new Date().getFullYear();
    var count = rows.length; // Approximate counter
    var padded = ('0000' + count).slice(-4);
    officialAppId = 'ACI-' + year + '-' + padded;
  }
  
  var now = new Date().toISOString();
  var applicantName = (formData.personal && formData.personal.name) || '';
  var mobileNumber = (formData.church && formData.church.mobileNumber) || '';
  var cityTown = (formData.personal && formData.personal.permanentAddress && formData.personal.permanentAddress.cityTown) || '';
  var district = (formData.personal && formData.personal.permanentAddress && formData.personal.permanentAddress.district) || '';
  var ministryFunction = (formData.spiritual && formData.spiritual.ministryFunction) || '';
  
  var jsonPayload = JSON.stringify(formData);
  var userId = data.userId || ('USR-' + Utilities.getUuid().substring(0, 8).toUpperCase());
  
  if (rowIndex !== -1) {
    appSheet.getRange(rowIndex, 1).setValue(officialAppId);
    appSheet.getRange(rowIndex, 4).setValue(applicantName);
    appSheet.getRange(rowIndex, 5).setValue(mobileNumber);
    appSheet.getRange(rowIndex, 6).setValue(cityTown);
    appSheet.getRange(rowIndex, 7).setValue(district);
    appSheet.getRange(rowIndex, 8).setValue(ministryFunction);
    appSheet.getRange(rowIndex, 9).setValue('SUBMITTED');
    appSheet.getRange(rowIndex, 10).setValue(now);
    appSheet.getRange(rowIndex, 14).setValue(jsonPayload);
  } else {
    appSheet.appendRow([
      officialAppId,
      userId,
      email,
      applicantName,
      mobileNumber,
      cityTown,
      district,
      ministryFunction,
      'SUBMITTED',
      now,
      '',
      '',
      '',
      jsonPayload
    ]);
  }
  
  // Log Status History & Audit
  logStatusHistory(officialAppId, 'DRAFT', 'SUBMITTED', email, 'Applicant submitted membership application');
  logAudit('USER', email, 'SUBMIT_APPLICATION', officialAppId, 'Application submitted with ID ' + officialAppId);
  
  // Send notification email to admin
  try {
    var props = PropertiesService.getScriptProperties();
    var adminEmails = props.getProperty('ADMIN_EMAILS') || 'rev.johnsondurai@gmail.com';
    var subject = 'New ACI Diocese Application Received: ' + officialAppId + ' (' + applicantName + ')';
    var body = 'A new official membership application has been submitted.\n\n' +
      'Application ID: ' + officialAppId + '\n' +
      'Applicant Name: ' + applicantName + '\n' +
      'Email: ' + email + '\n' +
      'Mobile: ' + mobileNumber + '\n' +
      'Ministry Calling: ' + ministryFunction + '\n' +
      'Submitted On: ' + now + '\n\n' +
      'Please log into the ACI Diocese Admin Dashboard to review the 2-page official application and supporting documents.';
      
    MailApp.sendEmail(adminEmails, subject, body);
  } catch (mailErr) {
    // Non-blocking mail failure
  }
  
  return {
    success: true,
    applicationId: officialAppId,
    status: 'SUBMITTED',
    submittedAt: now,
    message: 'Application submitted successfully.'
  };
}

/**
 * Admin: List All Applications
 */
function handleAdminListApplications(data) {
  var email = (data.adminEmail || '').toLowerCase().trim();
  if (!isAdminEmail(email)) {
    return { success: false, error: 'FORBIDDEN', message: 'You do not have administrative access.' };
  }
  
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var rows = appSheet.getDataRange().getValues();
  
  var list = [];
  for (var i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    list.push({
      applicationId: rows[i][0],
      userId: rows[i][1],
      email: rows[i][2],
      applicantName: rows[i][3],
      mobileNumber: rows[i][4],
      cityTown: rows[i][5],
      district: rows[i][6],
      ministryFunction: rows[i][7],
      status: rows[i][8],
      submittedAt: rows[i][9],
      reviewedAt: rows[i][10],
      reviewedBy: rows[i][11],
      rejectionReason: rows[i][12]
    });
  }
  
  return {
    success: true,
    applications: list
  };
}

/**
 * Admin: Get Complete Application Details
 */
function handleAdminGetApplication(data) {
  var email = (data.adminEmail || '').toLowerCase().trim();
  var applicationId = data.applicationId || '';
  
  if (!isAdminEmail(email)) {
    return { success: false, error: 'FORBIDDEN', message: 'You do not have administrative access.' };
  }
  
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var rows = appSheet.getDataRange().getValues();
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === applicationId) {
      var appJson = {};
      try {
        appJson = JSON.parse(rows[i][13] || '{}');
      } catch (e) {}
      
      var documents = getApplicationDocuments(applicationId);
      var history = getApplicationHistory(applicationId);
      
      return {
        success: true,
        application: {
          applicationId: rows[i][0],
          userId: rows[i][1],
          email: rows[i][2],
          applicantName: rows[i][3],
          mobileNumber: rows[i][4],
          cityTown: rows[i][5],
          district: rows[i][6],
          ministryFunction: rows[i][7],
          status: rows[i][8],
          submittedAt: rows[i][9],
          reviewedAt: rows[i][10],
          reviewedBy: rows[i][11],
          rejectionReason: rows[i][12],
          data: appJson,
          documents: documents,
          history: history
        }
      };
    }
  }
  
  return { success: false, error: 'NOT_FOUND', message: 'Application not found.' };
}

/**
 * Admin: Update Status (Accept / Reject / Under Review)
 */
function handleAdminUpdateStatus(data) {
  var adminEmail = (data.adminEmail || '').toLowerCase().trim();
  var applicationId = data.applicationId || '';
  var newStatus = data.newStatus || '';
  var reason = data.reason || '';
  
  if (!isAdminEmail(adminEmail)) {
    return { success: false, error: 'FORBIDDEN', message: 'You do not have administrative access.' };
  }
  
  if (newStatus === 'REJECTED' && !reason.trim()) {
    return { success: false, error: 'REASON_REQUIRED', message: 'A rejection reason is strictly required.' };
  }
  
  var db = getDb();
  var appSheet = db.getSheetByName(SHEETS.APPLICATIONS);
  var rows = appSheet.getDataRange().getValues();
  
  var rowIndex = -1;
  var previousStatus = '';
  var applicantEmail = '';
  var applicantName = '';
  
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === applicationId) {
      rowIndex = i + 1;
      previousStatus = rows[i][8];
      applicantEmail = rows[i][2];
      applicantName = rows[i][3];
      break;
    }
  }
  
  if (rowIndex === -1) {
    return { success: false, error: 'NOT_FOUND', message: 'Application not found.' };
  }
  
  var now = new Date().toISOString();
  appSheet.getRange(rowIndex, 9).setValue(newStatus);
  appSheet.getRange(rowIndex, 11).setValue(now);
  appSheet.getRange(rowIndex, 12).setValue(adminEmail);
  appSheet.getRange(rowIndex, 13).setValue(reason);
  
  logStatusHistory(applicationId, previousStatus, newStatus, adminEmail, reason);
  logAudit('ADMIN', adminEmail, 'UPDATE_STATUS', applicationId, 'Status changed from ' + previousStatus + ' to ' + newStatus + (reason ? (' Reason: ' + reason) : ''));
  
  // Send email to applicant
  if (applicantEmail && (newStatus === 'ACCEPTED' || newStatus === 'REJECTED')) {
    try {
      var subject = 'ACI Diocese Application Status Update: ' + newStatus + ' (' + applicationId + ')';
      var body = 'Dear ' + applicantName + ',\n\n' +
        'Your membership application with the Apostolic Council of India Diocese has been reviewed.\n\n' +
        'Application ID: ' + applicationId + '\n' +
        'Current Status: ' + newStatus + '\n\n';
        
      if (newStatus === 'ACCEPTED') {
        body += 'Congratulations! Your application has been approved. The central diocesan office will contact you regarding your induction and official membership certificate.\n\n';
      } else if (newStatus === 'REJECTED') {
        body += 'Decision Details / Reason:\n' + reason + '\n\n' +
          'If you wish to provide clarification or updated documents, please log into your applicant portal.\n\n';
      }
      
      body += 'Best regards,\nApostolic Council of India Diocese';
      MailApp.sendEmail(applicantEmail, subject, body);
    } catch (mailErr) {}
  }
  
  return {
    success: true,
    applicationId: applicationId,
    status: newStatus,
    reviewedAt: now,
    reviewedBy: adminEmail,
    rejectionReason: reason
  };
}

/**
 * Helper: Retrieve Documents for an Application
 */
function getApplicationDocuments(applicationId) {
  var db = getDb();
  var docSheet = db.getSheetByName(SHEETS.DOCUMENTS);
  if (!docSheet) return [];
  var rows = docSheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][1] === applicationId) {
      list.push({
        documentId: rows[i][0],
        applicationId: rows[i][1],
        userId: rows[i][2],
        documentType: rows[i][3],
        fileName: rows[i][4],
        driveFileId: rows[i][5],
        uploadedAt: rows[i][6],
        verificationStatus: rows[i][7],
        adminNotes: rows[i][8]
      });
    }
  }
  return list;
}

/**
 * Helper: Retrieve Status History for an Application
 */
function getApplicationHistory(applicationId) {
  var db = getDb();
  var historySheet = db.getSheetByName(SHEETS.STATUS_HISTORY);
  if (!historySheet) return [];
  var rows = historySheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][1] === applicationId) {
      list.push({
        historyId: rows[i][0],
        applicationId: rows[i][1],
        previousStatus: rows[i][2],
        newStatus: rows[i][3],
        changedBy: rows[i][4],
        timestamp: rows[i][5],
        reason: rows[i][6]
      });
    }
  }
  return list;
}

/**
 * Helper: Log Status History
 */
function logStatusHistory(applicationId, prevStatus, newStatus, changedBy, reason) {
  var db = getDb();
  var sheet = db.getSheetByName(SHEETS.STATUS_HISTORY);
  if (!sheet) return;
  var id = 'HIST-' + Utilities.getUuid().substring(0, 8).toUpperCase();
  sheet.appendRow([
    id,
    applicationId,
    prevStatus,
    newStatus,
    changedBy,
    new Date().toISOString(),
    reason || ''
  ]);
}

/**
 * Helper: Log Audit Trail
 */
function logAudit(actorType, actorEmail, action, applicationId, details) {
  var db = getDb();
  var sheet = db.getSheetByName(SHEETS.AUDIT_LOG);
  if (!sheet) return;
  sheet.appendRow([
    new Date().toISOString(),
    actorType,
    actorEmail,
    action,
    applicationId || '',
    details || ''
  ]);
}
