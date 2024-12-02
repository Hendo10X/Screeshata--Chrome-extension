function getFullPageHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
    );
}

function enableRegionSelection() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    overlay.style.cursor = 'crosshair';
    overlay.style.zIndex = '10000';

    let startX, startY;
    let selection = document.createElement('div');
    selection.style.position = 'fixed';
    selection.style.border = '1px solid #fff';
    selection.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
    selection.style.pointerEvents = 'none';

    overlay.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        startY = e.clientY;
        selection.style.left = startX + 'px';
        selection.style.top = startY + 'px';
        document.body.appendChild(selection);
    });

    overlay.addEventListener('mousemove', (e) => {
        if (startX && startY) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            selection.style.width = Math.abs(width) + 'px';
            selection.style.height = Math.abs(height) + 'px';
            selection.style.left = (width < 0 ? e.clientX : startX) + 'px';
            selection.style.top = (height < 0 ? e.clientY : startY) + 'px';
        }
    });

    overlay.addEventListener('mouseup', () => {
        document.body.removeChild(overlay);
        document.body.removeChild(selection);
    });

    document.body.appendChild(overlay);
}