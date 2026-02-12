# Contact Form Setup Guide - Google Apps Script Integration

## Overview
This guide will help you set up the dynamic contact form for the AusInd Bridge Foundation website using Google Apps Script to store submissions in Google Sheets and send email notifications.

## Prerequisites
- Google Account with access to Google Sheets and Google Apps Script
- Access to the website files (specifically `contact.html`)
- Basic understanding of Google Workspace

---

## Part 1: Create Google Sheet for Submissions

### Step 1: Create a New Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Rename it to **"AusInd Bridge - Contact Form Submissions"**
4. Note the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
   ```
   Copy the part between `/d/` and `/edit` - this is your `SHEET_ID`

### Step 2: Prepare the Sheet
- The script will automatically create the sheet tab named **"Contact Submissions"** with proper headers
- No manual setup needed for the sheet structure

---

## Part 2: Set Up Google Apps Script

### Step 1: Create Apps Script Project
1. Open your Google Sheet
2. Go to **Extensions** > **Apps Script**
3. A new tab will open with the Apps Script editor
4. Delete any default code in the editor

### Step 2: Add the Script Code
1. Copy all the code from `ContactFormHandler.gs`
2. Paste it into the Apps Script editor
3. Rename the project to **"AusInd Contact Form Handler"** (click "Untitled project" at the top)

### Step 3: Configure the Script
Update these values at the top of the script:

```javascript
// Replace with your Google Sheet ID from Step 1
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';

// Email where notifications will be sent (default: info@ausindbridge.org)
const NOTIFICATION_EMAIL = 'info@ausindbridge.org';

// Enable/disable features as needed
const SEND_EMAIL_NOTIFICATIONS = true;
const SEND_AUTO_REPLY = true;
```

### Step 4: Test the Script
1. Click the **Save** icon (💾) or press `Ctrl+S`
2. In the function dropdown (next to Debug), select **`testFormSubmission`**
3. Click **Run** (▶️)
4. First time authorization:
   - You'll see "Authorization required" - click **Review Permissions**
   - Choose your Google account
   - Click **Advanced** (if you see a warning)
   - Click **Go to AusInd Contact Form Handler (unsafe)**
   - Click **Allow**
5. Check the **Execution log** at the bottom - you should see "Test completed successfully!"
6. Verify:
   - Check your Google Sheet - a test row should appear
   - Check your email - you should receive a notification
   - The test user email will receive an auto-reply

### Step 5: Deploy as Web App
1. Click **Deploy** > **New deployment**
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**
3. Fill in the deployment settings:
   - **Description**: "Production deployment for contact form"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**
4. Click **Deploy**
5. You may need to authorize again - follow the same steps as before
6. **IMPORTANT**: Copy the **Web app URL** that appears
   - It will look like: `https://script.google.com/macros/s/XXXXX/exec`
   - Save this URL - you'll need it for the next part

---

## Part 3: Update Website Contact Form

### Step 1: Update contact.html
1. Open `contact.html` in your code editor
2. Find this line near the top of the JavaScript section (around line 422):
   ```javascript
   const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` with the Web App URL from Part 2, Step 5
   ```javascript
   const SCRIPT_URL = 'https://script.google.com/macros/s/XXXXX/exec';
   ```
4. Save the file

### Step 2: Upload to Web Server
1. Upload the updated `contact.html` file to your web server
2. Make sure all other required files are also uploaded (CSS, JS, images, etc.)

---

## Part 4: Test the Contact Form

### Step 1: Submit a Test Entry
1. Go to your website contact page
2. Fill out the form with test data:
   - Full Name: `Test User`
   - Email: Your actual email address
   - Subject: `Testing Contact Form`
   - Enquiry Type: `General Enquiry`
   - Message: `This is a test submission`
3. Click **Submit Enquiry**

### Step 2: Verify Success
1. You should see a green success message on the page
2. Check your Google Sheet - a new row should appear with the submission
3. Check your inbox - you should receive:
   - Admin notification (at `NOTIFICATION_EMAIL`)
   - Auto-reply (at the email you entered in the form)

---

## Features

### 1. **Automatic Data Storage**
- All submissions are saved to Google Sheets with timestamp
- Includes: Name, Email, Phone, Subject, Enquiry Type, Message, Source, Status
- Status defaults to "New" (highlighted in yellow)
- Automatic column formatting and resizing

### 2. **Email Notifications**
- **Admin Notification**: Sent to `info@ausindbridge.org` with full submission details
- **Auto-Reply**: Professional acknowledgment sent to the person who submitted the form
- Both emails are HTML-formatted with branding

### 3. **Form Features**
- Real-time validation
- Loading states during submission
- Success/error messages
- Responsive design
- Phone number is optional, all other fields required

### 4. **Data Tracking**
- Submission ID (row number)
- Timestamp in Australian format
- Source tracking (identifies website submissions)
- Status field for follow-up tracking

---

## Managing Submissions

### View Submissions
1. Open your Google Sheet
2. All submissions appear in the "Contact Submissions" tab
3. Columns:
   - **Timestamp**: When the form was submitted
   - **Full Name**: Submitter's name
   - **Email**: Contact email
   - **Phone**: Phone number (if provided)
   - **Subject**: Brief description
   - **Enquiry Type**: Category selected
   - **Message**: Full message content
   - **Source**: Where the submission came from
   - **Status**: Current status (New/In Progress/Resolved)
   - **Notes**: For internal tracking

### Update Status
1. Click on the **Status** cell for any submission
2. Change from "New" to:
   - "In Progress" (when you're working on it)
   - "Resolved" (when completed)
   - "Spam" (if it's spam)
3. Add notes in the **Notes** column as needed

### Export Data
1. In Google Sheets: **File** > **Download** > **Excel** or **CSV**
2. Choose your preferred format

---

## Troubleshooting

### Form submission not working
1. Check browser console (F12 > Console) for errors
2. Verify the `SCRIPT_URL` in contact.html is correct
3. Make sure the Google Apps Script is deployed as a Web App
4. Check that "Who has access" is set to "Anyone"

### No email notifications
1. Check spam folder
2. Verify `NOTIFICATION_EMAIL` in the script is correct
3. Make sure `SEND_EMAIL_NOTIFICATIONS` is set to `true`
4. Check Apps Script execution log for errors

### Data not saving to sheet
1. Verify `SHEET_ID` in the script is correct
2. Check Apps Script execution log for errors
3. Make sure the script has permission to access the sheet
4. Re-run the `testFormSubmission` function

### Authorization errors
1. Go to Apps Script editor
2. **Deploy** > **Manage deployments**
3. Click the edit icon (pencil)
4. Click **Deploy** again
5. May need to re-authorize

---

## Security Notes

1. **Public Access**: The Web App is set to "Anyone" access because it receives form submissions from your public website
2. **Data Privacy**: All submissions are stored in your private Google Sheet (not publicly accessible)
3. **Email Security**: Emails are sent through Google's servers with proper authentication
4. **No Sensitive Data**: Don't collect passwords, credit cards, or other sensitive information through this form

---

## Customization

### Change Email Templates
Edit the `sendAdminNotification()` and `sendAutoReply()` functions in the script to customize:
- Email subject lines
- HTML formatting
- Content and messaging
- Contact information

### Add More Fields
1. Update the form in `contact.html`
2. Add the field to the `data` object in the submit handler
3. Update the `rowData` array in `saveToSheet()` function
4. Add the new column to the headers array

### Change Sheet Structure
Modify the `headers` array in the `saveToSheet()` function to add/remove columns

---

## Support

For technical issues:
1. Check the Apps Script execution log: **Executions** in the Apps Script editor
2. Review browser console errors on the contact page
3. Test using the `testFormSubmission()` function

---

## Maintenance

### Update the Deployment (when you modify the script)
1. Make your changes in the Apps Script editor
2. Click **Save**
3. Go to **Deploy** > **Manage deployments**
4. Click the edit icon (pencil) next to your active deployment
5. Under "Version", select **New version**
6. Click **Deploy**
7. The Web App URL stays the same - no need to update contact.html

### Monitor Submissions
- Set up Google Sheets notifications (Tools > Notification rules)
- Regularly check the submissions sheet
- Update status as you process enquiries

---

## Quick Reference

| Item | Location |
|------|----------|
| Google Sheet | [Google Sheets](https://sheets.google.com) |
| Apps Script Editor | Extensions > Apps Script (from your sheet) |
| Manage Deployments | Apps Script: Deploy > Manage deployments |
| View Execution Logs | Apps Script: Executions (left sidebar) |
| Contact Form File | `contact.html` |
| Script File | `ContactFormHandler.gs` |

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Contact**: info@ausindbridge.org
