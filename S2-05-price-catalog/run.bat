@echo off
chcp 65001 >nul
echo ======================================================================
echo  HỆ THỐNG QUẢN LÝ BẢNG GIÁ CHUẨN & DANH MỤC SP/DV (SCRUM-17 / SCRUM-63)
echo  Ngôn ngữ & Nền tảng: REACT 19 + VITE + MODERN CSS + LUCIDE ICONS
echo ======================================================================
echo Đang thiết lập biến môi trường và khởi động ứng dụng...
set PATH=C:\Program Files\nodejs;%PATH%
echo Đang mở tại: http://localhost:5174
echo Nhấn Ctrl+C để dừng máy chủ.
echo ======================================================================
npm run dev -- --open
pause
