/**
 * AusInd Bridge Foundation - Contact Form Handler
 * Google Apps Script to handle form submissions from the website
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet to store submissions
 * 2. Create a new Google Apps Script project (Extensions > Apps Script)
 * 3. Copy this code into the script editor
 * 4. Update the configuration variables below
 * 5. Deploy as Web App (Deploy > New Deployment)
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL and paste it in contact.html (SCRIPT_URL variable)
 * 7. Authorize the script to access your Google account
 */

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// Google Sheet ID where submissions will be stored
// Get this from your Google Sheet URL: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';

// Name of the sheet tab (will be created if doesn't exist)
const SHEET_NAME = 'Contact Submissions';

// Email address to receive notifications
const NOTIFICATION_EMAIL = 'info@ausindbridge.org';

// Enable/disable email notifications
const SEND_EMAIL_NOTIFICATIONS = true;

// Enable/disable auto-reply to the submitter
const SEND_AUTO_REPLY = true;

// ============================================
// MAIN HANDLER FUNCTION
// ============================================

/**
 * Handle POST requests from the contact form
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.fullName || !data.email || !data.subject || !data.enquiryType || !data.message) {
      return createResponse(false, 'Missing required fields');
    }
    
    // Validate email format
    if (!isValidEmail(data.email)) {
      return createResponse(false, 'Invalid email address');
    }
    
    // Save to Google Sheet
    const rowData = saveToSheet(data);
    
    // Send email notification to admin
    if (SEND_EMAIL_NOTIFICATIONS) {
      sendAdminNotification(data, rowData.rowNumber);
    }
    
    // Send auto-reply to submitter
    if (SEND_AUTO_REPLY) {
      sendAutoReply(data);
    }
    
    // Log success
    Logger.log('Form submission processed successfully: ' + data.email);
    
    return createResponse(true, 'Form submitted successfully', {
      submissionId: rowData.rowNumber,
      timestamp: data.timestamp
    });
    
  } catch (error) {
    Logger.log('Error processing form: ' + error.message);
    return createResponse(false, 'Server error: ' + error.message);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return HtmlService.createHtmlOutput(
    '<h1>AusInd Bridge Foundation - Contact Form API</h1>' +
    '<p>This endpoint accepts POST requests with contact form data.</p>' +
    '<p>Status: Active ✓</p>'
  );
}

// ============================================
// GOOGLE SHEET OPERATIONS
// ============================================

/**
 * Save form data to Google Sheet
 */
function saveToSheet(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      
      // Add headers
      const headers = [
        'Timestamp',
        'Full Name',
        'Email',
        'Phone',
        'Subject',
        'Enquiry Type',
        'Message',
        'Source',
        'Status',
        'Notes'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
      
      // Auto-resize columns
      sheet.autoResizeColumns(1, headers.length);
    }
    
    // Prepare row data
    const rowData = [
      new Date(data.timestamp),
      data.fullName,
      data.email,
      data.phone || 'Not provided',
      data.subject,
      data.enquiryType,
      data.message,
      data.source || 'Website Contact Form',
      'New',
      ''
    ];
    
    // Append to sheet
    sheet.appendRow(rowData);
    
    const lastRow = sheet.getLastRow();
    
    // Format the new row
    sheet.getRange(lastRow, 1).setNumberFormat('dd/mm/yyyy hh:mm:ss');
    sheet.getRange(lastRow, 9).setBackground('#fff2cc'); // Highlight status column
    
    Logger.log('Data saved to sheet at row: ' + lastRow);
    
    return {
      success: true,
      rowNumber: lastRow
    };
    
  } catch (error) {
    Logger.log('Error saving to sheet: ' + error.message);
    throw new Error('Failed to save to spreadsheet');
  }
}

// ============================================
// EMAIL NOTIFICATIONS
// ============================================

/**
 * Send email notification to admin
 */
function sendAdminNotification(data, rowNumber) {
  try {
    const subject = `New Contact Form Submission #${rowNumber} - ${data.enquiryType}`;
    
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0C2340; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .field { margin-bottom: 15px; }
          .field-label { font-weight: bold; color: #0C2340; }
          .field-value { margin-left: 10px; }
          .footer { margin-top: 20px; padding: 10px; text-align: center; font-size: 12px; color: #666; }
          .highlight { background: #D4AF37; color: white; padding: 2px 8px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
            <p>AusInd Bridge Foundation</p>
          </div>
          
          <div class="content">
            <div class="field">
              <span class="field-label">Submission ID:</span>
              <span class="field-value highlight">#${rowNumber}</span>
            </div>
            
            <div class="field">
              <span class="field-label">Timestamp:</span>
              <span class="field-value">${new Date(data.timestamp).toLocaleString('en-AU')}</span>
            </div>
            
            <div class="field">
              <span class="field-label">Enquiry Type:</span>
              <span class="field-value">${data.enquiryType}</span>
            </div>
            
            <hr>
            
            <div class="field">
              <span class="field-label">Name:</span>
              <span class="field-value">${data.fullName}</span>
            </div>
            
            <div class="field">
              <span class="field-label">Email:</span>
              <span class="field-value"><a href="mailto:${data.email}">${data.email}</a></span>
            </div>
            
            <div class="field">
              <span class="field-label">Phone:</span>
              <span class="field-value">${data.phone}</span>
            </div>
            
            <div class="field">
              <span class="field-label">Subject:</span>
              <span class="field-value">${data.subject}</span>
            </div>
            
            <div class="field">
              <span class="field-label">Message:</span>
              <div class="field-value" style="margin-top: 10px; white-space: pre-wrap; background: white; padding: 15px; border-left: 3px solid #D4AF37;">
${data.message}
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p>View all submissions in the <a href="https://docs.google.com/spreadsheets/d/${SHEET_ID}">Contact Form Spreadsheet</a></p>
            <p>This is an automated notification from the AusInd Bridge Foundation website contact form.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    GmailApp.sendEmail(
      NOTIFICATION_EMAIL,
      subject,
      '', // Plain text body (empty because we're using HTML)
      {
        htmlBody: htmlBody,
        name: 'AusInd Bridge Foundation Website',
        replyTo: data.email
      }
    );
    
    Logger.log('Admin notification sent to: ' + NOTIFICATION_EMAIL);
    
  } catch (error) {
    Logger.log('Error sending admin notification: ' + error.message);
    // Don't throw error - we still want form submission to succeed
  }
}

/**
 * Send auto-reply to form submitter
 */
function sendAutoReply(data) {
  try {
    const subject = 'Thank you for contacting AusInd Bridge Foundation';
    
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0C2340; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .footer { margin-top: 20px; padding: 10px; text-align: center; font-size: 12px; color: #666; }
          .logo { color: #D4AF37; font-weight: bold; font-size: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">AusInd Bridge Foundation</div>
            <p>Building Stronger Australia-India Relations</p>
          </div>
          
          <div class="content">
            <p>Dear ${data.fullName},</p>
            
            <p>Thank you for reaching out to AusInd Bridge Foundation. We have received your enquiry regarding "${data.subject}" and appreciate you taking the time to contact us.</p>
            
            <p><strong>Your submission details:</strong></p>
            <ul>
              <li><strong>Enquiry Type:</strong> ${data.enquiryType}</li>
              <li><strong>Subject:</strong> ${data.subject}</li>
              <li><strong>Submitted:</strong> ${new Date(data.timestamp).toLocaleString('en-AU')}</li>
            </ul>
            
            <p>Our team will review your message and respond within 1-2 business days. If your enquiry is urgent, please feel free to contact us directly:</p>
            
            <ul>
              <li><strong>Email:</strong> <a href="mailto:info@ausindbridge.org">info@ausindbridge.org</a></li>
              <li><strong>Phone:</strong> +61 2 6273 3637</li>
            </ul>
            
            <p>To learn more about our work, please visit our website at <a href="https://ausindbridge.org.au">ausindbridge.org.au</a></p>
            
            <p>Best regards,<br>
            <strong>The AusInd Bridge Foundation Team</strong></p>
          </div>
          
          <div class="footer">
            <p>AusInd Bridge Foundation | Canberra, Australia</p>
            <p>This is an automated response. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    GmailApp.sendEmail(
      data.email,
      subject,
      '', // Plain text body
      {
        htmlBody: htmlBody,
        name: 'AusInd Bridge Foundation',
        replyTo: NOTIFICATION_EMAIL
      }
    );
    
    Logger.log('Auto-reply sent to: ' + data.email);
    
  } catch (error) {
    Logger.log('Error sending auto-reply: ' + error.message);
    // Don't throw error - we still want form submission to succeed
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Create standardized JSON response
 */
function createResponse(success, message, data = {}) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: success,
      message: message,
      data: data,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - call this to verify setup
 */
function testFormSubmission() {
  const testData = {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '+61 400 000 000',
    subject: 'Test Submission',
    enquiryType: 'General Enquiry',
    message: 'This is a test message to verify the contact form is working correctly.',
    timestamp: new Date().toISOString(),
    source: 'Manual Test'
  };
  
  const result = saveToSheet(testData);
  Logger.log('Test submission result: ' + JSON.stringify(result));
  
  if (SEND_EMAIL_NOTIFICATIONS) {
    sendAdminNotification(testData, result.rowNumber);
  }
  
  if (SEND_AUTO_REPLY) {
    sendAutoReply(testData);
  }
  
  Logger.log('Test completed successfully!');
}
