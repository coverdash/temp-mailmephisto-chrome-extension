// SIMPLE VERSION - For Testing/Debugging
// This version uses emoji and simpler positioning

// Simple email field detection and icon injection
function injectSimpleIcons() {
  // Find all email inputs
  const emailInputs = document.querySelectorAll('input[type="email"], input[placeholder*="email" i], input[name*="email" i]');

  emailInputs.forEach((input, index) => {
    // Skip if already processed
    if (input.dataset.mephistoProcessed) return;
    input.dataset.mephistoProcessed = 'true';

    // Create wrapper if parent isn't positioned
    if (window.getComputedStyle(input.parentElement).position === 'static') {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.display = 'inline-block';
      wrapper.style.width = input.style.width || '100%';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
    }

    // Create icon with app branding
    const icon = document.createElement('div');
    icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    `;
    icon.title = 'Fill with temporary email';
    icon.style.cssText = `
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      z-index: 999999;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ef4444;
      opacity: 0.7;
    `;

    // Click to fill
    icon.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        const response = await chrome.runtime.sendMessage({ action: 'getEmail' });

        if (response && response.email) {
          input.value = response.email;

          // Trigger events for React/Vue/Angular
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } catch (error) {
        // Silent error
      }
    };

    // Append to parent
    input.parentElement.appendChild(icon);
  });
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectSimpleIcons);
} else {
  injectSimpleIcons();
}

// Watch for dynamic content
const observer = new MutationObserver(() => {
  injectSimpleIcons();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
