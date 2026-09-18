# Quick Setup Guide: Google Sheets & Apps Script Backend

Follow these 4 simple steps to connect your Inquiry Form to your Google Sheet. It takes less than 2 minutes!

---

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Name it something clear like **"Galla Inquiries"**.
3. Copy the URL from your browser's address bar (e.g., `https://docs.google.com/spreadsheets/d/your-sheet-id/edit`).
4. Keep this tab open.

---

## Step 2: Add the Apps Script Code

1. In your Google Sheet, click on the top menu: **Extensions** > **Apps Script**.
2. A new editor tab will open. You will see a file named `Code.gs`.
3. Select and delete any existing code inside `Code.gs`.
4. Open the [`Code.gs`](./Code.gs) file from this project, copy all its code, and paste it into the Google Apps Script editor.
5. Click the **Save** icon (diskette icon) or press `Ctrl + S`.

---

## Step 3: Deploy as Web App

1. In the top right corner of the Apps Script editor, click **Deploy** > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure the following settings:
   - **Description**: `Galla Inquiries v1`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: **`Anyone`** *(⚠️ IMPORTANT: If you don't choose "Anyone", the public inquiry form will not be able to submit!)*
4. Click **Deploy**.
5. If prompted with *"Authorization required"*:
   - Click **Authorize access**.
   - Choose your Google Account.
   - Click **Advanced** > **Go to Untitled project (unsafe)**.
   - Click **Allow**.
6. Once deployed, Google will show you a **Web app URL** that looks like:
   `https://script.google.com/macros/s/AKfycby.../exec`
7. Copy this **Web app URL**.

---

## Step 4: Paste URLs into `app.js`

Open [`app.js`](./app.js) in your editor and update the `CONFIG` object at the top:

```javascript
const CONFIG = {
  // 1. Paste your deployed Web App URL here:
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycby.../exec',

  // 2. Paste your Google Sheet URL here:
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/your-sheet-id/edit',
};
```

---

## Testing Your Setup

1. Open `index.html` in your browser.
2. Enter your Name, a 10-digit Mobile Number, and a Note.
3. Click **Send Inquiry**.
4. You should see a green success alert, and a new row will instantly appear in your Google Sheet with the headers `Timestamp`, `Name`, `Mobile Number`, and `Note`!
5. Click **View Submissions** directly below the Send Inquiry button — it will open your Google Sheet in a new tab where you can see all inquiries.
