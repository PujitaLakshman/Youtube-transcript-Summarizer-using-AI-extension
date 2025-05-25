document.addEventListener('DOMContentLoaded', () => {
  const saveSettingsButton = document.getElementById('saveSettings');
  const aiPlatformSelect = document.getElementById('aiPlatform');
  const customPromptTextarea = document.getElementById('customPrompt');
  const statusMessageDiv = document.getElementById('status-message');

  // Load saved settings
  chrome.storage.local.get(['aiPlatform', 'customPrompt'], (result) => {
    if (result.aiPlatform) aiPlatformSelect.value = result.aiPlatform;
    if (result.customPrompt) customPromptTextarea.value = result.customPrompt;
  });

  // Save and trigger summarization
  saveSettingsButton.addEventListener('click', () => {
    const platform = aiPlatformSelect.value;
    const prompt = customPromptTextarea.value.trim();

    chrome.storage.local.set({ aiPlatform: platform, customPrompt: prompt }, () => {
      if (chrome.runtime.lastError) {
        console.error("Storage error:", chrome.runtime.lastError.message);
        showStatusMessage("❌ Error saving preferences: " + chrome.runtime.lastError.message, 'error');
      } else {
        showStatusMessage("✅ Preferences saved!", 'success');

        // Optional: send message to background script to initiate summarization
        chrome.runtime.sendMessage({ action: "initiateSummary" });
      }
    });
  });

  function showStatusMessage(message, type) {
    statusMessageDiv.textContent = message;
    statusMessageDiv.style.display = 'block';
    statusMessageDiv.style.backgroundColor = type === 'success' ? '#e2f0cb' : '#f8d7da';
    statusMessageDiv.style.borderColor = type === 'success' ? '#a8d7a8' : '#f5c6cb';
    setTimeout(() => {
      statusMessageDiv.style.display = 'none';
    }, 3000);
  }
});
