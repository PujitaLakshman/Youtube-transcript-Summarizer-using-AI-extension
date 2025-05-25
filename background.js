console.log("Background service worker running!");

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "summarize") {
    const { transcript, platform } = message;
    let url;

    switch (platform) {
      case "gemini": url = "https://gemini.google.com/app"; break;
      case "claude": url = "https://claude.ai"; break;
      default: url = "https://chat.openai.com/"; break;
    }

    chrome.tabs.create({ url }, (tab) => {
      const tabId = tab.id;

      setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId },
          files: ['inject.js']
        }, () => {
          chrome.tabs.sendMessage(tabId, {
            action: "pasteAndPrompt",
            platform,
            transcript,
            prompt: "Summarize the above transcript."
          });
        });
      }, 4000); // give time to load
    });
  }
});
