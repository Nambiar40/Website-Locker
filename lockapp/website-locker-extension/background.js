// ===== Gmail Locker Background Script =====

// Handle Messages from Content Script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openLoginTab') {
    console.log('Opening login page...');
    chrome.tabs.create({ url: "http://127.0.0.1:8000/login" });
  }

  if (message.action === 'loginSuccess') {
    console.log('Login success received, updating storage...');
    chrome.storage.local.set({ authenticated: true }, () => {
      console.log('User authenticated. Storage updated.');

      // Notify all tabs to force unlock Gmail
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, { action: 'forceUnlock' });
        });
      });
    });
  }
});

// Optional: Clear authentication when browser is restarted (optional for strict security)
// chrome.runtime.onStartup.addListener(() => {
//   chrome.storage.local.set({ authenticated: false });
// });
