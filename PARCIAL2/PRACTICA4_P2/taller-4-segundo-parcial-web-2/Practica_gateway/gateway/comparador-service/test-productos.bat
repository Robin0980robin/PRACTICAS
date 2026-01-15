@echo off
echo Ejecutando seed...
curl -X POST http://localhost:3003/productos/seed
echo.
echo.
echo Consultando productos...
curl http://localhost:3003/productos
echo.
pause
