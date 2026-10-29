/**
 * content.js
 * Injects a high-reliability sidebar button that triggers the extension dashboard.
 */

const BUTTON_ID = 'wa-bulk-automator-trigger';
const IFRAME_ID = 'wa-bulk-automator-bridge';

let iframe = null;

const createIframe = () => {
  if (document.getElementById(IFRAME_ID)) return document.getElementById(IFRAME_ID);

  const container = document.createElement('div');
  container.id = IFRAME_ID;
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.zIndex = '2147483647';
  container.style.display = 'none';
  container.style.backgroundColor = 'rgba(0,0,0,0.5)';
  container.style.backdropFilter = 'blur(4px)';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  const frame = document.createElement('iframe');
  frame.src = chrome.runtime.getURL('index.html');
  frame.style.width = '90%';
  frame.style.height = '85%';
  frame.style.border = 'none';
  frame.style.borderRadius = '24px';
  frame.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
  frame.style.backgroundColor = 'white';

  container.appendChild(frame);
  document.body.appendChild(container);
  
  iframe = container;
  return container;
};

const toggleDashboard = () => {
  const el = createIframe();
  if (el.style.display === 'none') {
    el.style.display = 'flex';
  } else {
    el.style.display = 'none';
  }
};

const injectSidebarButton = () => {
  if (document.getElementById(BUTTON_ID)) return;

  const btn = document.createElement('button');
  btn.id = BUTTON_ID;
  btn.title = "WhatsApp Bulk Automator Dashboard";
  
  // Clean, professional vertical tab
  btn.innerHTML = `
    <div style="writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg); display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 13px; letter-spacing: 0.05em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      ⚡ BULK AUTOMATOR
    </div>
  `;
  
  // Styling for the floating trigger
  btn.style.position = 'fixed';
  btn.style.left = '0';
  btn.style.top = '50%';
  btn.style.transform = 'translateY(-50%)';
  btn.style.zIndex = '999999';
  btn.style.backgroundColor = '#00a884';
  btn.style.color = 'white';
  btn.style.border = 'none';
  btn.style.padding = '24px 10px';
  btn.style.borderRadius = '0 12px 12px 0';
  btn.style.cursor = 'pointer';
  btn.style.boxShadow = '4px 0 15px rgba(0, 168, 132, 0.4)';
  btn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.outline = 'none';

  btn.onmouseover = () => {
    btn.style.backgroundColor = '#008f6f';
    btn.style.paddingLeft = '15px';
    btn.style.boxShadow = '6px 0 20px rgba(0, 168, 132, 0.5)';
  };
  btn.onmouseout = () => {
    btn.style.backgroundColor = '#00a884';
    btn.style.paddingLeft = '10px';
    btn.style.boxShadow = '4px 0 15px rgba(0, 168, 132, 0.4)';
  };

  btn.onclick = () => {
    toggleDashboard();
  };

  document.body.appendChild(btn);
};

// Listen for background toggle commands
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'toggle_dashboard') {
    toggleDashboard();
  }
});

// Communication with DASHBOARD (iframe)
window.addEventListener('message', async (event) => {
  if (event.data === 'close_wa_automator') {
    if (iframe) iframe.style.display = 'none';
  }

  if (event.data?.type === 'stealth_send') {
    const { phone, message } = event.data;
    // Hide the dashboard temporarily to avoid overlay issues
    if (iframe) iframe.style.display = 'none';
    
    const success = await runStealthSend(phone, message);
    
    // Show dashboard back after completion
    if (iframe) iframe.style.display = 'flex';
    
    // Send feedback to dashboard
    const rootFrame = document.querySelector(`#${IFRAME_ID} iframe`);
    if (rootFrame) {
      rootFrame.contentWindow.postMessage({ 
        type: 'stealth_send_result', 
        success, 
        phone 
      }, '*');
    }
  }
});

// AUTO-CLICKER AND STEALTH SENDER LOGIC
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const findElement = (selectors, timeout = 5000) => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const check = () => {
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
      }
      if (Date.now() - startTime > timeout) return resolve(null);
      setTimeout(check, 500);
    };
    check();
  });
};

const runStealthSend = async (phone, message) => {
  console.log(`Automator: Running High-Precision Stealth Send to ${phone}...`);
  
  try {
    // 1. Find and Focus Search Box
    // Based on provided HTML: <input role="textbox" aria-label="Search or start new chat" data-tab="3">
    const searchBox = await findElement([
      'input[aria-label="Search or start new chat"]',
      'input[data-tab="3"]',
      'div[contenteditable="true"][data-tab="3"]',
      'div[id="side"] div[contenteditable="true"]',
      '#side .selectable-text.copyable-text'
    ]);
    
    if (!searchBox) throw new Error("Search box not found. Ensure WhatsApp is fully loaded.");
    
    console.log("Automator: Search box located. Focusing...");
    searchBox.focus();
    searchBox.click(); // Some versions need a click to activate the input
    
    // Clear and Type
    if (searchBox.tagName === 'INPUT') {
      searchBox.value = '';
      document.execCommand('insertText', false, phone);
    } else {
      document.execCommand('selectAll', false, null);
      document.execCommand('delete', false, null);
      document.execCommand('insertText', false, phone);
    }
    
    searchBox.dispatchEvent(new Event('input', { bubbles: true }));
    await sleep(500);
    searchBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
    
    onLogMsg('info', `Searching for ${phone}...`);
    await sleep(3000); // Give WhatsApp time to find and switch to the chat
    
    // 2. Find Message Box in the active chat area
    const messageBox = await findElement([
      'div[role="textbox"][aria-label="Type a message"]',
      'footer div[contenteditable="true"]',
      'div[data-tab="10"]',
      '#main .selectable-text.copyable-text'
    ]);
                      
    if (!messageBox) throw new Error("Message box not found. Did the search fail to find the contact?");
    
    console.log("Automator: Message box located. Preparing text...");
    messageBox.focus();
    document.execCommand('insertText', false, message);
    messageBox.dispatchEvent(new Event('input', { bubbles: true }));
    
    await sleep(1000);
    
    // 3. Find and Click Send Button
    const sendButton = await findElement([
      'button span[data-icon="send"]',
      'footer button span[data-icon="send"]',
      'button[aria-label="Send"]'
    ], 2000);
                       
    if (sendButton) {
      console.log("Automator: Send button clicked.");
      const actualBtn = sendButton.closest('button');
      if (actualBtn) actualBtn.click();
      else sendButton.click();
    } else {
      console.log("Automator: Send button not found, trying Enter key fallback.");
      messageBox.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        which: 13,
        keyCode: 13,
        bubbles: true
      }));
    }
    
    console.log("Automator: Action completed successfully.");
    return true;
  } catch (err) {
    console.error("Automator Error:", err.message);
    return false;
  }
};

// Helper for sending logs to the dashboard iframe
const onLogMsg = (type, message) => {
  const rootFrame = document.querySelector(`#${IFRAME_ID} iframe`);
  if (rootFrame) {
    rootFrame.contentWindow.postMessage({ 
      type: 'automation_status', 
      logType: type,
      message: message 
    }, '*');
  }
};

const runAutoClicker = async () => {
  const params = new URLSearchParams(window.location.search);
  if (!params.get('autoclick') || !window.location.href.includes('/send')) return;

  console.log("Automator: Worker tab detected. Waiting for WhatsApp to load...");

  // We need to wait for the send button to appear
  // We use a MutationObserver or a robust interval check
  const checkInterval = setInterval(() => {
    // WhatsApp's send button usually has a specific aria-label or is the only button in the footer for send URLs
    // Selector for the actual Send button (it often looks like a paper plane icon)
    const sendButton = document.querySelector('button span[data-icon="send"]') || 
                       document.querySelector('footer button span[data-icon="send"]') ||
                       document.querySelector('button[aria-label="Send"]');

    if (sendButton) {
      clearInterval(checkInterval);
      console.log("Automator: Send button found. Clicking...");
      
      // We click the parent button of the icon
      const actualButton = sendButton.closest('button') || sendButton;
      actualButton.click();

      // Give it a moment to send, then close the tab
      setTimeout(() => {
        console.log("Automator: Message dispatched. Closing tab.");
        chrome.runtime.sendMessage({ action: 'close_current_tab' });
        // Fallback for some browser settings
        window.close();
      }, 2000);
    }
  }, 1000);

  // Safety timeout: if it takes more than 30 seconds, something is wrong (e.g. invalid number)
  setTimeout(() => {
    clearInterval(checkInterval);
  }, 30000);
};

// Periodic check for UI setup
setInterval(injectSidebarButton, 2000);
injectSidebarButton();

// Run auto-clicker on every page load
runAutoClicker();
