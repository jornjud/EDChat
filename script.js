document.addEventListener('DOMContentLoaded', function() {
    // ตัวแปรอ้างอิงไปยัง Element ต่างๆ ใน HTML
    const coverImageUpload = document.getElementById('cover-image-upload');
    const secretImageUpload = document.getElementById('secret-image-upload');
    const hideButton = document.getElementById('hide-button');
    const hiddenImageCanvas = document.getElementById('hidden-image-canvas');
    const downloadHiddenImageLink = document.getElementById('download-hidden-image');

    const hiddenImageUpload = document.getElementById('hidden-image-upload');
    const revealButton = document.getElementById('reveal-button');
    const revealedImageCanvas = document.getElementById('revealed-image-canvas');

    // ฟังก์ชัน Helper สำหรับโหลดรูปภาพลง Canvas
    function loadImageToCanvas(imageFile, canvas) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const image = new Image();
                image.onload = () => {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    resolve(ctx.getImageData(0, 0, image.width, image.height));
                };
                image.onerror = reject;
                image.src = event.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });
    }

    // ฟังก์ชัน Helper สำหรับดาวน์โหลดรูปภาพจาก Canvas
    function downloadCanvasImage(canvas, filename) {
        const dataURL = canvas.toDataURL('image/png');
        downloadHiddenImageLink.href = dataURL;
        downloadHiddenImageLink.download = filename;
        downloadHiddenImageLink.style.display = 'block';
    }

    // ฟังก์ชันสำหรับซ่อนรูปภาพ (Steganography LSB)
    async function hideImage() {
        const coverImageFile = coverImageUpload.files[0];
        const secretImageFile = secretImageUpload.files[0];

        if (!coverImageFile || !secretImageFile) {
            alert('กรุณาเลือกรูปภาพต้นฉบับและรูปภาพที่ต้องการซ่อน');
            return;
        }

        if (coverImageFile.size > 10 * 1024 * 1024 || secretImageFile.size > 10 * 1024 * 1024) {
            alert('ขนาดรูปภาพต้องไม่เกิน 10MB');
            return;
        }

        try {
            const coverImageData = await loadImageToCanvas(coverImageFile, hiddenImageCanvas);
            const secretImageData = await loadImageToCanvas(secretImageFile, document.createElement('canvas')); // ใช้ canvas ชั่วคราว

            if (secretImageData.width > coverImageData.width || secretImageData.height > coverImageData.height) {
                alert('รูปภาพที่ต้องการซ่อนต้องมีขนาดเล็กกว่าหรือเท่ากับรูปภาพต้นฉบับ');
                        return;
                    }

                    const coverData = coverImageData.data;
                    const secretData = secretImageData.data;

                    let secretBitIndex = 0;
                    for (let i = 0; i < coverData.length; i += 4) { // Process R, G, B channels
                        for (let j = 0; j < 3; j++) { // R, G, B components
                            if (secretBitIndex < secretData.length) {
                                const secretByte = secretData[secretBitIndex];
                                const secretBit = (secretByte >> (j % 8)) & 1; // Get bit from secret byte
                                coverData[i + j] = (coverData[i + j] & ~1) | secretBit; // Replace LSB with secret bit
                                secretBitIndex++;
                            } else {
                                break; // No more secret data to hide
                            }
                        }
                        if (secretBitIndex >= secretData.length) {
                            break; // No more secret data to hide
                        }
                    }

                    const ctx = hiddenImageCanvas.getContext('2d');
                    ctx.putImageData(coverImageData, 0, 0);
                    hiddenImageCanvas.style.display = 'block';
                    downloadCanvasImage(hiddenImageCanvas, 'hidden_image.png');

                } catch (error) {
                    console.error('เกิดข้อผิดพลาดในการซ่อนรูปภาพ:', error);
                    alert('เกิดข้อผิดพลาดในการซ่อนรูปภาพ กรุณาลองใหม่อีกครั้ง');
                }
            }

            // ฟังก์ชันสำหรับถอดรหัสรูปภาพ (Steganography LSB)
            async function revealImage() {
                const hiddenImageFile = hiddenImageUpload.files[0];

                if (!hiddenImageFile) {
                    alert('กรุณาเลือกรูปภาพที่ต้องการถอดรหัส');
                    return;
                }

                if (hiddenImageFile.size > 10 * 1024 * 1024) {
                    alert('ขนาดรูปภาพต้องไม่เกิน 10MB');
                    return;
                }

                try {
                    const hiddenImageData = await loadImageToCanvas(hiddenImageFile, revealedImageCanvas);
                    const hiddenData = hiddenImageData.data;
                    const secretData = new Uint8ClampedArray(hiddenData.length); // เตรียมพื้นที่เก็บข้อมูลภาพลับ (ขนาดเท่า Cover image)
                    let secretBitIndex = 0;

                    for (let i = 0; i < hiddenData.length; i += 4) { // Process R, G, B channels
                        for (let j = 0; j < 3; j++) { // R, G, B components
                            if (secretBitIndex < secretData.length) {
                                const lsb = hiddenData[i + j] & 1; // Extract LSB
                                secretData[secretBitIndex] = secretData[secretBitIndex] | (lsb << (j % 8)); // Set bit in secret byte
                                secretBitIndex++;
                            } else {
                                break; // No more space to extract secret data
                            }
                        }
                        if (secretBitIndex >= secretData.length) {
                            break; // No more space to extract secret data
                        }
                    }

                    // สร้าง ImageData ใหม่สำหรับภาพลับ โดยใช้ข้อมูลที่ดึงออกมา (secretData)
                    const revealedImageData = new ImageData(secretData, revealedImageCanvas.width, revealedImageCanvas.height);
                    const ctx = revealedImageCanvas.getContext('2d');
                    ctx.putImageData(revealedImageData, 0, 0);
                    revealedImageCanvas.style.display = 'block';


                } catch (error) {
                    console.error('เกิดข้อผิดพลาดในการถอดรหัสรูปภาพ:', error);
                    alert('เกิดข้อผิดพลาดในการถอดรหัสรูปภาพ กรุณาลองใหม่อีกครั้ง');
                }
            }


            // Event Listener สำหรับปุ่ม "ซ่อนรูปภาพ"
            hideButton.addEventListener('click', hideImage);

            // Event Listener สำหรับปุ่ม "ถอดรหัสรูปภาพ"
            revealButton.addEventListener('click', revealImage);
        });