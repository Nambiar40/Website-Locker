chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.session.set({ authenticated: false });
});

// Listen for Messages from content.js (login success, open login tab, logout)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.action === 'loginSuccess') {
    chrome.storage.session.set({ authenticated: true }, () => {
      console.log('User authenticated.');
    });
  }

  if (message.action === 'logout') {
    chrome.storage.session.set({ authenticated: false }, () => {
      console.log('User logged out.');
    });
  }

  if (message.action === 'openLoginTab') {
    chrome.tabs.create({ url: "https://your-render-url/login/?next=gmail-lock" });
  }

});
