// Detect login success and authenticate this tab
if (window.location.href.includes('login_success=true')) {
  chrome.runtime.sendMessage({ action: 'loginSuccess' });
}

// Function to check if Gmail is Locked
function checkGmailLock() {
  chrome.storage.local.get(['authenticatedTabs'], function(data) {
    const authenticatedTabs = data.authenticatedTabs || [];
    console.log("Authenticated Tabs:", authenticatedTabs);

    if (authenticatedTabs.includes(window.tabId)) {
      console.log("Tab is authenticated. Gmail Unlocked.");
      const overlay = document.getElementById('gmail-locker-overlay');
      if (overlay) overlay.remove();
    } else {
      if (!document.getElementById('gmail-locker-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'gmail-locker-overlay';
        overlay.style = `
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-color: rgba(0,0,0,0.9); z-index: 999999;
          display: flex; justify-content: center; align-items: center;
          flex-direction: column;
        `;
        overlay.innerHTML = `
          <p style="color: white; font-size: 20px;">Gmail is Locked. Please Login.</p>
          <button id="open-login" style="margin-top: 20px; padding: 10px 20px;">Login</button>
        `;
        document.body.appendChild(overlay);

        document.getElementById('open-login').addEventListener('click', () => {
          chrome.runtime.sendMessage({ action: 'openLoginTab' });
        });
      }
    }
  });
}

// Get Current Tab ID and Run Lock Check
chrome.runtime.sendMessage({ action: 'getTabId' }, (response) => {
  window.tabId = response.tabId;
  checkGmailLock();
});

// Listen for Logout Action
document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'logout-link') {
    chrome.runtime.sendMessage({ action: 'logoutGmail' });
  }
});
