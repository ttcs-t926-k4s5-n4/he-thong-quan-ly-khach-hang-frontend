@echo off
chcp 65001 >nul
echo ======================================================================
echo  HỆ THỐNG CẢNH BÁO & GỘP KHÁCH HÀNG TRÙNG (SCRUM-18 / SCRUM-72)
echo  Ngôn ngữ & Nền tảng: REACT 19 + VITE + MODERN CSS + LUCIDE ICONS
echo ======================================================================
echo Đang thiết lập biến môi trường và khởi động ứng dụng...
set PATH=C:\Program Files\nodejs;%PATH%
echo Đang mở tại: http://localhost:5177
echo Nhấn Ctrl+C để dừng máy chủ.
echo ======================================================================
npm run dev -- --open
pause
