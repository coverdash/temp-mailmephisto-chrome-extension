# Mephisto TempMail - Feature Documentation

## Core Features

### 1. Instant Email Generation

**What it does:**
- Generates a temporary, disposable email address instantly
- No signup, no personal information required
- Email is stored locally in your browser

**How to use:**
1. Click the extension icon in your toolbar
2. Your temporary email is displayed automatically
3. Click "+" to generate a new email address

**Technical details:**
- Uses Guerrilla Mail API
- Session stored in Chrome Storage API
- Multiple fallback proxies for reliability

---

### 2. One-Click Copy to Clipboard

**What it does:**
- Copies your temporary email to clipboard with one click
- Visual feedback confirms successful copy

**How to use:**
1. Open extension popup
2. Click the copy icon button
3. Paste the email anywhere (Ctrl+V / Cmd+V)

**Technical details:**
- Uses modern Clipboard API
- Falls back gracefully on older browsers
- 2-second visual confirmation

---

### 3. Smart Email Field Auto-Fill

**What it does:**
- Automatically detects email input fields on any website
- Adds a clickable icon to fill fields instantly
- Works with both static and dynamic content

**How to use:**
1. Navigate to any website with email fields
2. Look for the blue envelope icon inside email inputs
3. Click the icon to auto-fill with your temporary email

**Detection methods:**
- `input[type="email"]` fields
- Fields with "email" in name/id/placeholder
- ARIA labels containing "email"
- Multiple language support (e-mail, mail, correo, etc.)

**Technical details:**
- Content script injected on all pages
- MutationObserver watches for dynamic fields
- WeakSet prevents duplicate processing
- Icon positioning adapts to input location

---

### 4. Real-Time Email Notifications

**What it does:**
- Shows desktop notification when new emails arrive
- Displays sender name and subject
- Badge counter on extension icon

**How to use:**
- Notifications appear automatically
- Click notification to open extension
- Badge shows unread count

**Notification triggers:**
- New email received
- Only when email count increases
- Shows latest email details

**Technical details:**
- Chrome Notifications API
- Service worker polls every 30 seconds
- Badge color: #ef4444 (red)
- Priority level: 2 (high)

---

### 5. Email Inbox Management

**What it does:**
- View all received emails in extension popup
- See sender, subject, time, and preview
- Category badges (Verification, Security, Newsletter, Other)
- Click to open in full web app

**Features:**
- Real-time email list
- "Time ago" formatting (e.g., "5m ago")
- Unread highlighting
- Empty state messaging

**Categories explained:**
- **Verification**: OTP codes, confirmations
- **Security**: Password resets, login alerts
- **Newsletter**: Marketing, digests
- **Other**: Everything else

**Technical details:**
- Auto-refresh every 30 seconds
- Smart category detection via regex
- HTML entity decoding
- XSS protection on all content

---

### 6. Session Persistence

**What it does:**
- Remembers your email between browser sessions
- No need to regenerate on every use
- Works offline for cached emails

**Storage:**
- Chrome Storage API (local)
- Session tokens secured
- Email cache for offline viewing

**Privacy:**
- Data stored locally only
- No server-side storage
- Clear storage to reset completely

---

## Advanced Features

### Multi-Proxy Fallback

**Purpose:** Ensure reliable API access even when proxies fail

**How it works:**
1. Tries first CORS proxy
2. 5-second timeout per attempt
3. Cycles to next proxy on failure
4. Returns null if all fail

**Proxies used:**
- api.codetabs.com
- thingproxy.freeboard.io
- api.allorigins.win

---

### HTML Content Sanitization

**Purpose:** Prevent XSS attacks from malicious emails

**Methods:**
1. HTML entity decoding
2. HTTP to HTTPS conversion
3. Broken image link fixes
4. Script tag removal

---

### Efficient DOM Observation

**Purpose:** Detect new email fields without slowing down pages

**Optimization:**
- Single MutationObserver per page
- WeakSet for processed elements
- Debounced field processing
- Cleanup on element removal

---

### Smart Time Formatting

**Displays:**
- "Just now" (< 1 minute)
- "5m ago" (< 1 hour)
- "3h ago" (< 1 day)
- "2d ago" (< 1 week)
- Full date (> 1 week)

---

## Keyboard Shortcuts

Currently, the extension doesn't have custom keyboard shortcuts, but you can add them:

**To add shortcuts:**
1. Go to `chrome://extensions/shortcuts`
2. Find Mephisto TempMail
3. Assign custom shortcuts

**Recommended shortcuts:**
- `Ctrl+Shift+E` - Open extension popup
- `Alt+Shift+C` - Copy email (requires code addition)

---

## Permissions Explained

### Required Permissions

**storage**
- Store email session locally
- Cache emails for offline access

**notifications**
- Show desktop notifications for new emails
- Update badge counter

**activeTab**
- Access current tab to inject auto-fill icons
- Only when you interact with extension

**clipboardWrite**
- Copy email to clipboard
- Triggered only by user click

### Host Permissions

**https://api.guerrillamail.com/***
- Generate temporary emails
- Fetch email list
- Get email details

**https://api.codetabs.com/***
**https://thingproxy.freeboard.io/***
**https://api.allorigins.win/***
- CORS proxy services
- Fallback reliability

---

## Limitations & Known Issues

### Current Limitations

1. **Email Viewing:**
   - Full email content requires web app
   - Popup shows preview only

2. **Email Retention:**
   - Emails deleted when session ends
   - No permanent storage
   - Backend purges on disconnect

3. **Domain Selection:**
   - Fixed domain list
   - No custom domain input (yet)

4. **Polling Frequency:**
   - 30-second minimum (Manifest V3 limit)
   - Can't check more frequently

### Known Issues

1. **Icon Position on Complex Forms:**
   - May misalign on heavily styled inputs
   - Absolute positioning challenges

2. **SPA Navigation:**
   - Some single-page apps need manual refresh
   - Mutation observer has limits

3. **Proxy Reliability:**
   - CORS proxies can be slow or down
   - Multiple fallbacks help but not perfect

---

## Privacy & Security

### What We Track
- **Nothing!** Zero tracking or analytics

### What We Store Locally
- Email session token
- Current email address
- Cached email list

### What We Send
- API requests to Guerrilla Mail (through proxies)
- No personal information
- No usage telemetry

### Security Measures
- HTTPS only
- HTML sanitization
- No eval() or inline scripts
- Content Security Policy
- XSS protection

---

## Performance Characteristics

### Memory Usage
- Popup: ~5-10 MB
- Service Worker: ~2-5 MB
- Content Scripts: <1 MB per page

### Network Usage
- Email check: ~5-10 KB per poll
- Email fetch: ~10-50 KB per email
- Polling: Every 30 seconds

### CPU Impact
- Minimal (service worker sleeps between polls)
- Content script runs only on DOM changes

---

## Browser Compatibility

### Fully Supported
- Chrome 88+ (Manifest V3 required)
- Edge 88+ (Chromium-based)

### Planned Support
- Firefox (requires manifest conversion)
- Opera (Chromium-based, should work)
- Brave (Chromium-based, should work)

### Not Supported
- Safari (different extension API)
- Internet Explorer (discontinued)

---

## Future Enhancements

### Planned Features
- [ ] In-popup email detail view
- [ ] Multiple email address management
- [ ] Custom domain selection UI
- [ ] Email search and filtering
- [ ] Export emails to file
- [ ] Dark/light theme toggle
- [ ] Keyboard shortcuts
- [ ] Email forwarding

### Under Consideration
- [ ] Email encryption
- [ ] Custom email templates
- [ ] Integration with password managers
- [ ] QR code for mobile
- [ ] Email scheduling

---

## API Reference

### Chrome Extension Messages

**Get current email:**
```javascript
chrome.runtime.sendMessage({ action: 'getEmail' }, (response) => {
  console.log(response.email);
});
```

**Generate new email:**
```javascript
chrome.runtime.sendMessage({ action: 'generateEmail' }, (response) => {
  console.log(response.email);
});
```

**Trigger email check:**
```javascript
chrome.runtime.sendMessage({ action: 'checkEmails' }, (response) => {
  console.log(response.success);
});
```

### Storage Keys

- `mephisto_extension_session` - Current session data
- `mephisto_email_cache` - Cached email list

---

## Contributing Ideas

Want to contribute? Here are areas that need work:

1. **UI/UX Improvements**
   - Better email detail view
   - Animation polish
   - Responsive design

2. **Feature Additions**
   - Email search
   - Custom domains
   - Settings panel

3. **Performance Optimization**
   - Reduce memory usage
   - Faster icon injection
   - Better caching

4. **Accessibility**
   - Screen reader support
   - Keyboard navigation
   - High contrast mode

5. **Testing**
   - Automated tests
   - Cross-browser testing
   - Performance benchmarks

---

For more information, see:
- [README.md](../README.md) - General overview
- [SETUP.md](../SETUP.md) - Installation guide
- [Original Project](https://github.com/jokallame350-lang/temp-mailmephisto)
