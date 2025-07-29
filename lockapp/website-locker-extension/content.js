// Inject Gmail Locker Overlay
function addLockerOverlay() {
    if (document.getElementById('gmail-locker-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'gmail-locker-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.zIndex = '99999';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.color = 'white';
    overlay.innerHTML = `
        <div style="text-align: center;">
            <h2>Gmail is Locked</h2>
            <button id="unlock-btn" style="padding: 10px 20px; font-size: 16px;">Login to Unlock</button>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('unlock-btn').addEventListener('click', () => {
        // Open Login Page in New Tab
        chrome.runtime.sendMessage({ action: 'openLoginTab' });
    });
}

// Always Check Authentication
chrome.storage.local.get(['authenticated'], (result) => {
    if (!result.authenticated) {
        addLockerOverlay();
    }
});
