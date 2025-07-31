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
    });
  }
}

// Main Logic:
chrome.storage.session.get(['authenticated'], (result) => {
  if (!result.authenticated) {
    console.log('User NOT authenticated. Locking Gmail.');
    lockGmail();
  } else {
    console.log('User Authenticated. Gmail is Unlocked.');
    const overlay = document.getElementById('gmail-locker-overlay');
    if (overlay) overlay.remove();
  }
});

// Extra: Listen to Background for Re-lock Commands (Optional)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'reLock') {
    lockGmail();
  }
});
// Force Lock when message received from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'forceLock') {
    console.log("Force Lock Triggered");
    lockGmail();
  }
});
if (window.location.href.includes('login_success=true')) {
  chrome.storage.session.set({ authenticated: true }, () => {
    console.log("Authenticated session set to TRUE.");
    // Remove login_success param from URL to prevent loops
    window.location.href = 'https://mail.google.com/';
  });
}