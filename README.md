# Galla Inquiry Form

A modern, responsive inquiry form built with a clean and crisp light theme, featuring live 10-digit mobile number validation, smooth micro-interactions, and a Google Sheets backend powered by Google Apps Script.

## Features

- **Strict Validation**:
  - **Name**: Required text input.
  - **Mobile Number**: Strictly permits digits only, capped at 10 digits, with a live `0/10` counter and exact 10-digit validation.
  - **Note**: Required multi-line textarea.
- **Button Workflow**:
  1. **Send Inquiry**: Primary button with loading spinner state, disables during submission, and displays success/error notification banners.
  2. **View Submissions**: Placed directly below "Send Inquiry" to open the Google Sheet in a new tab.
- **Google Sheets Backend**:
  - Automatically receives submissions and records `Timestamp`, `Name`, `Mobile Number`, and `Note`.
  - Automatic header generation and concurrency lock protection.
- **Modern Light Aesthetic**:
  - Tailored color palette with Plus Jakarta Sans typography.
  - Layered soft shadows, subtle card border, and mobile-responsive layout.

## Project Structure

```
Galla-inquireForm/
├── index.html        # Clean semantic form structure
├── style.css         # Modern light theme & responsive styles
├── app.js            # Validation, form logic & Google Apps Script submission
├── Code.gs           # Google Apps Script for Google Sheet backend
├── SETUP_GUIDE.md    # 4-step quick start guide to deploy Google Sheets backend
├── script.md         # Original project requirements specification
└── README.md         # Project documentation
```

## Quick Start

1. Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md) to set up your Google Sheet and deploy [Code.gs](./Code.gs).
2. Paste your Google Apps Script Web App URL and Google Sheet URL into [app.js](./app.js).
3. Open [index.html](./index.html) in any browser.