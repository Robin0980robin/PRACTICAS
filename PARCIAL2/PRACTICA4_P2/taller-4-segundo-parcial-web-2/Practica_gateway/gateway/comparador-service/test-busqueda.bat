@echo off
echo Buscando paracetamol...
curl "http://localhost:3003/productos?search=paracetamol"
echo.
echo.
echo Buscando ibuprofeno...
curl "http://localhost:3003/productos?search=ibuprofeno"
echo.
pause
