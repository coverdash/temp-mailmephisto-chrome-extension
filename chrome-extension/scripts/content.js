// Content Script for Mephisto TempMail Extension
// Injects fill icons into email input fields

(function() {
  'use strict';

  const ICON_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  `;

  // Track processed inputs to avoid duplicate icons
  const processedInputs = new WeakSet();

  // Check if an input field is an email field
  function isEmailField(input) {
    if (input.type === 'email') return true;

    const name = (input.name || '').toLowerCase();
    const id = (input.id || '').toLowerCase();
    const placeholder = (input.placeholder || '').toLowerCase();
    const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();

    const emailKeywords = ['email', 'e-mail', 'mail', 'correo', 'courriel'];

    return emailKeywords.some(keyword =>
      name.includes(keyword) ||
      id.includes(keyword) ||
      placeholder.includes(keyword) ||
      ariaLabel.includes(keyword)
    );
  }

  // Create and inject the fill icon
  function injectIcon(input) {
    if (processedInputs.has(input)) return;

    console.log('Mephisto: Injecting icon for email field:', input);
    processedInputs.add(input);

    // Ensure input has position context
    const computedStyle = window.getComputedStyle(input);
    const inputPosition = computedStyle.position;

    // Wrap input in relative container if needed
    let container = input.parentElement;
    if (inputPosition === 'static' || inputPosition === '') {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.display = 'inline-block';
      wrapper.style.width = '100%';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
      container = wrapper;
    }

    // Create icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'mephisto-email-icon';
    iconContainer.innerHTML = ICON_SVG;
    iconContainer.title = 'Fill with temporary email from Mephisto';

    // Position the icon with better calculation
    iconContainer.style.cssText = `
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: #6366f1;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      transition: all 0.2s;
      padding: 4px;
      border-radius: 4px;
      pointer-events: auto;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    `;

    console.log('Mephisto: Icon injected and positioned');

    // Add hover effect
    iconContainer.addEventListener('mouseenter', () => {
      iconContainer.style.backgroundColor = '#e0e7ff';
      iconContainer.style.color = '#4338ca';
    });

    iconContainer.addEventListener('mouseleave', () => {
      iconContainer.style.backgroundColor = 'transparent';
      iconContainer.style.color = '#6366f1';
    });

    // Handle click to fill email
    iconContainer.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        // Get current email from background
        const response = await chrome.runtime.sendMessage({ action: 'getEmail' });

        if (response && response.email) {
          input.value = response.email;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));

          // Visual feedback
          iconContainer.style.color = '#10b981';
          setTimeout(() => {
            iconContainer.style.color = '#6366f1';
          }, 1000);
        }
      } catch (error) {
        console.error('Error filling email:', error);
      }
    });

    // Append icon to the container
    container.appendChild(iconContainer);

    console.log('Mephisto: Icon added to DOM');

    // Remove icon if input is removed
    const observer = new MutationObserver((mutations) => {
      if (!document.contains(input)) {
        iconContainer.remove();
        observer.disconnect();
        window.removeEventListener('resize', updatePosition);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Find and process all email fields
  function processEmailFields() {
    console.log('Mephisto: Scanning for email fields...');
    const inputs = document.querySelectorAll('input[type="email"], input[type="text"], input:not([type])');
    console.log(`Mephisto: Found ${inputs.length} input fields`);

    let emailFieldsFound = 0;
    inputs.forEach(input => {
      if (isEmailField(input)) {
        emailFieldsFound++;
        console.log('Mephisto: Email field detected:', {
          type: input.type,
          name: input.name,
          id: input.id,
          placeholder: input.placeholder
        });

        if (!processedInputs.has(input)) {
          // Add a small delay to ensure input is fully rendered
          setTimeout(() => injectIcon(input), 100);
        }
      }
    });

    console.log(`Mephisto: Found ${emailFieldsFound} email fields`);
  }

  // Initial processing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processEmailFields);
  } else {
    processEmailFields();
  }

  // Watch for dynamically added email fields
  const observer = new MutationObserver((mutations) => {
    let shouldProcess = false;

    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldProcess = true;
        break;
      }
    }

    if (shouldProcess) {
      processEmailFields();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Process on navigation (for SPAs)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(processEmailFields, 500);
    }
  }).observe(document, { subtree: true, childList: true });

})();
