// Mail Service for Mephisto TempMail Extension
// Based on the original Guerrilla Mail API implementation

const API_BASE = "https://api.guerrillamail.com/ajax.php";

const PROXIES = [
  "https://api.codetabs.com/v1/proxy?quest=",
  "https://thingproxy.freeboard.io/fetch/",
  "https://api.allorigins.win/raw?url="
];

const STORAGE_KEY = "mephisto_extension_session";
const CACHE_KEY = "mephisto_email_cache";

// Smart fetch with timeout protection
async function smartFetch(params) {
  const targetUrl = `${API_BASE}?${params}`;

  for (const proxy of PROXIES) {
    try {
      const finalUrl = `${proxy}${encodeURIComponent(targetUrl)}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(finalUrl, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) continue;

      const data = await res.json();
      return data;
    } catch (error) {
      continue;
    }
  }
  return null;
}

// Decode HTML entities (service worker compatible)
function decodeHtmlEntities(text) {
  if (!text) return "";

  // Manual HTML entity decoding for service worker context
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
    '&nbsp;': ' ',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…'
  };

  // Replace common entities
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }

  // Handle numeric entities like &#8217;
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));

  // Handle hex entities like &#x2019;
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

  return decoded;
}

// Determine email category
function determineCategory(subject, from, intro) {
  const text = `${subject} ${from} ${intro}`.toLowerCase();
  if (/(code|verify|verification|otp|confirm|activation|pin\b)/.test(text)) return 'Verification';
  if (/(security|alert|reset password|suspicious|login attempt)/.test(text)) return 'Security';
  if (/(newsletter|weekly|digest|discount|offer)/.test(text)) return 'Newsletter';
  return 'Other';
}

// Generate a new mailbox
export async function generateMailbox() {
  try {
    const data = await smartFetch("f=get_email_address");

    if (!data || !data.email_addr) {
      return null;
    }

    const session = {
      sid_token: data.sid_token,
      email_addr: data.email_addr,
      alias: data.alias,
      timestamp: Date.now()
    };

    await chrome.storage.local.set({ [STORAGE_KEY]: session });

    return {
      id: data.email_addr,
      address: data.email_addr,
      session: session
    };
  } catch (error) {
    console.error('Error generating mailbox:', error);
    return null;
  }
}

// Get current session
export async function getSession() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || null;
}

// Get messages for current session
export async function getMessages() {
  const session = await getSession();
  if (!session) return [];

  try {
    const data = await smartFetch(`f=get_email_list&offset=0&sid_token=${session.sid_token}`);

    if (!data || !data.list) {
      const cached = await chrome.storage.local.get(CACHE_KEY);
      return cached[CACHE_KEY] || [];
    }

    const emails = data.list.map((msg) => ({
      id: String(msg.mail_id),
      from: {
        address: msg.mail_from,
        name: msg.mail_from.split('<')[0].replace(/"/g, '').trim()
      },
      subject: msg.mail_subject,
      intro: decodeHtmlEntities(msg.mail_excerpt),
      seen: msg.mail_read === "1",
      createdAt: new Date(parseInt(msg.mail_timestamp) * 1000).toISOString(),
      category: determineCategory(msg.mail_subject, msg.mail_from, msg.mail_excerpt)
    }));

    await chrome.storage.local.set({ [CACHE_KEY]: emails });
    return emails;
  } catch (error) {
    console.error('Error fetching messages:', error);
    const cached = await chrome.storage.local.get(CACHE_KEY);
    return cached[CACHE_KEY] || [];
  }
}

// Get message detail
export async function getMessageDetail(messageId) {
  const session = await getSession();
  if (!session) return null;

  try {
    const msg = await smartFetch(`f=fetch_email&email_id=${messageId}&sid_token=${session.sid_token}`);

    if (!msg) return null;

    return {
      id: String(msg.mail_id),
      from: { address: msg.mail_from, name: msg.mail_from },
      subject: msg.mail_subject,
      intro: decodeHtmlEntities(msg.mail_excerpt),
      seen: true,
      createdAt: new Date(parseInt(msg.mail_timestamp) * 1000).toISOString(),
      category: determineCategory(msg.mail_subject, msg.mail_from, ''),
      text: msg.mail_body,
      html: msg.mail_body,
      hasAttachments: false,
      attachments: []
    };
  } catch (error) {
    console.error('Error fetching message detail:', error);
    return null;
  }
}

// Delete message
export async function deleteMessage(messageId) {
  const session = await getSession();
  if (!session) return false;

  try {
    await smartFetch(`f=del_email&email_ids[]=${messageId}&sid_token=${session.sid_token}`);
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    return false;
  }
}

// Create custom mailbox with specific username and domain
export async function createCustomMailbox(username, domain) {
  try {
    const initData = await smartFetch("f=get_email_address");

    if (initData && initData.sid_token) {
      await smartFetch(`f=set_email_user&email_user=${username}&lang=en&sid_token=${initData.sid_token}&site=${domain}`);

      const session = {
        sid_token: initData.sid_token,
        email_addr: `${username}@${domain}`,
        alias: username,
        timestamp: Date.now()
      };

      await chrome.storage.local.set({ [STORAGE_KEY]: session });

      return {
        id: session.email_addr,
        address: session.email_addr,
        session: session
      };
    }
    return await generateMailbox();
  } catch (error) {
    console.error('Error creating custom mailbox:', error);
    return null;
  }
}
