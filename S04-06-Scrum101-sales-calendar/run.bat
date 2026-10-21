@echo off
chcp 65001 >nul
echo ======================================================================
echo  HỆ THỐNG LỊCH LÀM VIỆC & XẾP LỊCH NHÓM KINH DOANH (SCRUM-101)
echo  User Story: Là Nhân viên kinh doanh, tôi muốn xem lịch làm việc
echo  của mình và của nhóm, để bố trí lịch gặp mà không chồng chéo với đồng đội.
echo ======================================================================
echo.
echo Đang khởi chạy máy chủ phát triển React Vite...
echo Truy cập ứng dụng tại: http://localhost:5190
echo.

call npm.cmd run dev

pause
