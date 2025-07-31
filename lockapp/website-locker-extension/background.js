chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.session.set({ authenticated: false });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openLoginTab') {
    chrome.tabs.create({ url: "https://website-locker.onrender.com/login/?next=gmail-lock" });
  }

  if (message.action === 'loginSuccess') {
    chrome.storage.session.set({ authenticated: true }, () => {
      console.log('Login Success Saved in Storage');
      // Reload Gmail Tabs to Reflect Unlock
      chrome.tabs.query({ url: "*://mail.google.com/*" }, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.reload(tab.id);
        });
      });
    });
  }

  if (message.action === 'logout') {
    chrome.storage.session.set({ authenticated: false }, () => {
      console.log('User Logged out, Locking Gmail Again.');
      chrome.tabs.query({ url: "*://mail.google.com/*" }, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: 'reLock' });
        });
      });
    });
  }
});
// Re-check lock on Gmail tab activation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('mail.google.com')) {
    chrome.storage.session.get(['authenticated'], (result) => {
      if (!result.authenticated) {
        chrome.tabs.sendMessage(tabId, { action: 'forceLock' });
      } else {
        console.log("User is authenticated, Gmail unlocked.");
      }
    });
  }
});



