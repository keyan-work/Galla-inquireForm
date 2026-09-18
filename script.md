# Project: Inquiry Form with Google Sheet backend

**Goal:** A simple web form where anyone can submit an inquiry, saved automatically to a Google Sheet, with a way to view all submissions.

## Form fields (in this order)

1. **Name** — text input, required
2. **Mobile Number** — number input, required, must be exactly 10 digits
3. **Note** — multi-line text input, required

## Buttons (in this order)

1. **Send Inquiry** — saves the entry as a new row in a Google Sheet (columns: Timestamp, Name, Mobile, Note). Shows a success message on save, or an error message if it fails.
2. **View Submissions** — placed directly below Send Inquiry. Opens the Google Sheet in a new browser tab so all past submissions can be viewed there directly (no separate table built on the page).

## Backend

Google Sheets acts as the database. A Google Apps Script deployed as a web app receives the form data and appends it as a new row.

## Validation rules

- All three fields are required.
- Mobile number field only accepts digits, capped at 10 characters, and is rejected if not exactly 10 digits.

## Not included (for now)

- No in-page live table
- No Excel download button
- No hosting/deployment decided yet