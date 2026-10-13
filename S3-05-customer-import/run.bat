@echo off
chcp 65001 >nul
echo ======================================================================
echo  NHẬP DANH SÁCH KHÁCH HÀNG HÀNG LOẠT TỪ EXCEL (SCRUM-193)
echo  User Story: Nhập danh sách khách hàng hàng loạt từ Excel
echo  Nền tảng: REACT 19 + VITE + MODERN CSS + LUCIDE ICONS + SHEETJS
echo ======================================================================
echo Đang thiết lập biến môi trường và khởi động ứng dụng...
set PATH=C:\Program Files\nodejs;%PATH%
echo Đang mở tại: http://localhost:5179
echo Nhấn Ctrl+C để dừng máy chủ.
echo ======================================================================
npm.cmd run dev -- --open
pause
