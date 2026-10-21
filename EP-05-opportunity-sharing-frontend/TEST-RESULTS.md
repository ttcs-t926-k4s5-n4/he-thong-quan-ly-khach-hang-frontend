# Kết quả kiểm thử — EP-06 Chia sẻ cơ hội

## Kiểm thử logic

Đã chạy lệnh:

```text
npm test
```

Kết quả: **10/10 bài test đạt, 0 thất bại**.

1. Phân biệt vai trò chủ sở hữu, thành viên chia sẻ và người không tham gia.
2. Chủ sở hữu thêm nhiều thành viên và ghi nhật ký thay đổi.
3. Không thêm lại owner/member hiện hữu hoặc ID không hợp lệ.
4. Thành viên chia sẻ không được tự thêm người khác.
5. Thành viên được chia sẻ có thể ghi hoạt động và hệ thống lưu nhật ký hoạt động.
6. Chặn người không tham gia ghi hoạt động; bắt buộc có tiêu đề và nội dung.
7. Chỉ chủ sở hữu được gỡ thành viên chia sẻ.
8. Chuyển chủ sở hữu cập nhật owner, giữ owner cũ trong nhóm chia sẻ và lưu nhật ký có lý do.
9. Chặn thành viên chuyển chủ sở hữu; lý do chuyển quyền là bắt buộc; không thể chọn owner hiện tại.
10. Danh sách người có thể được chia sẻ không bao gồm owner và member hiện có.

## Kiểm tra cú pháp

Đã kiểm tra cú pháp JSX cho `src/App.jsx` và `src/main.jsx` bằng TypeScript transpile parser: **đạt**.

## Chưa xác minh

Không chạy được `npm run build` trong môi trường tạo file do chưa cài dependency Vite/React của project trong môi trường này. Hãy chạy `npm install` và `npm run build` trên máy phát triển để xác nhận build cuối cùng. Kiểm thử Node xác minh logic nghiệp vụ; chưa phải kiểm thử trình duyệt tự động.
