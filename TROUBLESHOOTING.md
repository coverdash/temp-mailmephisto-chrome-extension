# Troubleshooting Guide

## Issues Fixed

### 1. Service Worker Registration Failed (Status Code 15)
**Problem:** Missing `alarms` permission in manifest.json

**Solution:** Added `"alarms"` to the permissions array in manifest.json

### 2. TypeError: Cannot read properties of undefined (reading 'onAlarm')
**Problem:** chrome.alarms API was being accessed before permission was granted

**Solution:** Added safety checks to ensure chrome.alarms exists before using it

## How to Apply the Fixes

1. **Reload the Extension:**
   - Go to `chrome://extensions/`
   - Find "Mephisto TempMail"
   - Click the reload icon (circular arrow)

2. **Verify the Fix:**
   - Open the extension popup (should work without errors)
   - Check the service worker console:
     - Go to `chrome://extensions/`
     - Click "service worker" under Mephisto TempMail
     - Look for "Mephisto TempMail Extension installed" message
     - Should see no errors

3. **Test Functionality:**
   - Email should generate automatically
   - Copy button should work
   - Auto-fill icons should appear on email fields
   - Notifications should work (send a test email)

## If Errors Persist

### Clear Extension Data
```javascript
// In browser console or service worker console:
chrome.storage.local.clear().then(() => {
  console.log('Storage cleared');
  location.reload();
});
```

### Complete Reinstall
1. Remove the extension from `chrome://extensions/`
2. Restart Chrome
3. Load the extension again

### Check Service Worker Status
1. Go to `chrome://extensions/`
2. Click "service worker" link
3. Look for any error messages
4. Verify all API calls are working

### Debug Content Script
1. Open any webpage
2. Press F12 for DevTools
3. Go to Console tab
4. Look for any content.js errors

### Test Auto-Fill Feature
1. Visit https://example.com or any site with email fields
2. Right-click → Inspect on an email field
3. Look for the injected icon element
4. Check console for any content script errors

## Common Issues & Solutions

### Icons Not Showing
**Problem:** Missing icon files

**Solution:**
1. Open `chrome-extension/icons/generate-icons.html`
2. Download all 4 icon sizes
3. Place them in `chrome-extension/icons/` folder
4. Reload extension

### Popup Blank or Not Loading
**Problem:** Module import errors

**Solution:**
1. Check browser console (F12) when opening popup
2. Verify all files exist in correct locations
3. Check for typos in file paths

### Notifications Not Appearing
**Problem:** Chrome notifications disabled

**Solution:**
1. Go to `chrome://settings/content/notifications`
2. Allow notifications for Chrome
3. Check if extension has notification permission

### Badge Counter Not Updating
**Problem:** Service worker not running

**Solution:**
1. Go to `chrome://extensions/`
2. Check if service worker is active
3. Click extension icon to wake service worker
4. Check service worker console for errors

### API Connection Failures
**Problem:** All CORS proxies might be down or blocked

**Solution:**
1. Check internet connection
2. Try again in a few minutes
3. Check if you're behind a corporate firewall
4. Try using a VPN if proxies are blocked

## Verification Checklist

After applying fixes, verify:

- [ ] Extension loads without errors
- [ ] Service worker console shows no errors
- [ ] Popup opens successfully
- [ ] Email address generates
- [ ] Copy button works
- [ ] Auto-fill icons appear on email fields
- [ ] Clicking auto-fill icon populates fields
- [ ] Badge counter updates (test by sending email)
- [ ] Notifications appear (test by sending email)

## Getting More Help

If issues persist after trying all solutions:

1. **Check the service worker console:**
   - `chrome://extensions/` → Click "service worker"
   - Screenshot any errors

2. **Check the popup console:**
   - Right-click extension icon → "Inspect popup"
   - Screenshot any errors

3. **Check the content script console:**
   - Visit any webpage
   - Press F12 → Console tab
   - Screenshot any errors

4. **Report the issue:**
   - Create a GitHub issue with:
     - Chrome version
     - Operating system
     - Screenshots of errors
     - Steps to reproduce

## Prevention

To avoid future issues:

1. Always reload extension after making changes
2. Keep Chrome updated
3. Check permissions in manifest.json
4. Test in service worker console before full deployment
5. Use try-catch blocks for error handling

## Quick Reset

If everything is broken and you want to start fresh:

```bash
# Remove and reinstall
1. Remove extension from chrome://extensions/
2. Delete chrome-extension folder
3. Re-clone or download fresh copy
4. Generate icons
5. Load extension again
```

## Status: Fixed ✅

Both errors mentioned in your screenshot should now be resolved:
- ✅ Service worker registration failed - FIXED by adding "alarms" permission
- ✅ TypeError on chrome.alarms - FIXED by adding safety checks

Simply reload the extension in `chrome://extensions/` to apply the fixes!
