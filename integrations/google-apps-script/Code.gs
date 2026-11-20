/**
 * Nhận form liên hệ từ www.pythera.ai: ghi 1 dòng vào Google Sheet và gửi email báo.
 * Cài đặt: mở Google Sheet → Extensions → Apps Script → dán file này → sửa NOTIFY_EMAIL
 * → Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone) → chép URL /exec
 * → dán vào CMS: Trang chủ → section Liên hệ → "Địa chỉ nhận form".
 */
const NOTIFY_EMAIL = 'NHAP_EMAIL_NHAN_THONG_BAO@pythera.ai';
const SHEET_NAME = 'Liên hệ';
const FIELDS = ['name', 'company', 'phone', 'email', 'need', 'estimate', 'locale', 'source'];
const HEADERS = ['Thời gian', 'Họ tên', 'Công ty', 'Điện thoại', 'Email', 'Lĩnh vực quan tâm', 'Ước tính chi phí ẩn', 'Ngôn ngữ', 'Trang gửi', 'Đồng ý chính sách'];

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.website) return json({ ok: true }); // bot điền ô ẩn
    const v = {};
    FIELDS.forEach(function (k) { v[k] = String(data[k] || '').trim().slice(0, 500); });
    if (!v.name || !v.company || !v.phone || data.consent !== true) return json({ ok: false, error: 'invalid' });
    if (!/^[+()\d\s.-]{8,20}$/.test(v.phone)) return json({ ok: false, error: 'phone' });
    if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) v.email = '';

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) { sh.appendRow(HEADERS); sh.setFrozenRows(1); }
    // chặn công thức chèn vào ô (dấu = + - @ ở đầu)
    const safe = function (s) { return /^[=+\-@]/.test(s) ? "'" + s : s; };
    sh.appendRow([new Date()].concat(FIELDS.map(function (k) { return safe(v[k]); })).concat(['Có']));

    const body = [
      'Họ tên: ' + v.name, 'Công ty: ' + v.company, 'Điện thoại: ' + v.phone, 'Email: ' + (v.email || '-'),
      'Lĩnh vực quan tâm: ' + (v.need || '-'), 'Ước tính chi phí ẩn: ' + (v.estimate || '-'),
      'Ngôn ngữ trang: ' + (v.locale || '-'), 'Trang gửi: ' + (v.source || '-'), '', 'Danh sách đầy đủ: ' + ss.getUrl()
    ].join('\n');
    const opt = { name: 'Website Pythera' };
    if (v.email) opt.replyTo = v.email;
    MailApp.sendEmail(NOTIFY_EMAIL, '[pythera.ai] Liên hệ mới: ' + v.company + ' – ' + v.name, body, opt);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: 'server' });
  }
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
