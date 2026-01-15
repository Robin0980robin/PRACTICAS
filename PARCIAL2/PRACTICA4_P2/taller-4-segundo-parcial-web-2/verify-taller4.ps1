# =========================================
# Script de Verificación - Taller 4 (n8n)
# =========================================

Write-Host "🔍 Verificación de Integración n8n - Taller 4" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# 1. Verificar Docker
Write-Host "1️⃣ Verificando Docker..." -ForegroundColor Yellow
if (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "   ✅ Docker instalado" -ForegroundColor Green
    
    docker ps *>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Docker corriendo" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Docker no está corriendo" -ForegroundColor Red
        $allGood = $false
    }
} else {
    Write-Host "   ❌ Docker no instalado" -ForegroundColor Red
    $allGood = $false
}
Write-Host ""

# 2. Verificar estructura de archivos
Write-Host "2️⃣ Verificando estructura de archivos..." -ForegroundColor Yellow

$requiredFiles = @(
    "n8n\docker-compose.yml",
    "n8n\README.md",
    "n8n\workflows\01-notificacion-biblioteca-telegram.json",
    "n8n\workflows\02-sincronizacion-google-sheets.json",
    "n8n\workflows\03-alertas-criticas-biblioteca.json",
    "n8n\workflows\GUIA_WORKFLOWS.md",
    "apps\backend\env.example",
    "GUIA_COMPLETA_TALLER_4.md",
    "RESUMEN_TALLER_4.md"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file (NO ENCONTRADO)" -ForegroundColor Red
        $allGood = $false
    }
}
Write-Host ""

# 3. Verificar contenedor n8n
Write-Host "3️⃣ Verificando contenedor n8n..." -ForegroundColor Yellow
$n8nContainer = docker ps --filter "name=n8n-taller4" --format "{{.Names}}" 2>$null

if ($n8nContainer -eq "n8n-taller4") {
    Write-Host "   ✅ Contenedor n8n-taller4 corriendo" -ForegroundColor Green
    
    # Verificar acceso web
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5678" -UseBasicParsing -ErrorAction SilentlyContinue -TimeoutSec 5
        Write-Host "   ✅ n8n accesible en http://localhost:5678" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  n8n corriendo pero no responde en http://localhost:5678" -ForegroundColor Yellow
        Write-Host "      Intenta esperar unos segundos más..." -ForegroundColor Gray
    }
} else {
    Write-Host "   ⚠️  Contenedor n8n-taller4 no está corriendo" -ForegroundColor Yellow
    Write-Host "      Ejecuta: .\start-n8n.ps1" -ForegroundColor Gray
}
Write-Host ""

# 4. Verificar .env del backend
Write-Host "4️⃣ Verificando configuración del backend..." -ForegroundColor Yellow

if (Test-Path "apps\backend\.env") {
    $envContent = Get-Content "apps\backend\.env" -Raw
    
    if ($envContent -match "N8N_WEBHOOK_URL") {
        Write-Host "   ✅ N8N_WEBHOOK_URL configurado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  N8N_WEBHOOK_URL no encontrado en .env" -ForegroundColor Yellow
    }
    
    if ($envContent -match "N8N_WEBHOOK_SHEETS_URL") {
        Write-Host "   ✅ N8N_WEBHOOK_SHEETS_URL configurado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  N8N_WEBHOOK_SHEETS_URL no encontrado en .env" -ForegroundColor Yellow
    }
    
    if ($envContent -match "N8N_WEBHOOK_ALERTS_URL") {
        Write-Host "   ✅ N8N_WEBHOOK_ALERTS_URL configurado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  N8N_WEBHOOK_ALERTS_URL no encontrado en .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  Archivo apps\backend\.env no existe" -ForegroundColor Yellow
    Write-Host "      Copia apps\backend\env.example a apps\backend\.env" -ForegroundColor Gray
}
Write-Host ""

# 5. Verificar WebhookEmitterService
Write-Host "5️⃣ Verificando WebhookEmitterService..." -ForegroundColor Yellow
if (Test-Path "apps\backend\src\common\webhook-emitter.service.ts") {
    Write-Host "   ✅ WebhookEmitterService existe" -ForegroundColor Green
} else {
    Write-Host "   ❌ WebhookEmitterService no encontrado" -ForegroundColor Red
    $allGood = $false
}
Write-Host ""

# Resumen
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "✅ VERIFICACIÓN EXITOSA" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 TODO LISTO. Próximos pasos:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   1. Si n8n no está corriendo:" -ForegroundColor White
    Write-Host "      .\start-n8n.ps1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   2. Abre n8n: http://localhost:5678" -ForegroundColor White
    Write-Host "      Usuario: admin | Contraseña: uleam2025" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   3. Importa los 3 workflows desde n8n/workflows/" -ForegroundColor White
    Write-Host ""
    Write-Host "   4. Configura credenciales:" -ForegroundColor White
    Write-Host "      - Telegram (Bot Token + Chat ID)" -ForegroundColor Gray
    Write-Host "      - Gemini (API Key)" -ForegroundColor Gray
    Write-Host "      - Google Sheets (OAuth)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   5. Activa los workflows (toggle verde)" -ForegroundColor White
    Write-Host ""
    Write-Host "   6. Copia URLs webhook a apps/backend/.env" -ForegroundColor White
    Write-Host ""
    Write-Host "   7. Reinicia el backend" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Guía completa: GUIA_COMPLETA_TALLER_4.md" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  ALGUNOS PROBLEMAS DETECTADOS" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Revisa los errores arriba y corrígelos." -ForegroundColor White
    Write-Host "   Luego ejecuta este script nuevamente." -ForegroundColor White
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
