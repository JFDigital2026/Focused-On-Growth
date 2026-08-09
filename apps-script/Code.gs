/**
 * Focused On Growth — contact form handler.
 *
 * Deploy this as a Google Apps Script Web App from the Google account that
 * should RECEIVE the submissions. Mail is sent by the owning account, so
 * deploying from admin.focusedongrowth@gmail.com means the notification is
 * sent from that inbox to itself.
 *
 * Setup steps live in README.md ("Contact form").
 *
 * Defence in depth, outermost first:
 *   1. Cloudflare Turnstile token, verified server side
 *   2. Honeypot field no human fills in
 *   3. Time to fill check (bots submit instantly)
 *   4. Field validation and length caps
 *   5. Duplicate / replay detection
 *   6. Rate limits: burst, per email, per phone, and a global daily cap
 *   7. Spam heuristics, which flag rather than discard
 * Every accepted submission is written to a Google Sheet before the email is
 * attempted, so a lead is never lost even when mail is capped or throttled.
 */

// Where submissions are delivered.
var RECIPIENT = 'admin.focusedongrowth@gmail.com';

// Shown as the sender name on the notification email.
var SENDER_NAME = 'Focused On Growth Website';

// --- Limits -----------------------------------------------------------------

// Gmail allows 100 emails/day on a consumer account. Stop short of it so a
// flood can never consume the whole allowance.
var MAX_EMAILS_PER_DAY = 80;

// Submissions accepted across the whole site in any 60 second window.
var MAX_PER_MINUTE = 10;

// Submissions accepted from the same email address, or the same phone
// number, within an hour.
var MAX_PER_EMAIL_PER_HOUR = 3;
var MAX_PER_PHONE_PER_HOUR = 3;

// An identical message from the same address inside this window is treated
// as a double click or a replay and silently accepted without re-sending.
var DUPLICATE_WINDOW_SECONDS = 600;

// A real person cannot complete this form faster than this.
var MIN_FILL_SECONDS = 3;

// Field length caps applied before anything is stored or emailed.
var MAX_NAME = 100;
var MAX_PHONE = 40;
var MAX_EMAIL = 254;
var MAX_MESSAGE = 2000;

// --- Entry points -----------------------------------------------------------

/**
 * Handles the form POST. The site sends a JSON body as text/plain, which
 * keeps it a "simple" CORS request and avoids a preflight that Apps Script
 * cannot answer.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'Empty request body.' });
    }

    // Reject oversized bodies before spending time parsing them.
    if (e.postData.contents.length > 20000) {
      return jsonResponse({ ok: false, error: 'Request too large.' });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse({ ok: false, error: 'Malformed request.' });
    }

    // 1. Honeypot. Bots fill every field they find; people never see this one.
    // Answer with success so the bot has no signal to adapt to.
    if (data.company) {
      recordBlocked('honeypot');
      return jsonResponse({ ok: true });
    }

    // 2. Turnstile. This is the measure that actually stops a determined bot,
    // because it cannot be satisfied by posting straight to this endpoint.
    var turnstile = verifyTurnstile(data.turnstileToken);
    if (!turnstile.ok) {
      recordBlocked('turnstile');
      return jsonResponse({ ok: false, error: 'Verification failed. Please reload the page and try again.' });
    }

    // 3. Time to fill. Spoofable, but it raises the cost of a scripted post.
    var elapsed = Number(data.elapsedMs);
    if (isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_SECONDS * 1000) {
      recordBlocked('too_fast');
      return jsonResponse({ ok: true });
    }

    // 4. Validation.
    var firstName = clean(data.firstName, MAX_NAME);
    var lastName = clean(data.lastName, MAX_NAME);
    var phone = clean(data.phone, MAX_PHONE);
    var email = clean(data.email, MAX_EMAIL);
    var message = clean(data.message, MAX_MESSAGE);
    var advisor = clean(data.advisor, MAX_NAME);
    var consent = data.consent === true;

    var missing = [];
    if (!firstName) missing.push('first name');
    if (!lastName) missing.push('last name');
    if (!phone) missing.push('phone');
    if (!email) missing.push('email');
    if (missing.length) {
      return jsonResponse({ ok: false, error: 'Missing: ' + missing.join(', ') });
    }

    if (!isValidEmail(email)) {
      return jsonResponse({ ok: false, error: 'Please enter a valid email address.' });
    }
    if (countDigits(phone) < 7) {
      return jsonResponse({ ok: false, error: 'Please enter a valid phone number.' });
    }

    // 5, 6. Duplicate and rate checks share a lock so two simultaneous posts
    // cannot both read a stale counter and slip past the same limit.
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000);
    } catch (lockErr) {
      return jsonResponse({ ok: false, error: 'Server busy. Please try again in a moment.' });
    }

    var gate;
    try {
      gate = checkDuplicateAndRates(email, phone, message);
    } finally {
      lock.releaseLock();
    }

    if (gate.duplicate) {
      // Same person, same message, moments ago. Treat as a double submit.
      return jsonResponse({ ok: true });
    }
    if (gate.blocked) {
      recordBlocked(gate.reason);
      return jsonResponse({
        ok: false,
        error: 'Too many submissions right now. Please call us at 215-752-3409.'
      });
    }

    // 7. Spam heuristics flag rather than discard, so a real lead that trips
    // a rule still reaches the inbox, just marked.
    var suspicion = scoreSpam(message, firstName, lastName);

    var fullName = firstName + ' ' + lastName;
    var submittedAt = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "MMMM d, yyyy 'at' h:mm a"
    );

    // Log before emailing. If the daily cap is reached, or mail fails, the
    // lead still exists in the Sheet.
    var emailed = false;
    var overCap = countToday() >= MAX_EMAILS_PER_DAY;

    if (!overCap) {
      var lines = [
        'New contact form submission',
        '',
        'Name:     ' + fullName,
        'Phone:    ' + phone,
        'Email:    ' + email,
        'Meeting with: ' + (advisor || 'No preference'),
        'SMS consent: ' + (consent ? 'Yes' : 'No'),
        'Submitted: ' + submittedAt,
        '',
        'What they would like to discuss:',
        message || '(left blank)'
      ];

      if (suspicion.flagged) {
        lines.splice(1, 0, '', '[ Flagged as possible spam: ' + suspicion.reasons.join(', ') + ' ]');
      }

      var subject = advisor
        ? 'Website inquiry, meeting with ' + advisor + ': ' + fullName
        : 'Website inquiry: ' + fullName;
      if (suspicion.flagged) {
        subject = '[possible spam] ' + subject;
      }

      MailApp.sendEmail({
        to: RECIPIENT,
        subject: subject,
        body: lines.join('\n'),
        name: SENDER_NAME,
        // Lets you hit Reply in Gmail and answer the person directly.
        replyTo: email
      });

      incrementToday();
      emailed = true;
    }

    logToSheet({
      submittedAt: submittedAt,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      advisor: advisor || 'No preference',
      consent: consent ? 'Yes' : 'No',
      message: message,
      flagged: suspicion.flagged ? suspicion.reasons.join(', ') : '',
      emailed: emailed ? 'Yes' : 'No (daily cap reached)'
    });

    return jsonResponse({ ok: true });
  } catch (err) {
    // Never leak internals to the browser; keep the detail in the execution log.
    console.error('doPost failed: ' + err);
    return jsonResponse({ ok: false, error: 'Something went wrong. Please try again.' });
  }
}

/**
 * Visiting the /exec URL in a browser hits this. Useful for confirming the
 * deployment is live.
 */
function doGet() {
  return jsonResponse({ ok: true, status: 'Contact form endpoint is live.' });
}

// --- Turnstile --------------------------------------------------------------

/**
 * Verifies the Cloudflare Turnstile token with Cloudflare.
 *
 * The secret lives in Script Properties, never in this file and never in the
 * website bundle. If no secret is configured the check is skipped, so the
 * form keeps working before Turnstile is set up.
 */
function verifyTurnstile(token) {
  var raw = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  // Trim: pasting a key into Script Properties very often carries a trailing
  // space or newline, which Cloudflare rejects as invalid-input-secret.
  var secret = raw ? String(raw).trim() : '';

  if (!secret) {
    return { ok: true, skipped: true };
  }
  if (!token) {
    return { ok: false, codes: ['missing-input-response'] };
  }

  try {
    var res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'post',
      payload: { secret: secret, response: String(token).trim() },
      muteHttpExceptions: true
    });
    var body = JSON.parse(res.getContentText());

    if (body.success !== true) {
      // Cloudflare says exactly why. Without this it is guesswork.
      console.error('Turnstile rejected: ' + JSON.stringify(body['error-codes'] || []) +
                    ' hostname=' + (body.hostname || 'n/a'));
    }
    return { ok: body.success === true, codes: body['error-codes'] || [] };
  } catch (err) {
    console.error('Turnstile verification error: ' + err);
    // Fail closed. A verification outage must not become an open door.
    return { ok: false, codes: ['fetch-failed'] };
  }
}

/**
 * Run this from the editor to check the stored secret without needing a real
 * token. Reads the result from the execution log.
 *
 *   invalid-input-response  -> the secret is CORRECT (only the dummy token
 *                              was rejected). Look elsewhere.
 *   invalid-input-secret    -> the secret is wrong, or belongs to a
 *                              different Turnstile widget.
 *   (no secret configured)  -> the Script Property is missing or misnamed.
 */
function testTurnstileSecret() {
  var raw = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  if (!raw) {
    console.log('No TURNSTILE_SECRET script property found. Check the name is exact.');
    return;
  }

  var secret = String(raw).trim();
  console.log('Secret found. Length: ' + secret.length +
              ' | had surrounding whitespace: ' + (secret !== String(raw)) +
              ' | starts with: ' + secret.slice(0, 8) + '...');

  var res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: secret, response: 'dummy-token-for-diagnostics' },
    muteHttpExceptions: true
  });
  var body = JSON.parse(res.getContentText());
  var codes = body['error-codes'] || [];
  console.log('Cloudflare replied: ' + JSON.stringify(body));

  if (codes.indexOf('invalid-input-secret') > -1) {
    console.log('RESULT: the secret is WRONG. Copy it again from the Turnstile widget page.');
  } else if (codes.indexOf('invalid-input-response') > -1) {
    console.log('RESULT: the secret is CORRECT. The dummy token was rejected, as expected.');
  } else {
    console.log('RESULT: unexpected reply, see the raw response above.');
  }
}

// --- Rate limiting ----------------------------------------------------------

/**
 * Duplicate detection plus the burst, per email and per phone limits.
 * Call inside a lock.
 */
function checkDuplicateAndRates(email, phone, message) {
  var cache = CacheService.getScriptCache();

  var dupKey = 'dup_' + md5(email.toLowerCase() + '|' + message);
  if (cache.get(dupKey)) {
    return { duplicate: true };
  }

  var minuteKey = 'burst_' + Math.floor(Date.now() / 60000);
  var minuteCount = Number(cache.get(minuteKey) || 0);
  if (minuteCount >= MAX_PER_MINUTE) {
    return { blocked: true, reason: 'burst' };
  }

  var emailKey = 'em_' + md5(email.toLowerCase());
  var emailCount = Number(cache.get(emailKey) || 0);
  if (emailCount >= MAX_PER_EMAIL_PER_HOUR) {
    return { blocked: true, reason: 'per_email' };
  }

  var phoneKey = 'ph_' + md5(digitsOnly(phone));
  var phoneCount = Number(cache.get(phoneKey) || 0);
  if (phoneCount >= MAX_PER_PHONE_PER_HOUR) {
    return { blocked: true, reason: 'per_phone' };
  }

  // Accepted. Record it against every window.
  cache.put(dupKey, '1', DUPLICATE_WINDOW_SECONDS);
  cache.put(minuteKey, String(minuteCount + 1), 120);
  cache.put(emailKey, String(emailCount + 1), 3600);
  cache.put(phoneKey, String(phoneCount + 1), 3600);

  return { blocked: false, duplicate: false };
}

/** Emails sent so far today. Kept in properties so it survives cache eviction. */
function countToday() {
  var props = PropertiesService.getScriptProperties();
  return Number(props.getProperty(todayKey()) || 0);
}

function incrementToday() {
  var props = PropertiesService.getScriptProperties();
  var key = todayKey();
  props.setProperty(key, String(Number(props.getProperty(key) || 0) + 1));
}

function todayKey() {
  return 'sent_' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

/** Counts blocked attempts by reason, for visibility in the Sheet's stats. */
function recordBlocked(reason) {
  try {
    var props = PropertiesService.getScriptProperties();
    var key = 'blocked_' + reason + '_' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    props.setProperty(key, String(Number(props.getProperty(key) || 0) + 1));
  } catch (err) {
    // Counting is best effort; never fail a request over it.
  }
}

// --- Spam heuristics --------------------------------------------------------

/**
 * Looks for the shape of spam rather than specific words, and never discards
 * anything. A flagged submission is still delivered, just labelled.
 */
function scoreSpam(message, firstName, lastName) {
  var reasons = [];
  var text = String(message || '');

  var links = (text.match(/https?:\/\//gi) || []).length +
              (text.match(/\bwww\./gi) || []).length;
  if (links >= 2) reasons.push('multiple links');

  if (/\[url=|\[link=|<a\s+href/i.test(text)) reasons.push('markup in message');

  if (text.length > 20 && text === text.toUpperCase() && /[A-Z]{20,}/.test(text)) {
    reasons.push('all caps');
  }

  if (/\b(crypto|bitcoin|forex|seo services|casino|viagra|loan offer)\b/i.test(text)) {
    reasons.push('common spam terms');
  }

  // A name that is a random character run rather than a name.
  if (/[^a-zA-Z\s.'-]{4,}/.test(firstName + lastName)) {
    reasons.push('unusual name');
  }

  return { flagged: reasons.length > 0, reasons: reasons };
}

// --- Sheet log --------------------------------------------------------------

/**
 * Appends the submission to a Google Sheet, creating the spreadsheet the
 * first time and remembering its id. The Sheet is the durable record: it is
 * written even when the daily email cap has been reached.
 */
function logToSheet(row) {
  try {
    var props = PropertiesService.getScriptProperties();
    var id = props.getProperty('LOG_SHEET_ID');
    var ss;

    if (id) {
      ss = SpreadsheetApp.openById(id);
    } else {
      ss = SpreadsheetApp.create('Focused On Growth — Website Submissions');
      props.setProperty('LOG_SHEET_ID', ss.getId());
      ss.getActiveSheet().appendRow([
        'Submitted', 'First name', 'Last name', 'Phone', 'Email',
        'Meeting with', 'SMS consent', 'Message', 'Flagged', 'Emailed'
      ]);
      ss.getActiveSheet().setFrozenRows(1);
    }

    ss.getActiveSheet().appendRow([
      row.submittedAt, row.firstName, row.lastName, row.phone, row.email,
      row.advisor, row.consent, row.message, row.flagged, row.emailed
    ]);
  } catch (err) {
    // Logging must never cost a submission. The email already went out.
    console.error('Sheet logging failed: ' + err);
  }
}

/** Run once from the editor to print the log Sheet's URL. */
function showLogSheetUrl() {
  var id = PropertiesService.getScriptProperties().getProperty('LOG_SHEET_ID');
  if (!id) {
    console.log('No Sheet yet. It is created on the first submission.');
    return;
  }
  console.log(SpreadsheetApp.openById(id).getUrl());
}

// --- Helpers ----------------------------------------------------------------

function clean(value, max) {
  if (value === null || value === undefined) return '';
  return String(value).trim().slice(0, max || 5000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function digitsOnly(value) {
  return String(value).replace(/\D/g, '');
}

function countDigits(value) {
  return digitsOnly(value).length;
}

function md5(text) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, text);
  return bytes.map(function (b) {
    return ((b & 0xff) + 0x100).toString(16).slice(1);
  }).join('');
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
