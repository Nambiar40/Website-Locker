chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ authenticatedTabs: [] });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openLoginTab') {
    chrome.tabs.create({ url: "http://127.0.0.1:8000/login/?next=mail" });
  }

  if (message.action === 'loginSuccess') {
    // Mark sender.tab.id as authenticated
    chrome.storage.local.get(['authenticatedTabs'], (data) => {
      let tabs = data.authenticatedTabs || [];
      if (!tabs.includes(sender.tab.id)) {
        tabs.push(sender.tab.id);
      }
      chrome.storage.local.set({ authenticatedTabs: tabs }, () => {
        console.log("Tab authenticated:", sender.tab.id);
      });
    });
  }

  if (message.action === 'logoutGmail') {
    chrome.storage.local.set({ authenticatedTabs: [] }, () => {
      console.log("All Gmail Tabs Locked Again.");
    });
  }
  if (message.action === 'getTabId') {
  sendResponse({ tabId: sender.tab.id });
}

});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('mail.google.com')) {
    // Inject content.js on Gmail
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
  }
});
