/**
 * Focused On Growth — contact form handler.
 *
 * Deploy this as a Google Apps Script Web App from the Google account that
 * should RECEIVE the submissions. Mail is sent by the owning account, so
 * deploying from admin.focusedongrowth@gmail.com means the notification is
 * sent from that inbox to itself.
 *
 * Setup steps live in README.md ("Contact form").
 */

// Where submissions are delivered.
var RECIPIENT = 'admin.focusedongrowth@gmail.com';

// Shown as the sender name on the notification email.
var SENDER_NAME = 'Focused On Growth Website';

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

    var data = JSON.parse(e.postData.contents);

    // Honeypot: a hidden field no human ever fills in. Bots fill everything,
    // so a non-empty value means spam. Return success so the bot moves on.
    if (data.company) {
      return jsonResponse({ ok: true });
    }

    var firstName = clean(data.firstName);
    var lastName = clean(data.lastName);
    var phone = clean(data.phone);
    var email = clean(data.email);
    var message = clean(data.message);
    var consent = data.consent === true;
    var advisor = clean(data.advisor);

    var missing = [];
    if (!firstName) missing.push('first name');
    if (!lastName) missing.push('last name');
    if (!phone) missing.push('phone');
    if (!email) missing.push('email');
    if (missing.length) {
      return jsonResponse({ ok: false, error: 'Missing: ' + missing.join(', ') });
    }

    var fullName = firstName + ' ' + lastName;
    var submittedAt = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "MMMM d, yyyy 'at' h:mm a"
    );

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

    // Put the advisor in the subject so it is visible from the inbox list.
    var subject = advisor
      ? 'Website inquiry, meeting with ' + advisor + ': ' + fullName
      : 'Website inquiry: ' + fullName;

    MailApp.sendEmail({
      to: RECIPIENT,
      subject: subject,
      body: lines.join('\n'),
      name: SENDER_NAME,
      // Lets you hit Reply in Gmail and answer the person directly.
      replyTo: email
    });

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

/**
 * Visiting the /exec URL in a browser hits this. Useful for confirming the
 * deployment is live.
 */
function doGet() {
  return jsonResponse({ ok: true, status: 'Contact form endpoint is live.' });
}

function clean(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim().slice(0, 5000);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
