document.getElementById('captureBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const dataUrl = await chrome.tabs.captureVisibleTab();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshot-${timestamp}.png`;

    chrome.downloads.download({
        url: dataUrl,
        filename: filename,
        saveAs: true
    });
});