@echo off
chcp 65001 >nul
echo ======================================================================
echo  HỆ THỐNG PHÂN BỔ LẠI CƠ HỘI KINH DOANH (SCRUM-94)
echo  User Story: Trưởng nhóm kinh doanh phân bổ lại cơ hội cho người khác
echo  để thương vụ không đứng yên khi người phụ trách nghỉ dài hoặc quá tải.
echo ======================================================================
echo.
echo Đang khởi chạy máy chủ phát triển React Vite...
echo Truy cập ứng dụng tại: http://localhost:5189
echo.

call npm.cmd run dev

pause
