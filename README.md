# Mephisto TempMail - Chrome Extension

A modern Chrome extension for generating and managing temporary email addresses. Built as a wrapper around the [temp-mailmephisto](https://github.com/jokallame350-lang/temp-mailmephisto) web application.

## Features

- **Instant Email Generation**: Generate temporary email addresses with one click
- **One-Click Copy**: Copy your temporary email to clipboard instantly
- **Smart Auto-Fill**: Automatically injects a fill icon into email input fields across any website
- **Real-Time Notifications**: Get notified when new emails arrive with badge counter
- **Email Management**: View, read, and manage your temporary emails directly from the extension
- **Privacy-Focused**: No tracking, cookies, or data persistence beyond the session
- **Modern UI**: Clean, dark-themed interface built with modern web standards

## Technology Stack

- **Manifest V3**: Latest Chrome extension platform (required for Chrome Web Store)
- **Service Workers**: Efficient background processing for email polling
- **Content Scripts**: Smart detection and auto-fill for email fields
- **Chrome Storage API**: Secure local storage for session management
- **Chrome Notifications API**: Native browser notifications for new emails
- **Vanilla JavaScript**: No framework dependencies for optimal performance

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/temp-mailmephisto-chrome-extension.git
   cd temp-mailmephisto-chrome-extension
   ```

2. Generate extension icons:
   - Open `chrome-extension/icons/generate-icons.html` in a browser
   - Click each download button to save the icon files
   - Or create your own icons (16x16, 32x32, 48x48, 128x128 PNG files)

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `chrome-extension` folder

### From Chrome Web Store

_Coming soon..._

## Usage

### Generating a Temporary Email

1. Click the Mephisto extension icon in your Chrome toolbar
2. Your temporary email address will be displayed automatically
3. Click the copy button to copy it to your clipboard
4. Click the "+" button to generate a new email address

### Auto-Filling Email Fields

1. Navigate to any website with an email input field
2. Look for the blue envelope icon that appears inside the field
3. Click the icon to automatically fill the field with your temporary email
4. The extension detects email fields by type, name, id, and placeholder attributes

### Managing Emails

1. Open the extension popup to view all received emails
2. Click on any email to view it in the full web application
3. The badge on the extension icon shows your unread email count
4. Emails are automatically refreshed every 30 seconds

### Notifications

- Desktop notifications appear when new emails arrive
- Badge counter updates in real-time
- Click the notification to open the extension popup

## Architecture

### File Structure

```
chrome-extension/
├── manifest.json                 # Extension manifest (Manifest V3)
├── icons/                        # Extension icons
│   ├── generate-icons.html      # Icon generator utility
│   ├── icon16.png               # 16x16 icon
│   ├── icon32.png               # 32x32 icon
│   ├── icon48.png               # 48x48 icon
│   └── icon128.png              # 128x128 icon
├── popup/                        # Extension popup UI
│   ├── popup.html               # Popup HTML structure
│   ├── popup.css                # Popup styling
│   └── popup.js                 # Popup functionality
├── scripts/                      # Extension scripts
│   ├── mailService.js           # Email API service
│   ├── background.js            # Service worker
│   └── content.js               # Content script for auto-fill
└── styles/                       # Content styles
    └── content.css              # Auto-fill icon styling
```

### Components

#### Service Worker (`background.js`)
- Polls for new emails every 30 seconds using Chrome Alarms API
- Updates badge counter with unread email count
- Sends desktop notifications for new emails
- Manages email session lifecycle

#### Content Script (`content.js`)
- Detects email input fields across all websites
- Injects clickable fill icons
- Handles auto-fill functionality
- Observes DOM changes for dynamically added fields

#### Mail Service (`mailService.js`)
- Interfaces with Guerrilla Mail API through CORS proxies
- Handles email generation and fetching
- Manages session storage via Chrome Storage API
- Decodes HTML entities and cleans email content

#### Popup UI (`popup/`)
- Displays current email address
- Shows email list with real-time updates
- Provides copy and generate buttons
- Links to full web application

## API Integration

This extension uses the Guerrilla Mail API (https://www.guerrillamail.com/) through CORS proxy services:

- `https://api.codetabs.com/v1/proxy`
- `https://thingproxy.freeboard.io/fetch/`
- `https://api.allorigins.win/raw`

The extension automatically tries each proxy in order until one succeeds, with a 5-second timeout per request.

## Privacy & Security

- **No Data Collection**: We don't collect, store, or transmit any user data
- **Session-Only Storage**: Email sessions are stored locally using Chrome Storage API
- **No Cookies**: The extension doesn't use cookies or tracking mechanisms
- **HTTPS Only**: All API requests use HTTPS for secure communication
- **Content Security**: Email content is sanitized to prevent XSS attacks

## Development

### Best Practices Implemented

1. **Manifest V3 Compliance**: Uses service workers and modern APIs
2. **Efficient Polling**: Uses Chrome Alarms API (30-second minimum interval)
3. **Smart Content Detection**: Robust email field detection with multiple heuristics
4. **Error Handling**: Graceful fallbacks for API failures
5. **Performance**: Minimal memory footprint with efficient DOM observation
6. **Accessibility**: Semantic HTML and ARIA labels

### Testing Checklist

- [ ] Email generation works correctly
- [ ] Copy to clipboard functionality
- [ ] Auto-fill icon appears on email fields
- [ ] Auto-fill correctly populates fields
- [ ] Badge counter updates with new emails
- [ ] Notifications appear for new emails
- [ ] Email list displays correctly
- [ ] Popup UI is responsive and functional
- [ ] Works across different websites
- [ ] No console errors or warnings

## Credits

This extension is built as a wrapper around the excellent [temp-mailmephisto](https://github.com/jokallame350-lang/temp-mailmephisto) web application by [jokallame350-lang](https://github.com/jokallame350-lang).

**Original Project**: https://github.com/jokallame350-lang/temp-mailmephisto
**Live Web App**: https://mephistomail.site/

All core email functionality and API integration is based on the original implementation. This extension adds Chrome-specific features like auto-fill, notifications, and browser integration.

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/temp-mailmephisto-chrome-extension/issues) page
2. Create a new issue with detailed information
3. Visit the original project for API-related issues

## Roadmap

- [ ] Add email detail view in popup
- [ ] Support for custom domain selection
- [ ] Email search and filtering
- [ ] Dark/Light theme toggle
- [ ] Export emails functionality
- [ ] Multiple email address management
- [ ] Keyboard shortcuts
- [ ] Firefox extension port

## Changelog

### Version 1.0.0 (2025-01-XX)
- Initial release
- Email generation and management
- Auto-fill functionality
- Real-time notifications
- Badge counter
- Modern Manifest V3 implementation
