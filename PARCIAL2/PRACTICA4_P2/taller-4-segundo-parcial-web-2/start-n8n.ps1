# =========================================
# Script de Inicio Rapido - Taller 4 (n8n)
# =========================================

Write-Host "Iniciando Taller 4 - n8n Automatizacion..." -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "1. Verificando Docker..." -ForegroundColor Yellow
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Docker no esta instalado. Por favor, instala Docker Desktop." -ForegroundColor Red
    exit 1
}

# Verificar que Docker este corriendo
docker ps *>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker no esta corriendo. Por favor, inicia Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "OK: Docker esta corriendo" -ForegroundColor Green
Write-Host ""

# Iniciar n8n
Write-Host "2. Iniciando n8n..." -ForegroundColor Yellow
Set-Location "n8n"
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: n8n iniciado correctamente" -ForegroundColor Green
} else {
    Write-Host "ERROR: Error al iniciar n8n" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host ""
Start-Sleep -Seconds 3

# Verificar que n8n este corriendo
Write-Host "3. Verificando estado de n8n..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "4. Esperando que n8n este listo..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

while ($attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5678" -UseBasicParsing -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "OK: n8n esta listo!" -ForegroundColor Green
            break
        }
    } catch {
        # Continuar esperando
    }
    
    $attempt++
    Write-Host "Esperando n8n... ($attempt/$maxAttempts)" -ForegroundColor Gray
    Start-Sleep -Seconds 2
}

if ($attempt -eq $maxAttempts) {
    Write-Host "ADVERTENCIA: n8n tardo mucho en iniciar, pero puede estar funcionando. Verifica manualmente." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "OK: n8n ESTA CORRIENDO" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Interfaz Web: http://localhost:5678" -ForegroundColor Cyan
Write-Host "Usuario: admin" -ForegroundColor White
Write-Host "Contrasena: uleam2025" -ForegroundColor White
Write-Host ""
Write-Host "SIGUIENTE PASO:" -ForegroundColor Yellow
Write-Host "   1. Abre http://localhost:5678 en tu navegador" -ForegroundColor White
Write-Host "   2. Importa los 3 workflows desde n8n/workflows/" -ForegroundColor White
Write-Host "   3. Configura las credenciales (Telegram, Gemini, Google Sheets)" -ForegroundColor White
Write-Host "   4. Activa los workflows" -ForegroundColor White
Write-Host "   5. Copia las URLs de webhook al archivo apps/backend/.env" -ForegroundColor White
Write-Host ""
Write-Host "Documentacion completa: n8n/README.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Ver logs (opcional)
$viewLogs = Read-Host "Deseas ver los logs de n8n? (S/N)"
if ($viewLogs -eq "S" -or $viewLogs -eq "s") {
    Write-Host ""
    Write-Host "Mostrando logs (Ctrl+C para salir)..." -ForegroundColor Yellow
    docker-compose logs -f
}

Set-Location ..
