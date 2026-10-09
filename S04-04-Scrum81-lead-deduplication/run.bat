@echo off
chcp 65001 >nul
echo ======================================================================
echo  HỆ THỐNG CẢNH BÁO VÀ GỘP LEAD TRÙNG LẶP (MARKETING CRM)
echo  User Story: Cảnh báo & gộp lead trùng, chống 2 nhân viên cùng gọi 1 người
echo ======================================================================
echo.
echo Đang khởi chạy máy chủ phát triển React Vite...
echo Truy cập ứng dụng tại: http://localhost:5180
echo.

call npm.cmd run dev

pause
