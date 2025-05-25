console.log("inject.js loaded");
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "pasteAndPrompt") {
    const { platform, transcript, prompt } = request;
    const message = transcript + "\n\n" + prompt;
    console.log("Received message:", request);

    switch (platform) {
      case "chatgpt": return injectChatGPT(message);
      case "gemini": return injectGemini(message);
      case "claude": return injectClaude(message);
    }
  }
});

function waitForElement(selector, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      }
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      reject("Timeout: Element not found " + selector);
    }, timeout);
  });
}

async function injectChatGPT(msg) {
  try {
    const textarea = await waitForElement('textarea');
    const sendButton = await waitForElement('button[data-testid="send-button"]');

    textarea.value = msg;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    setTimeout(() => sendButton.click(), 500);

    monitorResponse(".markdown");
  } catch (error) {
    console.error(error);
    chrome.runtime.sendMessage({ type: "SUMMARY_READY", summary: "Error: Unable to interact with ChatGPT" });
  }
}


function injectGemini(msg) {
  const tryInject = setInterval(() => {
    const textarea = document.querySelector('textarea');
    const button = document.querySelector('button[aria-label="Send"]');
    if (textarea && button) {
      clearInterval(tryInject);
      textarea.value = msg;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      setTimeout(() => button.click(), 500);
      monitorResponse('.markdown, .response-text');
    }
  }, 1000);
}

function injectClaude(msg) {
  const tryInject = setInterval(() => {
    const textarea = document.querySelector('textarea');
    const button = document.querySelector('button:has(svg)');
    if (textarea && button) {
      clearInterval(tryInject);
      textarea.value = msg;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      setTimeout(() => button.click(), 500);
      monitorResponse('div[class*="message"]');
    }
  }, 1000);
}

function monitorResponse(selector) {
  const observer = new MutationObserver(() => {
    const responses = document.querySelectorAll(selector);
    const latest = responses[responses.length - 1];
    if (latest && latest.innerText.trim()) {
      chrome.runtime.sendMessage({ type: "SUMMARY_READY", summary: latest.innerText.trim() });
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(() => {
    observer.disconnect();
    chrome.runtime.sendMessage({ type: "SUMMARY_READY", summary: "Error: No response from AI platform." });
  }, 60000);
}
