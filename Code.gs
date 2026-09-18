/**
 * =============================================================================
 * Galla Inquiry Form - Google Apps Script Backend
 * =============================================================================
 * 
 * Paste this script into your Google Sheet:
 * Extensions > Apps Script > Replace default Code.gs with this file.
 * 
 * Deployment:
 * 1. Click "Deploy" > "New deployment"
 * 2. Select type: "Web app"
 * 3. Description: "Galla Inquiry Web App v1"
 * 4. Execute as: "Me"
 * 5. Who has access: "Anyone" (IMPORTANT!)
 * 6. Click "Deploy", authorize access, and copy the Web App URL.
 */

/**
 * Handle incoming POST requests from the inquiry web form
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for other concurrent executions to finish
  var hasLock = lock.tryLock(10000);
  
  if (!hasLock) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Server is busy processing other requests. Please retry in a few seconds.'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // If the sheet is brand new or empty, automatically write the header row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Mobile Number", "Note"]);
      
      // Style headers
      var headerRange = sheet.getRange(1, 1, 1, 4);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4f46e5");
      headerRange.setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    // Parse incoming payload (supports both JSON body and standard Form POST)
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Extract fields
    var now = new Date();
    var formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    var name = (data.name || '').toString().trim();
    var rawMobile = (data.mobile || '').toString().trim();
    // Prefix mobile number with an apostrophe to guarantee Google Sheets treats it as text
    var mobile = rawMobile ? "'" + rawMobile : '';
    var note = (data.note || '').toString().trim();

    // Append new submission row
    sheet.appendRow([formattedDate, name, mobile, note]);

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Inquiry successfully saved.',
      timestamp: formattedDate
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Health check / friendly status when someone visits the Web App URL directly in browser
 */
function doGet(e) {
  return ContentService.createTextOutput(
    "✅ Galla Inquiry Form Backend is running successfully!\n" +
    "Send a POST request from the web form to record submissions."
  ).setMimeType(ContentService.MimeType.TEXT);
}
