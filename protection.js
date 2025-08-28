/**
 * Multiaxis Protection Module
 * A reusable security module to protect pages from AI scrapers and unauthorized access
 * 
 * @version 1.0.0
 * @date 2024-01-20
 * @author Mike Kaminski
 * @company Multiaxis LLC
 * @website https://multiaxis.ai
 * @license MIT
 * 
 * Copyright (c) 2024 Multiaxis LLC
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
        acceptedAnswers: ['MULTIAXIS', 'MULTIAXIS LLC', 'MULTIAXIS AI'],
        
        // Session configuration
        sessionKey: 'multiaxis_protection',
        
        // Styling configuration
        useDefaultStyles: true,
        customStyles: null,
        
        // Callbacks
        onSuccess: null,
        onError: null,
        beforeCheck: null
    };
    
    let config = {};
    
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
            .protection-modal {
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

            .protection-modal.hidden {
                display: none;
            }

            .protection-container {
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                max-width: 500px;
                width: 90%;
                text-align: center;
            }

            .protection-title {
                color: #2c5e82;
                margin-bottom: 20px;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                font-weight: bold;
            }

            .shield-icon {
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

            .protection-submit {
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

            .protection-submit:hover {
                background: #4a8bc2;
            }

            .protection-submit:active {
                box-shadow: 0 3px #666;
                transform: translateY(3px);
            }

            .protection-error {
                color: #d32f2f;
                margin-top: 12px;
                font-size: 14px;
                display: none;
                font-weight: 500;
            }

            .protection-footer {
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                font-size: 13px;
                color: #999;
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
                .protection-container {
                    padding: 30px 20px;
                    width: 95%;
                }

                .protection-title {
                    font-size: 20px;
                }

                .challenge-text {
                    font-size: 16px;
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
            
            // Show protected content
            const protectedContent = document.getElementById(config.protectedContentId);
            if (protectedContent) {
                protectedContent.classList.add('authorized');
            }
            
            // Clear input
            input.value = '';
            errorMsg.style.display = 'none';
            
            // Set session storage
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
    
    // Check if user already has access
    function checkExistingAccess() {
        if (sessionStorage.getItem(config.sessionKey) === 'granted') {
            const modal = document.getElementById(config.modalId);
            if (modal) {
                modal.classList.add('hidden');
            }
            
            const protectedContent = document.getElementById(config.protectedContentId);
            if (protectedContent) {
                protectedContent.classList.add('authorized');
            }
            
            return true;
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
        
        // Create and add modal
        const modal = createModal();
        document.body.appendChild(modal);
        
        // Check existing access
        if (!checkExistingAccess()) {
            // Set up event listeners
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
