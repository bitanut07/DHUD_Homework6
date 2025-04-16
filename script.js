const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Tạo bộ lọc Sobel edge detection đơn giản
function detectEdges(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const src = imageData.data;
    const out = new Uint8ClampedArray(src.length);

    // Kernel cho edge detection (Sobel)
    const kernelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const kernelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gx = 0;
            let gy = 0;
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const px = x + kx;
                    const py = y + ky;
                    const offset = (py * width + px) * 4;
                    const gray =
                        (src[offset] + src[offset + 1] + src[offset + 2]) / 3;
                    const idx = (ky + 1) * 3 + (kx + 1);
                    gx += gray * kernelX[idx];
                    gy += gray * kernelY[idx];
                }
            }
            const magnitude = Math.sqrt(gx * gx + gy * gy);
            const outOffset = (y * width + x) * 4;
            out[outOffset] =
                out[outOffset + 1] =
                out[outOffset + 2] =
                    magnitude;
            out[outOffset + 3] = 255;
        }
    }

    return new ImageData(out, width, height);
}

// Khi video đang phát -> cập nhật canvas
function draw() {
    if (!video.paused && !video.ended) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const edges = detectEdges(frame);
        ctx.putImageData(edges, 0, 0);
        requestAnimationFrame(draw);
    }
}

video.addEventListener('play', () => {
    draw();
});
