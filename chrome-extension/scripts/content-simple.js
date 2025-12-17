// SIMPLE VERSION - For Testing/Debugging
// This version uses emoji and simpler positioning

console.log('🔥 MEPHISTO SIMPLE VERSION LOADED 🔥');

// Badge removed per user request

// Simple email field detection and icon injection
function injectSimpleIcons() {
  console.log('🔍 Scanning for email fields...');

  // Find all email inputs
  const emailInputs = document.querySelectorAll('input[type="email"], input[placeholder*="email" i], input[name*="email" i]');

  console.log(`📧 Found ${emailInputs.length} email fields`);

  emailInputs.forEach((input, index) => {
    // Skip if already processed
    if (input.dataset.mephistoProcessed) return;
    input.dataset.mephistoProcessed = 'true';

    console.log(`✅ Processing email field ${index + 1}:`, {
      type: input.type,
      name: input.name,
      placeholder: input.placeholder
    });

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

      console.log('🖱️ Icon clicked, fetching email...');

      try {
        const response = await chrome.runtime.sendMessage({ action: 'getEmail' });

        if (response && response.email) {
          console.log('✅ Got email:', response.email);
          input.value = response.email;

          // Trigger events for React/Vue/Angular
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));

          // No visual feedback - stays the same
        } else {
          console.error('❌ No email received from extension');
        }
      } catch (error) {
        console.error('❌ Error filling email:', error);
      }
    };

    // Append to parent
    input.parentElement.appendChild(icon);
    console.log(`✅ Icon added to field ${index + 1}`);
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

console.log('✅ Mephisto simple version initialized');
