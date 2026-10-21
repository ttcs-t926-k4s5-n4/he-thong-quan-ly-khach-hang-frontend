@echo off
chcp 65001 >nul
echo ======================================================================
echo  HỆ THỐNG DÒNG THỜI GIAN TƯƠNG TÁC KHÁCH HÀNG (SCRUM-102)
echo  User Story: Là Chăm sóc khách hàng, tôi muốn xem dòng thời gian
echo  tương tác đầy đủ của một khách hàng, để tiếp nhận khách từ đồng nghiệp
echo  mà nắm được bối cảnh trong năm phút.
echo ======================================================================
echo.
echo Đang khởi chạy máy chủ phát triển React Vite...
echo Truy cập ứng dụng tại: http://localhost:5191
echo.

call npm.cmd run dev

pause
