/**
 * Multiaxis Protection Module
 * A reusable security module to protect pages from AI scrapers and unauthorized access
 * 
 * @version 1.0.0
 * @date 2025-08-28
 * @author Mike Kaminski
 * @company Multiaxis LLC
 * @website https://multiaxis.ai
 * @license MIT
 * 
 * Copyright (C)2025 Multiaxis LLC. All rights reserved | The Power of MULTIAXIS(R) with the Intelligence of ARLO(TM)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * Usage:
 * 1. Include this script in your HTML page
 * 2. Call MultiaxisProtection.init() with your configuration
 * 3. Wrap your protected content in a div with id="protectedContent"
 */

const MultiaxisProtection = (function() {
    'use strict';
    
    // Default configuration
    const defaults = {
        // Content configuration
        protectedContentId: 'protectedContent',
        modalId: 'protectionModal',
        
        // Text customization
        title: 'Protected Content',
        notice: 'This verification helps protect our resources from automated AI scrapers and malware while keeping them accessible to legitimate users.',
        instruction: 'Please complete this simple verification to access this content:',
        challengeCompany: 'MULTIAXIS',
        hint: 'Eight letters, starts with \'M\'',
        errorMessage: 'Please type: MULTIAXIS (not case sensitive)',
        footerText: 'This human verification helps us maintain content quality and security.',
        
        // Accepted answers
        acceptedAnswers: ['MULTIAXIS', 'MULTIAXIS LLC', 'MULTIAXIS INTELLIGENCE'],
        
        // Safe Harbor configuration - ENABLED BY DEFAULT
        enableSafeHarbor: true,
        safeHarborTitle: 'Important Legal Notice',
        safeHarborDate: null, // null = use today's date, or provide specific date string
        safeHarborDaysValid: 90, // Number of days the disclaimer remains valid
        safeHarborText: null, // Will use default if not provided
        
        // Session configuration
        sessionKey: 'multiaxis_protection',
        safeHarborKey: null, // Will be auto-generated from sessionKey if not provided
        
        // Styling configuration
        useDefaultStyles: true,
        customStyles: null,
        
        // Callbacks
        onSuccess: null,
        onError: null,
        beforeCheck: null,
        onSafeHarborAccept: null,
        onSafeHarborDecline: null
    };
    
    let config = {};
    
    // Format date helper function
    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Get the date to use for Safe Harbor
    function getSafeHarborDate() {
        if (config.safeHarborDate) {
            // Use provided date if specified
            return config.safeHarborDate;
        } else {
            // Use today's date
            const today = new Date();
            return formatDate(today);
        }
    }
    
    // Get the expiration date for Safe Harbor validity
    function getSafeHarborExpirationDate() {
        const baseDate = config.safeHarborDate ? new Date(config.safeHarborDate) : new Date();
        const expirationDate = new Date(baseDate);
        expirationDate.setDate(expirationDate.getDate() + (config.safeHarborDaysValid || 90));
        return formatDate(expirationDate);
    }
    
    // Get default Safe Harbor text
    function getDefaultSafeHarborText() {
        const currentDate = getSafeHarborDate();
        const expirationDate = getSafeHarborExpirationDate();
        
        return `
            <p><strong>Website Terms & Conditions:</strong> This website and its content are proprietary to Multiaxis LLC. By accessing this protected content, you acknowledge and agree to the following terms.</p>
            
            <p><strong>Proprietary Information:</strong> All content, technical documentation, whitepapers, and materials on this site are the intellectual property of Multiaxis LLC. Unauthorized reproduction, distribution, or use is strictly prohibited.</p>
            
            <p><strong>Forward-Looking Statements:</strong> This site may contain statements about future product developments, features, or capabilities. These statements reflect our current plans based on information available today and may change without notice. They should not be interpreted as commitments or guarantees of future functionality.</p>
            
            <p><strong>Third-Party References:</strong> We may reference partner companies, technologies, or products for informational purposes only. These references do not imply endorsement, and we are not responsible for third-party products or services. All third-party trademarks are the property of their respective owners.</p>
            
            <p><strong>Disclaimer of Warranties:</strong> Content is provided "as is" without warranties of any kind. Multiaxis LLC assumes no liability for the accuracy, completeness, or usefulness of any information provided. If this content is accessed after ${expirationDate}, information may be outdated or no longer accurate.</p>
            
            <p><strong>Acceptable Use:</strong> By proceeding, you agree to use this content only for legitimate business purposes and not for competitive analysis, reverse engineering, or any unauthorized purpose. You may not use automated tools, scrapers, or bots to access this content.</p>
            
            <p><strong>Confidentiality:</strong> Some content may contain confidential or proprietary information. You agree to maintain the confidentiality of such information and not disclose it to unauthorized parties.</p>
        `;
    }
    
    // Create Safe Harbor modal HTML
    function createSafeHarborModal() {
        const currentDate = getSafeHarborDate();
        
        const modal = document.createElement('div');
        modal.id = 'safeHarborModal';
        modal.className = 'safe-harbor-modal';
        modal.innerHTML = `
            <div class="safe-harbor-container">
                <h2 class="safe-harbor-title">
                    <span class="legal-icon">⚖️</span>
                    <span>${config.safeHarborTitle}</span>
                </h2>
                
                <div class="safe-harbor-content">
                    ${config.safeHarborText || getDefaultSafeHarborText()}
                </div>
                
                <div class="safe-harbor-acknowledgment">
                    <label class="safe-harbor-checkbox-label">
                        <input type="checkbox" id="safeHarborCheckbox" class="safe-harbor-checkbox">
                        <span>I have read and understand these important legal notices and agree to proceed under these terms.</span>
                    </label>
                </div>
                
                <div class="safe-harbor-buttons">
                    <button class="safe-harbor-decline" id="safeHarborDecline">
                        Decline & Exit
                    </button>
                    <button class="safe-harbor-accept" id="safeHarborAccept" disabled>
                        Accept & Continue
                    </button>
                </div>
                
                <div class="safe-harbor-footer">
                    <p>Date of Notice: ${currentDate}</p>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    // Create protection modal HTML
    function createModal() {
        const modal = document.createElement('div');
        modal.id = config.modalId;
        modal.className = 'protection-modal';
        modal.innerHTML = `
            <div class="protection-container">
                <h2 class="protection-title">
                    <span class="shield-icon">🛡️</span>
                    <span>${config.title}</span>
                </h2>
                
                <div class="protection-notice">
                    <p>
                        <strong>Security Notice:</strong> ${config.notice}
                    </p>
                </div>

                <p class="protection-instruction">
                    ${config.instruction}
                </p>

                <div class="protection-challenge">
                    <p class="challenge-text">
                        Type the company name shown in our logo:
                        <br>
                        <strong style="font-size: 1.2em; color: var(--accent-color, #ff6b35);">${config.challengeCompany}</strong>
                    </p>
                    
                    <div class="protection-hint">
                        <p>💡 Hint: ${config.hint}</p>
                    </div>

                    <input 
                        type="text" 
                        id="protectionInput" 
                        class="protection-input" 
                        placeholder="Enter company name here"
                        autocomplete="off"
                        spellcheck="false"
                    >
                    
                    <button class="protection-submit" id="protectionSubmit">
                        Verify & Access
                    </button>
                    
                    <div id="protectionError" class="protection-error">
                        ${config.errorMessage}
                    </div>
                </div>

                <div class="protection-footer">
                    ${config.footerText}
                </div>
            </div>
        `;
        
        return modal;
    }
    
    // Create default styles
    function createStyles() {
        const styles = `
            .protection-modal, .safe-harbor-modal {
                display: flex;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(5px);
            }

            .protection-modal.hidden, .safe-harbor-modal.hidden {
                display: none;
            }

            .protection-container, .safe-harbor-container {
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-width: 500px;
                width: 90%;
                text-align: center;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .safe-harbor-container {
                max-width: 700px;
                text-align: left;
            }

            .protection-title, .safe-harbor-title {
                color: #2c5e82;
                margin-bottom: 20px;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                font-weight: bold;
            }

            .shield-icon, .legal-icon {
                font-size: 32px;
            }

            .protection-notice {
                background: linear-gradient(135deg, #e3f2fd, #fff3e0);
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 25px;
                border-left: 4px solid #ff6b35;
            }

            .protection-notice p {
                margin: 0;
                color: #666;
                font-size: 14px;
                line-height: 1.5;
            }

            .protection-instruction {
                color: #2c5e82;
                font-size: 16px;
                margin-bottom: 20px;
                font-weight: 600;
            }

            .protection-challenge {
                background: #f8f9fa;
                padding: 25px;
                border-radius: 8px;
                margin-bottom: 25px;
                border: 2px dashed #5B9BD5;
            }

            .challenge-text {
                font-size: 18px;
                color: #2c3e50;
                margin-bottom: 20px;
                font-weight: 500;
                line-height: 1.4;
            }

            .protection-input {
                width: 100%;
                padding: 12px;
                font-size: 16px;
                border: 2px solid #5B9BD5;
                border-radius: 8px;
                margin-bottom: 20px;
                outline: none;
                text-align: center;
                text-transform: uppercase;
                box-sizing: border-box;
            }

            .protection-input:focus {
                border-color: #2c5e82;
                box-shadow: 0 0 0 3px rgba(91, 155, 213, 0.1);
            }

            .protection-input::placeholder {
                text-transform: none;
                opacity: 0.5;
            }

            .protection-hint {
                background: #fffbf0;
                padding: 12px;
                border-radius: 5px;
                margin-bottom: 20px;
                border: 1px solid #ffd699;
            }

            .protection-hint p {
                margin: 0;
                font-size: 13px;
                color: #996600;
                font-style: italic;
            }

            .protection-submit, .safe-harbor-accept, .safe-harbor-decline {
                background: #5B9BD5;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 6px #999;
                min-width: 150px;
            }

            .protection-submit:hover, .safe-harbor-accept:hover:not(:disabled) {
                background: #4a8bc2;
            }

            .protection-submit:active, .safe-harbor-accept:active:not(:disabled) {
                box-shadow: 0 3px #666;
                transform: translateY(3px);
            }
            
            .safe-harbor-decline {
                background: #dc3545;
                margin-right: 10px;
            }
            
            .safe-harbor-decline:hover {
                background: #c82333;
            }
            
            .safe-harbor-accept:disabled {
                background: #ccc;
                cursor: not-allowed;
                box-shadow: none;
            }

            .protection-error {
                color: #d32f2f;
                margin-top: 12px;
                font-size: 14px;
                display: none;
                font-weight: 500;
            }

            .protection-footer, .safe-harbor-footer {
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                font-size: 13px;
                color: #999;
            }
            
            .safe-harbor-content {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                max-height: 400px;
                overflow-y: auto;
                border: 1px solid #dee2e6;
            }
            
            .safe-harbor-content p {
                margin-bottom: 15px;
                line-height: 1.6;
                font-size: 14px;
                color: #495057;
            }
            
            .safe-harbor-content p:last-child {
                margin-bottom: 0;
            }
            
            .safe-harbor-content strong {
                color: #2c5e82;
            }
            
            .safe-harbor-acknowledgment {
                background: #fff3cd;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                border: 1px solid #ffc107;
            }
            
            .safe-harbor-checkbox-label {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                cursor: pointer;
                font-size: 14px;
                color: #856404;
            }
            
            .safe-harbor-checkbox {
                margin-top: 3px;
                cursor: pointer;
            }
            
            .safe-harbor-buttons {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-top: 20px;
            }

            #protectedContent {
                display: none;
            }

            #protectedContent.authorized {
                display: block;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }

            @media (max-width: 768px) {
                .protection-container, .safe-harbor-container {
                    padding: 30px 20px;
                    width: 95%;
                }

                .protection-title, .safe-harbor-title {
                    font-size: 20px;
                }

                .challenge-text {
                    font-size: 16px;
                }
                
                .safe-harbor-buttons {
                    flex-direction: column;
                }
                
                .safe-harbor-decline {
                    margin-right: 0;
                    margin-bottom: 10px;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        return styleSheet;
    }
    
    // Check access
    function checkAccess() {
        const input = document.getElementById('protectionInput');
        const errorMsg = document.getElementById('protectionError');
        const userAnswer = input.value.trim().toUpperCase();
        
        // Run beforeCheck callback if provided
        if (config.beforeCheck && typeof config.beforeCheck === 'function') {
            config.beforeCheck(userAnswer);
        }
        
        // Check if answer is acceptable
        const isCorrect = config.acceptedAnswers.some(answer => 
            userAnswer === answer.toUpperCase() || 
            userAnswer === answer.replace(/\s+/g, '').toUpperCase()
        );
        
        if (isCorrect) {
            // Hide protection modal
            document.getElementById(config.modalId).classList.add('hidden');
            
            // Check if Safe Harbor is enabled
            if (config.enableSafeHarbor) {
                // Show Safe Harbor modal instead of content
                showSafeHarborModal();
            } else {
                // Show protected content directly
                showProtectedContent();
            }
            
            // Clear input
            input.value = '';
            errorMsg.style.display = 'none';
            
            // Set session storage for protection
            sessionStorage.setItem(config.sessionKey, 'granted');
            
            // Run success callback if provided
            if (config.onSuccess && typeof config.onSuccess === 'function') {
                config.onSuccess();
            }
        } else {
            // Show error message
            errorMsg.style.display = 'block';
            input.value = '';
            input.focus();
            
            // Add shake animation
            input.style.animation = 'shake 0.5s';
            setTimeout(() => {
                input.style.animation = '';
            }, 500);
            
            // Run error callback if provided
            if (config.onError && typeof config.onError === 'function') {
                config.onError(userAnswer);
            }
        }
    }
    
    // Show Safe Harbor modal
    function showSafeHarborModal() {
        const modal = document.getElementById('safeHarborModal');
        if (!modal) {
            console.error('Safe Harbor modal not found');
            return;
        }
        
        modal.classList.remove('hidden');
        
        // Get elements
        const checkbox = document.getElementById('safeHarborCheckbox');
        const acceptBtn = document.getElementById('safeHarborAccept');
        const declineBtn = document.getElementById('safeHarborDecline');
        
        if (!checkbox || !acceptBtn || !declineBtn) {
            console.error('Safe Harbor elements not found');
            return;
        }
        
        // Remove any existing event listeners first
        const newCheckbox = checkbox.cloneNode(true);
        checkbox.parentNode.replaceChild(newCheckbox, checkbox);
        const newAcceptBtn = acceptBtn.cloneNode(true);
        acceptBtn.parentNode.replaceChild(newAcceptBtn, acceptBtn);
        const newDeclineBtn = declineBtn.cloneNode(true);
        declineBtn.parentNode.replaceChild(newDeclineBtn, declineBtn);
        
        // Re-get the new elements
        const finalCheckbox = document.getElementById('safeHarborCheckbox');
        const finalAcceptBtn = document.getElementById('safeHarborAccept');
        const finalDeclineBtn = document.getElementById('safeHarborDecline');
        
        // Add event listener for checkbox
        finalCheckbox.addEventListener('change', function() {
            finalAcceptBtn.disabled = !this.checked;
        });
        
        // Add event listener for accept button
        finalAcceptBtn.addEventListener('click', function() {
            if (finalCheckbox.checked) {
                // Hide Safe Harbor modal
                modal.classList.add('hidden');
                // Show protected content
                showProtectedContent();
                // Set Safe Harbor accepted in session
                const safeHarborSessionKey = config.safeHarborKey || config.sessionKey + '_safeharbor';
                sessionStorage.setItem(safeHarborSessionKey, 'accepted');
                
                // Run Safe Harbor accept callback
                if (config.onSafeHarborAccept && typeof config.onSafeHarborAccept === 'function') {
                    config.onSafeHarborAccept();
                }
            }
        });
        
        // Add event listener for decline button
        finalDeclineBtn.addEventListener('click', function() {
            // Clear sessions
            sessionStorage.removeItem(config.sessionKey);
            const safeHarborSessionKey = config.safeHarborKey || config.sessionKey + '_safeharbor';
            sessionStorage.removeItem(safeHarborSessionKey);
            
            // Run Safe Harbor decline callback
            if (config.onSafeHarborDecline && typeof config.onSafeHarborDecline === 'function') {
                config.onSafeHarborDecline();
            }
            
            // Reload the page
            location.reload();
        });
    }
    
    // Show protected content
    function showProtectedContent() {
        const protectedContent = document.getElementById(config.protectedContentId);
        if (protectedContent) {
            protectedContent.classList.add('authorized');
        }
    }
    
    // Check if user already has access
    function checkExistingAccess() {
        const hasProtectionAccess = sessionStorage.getItem(config.sessionKey) === 'granted';
        const safeHarborKey = config.safeHarborKey || config.sessionKey + '_safeharbor';
        const hasSafeHarborAccess = !config.enableSafeHarbor || sessionStorage.getItem(safeHarborKey) === 'accepted';
        
        if (hasProtectionAccess && hasSafeHarborAccess) {
            // User has completed all requirements
            const modal = document.getElementById(config.modalId);
            if (modal) {
                modal.classList.add('hidden');
            }
            
            const safeHarborModal = document.getElementById('safeHarborModal');
            if (safeHarborModal) {
                safeHarborModal.classList.add('hidden');
            }
            
            showProtectedContent();
            return true;
        } else if (hasProtectionAccess && config.enableSafeHarbor && !hasSafeHarborAccess) {
            // User passed protection but needs Safe Harbor
            const modal = document.getElementById(config.modalId);
            if (modal) {
                modal.classList.add('hidden');
            }
            showSafeHarborModal();
            return false;
        }
        
        return false;
    }
    
    // Initialize protection
    function init(userConfig = {}) {
        // Merge user config with defaults
        config = { ...defaults, ...userConfig };
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setup);
        } else {
            setup();
        }
    }
    
    // Setup protection
    function setup() {
        // Add styles if needed
        if (config.useDefaultStyles) {
            document.head.appendChild(createStyles());
        }
        
        // Add custom styles if provided
        if (config.customStyles) {
            const customStyleSheet = document.createElement('style');
            customStyleSheet.textContent = config.customStyles;
            document.head.appendChild(customStyleSheet);
        }
        
        // Create and add protection modal
        const modal = createModal();
        document.body.appendChild(modal);
        
        // Create and add Safe Harbor modal if enabled
        if (config.enableSafeHarbor) {
            const safeHarborModal = createSafeHarborModal();
            document.body.appendChild(safeHarborModal);
        }
        
        // Check existing access
        if (!checkExistingAccess()) {
            // Set up event listeners for protection
            const submitButton = document.getElementById('protectionSubmit');
            if (submitButton) {
                submitButton.addEventListener('click', checkAccess);
            }
            
            const input = document.getElementById('protectionInput');
            if (input) {
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        checkAccess();
                    }
                });
                
                // Focus input
                setTimeout(() => input.focus(), 100);
            }
        }
    }
    
    // Public API
    return {
        init: init,
        checkAccess: checkAccess,
        reset: function() {
            sessionStorage.removeItem(config.sessionKey);
            location.reload();
        }
    };
})();

// Auto-initialize with data attributes if present
document.addEventListener('DOMContentLoaded', function() {
    const protectionElement = document.querySelector('[data-protection="multiaxis"]');
    if (protectionElement) {
        const config = {};
        
        // Parse data attributes
        for (let key in protectionElement.dataset) {
            if (key !== 'protection') {
                config[key] = protectionElement.dataset[key];
            }
        }
        
        MultiaxisProtection.init(config);
    }
});
