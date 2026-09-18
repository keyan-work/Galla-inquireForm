/**
 * Galla Inquiry Form - Client Script
 * Connects frontend form to Google Apps Script Web App / Google Sheets
 */

// =============================================================================
// Configuration
// =============================================================================
const CONFIG = {
  // Replace this with your deployed Google Apps Script Web App URL
  // Example: 'https://script.google.com/macros/s/AKfycb.../exec'
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzEn8AfPRcyHhWm9yB76FMsEvnHbaB7YicfHrWJI9EpB_2zDcV7jth5HArK9czZ8UNW/exec',

  // Replace this with your Google Sheet URL to view past submissions
  // Example: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit'
  SHEET_URL: 'https://docs.google.com/spreadsheets/d/1devez9AgACidAuyyjmEeNsrw5oz09zxvhf0FiknJj04/edit?pli=1&gid=0#gid=0',
};

// =============================================================================
// DOM Elements
// =============================================================================
const form = document.getElementById('inquiryForm');
const nameInput = document.getElementById('nameInput');
const mobileInput = document.getElementById('mobileInput');
const noteInput = document.getElementById('noteInput');
const mobileCounter = document.getElementById('mobileCounter');
const submitBtn = document.getElementById('submitBtn');
const viewSubmissionsBtn = document.getElementById('viewSubmissionsBtn');
const statusAlert = document.getElementById('statusAlert');
const alertIcon = document.getElementById('alertIcon');
const alertTitle = document.getElementById('alertTitle');
const alertMessage = document.getElementById('alertMessage');
const alertDismiss = document.getElementById('alertDismiss');

// =============================================================================
// SVG Icons for Alerts
// =============================================================================
const ICONS = {
  success: `
    <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>`,
  error: `
    <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>`,
  warning: `
    <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>`
};

// =============================================================================
// Validation & Input Formatting
// =============================================================================

/**
 * Clean and enforce strictly digits on the mobile number field.
 * Cap at 10 characters and update counter.
 */
function handleMobileInput(e) {
  // Strip any non-digit character immediately
  const rawValue = e.target.value;
  const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 10);
  
  if (rawValue !== digitsOnly) {
    e.target.value = digitsOnly;
  }

  const length = digitsOnly.length;
  mobileCounter.textContent = `${length}/10`;
  
  if (length === 10) {
    mobileCounter.classList.add('valid');
    clearFieldError(mobileInput);
  } else {
    mobileCounter.classList.remove('valid');
  }
}

/**
 * Show error on a form group
 */
function setFieldError(inputElement, errorMessage) {
  const group = inputElement.closest('.form-group');
  if (!group) return;
  group.classList.add('has-error', 'shake');
  
  const errorSpan = group.querySelector('.field-error');
  if (errorSpan && errorMessage) {
    errorSpan.textContent = errorMessage;
  }

  setTimeout(() => {
    group.classList.remove('shake');
  }, 400);
}

/**
 * Clear error on a form group
 */
function clearFieldError(inputElement) {
  const group = inputElement.closest('.form-group');
  if (group) {
    group.classList.remove('has-error');
  }
}

/**
 * Validate all required fields
 * @returns {boolean} true if valid
 */
function validateForm() {
  let isValid = true;
  let firstInvalidInput = null;

  // 1. Validate Name (required, non-empty)
  const nameValue = nameInput.value.trim();
  if (!nameValue) {
    setFieldError(nameInput, 'Name is required.');
    isValid = false;
    firstInvalidInput = firstInvalidInput || nameInput;
  } else {
    clearFieldError(nameInput);
  }

  // 2. Validate Mobile Number (required, strictly 10 digits)
  const mobileValue = mobileInput.value.trim();
  if (!mobileValue) {
    setFieldError(mobileInput, 'Mobile number is required.');
    isValid = false;
    firstInvalidInput = firstInvalidInput || mobileInput;
  } else if (!/^\d{10}$/.test(mobileValue)) {
    setFieldError(mobileInput, 'Mobile number must be exactly 10 digits.');
    isValid = false;
    firstInvalidInput = firstInvalidInput || mobileInput;
  } else {
    clearFieldError(mobileInput);
  }

  // 3. Validate Note (required, non-empty)
  const noteValue = noteInput.value.trim();
  if (!noteValue) {
    setFieldError(noteInput, 'Note is required.');
    isValid = false;
    firstInvalidInput = firstInvalidInput || noteInput;
  } else {
    clearFieldError(noteInput);
  }

  if (!isValid && firstInvalidInput) {
    firstInvalidInput.focus();
  }

  return isValid;
}

// =============================================================================
// Alert Banner Helpers
// =============================================================================
function showAlert(type, title, message) {
  statusAlert.className = `status-alert ${type}`;
  alertIcon.innerHTML = ICONS[type] || ICONS.info;
  alertTitle.textContent = title;
  alertMessage.textContent = message;
  statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideAlert() {
  statusAlert.className = 'status-alert hidden';
}

// =============================================================================
// Submission Handler
// =============================================================================
async function handleFormSubmit(e) {
  e.preventDefault();
  hideAlert();

  if (!validateForm()) {
    return;
  }

  const payload = {
    name: nameInput.value.trim(),
    mobile: mobileInput.value.trim(),
    note: noteInput.value.trim(),
    timestamp: new Date().toISOString()
  };

  // Check if user has configured the Google Apps Script URL
  const isScriptPlaceholder = !CONFIG.SCRIPT_URL || 
    CONFIG.SCRIPT_URL.includes('PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE');

  if (isScriptPlaceholder) {
    showAlert(
      'warning', 
      'Backend URL Not Configured', 
      'Please paste your deployed Google Apps Script Web App URL in app.js (CONFIG.SCRIPT_URL). Follow SETUP_GUIDE.md for easy 2-minute setup.'
    );
    return;
  }

  // Set Loading State
  submitBtn.classList.add('is-loading');
  submitBtn.disabled = true;

  try {
    // We send payload as text/plain JSON to prevent CORS preflight OPTIONS requests,
    // which Google Apps Script does not support. mode: 'no-cors' allows submission through Google's 302 redirects.
    await fetch(CONFIG.SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    // Form submitted successfully!
    showAlert(
      'success',
      'Inquiry Sent Successfully!',
      'Thank you! Your inquiry has been saved directly to our Google Sheet.'
    );

    // Reset Form
    form.reset();
    mobileCounter.textContent = '0/10';
    mobileCounter.classList.remove('valid');

  } catch (error) {
    console.error('Submission error:', error);
    showAlert(
      'error',
      'Submission Failed',
      'Could not save your inquiry. Please check your internet connection or Google Apps Script deployment permissions.'
    );
  } finally {
    submitBtn.classList.remove('is-loading');
    submitBtn.disabled = false;
  }
}

// =============================================================================
// "View Submissions" Button Handler
// =============================================================================
function handleViewSubmissions(e) {
  const isSheetPlaceholder = !CONFIG.SHEET_URL || 
    CONFIG.SHEET_URL.includes('PASTE_YOUR_GOOGLE_SHEET_URL_HERE');

  if (isSheetPlaceholder) {
    e.preventDefault();
    showAlert(
      'warning',
      'Google Sheet URL Not Set',
      'Please paste your Google Sheet URL into app.js (CONFIG.SHEET_URL). Follow SETUP_GUIDE.md to link your sheet.'
    );
    return;
  }

  viewSubmissionsBtn.href = CONFIG.SHEET_URL;
}

// =============================================================================
// Event Listeners
// =============================================================================
mobileInput.addEventListener('input', handleMobileInput);
mobileInput.addEventListener('paste', () => setTimeout(() => handleMobileInput({ target: mobileInput }), 0));

// Clear error state on focus / input
nameInput.addEventListener('input', () => {
  if (nameInput.value.trim()) clearFieldError(nameInput);
});

noteInput.addEventListener('input', () => {
  if (noteInput.value.trim()) clearFieldError(noteInput);
});

mobileInput.addEventListener('blur', () => {
  const val = mobileInput.value.trim();
  if (val && val.length !== 10) {
    setFieldError(mobileInput, 'Mobile number must be exactly 10 digits.');
  }
});

form.addEventListener('submit', handleFormSubmit);
viewSubmissionsBtn.addEventListener('click', handleViewSubmissions);
alertDismiss.addEventListener('click', hideAlert);

// Initialize button href if valid URL configured
if (CONFIG.SHEET_URL && !CONFIG.SHEET_URL.includes('PASTE_YOUR_GOOGLE_SHEET_URL_HERE')) {
  viewSubmissionsBtn.href = CONFIG.SHEET_URL;
}
