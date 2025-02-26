document.addEventListener('DOMContentLoaded', function() {
    // ตัวแปรอ้างอิงไปยัง Element ต่างๆ ใน HTML
    const coverImageUpload = document.getElementById('cover-image-upload');
    const secretImageUpload = document.getElementById('secret-image-upload');
    const hideButton = document.getElementById('hide-button');
    const hiddenImagePreview = document.getElementById('hidden-image');
    const downloadHiddenImageLink = document.getElementById('download-hidden-image');

    const hiddenImageUpload = document.getElementById('hidden-image-upload');
    const revealButton = document.getElementById('reveal-button');
    const revealedImagePreview = document.getElementById('revealed-image');

    // ฟังก์ชันสำหรับการซ่อนรูปภาพ
    function hideImage() {
        const coverImageFile = coverImageUpload.files[0];
        const secretImageFile = secretImageUpload.files[0];

        if (coverImageFile && secretImageFile) {
            // ** ส่วนนี้จะเป็นส่วนที่เราจะเขียนโค้ด Steganography สำหรับซ่อนรูปภาพ **
            console.log('เริ่มกระบวนการซ่อนรูปภาพ...');
            console.log('Cover Image:', coverImageFile.name);
            console.log('Secret Image:', secretImageFile.name);

            // ** Placeholder: แสดงตัวอย่างรูปภาพ Cover Image (ยังไม่ได้ซ่อนจริง) **
            const coverImageURL = URL.createObjectURL(coverImageFile);
            hiddenImagePreview.src = coverImageURL;
            hiddenImagePreview.style.display = 'block'; // แสดงรูปภาพ

            // ** Placeholder: สร้างลิงก์ดาวน์โหลด (ยังไม่ใช่รูปภาพที่ซ่อนจริง) **
            downloadHiddenImageLink.href = coverImageURL; // ชั่วคราว: ดาวน์โหลด Cover Image
            downloadHiddenImageLink.style.display = 'block'; // แสดงลิงก์ดาวน์โหลด
        } else {
            alert('กรุณาเลือกรูปภาพต้นฉบับและรูปภาพที่ต้องการซ่อน');
        }
    }

    // ฟังก์ชันสำหรับการถอดรหัสรูปภาพ
    function revealImage() {
        const hiddenImageFile = hiddenImageUpload.files[0];

        if (hiddenImageFile) {
            // ** ส่วนนี้จะเป็นส่วนที่เราจะเขียนโค้ด Steganography สำหรับถอดรหัสรูปภาพ **
            console.log('เริ่มกระบวนการถอดรหัสรูปภาพ...');
            console.log('Hidden Image:', hiddenImageFile.name);

            // ** Placeholder: แสดงตัวอย่างรูปภาพ Hidden Image (ยังไม่ได้ถอดรหัสจริง) **
            const hiddenImageURL = URL.createObjectURL(hiddenImageFile);
            revealedImagePreview.src = hiddenImageURL;
            revealedImagePreview.style.display = 'block'; // แสดงรูปภาพ
        } else {
            alert('กรุณาเลือกรูปภาพที่ต้องการถอดรหัส');
        }
    }

    // Event Listener สำหรับปุ่ม "ซ่อนรูปภาพ"
    hideButton.addEventListener('click', hideImage);

    // Event Listener สำหรับปุ่ม "ถอดรหัสรูปภาพ"
    revealButton.addEventListener('click', revealImage);
});
