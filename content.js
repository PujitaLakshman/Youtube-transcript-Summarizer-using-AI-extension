console.log("Content script running!");

function createSidebar() {
  if (document.getElementById('transcript-sidebar')) return;

  const sidebar = document.createElement('div');
  sidebar.id = 'transcript-sidebar';
  sidebar.style = `
    position: fixed; top: 100px; right: 20px; background: #f9f9f9;
    border: 1px solid #ccc; padding: 15px; z-index: 1000; width: 300px;
    font-family: Arial, sans-serif; box-shadow: 0 0 10px rgba(0,0,0,0.2);
  `;

  sidebar.innerHTML = `
    <div style="font-weight:bold; margin-bottom:10px; display:flex; justify-content:space-between;">
      <span>Transcript</span>
      <button id="copy-transcript">Copy</button>
    </div>
    <div id="transcript-content" style="height: 400px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
      Loading transcript...
    </div>
    <button id="summarize-button" style="padding:10px; width:100%;">Summarize</button>
  `;

  document.body.appendChild(sidebar);

  document.getElementById('copy-transcript').onclick = () => {
    const text = document.getElementById('transcript-content').innerText;
    navigator.clipboard.writeText(text).then(() => alert('Transcript copied!'));
  };

  document.getElementById('summarize-button').onclick = summarize;
}

function summarize() {
  const contentEl = document.getElementById("transcript-content");
  const transcript = contentEl.innerText.trim();

  if (!transcript || transcript === "Loading transcript...") {
    alert("Transcript not loaded.");
    return;
  }

  chrome.storage.sync.get("selectedPlatform", data => {
    const platform = data.selectedPlatform || "chatgpt";
    contentEl.innerText = "Summarizing using " + platform + "...";

    chrome.runtime.sendMessage({
      action: "summarize",
      platform,
      transcript
    });
  });
}

window.addEventListener("load", () => {
  createSidebar();

  const waitForTranscript = setInterval(() => {
    const lines = document.querySelectorAll('.ytd-transcript-segment-renderer .segment-text');
    if (lines.length > 0) {
      clearInterval(waitForTranscript);
      let transcript = '';
      lines.forEach(line => transcript += line.innerText + '\n');
      const content = document.getElementById("transcript-content");
      if (content) content.innerText = transcript;
    }
  }, 1000);

  setTimeout(() => {
    clearInterval(waitForTranscript);
    const content = document.getElementById("transcript-content");
    if (content && content.innerText.includes("Loading transcript")) {
      content.innerText = "Transcript not available. Open the transcript panel on the YouTube video.";
    }
  }, 30000);
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "SUMMARY_READY") {
    const el = document.getElementById("transcript-content");
    if (el) el.innerText = "Summary:\n" + request.summary;
  }
});


chrome.storage.local.get(["aiPlatform", "customPrompt"], (settings) => {
  const platform = settings.aiPlatform || "chatgpt";
  const prompt = settings.customPrompt || "Summarize this transcript:";
  
  chrome.runtime.sendMessage({
    action: "summarize",
    platform,
    transcript,
    prompt
  });
});
