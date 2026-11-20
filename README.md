# www.pythera.ai

Site tĩnh Astro, nội dung quản lý bằng Sveltia CMS.

| Thư mục | Nội dung |
|---|---|
| `src/content/home.{vi,en,ja}.json` | Trang chủ: danh sách section (thêm, bớt, đổi thứ tự trong CMS) |
| `src/content/site.{vi,en,ja}.json` | Cài đặt chung: menu, SEO, thông tin công ty, footer |
| `src/components/sections/` | Giao diện từng loại section |
| `public/media/` | Ảnh, logo đối tác (ảnh upload từ CMS vào `public/media/uploads/`) |
| `cms/` | Trang quản trị (triển khai riêng, không nằm trong site public) |

## Chạy trên máy

```bash
npm install
npm run dev            # xem trước tại http://localhost:4321
python3 -m http.server 5183   # rồi mở http://localhost:5183/cms/ bằng Chrome
```

Trong CMS chọn "Work with Local Repository" và trỏ tới thư mục này. Sửa xong, trang ở cổng 4321 tự cập nhật.

## Đưa lên web

Push lên nhánh `main` thì GitHub Actions (`.github/workflows/deploy.yml`) tự build và đưa lên GitHub Pages.
