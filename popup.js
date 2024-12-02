let screenshot = null;
let isDrawing = false;
let context = null;
let startX, startY;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    // Capture visible area
    document.getElementById('captureVisible').addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const dataUrl = await chrome.tabs.captureVisibleTab();
        showEditor(dataUrl);
    });

    // Capture full page
    document.getElementById('captureFullPage').addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Inject scrolling script
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: getFullPageHeight,
        });

        // Capture full page
        const dataUrl = await chrome.tabs.captureVisibleTab();
        showEditor(dataUrl);
    });

    // Capture selected region
    document.getElementById('captureRegion').addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: enableRegionSelection,
        });
    });

    // Drawing functionality
    document.getElementById('draw').addEventListener('click', () => {
        canvas.style.cursor = 'crosshair';
        setupDrawing();
    });

    // Text functionality
    document.getElementById('text').addEventListener('click', () => {
        const text = prompt('Enter text:');
        if (text) {
            context.fillStyle = document.getElementById('color').value;
            context.font = '16px Arial';
            context.fillText(text, 50, 50);
        }
    });

    // Save functionality
    document.getElementById('save').addEventListener('click', () => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `screenshot-${timestamp}.png`;

        const dataUrl = canvas.toDataURL('image/png');
        chrome.downloads.download({
            url: dataUrl,
            filename: filename,
            saveAs: true
        });
    });
});

function showEditor(dataUrl) {
    document.getElementById('editor').style.display = 'block';
    const canvas = document.getElementById('canvas');
    const img = new Image();

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
    };

    img.src = dataUrl;
}

function setupDrawing() {
    const canvas = document.getElementById('canvas');

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    [startX, startY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(e.offsetX, e.offsetY);
    context.strokeStyle = document.getElementById('color').value;
    context.lineWidth = 2;
    context.stroke();

    [startX, startY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}