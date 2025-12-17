// Background Service Worker for Mephisto TempMail Extension
// Handles email polling and badge notifications

import { generateMailbox, getMessages, getSession } from './mailService.js';

const POLL_INTERVAL = 30000; // Poll every 30 seconds (Manifest V3 minimum for alarms)
let previousEmailCount = -1; // Start at -1 to prevent notification on first load
let pollingInterval = null;

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async () => {
  // Generate initial mailbox if none exists
  const session = await getSession();
  if (!session) {
    await generateMailbox();
  }

  // Set up periodic email checking
  try {
    if (chrome?.alarms) {
      await chrome.alarms.create('checkEmails', { periodInMinutes: 0.5 }); // 30 seconds
    } else {
      // Fallback to setInterval if alarms not available
      setupIntervalPolling();
    }
  } catch (error) {
    setupIntervalPolling();
  }
});

// Listen for alarm to check emails
try {
  if (chrome?.alarms?.onAlarm) {
    chrome.alarms.onAlarm.addListener(async (alarm) => {
      if (alarm.name === 'checkEmails') {
        await checkForNewEmails();
      }
    });
  }
} catch (error) {
  // Silent fallback
}

// Fallback polling using setInterval
function setupIntervalPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
  pollingInterval = setInterval(async () => {
    await checkForNewEmails();
  }, POLL_INTERVAL);
}

// Check for new emails and update badge
async function checkForNewEmails() {
  try {
    const allEmails = await getMessages();

    // Filter out Guerrilla Mail welcome emails
    const emails = (allEmails || []).filter(email => {
      const isWelcomeEmail =
        email.from.address === 'no-reply@guerrillamail.com' &&
        email.subject.toLowerCase().includes('welcome to guerrilla mail');
      return !isWelcomeEmail;
    });

    const currentCount = emails.length;
    const unreadCount = emails.filter(e => !e.seen).length;

    // Update badge with unread count
    if (unreadCount > 0) {
      chrome.action.setBadgeText({ text: String(unreadCount) });
      chrome.action.setBadgeBackgroundColor({ color: '#ef4444' }); // Red color
    } else {
      chrome.action.setBadgeText({ text: '' });
    }

    // Show notification if new emails arrived (but not on first check)
    if (currentCount > previousEmailCount && currentCount > 0 && previousEmailCount >= 0) {
      const latestEmail = emails[0];

      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'New Email Received',
        message: `${latestEmail.from.name}\n${latestEmail.subject}`,
        priority: 2
      });
    }

    // Update previous count (set to 0 if this is first check)
    previousEmailCount = previousEmailCount === -1 ? currentCount : currentCount;
  } catch (error) {
    // Silent error
  }
}

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getEmail') {
    getSession().then(session => {
      sendResponse({ email: session?.email_addr || null });
    });
    return true; // Keep channel open for async response
  }

  if (request.action === 'generateEmail') {
    generateMailbox().then(mailbox => {
      sendResponse({ email: mailbox?.address || null });
      // Reset count for new mailbox to avoid showing badge for welcome email
      previousEmailCount = -1;
      // Clear badge immediately
      chrome.action.setBadgeText({ text: '' });
      // Trigger immediate check
      checkForNewEmails();
    });
    return true;
  }

  if (request.action === 'checkEmails') {
    checkForNewEmails().then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Listen for extension icon clicks
chrome.action.onClicked.addListener(() => {
  checkForNewEmails();
});

// Initial check on startup
checkForNewEmails();
