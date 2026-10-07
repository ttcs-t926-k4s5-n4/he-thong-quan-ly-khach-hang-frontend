@echo off
chcp 65001 >nul
echo ======================================================================
echo  HỆ THỐNG NHẬT KÝ THAY ĐỔI DỮ LIỆU NHẠY CẢM (SCRUM-16 / SCRUM-62)
echo  Ngôn ngữ & Nền tảng: REACT + VITE + MODERN CSS
echo ======================================================================
echo Đang thiết lập biến môi trường và khởi động ứng dụng...
set PATH=C:\Program Files\nodejs;%PATH%
echo Đang mở tại: http://localhost:5173
echo Nhấn Ctrl+C để dừng máy chủ.
echo ======================================================================
npm run dev -- --open
pause
