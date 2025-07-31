function lockGmail() {
  if (document.getElementById('gmail-locker-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'gmail-locker-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  overlay.style.zIndex = '99999';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.innerHTML = `
    <div style="background:white; padding:30px; border-radius:10px; text-align:center;">
      <h2 style="color:black;">Gmail is Locked</h2>
      <button id="unlock-gmail-btn" style="padding:10px 20px;">Login to Unlock</button>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('unlock-gmail-btn').addEventListener('click', () => {
    if (!sessionStorage.getItem('loginTabOpened')) {
      chrome.runtime.sendMessage({ action: 'openLoginTab' });
      sessionStorage.setItem('loginTabOpened', 'true');
    }
  });
}

chrome.storage.session.get('authenticated').then((data) => {
  if (!data.authenticated) {
    lockGmail();
  }
});

// Listen for URL change after login success
if (window.location.href.includes('login_success=true')) {
  chrome.runtime.sendMessage({ action: 'loginSuccess' });
  sessionStorage.removeItem('loginTabOpened');  // Reset tab flag
}
