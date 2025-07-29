chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ authenticated: false });
});

// Open Login Tab when user clicks "Login to Unlock"
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openLoginTab') {
        chrome.tabs.create({ url: 'https://website-locker.onrender.com' });
    } else if (message.action === 'loginSuccess') {
        // Set Authenticated to true
        chrome.storage.local.set({ authenticated: true }, () => {
            // Reload Gmail Tabs
            chrome.tabs.query({ url: "*://mail.google.com/*" }, (tabs) => {
                tabs.forEach((tab) => {
                    chrome.tabs.reload(tab.id);
                });
            });
        });
    }
});
