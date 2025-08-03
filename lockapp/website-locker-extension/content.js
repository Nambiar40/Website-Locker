// ===== Gmail Locker Content Script =====

// Session-based unlock flag to avoid re-locking after login
let sessionUnlock = false;

// Helper to create the lock overlay
function lockGmail() {
  if (!document.getElementById('gmail-locker-overlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'gmail-locker-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
    overlay.style.color = 'white';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.innerHTML = `
      <h1>Gmail is Locked</h1>
      <p>Please login to unlock Gmail.</p>
      <button id="gmail-unlock-btn" style="padding: 10px 20px; background-color: #4285f4; color: white; border: none; border-radius: 5px;">Login</button>
    `;
    document.body.appendChild(overlay);

    document.getElementById('gmail-unlock-btn').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openLoginTab' });
      console.log('Login button clicked. Requesting openLoginTab...');
    });
  }
}

// Helper to remove the lock overlay
function unlockGmail() {
  const overlay = document.getElementById('gmail-locker-overlay');
  if (overlay) overlay.remove();
}

// Detect login_success param, notify background, and set session flag
(function handleLoginSuccess() {
  const url = new URL(window.location.href);
  if (url.searchParams.get('login_success') === 'true') {
    console.log("login_success detected in URL, sending loginSuccess...");
    sessionUnlock = true; // Prevent locking in this session
    chrome.runtime.sendMessage({ action: 'openLoginTab' }, () => {
      // Remove login_success param from URL (no reload)
      url.searchParams.delete('login_success');
      window.history.replaceState({}, document.title, url.pathname + url.search);
      console.log("login_success param removed from URL.");
    });
  }
})();

// Initial Authentication Check on Page Load
chrome.storage.local.get(['authenticated'], (result) => {
  console.log("Auth check on load:", result.authenticated);
  if (!result.authenticated && !sessionUnlock) {
    lockGmail();
  } else {
    unlockGmail();
  }
});

// Listen for Lock/Unlock Messages from Background Script
chrome.runtime.onMessage.addListener((message) => {
  console.log("Received message from background:", message);
  if (message.action === 'reLock') lockGmail();
  if (message.action === 'forceUnlock') unlockGmail();
});
