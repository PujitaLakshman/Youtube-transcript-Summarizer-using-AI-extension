Transcript Summarizer Chrome Extension

This Chrome Extension lets you view, copy, and summarize YouTube video transcripts using AI platforms like ChatGPT, Gemini, or Claude.

---

Features

- Adds a sidebar to YouTube to show transcripts.
- Allows you to copy the transcript or summarize it instantly.
- Supports AI platforms: ChatGPT, Gemini, and Claude.
- Easy-to-use popup menu to choose your preferred AI platform.

---

File Overview

| File         | Description                                                                 |
|--------------|-----------------------------------------------------------------------------|
| `background.js` | Listens for summarize command and opens the selected AI platform tab.    |
| `content.js`    | Displays the transcript in a sidebar on YouTube and handles summarization.|
| `inject.js`     | Injects transcript + prompt into the AI platform and monitors the response.|
| `popup.html`    | HTML layout for the extension’s popup interface (for selecting platform). |
| `popup.js`      | JavaScript for handling user interaction in the popup.                   |

---

 How It Works

1. Go to a YouTube video that has a transcript.
2. The sidebar will automatically appear and load the transcript.
3. Open the extension popup (click the extension icon) and choose your AI platform.
4. Click the **Summarize** button in the sidebar.
5. The selected AI platform opens, and the transcript is pasted with a prompt.
6. The summary appears in the sidebar.

---

Supported AI Platforms

- [ChatGPT](https://chat.openai.com/)
- [Gemini](https://gemini.google.com/app)
- [Claude](https://claude.ai)

---

Installation (Development Mode)

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked**.
5. Select the project folder that contains all the files.

---

How to Use

1. Click on the extension icon to open the popup.
2. Select your preferred AI platform.
3. Open a YouTube video with a transcript.
4. Wait for the sidebar to load the transcript.
5. Click **Summarize** – your AI platform will open with the transcript and prompt.
6. The summary will show up in the sidebar.

---

Notes

- Make sure the transcript panel is open on the YouTube video.
- Log in to your selected AI platform beforehand.
- It may take a few seconds for the summary to appear.

---
Example Use Case

Watching a long educational video? Use this extension to extract and summarize the transcript in seconds!

---

License

MIT License – free to use, modify, and distribute.
