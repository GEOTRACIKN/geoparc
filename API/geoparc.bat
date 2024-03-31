@echo off
tasklist /fi "imagename eq node.exe" | find ":" > nul
if errorlevel 1 (
    echo Starting geoparc.js...
    %windir%\system32\CMD.exe /K "pm2 stop geoparc.js --geoparc --silent & pm2 start geoparc.js --geoparc --silent geoparc & pm2 flush geot --silent"
) else (
    echo geoparc.js is already running.
)
