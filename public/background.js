/**
 * background.js
 * Handles requests from components to open the main automobilist dashboard
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'open_dashboard') {
    // Tell content script to show the UI inside WhatsApp
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle_dashboard' });
      }
    });
  }
});

// Handle clicking the extension icon
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'toggle_dashboard' });
  }
});
