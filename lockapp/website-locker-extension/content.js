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

function unlockGmail() {
  const overlay = document.getElementById('gmail-locker-overlay');
  if (overlay) overlay.remove();
}

// Initial Check on Page Load
chrome.storage.local.get(['authenticated'], (result) => {
  if (!result.authenticated) {
    console.log('Gmail Locked.');
    lockGmail();
  } else {
    console.log('Gmail Unlocked.');
    unlockGmail();
  }
});

// Listen for Lock/Unlock Messages from Background
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'reLock') lockGmail();
  if (message.action === 'forceUnlock') unlockGmail();
});

// Detect login_success param and notify background
if (window.location.href.includes('login_success=true')) {
  chrome.runtime.sendMessage({ action: 'loginSuccess' });
}