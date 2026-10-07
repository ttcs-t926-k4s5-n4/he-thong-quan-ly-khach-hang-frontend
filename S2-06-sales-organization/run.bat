@echo off
chcp 65001 >nul
echo ======================================================================
echo  HỆ THỐNG KHAI BÁO CƠ CẤU TỔ CHỨC KINH DOANH (SCRUM-17 / SCRUM-64)
echo  Ngôn ngữ & Nền tảng: REACT 19 + VITE + MODERN CSS + LUCIDE ICONS
echo ======================================================================
echo Đang thiết lập biến môi trường và khởi động máy chủ ứng dụng...
set PATH=C:\Program Files\nodejs;%PATH%
echo Đang mở ứng dụng tại: http://localhost:5175
echo Nhấn Ctrl+C để dừng máy chủ khi hoàn tất.
echo ======================================================================
npm.cmd run dev -- --open
pause
