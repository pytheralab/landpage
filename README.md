# www.pythera.ai

Site tĩnh Astro, nội dung quản lý bằng Sveltia CMS.

| Thư mục | Nội dung |
|---|---|
| `src/content/home.{vi,en,ja}.json` | Trang chủ: danh sách section (thêm, bớt, đổi thứ tự trong CMS) |
| `src/content/site.{vi,en,ja}.json` | Cài đặt chung: menu, SEO, thông tin công ty, footer |
| `src/components/sections/` | Giao diện từng loại section |
| `public/media/` | Ảnh, logo đối tác (ảnh upload từ CMS vào `public/media/uploads/`) |
| `public/cms/` | Trang quản trị tại www.pythera.ai/cms/ (Sveltia CMS) |

## Chạy trên máy

```bash
npm install
npm run dev            # xem trước tại http://localhost:4321
# CMS trên máy: mở http://localhost:4321/cms/index.html bằng Chrome
```

Trong CMS chọn "Work with Local Repository" và trỏ tới thư mục này. Sửa xong, trang ở cổng 4321 tự cập nhật.

## Đưa lên web

Push lên nhánh `main` thì GitHub Actions (`.github/workflows/deploy.yml`) tự build và đưa lên GitHub Pages.

## Đăng nhập CMS (www.pythera.ai/cms/)

1. Tạo token GitHub: Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.
   Resource owner: `pytheralab`, Repository access: Only select repositories → `landpage`, Permissions: Contents → Read and write.
2. Mở www.pythera.ai/cms/ → Sign In Using Access Token → dán token.
3. Sửa nội dung → Save: nội dung được commit vào nhánh `site`, khoảng 1–2 phút sau site cập nhật.

Token chỉ lưu trong trình duyệt của người dùng; không chia sẻ token cho người khác.
