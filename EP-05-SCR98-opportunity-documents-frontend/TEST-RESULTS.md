# Kết quả kiểm thử – EP-07 Tài liệu đính kèm

Các kiểm thử logic chạy bằng Node.js test runner (`node --test src/utils/attachments.test.mjs`).

| # | Hạng mục | Kết quả |
|---|---|---|
| 1 | Chủ sở hữu có quyền tải lên/tải xuống | Đạt |
| 2 | Thành viên được chia sẻ có quyền tải lên/tải xuống | Đạt |
| 3 | Người ngoài không có quyền tải lên/tải xuống | Đạt |
| 4 | Tệp đúng 20 MB được chấp nhận; vượt giới hạn bị từ chối | Đạt |
| 5 | Xác thực nhiều tệp độc lập | Đạt |
| 6 | Định dạng dung lượng B / KB / MB | Đạt |
| 7 | Tìm kiếm tiếng Việt không phân biệt dấu/chữ hoa | Đạt |
| 8 | Tìm kiếm theo tên tệp và người tải lên | Đạt |
| 9 | Nhận diện loại tệp PDF / Word / Excel / PowerPoint / ảnh | Đạt |
| 10 | Lọc loại tệp và sắp xếp mà không làm thay đổi mảng gốc | Đạt |

Build Vite cần dependency được cài bằng `npm install` trên máy phát triển. Nếu môi trường không truy cập npm registry, `npm run build` chưa thể được xác nhận tại đó.
