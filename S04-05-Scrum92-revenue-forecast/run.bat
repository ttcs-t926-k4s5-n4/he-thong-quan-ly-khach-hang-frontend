@echo off
chcp 65001 >nul
echo ======================================================================
echo  HỆ THỐNG DỰ BÁO DOANH SỐ THEO TRỌNG SỐ XÁC SUẤT (SCRUM-92)
echo  User Story: Giám đốc kinh doanh xem dự báo doanh số trả lời câu hỏi tháng này về bao nhiêu bằng số liệu
echo ======================================================================
echo.
echo Đang khởi chạy máy chủ phát triển React Vite...
echo Truy cập ứng dụng tại: http://localhost:5187
echo.

call npm.cmd run dev

pause
