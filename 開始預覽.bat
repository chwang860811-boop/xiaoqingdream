@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 正在啟動小晴 Dream World 網站...
echo 請稍候，瀏覽器會自動開啟。
start "" "http://localhost:5500"
python -m http.server 5500
pause
