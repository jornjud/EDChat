// แทนที่ SHEET_ID ด้วย ID ของ Google Sheet ของคุณ
const SHEET_ID = '1lbqhOZ4_fczW_GAQuQXUx6hxFKSelBNsCDoxu6t71Ag';
const SHEET_NAME = 'Logs';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);
    
    // รับข้อมูลจากเว็บแอป
    const timestamp = new Date();
    const inputText = data.input || '';
    const outputText = data.output || '';
    const mode = data.mode || '';
    const keyword = data.keyword || '';
    
    // บันทึกลงใน Sheet
    sheet.appendRow([timestamp, inputText, outputText, mode, keyword]);
    
    // ส่งกลับการตอบสนองสำเร็จ
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // กรณีเกิดข้อผิดพลาด
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}