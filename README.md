# Multiaxis Protection Module

Protects your web content from AI scrapers with human verification + legal disclaimers.

**Version:** 1.0.0  
**Author:** Mike Kaminski  
**Company:** Multiaxis LLC  
**License:** MIT  

## Quick Start

### 1. Add the script to your page:
```html
<script src="protection.js"></script>
```

### 2. Wrap your protected content:
```html
<div id="protectedContent">
    <!-- Your content here -->
</div>
```

### 3. Initialize at the bottom of your page:
```html
<script>
    MultiaxisProtection.init();
</script>
```

That's it! Users will need to:
1. Type "MULTIAXIS" to prove they're human
2. Accept legal terms
3. Then they can see your content

## Complete Working Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>Protected Page</title>
    <script src="protection.js"></script>
</head>
<body>
    <div id="protectedContent">
        <h1>This content is protected</h1>
        <p>Users must verify they're human and accept terms to see this.</p>
        
        <h2>Your Protected Content</h2>
        <ul>
            <li>Technical Documentation</li>
            <li>Whitepapers</li>
            <li>Proprietary Information</li>
        </ul>
    </div>
    
    <script>
        // Basic usage - Safe Harbor is enabled by default
        MultiaxisProtection.init();
    </script>
</body>
</html>
```

## Common Customizations

### Change the title:
```javascript
MultiaxisProtection.init({
    title: 'Protected Technical Documents'
});
```

### Track when users get access:
```javascript
MultiaxisProtection.init({
    onSafeHarborAccept: function() {
        console.log('User accepted terms');
        // Your analytics code here
    }
});
```

### Change validity period (default 90 days):
```javascript
MultiaxisProtection.init({
    safeHarborDaysValid: 180  // 6 months
});
```

### Use different session key for different pages:
```javascript
MultiaxisProtection.init({
    sessionKey: 'whitepaper_access'  // Different for each page type
});
```

### Disable Safe Harbor (verification only):
```javascript
MultiaxisProtection.init({
    enableSafeHarbor: false  // Only human verification, no legal terms
});
```

## What Users See

1. **First Screen:** "Type MULTIAXIS" verification
   - Proves they're human, not a bot
   - Case-insensitive
   - Accepts "MULTIAXIS", "MULTIAXIS LLC", or "MULTIAXIS INTELLIGENCE"

2. **Second Screen:** Legal disclaimer (if Safe Harbor enabled)
   - Shows today's date automatically
   - Must check acknowledgment box
   - Accept or Decline options
   - Decline returns to start

3. **Success:** Your protected content displays
   - Both verifications remembered per browser session
   - No need to re-verify on page refresh

## File Structure

```
your-website/
├── js/
│   └── protection.js
├── pages/
│   └── protected-page.html
└── index.html
```

## Features

- 🛡️ Blocks AI scrapers and bots
- ⚖️ Optional legal disclaimers with date tracking
- 🚀 Zero dependencies - pure JavaScript
- 📱 Mobile responsive
- 💾 Session persistence
- 🎨 Customizable text and styling

## Advanced Configuration

For all configuration options, callbacks, and styling customization, see the full documentation below.

### All Configuration Options

```javascript
MultiaxisProtection.init({
    // Basic settings
    protectedContentId: 'protectedContent',  // ID of your protected div
    title: 'Protected Content',              // Modal title
    challengeCompany: 'MULTIAXIS',          // Word users must type
    sessionKey: 'unique_page_key',          // Unique key per page
    
    // Safe Harbor settings
    enableSafeHarbor: true,                 // Show legal terms (default: true)
    safeHarborDaysValid: 90,                // Days until info outdated
    
    // Callbacks
    onSuccess: function() {},               // After verification passed
    onSafeHarborAccept: function() {},     // After terms accepted
    onSafeHarborDecline: function() {},    // If terms declined
    
    // Styling
    useDefaultStyles: true,                // Use built-in styles
    customStyles: 'your CSS here'          // Add custom CSS
});
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers

## License

MIT License - Copyright (c) 2024 Multiaxis LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Support

- Email: support@multiaxis.llc
- Website: [https://multiaxis.ai](https://multiaxis.ai)
- Terms: [https://multiaxis.ai/legal/terms-of-use.html](https://multiaxis.ai/legal/terms-of-use.html)
