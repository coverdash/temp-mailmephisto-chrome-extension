# Setup Guide for Mephisto TempMail Chrome Extension

## Quick Start (5 minutes)

### Step 1: Generate Icons

Icons are required for the extension to load. Choose one method:

#### Method A: Using the HTML Generator (Easiest)
1. Open `chrome-extension/icons/generate-icons.html` in Chrome
2. Click each "Download icon16.png", "Download icon32.png", etc. button
3. Move the downloaded PNG files to the `chrome-extension/icons/` folder

#### Method B: Use Placeholder Icons (Fastest for Testing)
```bash
# Create simple colored squares as placeholders
cd chrome-extension/icons
# On macOS/Linux with ImageMagick:
convert -size 16x16 xc:#ef4444 icon16.png
convert -size 32x32 xc:#ef4444 icon32.png
convert -size 48x48 xc:#ef4444 icon48.png
convert -size 128x128 xc:#ef4444 icon128.png
```

### Step 2: Load Extension in Chrome

1. Open Chrome and navigate to: `chrome://extensions/`

2. Enable **Developer mode** (toggle in top-right corner)

3. Click **"Load unpacked"** button

4. Navigate to and select the `chrome-extension` folder

5. The extension should now appear in your extensions list!

### Step 3: Pin the Extension (Optional)

1. Click the puzzle piece icon in Chrome toolbar
2. Find "Mephisto TempMail"
3. Click the pin icon to keep it visible

### Step 4: Test the Extension

1. **Test Email Generation:**
   - Click the extension icon
   - Verify a temporary email appears
   - Click the copy button

2. **Test Auto-Fill:**
   - Visit any website with an email field (e.g., a signup form)
   - Look for the blue envelope icon in the email field
   - Click it to auto-fill

3. **Test Notifications:**
   - Send a test email to your temporary address
   - Wait for the notification to appear
   - Check the badge counter on the extension icon

## Troubleshooting

### Extension Won't Load

**Error: "Manifest file is missing or unreadable"**
- Make sure you selected the `chrome-extension` folder, not the root folder
- Check that `manifest.json` exists in the folder

**Error: "Invalid manifest"**
- Ensure `manifest.json` is valid JSON
- Check for syntax errors

### Icons Not Showing

**Extension shows default gray icon:**
- Icons are missing from `chrome-extension/icons/` folder
- Follow Step 1 to generate icons
- Reload the extension after adding icons

### Auto-Fill Not Working

**Icon doesn't appear in email fields:**
- Check browser console for errors (F12)
- Verify content script permissions in manifest
- Try refreshing the page

**Icon appears but clicking doesn't fill:**
- Check if extension is enabled
- Verify email has been generated in popup
- Check background service worker console for errors

### Notifications Not Appearing

**No desktop notifications:**
- Check Chrome notification permissions:
  1. Go to `chrome://settings/content/notifications`
  2. Ensure notifications are allowed
  3. Check site permissions for the extension

**Badge counter not updating:**
- Service worker might be inactive
- Open extension popup to trigger a refresh
- Check background service worker logs

### API Connection Issues

**"Failed to generate email" errors:**
- CORS proxies might be down
- Check internet connection
- Wait a moment and try again
- The extension cycles through multiple proxies

## Development Mode

### Viewing Console Logs

**Popup Console:**
1. Right-click extension icon
2. Click "Inspect popup"
3. Console shows popup.js logs

**Background Service Worker Console:**
1. Go to `chrome://extensions/`
2. Find Mephisto TempMail
3. Click "service worker" link
4. Console shows background.js logs

**Content Script Console:**
1. Open any webpage
2. Press F12 for DevTools
3. Console shows content.js logs

### Making Changes

After modifying code:

1. **Popup/Content changes:**
   - Click reload button on extension card in `chrome://extensions/`

2. **Service Worker changes:**
   - Click "service worker" link to stop it
   - Reload the extension
   - Service worker restarts automatically

3. **Manifest changes:**
   - Always reload extension after manifest.json changes

### Testing on Different Sites

**Recommended test sites:**
- https://example.com (simple form)
- https://github.com/signup (complex form)
- https://mail.google.com (dynamic content)
- https://twitter.com/signup (SPA)

## Advanced Setup

### Using a Local Proxy (Optional)

If CORS proxies are blocked or slow, you can run your own:

```bash
# Clone and run a local CORS proxy
npm install -g local-cors-proxy
lcp --proxyUrl https://api.guerrillamail.com
```

Then update `mailService.js` to use `http://localhost:8010/proxy`

### Custom Domain Support

To add more Guerrilla Mail domains:

1. Edit `chrome-extension/scripts/mailService.js`
2. Update the domain list in the code
3. Reload extension

### Building for Distribution

To create a ZIP for Chrome Web Store:

```bash
cd chrome-extension
zip -r mephisto-tempmail-v1.0.0.zip . -x "*.git*" -x "*generate-icons.html"
```

## Performance Tips

1. **Reduce polling frequency** (saves battery):
   - Edit `background.js`
   - Change `periodInMinutes` to a higher value

2. **Disable on specific sites**:
   - Right-click extension icon
   - Choose "This can read and change site data"
   - Select "On click" or specific sites only

3. **Clear storage** (if extension feels slow):
   ```javascript
   // In browser console:
   chrome.storage.local.clear()
   ```

## Getting Help

1. Check the main [README.md](README.md) for feature documentation
2. Review browser console for error messages
3. Open an issue on GitHub with:
   - Chrome version
   - Extension version
   - Steps to reproduce
   - Console errors (if any)

## Next Steps

Once everything is working:

1. Customize the UI colors in `popup.css`
2. Add your own icon designs
3. Adjust notification settings
4. Share feedback or contribute improvements!

Enjoy your privacy-focused temporary email extension! 🎉
