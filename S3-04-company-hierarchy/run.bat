@echo off
chcp 65001 >nul
echo ======================================================================
echo  QUẢN LÝ QUAN HỆ CÔNG TY MẸ - CON & TỔNG GIÁ TRỊ TẬP ĐOÀN (SCRUM-73)
echo  User Story: SCRUM-18 / SCRUM-73
echo  Nền tảng: REACT 19 + VITE + MODERN CSS + LUCIDE ICONS
echo ======================================================================
echo Đang thiết lập biến môi trường và khởi động ứng dụng...
set PATH=C:\Program Files\nodejs;%PATH%
echo Đang mở tại: http://localhost:5178
echo Nhấn Ctrl+C để dừng máy chủ.
echo ======================================================================
npm run dev -- --open
pause
