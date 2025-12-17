# Quick Start Guide

Get up and running in 3 minutes!

## Prerequisites
- Google Chrome browser (version 88 or higher)
- 5 minutes of your time

## Installation Steps

### 1. Generate Icons (30 seconds)

The extension needs icons to display properly. Use the built-in generator:

```bash
# Open the icon generator
open chrome-extension/icons/generate-icons.html
# Or on Windows: start chrome-extension/icons/generate-icons.html
# Or just drag the file to your browser
```

Click the download buttons for each icon size, then move the PNG files to `chrome-extension/icons/`

### 2. Load Extension (1 minute)

1. Open Chrome and go to: `chrome://extensions/`
2. Toggle **"Developer mode"** ON (top-right)
3. Click **"Load unpacked"**
4. Select the `chrome-extension` folder
5. Done! The extension is now installed

### 3. First Use (1 minute)

1. **Click the extension icon** in your toolbar
   - A temporary email address appears automatically
   - Click the copy button to copy it

2. **Test auto-fill:**
   - Visit any website with an email field
   - Look for the blue envelope icon
   - Click it to auto-fill

3. **Test notifications:**
   - Send yourself a test email
   - Wait 30 seconds
   - You'll see a notification!

## That's It!

You're ready to use Mephisto TempMail. For more details:

- **Full Documentation**: See [README.md](README.md)
- **Detailed Setup**: See [SETUP.md](SETUP.md)
- **Feature Guide**: See [chrome-extension/FEATURES.md](chrome-extension/FEATURES.md)

## Common First-Time Issues

**Extension icon not showing?**
→ Reload the extension in `chrome://extensions/`

**Auto-fill not working?**
→ Refresh the webpage after installing

**No notifications?**
→ Check Chrome notification permissions in settings

## Get Help

- Check the [SETUP.md](SETUP.md) troubleshooting section
- Open an issue on GitHub
- Review browser console for errors (F12)

Enjoy your privacy! 🎉
