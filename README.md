# Multiaxis Protection Module

A lightweight, client-side JavaScript module that protects web content from automated AI scrapers and bots while maintaining accessibility for legitimate human users.

**Version:** 1.0.0  
**Author:** Mike Kaminski  
**Company:** Multiaxis LLC  
**License:** MIT  

## Features

- 🛡️ **AI/Bot Protection**: Prevents automated scraping through human verification
- ⚖️ **Safe Harbor Disclaimers**: Optional legal notices for forward-looking statements (NEW)
- 🚀 **Zero Dependencies**: Pure JavaScript, no external libraries required
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Fully Customizable**: Extensive configuration options for text, styling, and behavior
- 💾 **Session Persistence**: Users verify once per session
- ♿ **Accessible**: Keyboard navigation and screen reader friendly
- 🔧 **Easy Integration**: Simple setup with minimal code changes

## Installation

1. Download `protection.js` and add it to your project:
```
/your-project/
  ├── js/
  │   └── protection.js
  └── your-page.html
```

2. Include the script in your HTML:
```html
<script src="js/protection.js"></script>
```

3. Wrap your protected content:
```html
<div id="protectedContent">
    <!-- Your protected content here -->
</div>
```

4. Initialize the protection:
```html
<script>
    MultiaxisProtection.init();
</script>
```

## Quick Start Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Protected Page Example</title>
    <script src="protection.js"></script>
</head>
<body>
    <!-- Protected Content Container -->
    <div id="protectedContent">
        <h1>Welcome to Protected Content</h1>
        <p>This content is only visible after human verification.</p>
        
        <section>
            <h2>Your Protected Resources</h2>
            <ul>
                <li>Technical Documentation</li>
                <li>API References</li>
                <li>Proprietary Information</li>
                <li>Premium Content</li>
            </ul>
        </section>
        
        <p>All of this content is protected from AI scrapers and automated bots.</p>
    </div>

    <script>
        // Initialize protection with custom configuration
        MultiaxisProtection.init({
            title: 'Protected Resources',
            notice: 'This content is protected from automated access.',
            sessionKey: 'my_protected_page',
            onSuccess: function() {
                console.log('Access granted!');
            }
        });
    </script>
</body>
</html>
```

## Configuration Options

The `init()` method accepts a configuration object with the following options:

```javascript
MultiaxisProtection.init({
    // Content IDs
    protectedContentId: 'protectedContent',  // ID of protected content container
    modalId: 'protectionModal',              // ID of protection modal
    
    // Text Customization
    title: 'Protected Content',              // Modal title
    notice: 'Security notice text...',       // Security notice message
    instruction: 'Please complete...',       // User instruction text
    challengeCompany: 'MULTIAXIS',          // Company name to type
    hint: 'Eight letters, starts with M',    // Hint for users
    errorMessage: 'Please type: MULTIAXIS',  // Error message
    footerText: 'This human verification...', // Footer text
    
    // Accepted Answers (case-insensitive)
    acceptedAnswers: ['MULTIAXIS', 'MULTIAXIS LLC', 'MULTIAXIS INTELLIGENCE'],
    
    // Safe Harbor Configuration (NEW in v1.0.0)
    enableSafeHarbor: false,                // Enable legal disclaimer step
    safeHarborTitle: 'Important Legal Notice',
    safeHarborDate: 'August 1, 2025',       // Expiration date for disclaimers
    safeHarborText: null,                   // Custom legal text (uses default if null)
    
    // Session Configuration
    sessionKey: 'unique_page_key',          // Unique key for session storage
    safeHarborKey: null,                    // Separate key for Safe Harbor acceptance
    
    // Styling Options
    useDefaultStyles: true,                 // Use built-in CSS styles
    customStyles: null,                     // Additional CSS as string
    
    // Callback Functions
    onSuccess: function() {},               // Called on successful verification
    onError: function(attempt) {},          // Called on failed attempt
    beforeCheck: function(answer) {},       // Called before checking answer
    onSafeHarborAccept: function() {},     // Called when Safe Harbor accepted (NEW)
    onSafeHarborDecline: function() {}     // Called when Safe Harbor declined (NEW)
});
```

## Advanced Examples

### Safe Harbor Legal Disclaimers (NEW in v1.0.0)

Enable a two-step verification process with legal disclaimers for sensitive content:

```javascript
MultiaxisProtection.init({
    title: 'Partnership Documents',
    sessionKey: 'partnership_access',
    
    // Enable Safe Harbor feature
    enableSafeHarbor: true,
    safeHarborTitle: 'Legal Disclaimer & Terms',
    safeHarborDate: 'January 1, 2025',
    
    // Optional: Use custom legal text
    safeHarborText: `
        <p><strong>Custom Legal Notice:</strong> Your custom legal text here...</p>
        <p>Additional paragraphs of legal disclaimers...</p>
    `,
    
    // Track acceptance
    onSafeHarborAccept: function() {
        console.log('Legal terms accepted at:', new Date().toISOString());
        // Log to your analytics or compliance system
    },
    onSafeHarborDecline: function() {
        console.log('User declined legal terms');
        // Handle declined access
    }
});
```

The Safe Harbor feature includes:
- Forward-looking statement disclaimers
- Third-party information disclaimers
- Antitrust compliance notices
- Customizable expiration dates
- Checkbox confirmation requirement
- Separate session tracking

### Custom Styling

```javascript
MultiaxisProtection.init({
    title: 'Premium Content',
    customStyles: `
        .protection-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .protection-submit {
            background: #f093fb;
            color: white;
        }
        .protection-submit:hover {
            background: #f5576c;
        }
    `
});
```

### Analytics Integration

```javascript
MultiaxisProtection.init({
    sessionKey: 'whitepaper_access',
    onSuccess: function() {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'protection_passed', {
                'event_category': 'security',
                'event_label': 'whitepaper'
            });
        }
        
        // Custom tracking
        fetch('/api/track', {
            method: 'POST',
            body: JSON.stringify({
                event: 'access_granted',
                page: window.location.pathname
            })
        });
    },
    onError: function(attempt) {
        console.warn('Failed access attempt:', attempt);
    }
});
```

### Multiple Protected Sections

```javascript
// Different protection for different page sections
if (document.getElementById('premiumContent')) {
    MultiaxisProtection.init({
        protectedContentId: 'premiumContent',
        sessionKey: 'premium_access',
        title: 'Premium Section'
    });
}
```

## API Methods

### `MultiaxisProtection.init(config)`
Initializes the protection module with the specified configuration.

### `MultiaxisProtection.checkAccess()`
Manually triggers the access verification check.

### `MultiaxisProtection.reset()`
Clears the session storage and reloads the page, requiring re-verification.

## How It Works

1. **Initial Load**: The module hides protected content and displays a verification modal
2. **Human Verification**: Users must type the company name (default: "MULTIAXIS")
3. **Safe Harbor (Optional)**: If enabled, users must accept legal disclaimers after verification
4. **Session Storage**: Successful verification is stored in the browser session
5. **Content Access**: Protected content becomes visible after all requirements are met
6. **Persistence**: Users don't need to re-verify during the same session

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Opera 47+
- Mobile browsers (iOS Safari 12+, Chrome Android)

## Security Considerations

This module provides client-side protection against automated scraping. For sensitive content requiring stronger security:

- Implement server-side authentication
- Use token-based access control
- Consider rate limiting
- Add server-side validation

The module is designed to deter automated access while maintaining usability for legitimate users.

## License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (C)2025 Multiaxis LLC. All rights reserved | The Power of MULTIAXIS(R) with the Intelligence of ARLO(TM)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For support, please contact:
- Email: support@multiaxis.llc
- Website: [https://multiaxis.ai](https://multiaxis.ai)
- Terms of Use: [https://multiaxis.ai/legal/terms-of-use.html](https://multiaxis.ai/legal/terms-of-use.html)

## Acknowledgments

Developed by Multiaxis LLC to protect valuable content from automated scraping while maintaining accessibility for legitimate users.

## Changelog

### Version 1.0.0 (August 28, 2025)
- Initial public release
- Basic protection functionality with human verification
- Safe Harbor legal disclaimer feature
- Session persistence for both protection and legal acceptance
- Customizable configuration for all text and styling
- Default styling included with override capabilities
- Callback support for analytics and compliance tracking
- Mobile responsive design
- Accessibility features
