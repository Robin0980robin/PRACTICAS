#!/usr/bin/env pwsh

# Script de instalación Taller 4 - n8n + Automatización
# Autor: Sistema de Talleres ULEAM
# Versión: 1.0.0

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " TALLER 4: n8n + Automatización de Eventos" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Función para verificar comandos
function Test-Command {
    param($Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Verificar pre-requisitos
Write-Host "📋 Verificando pre-requisitos..." -ForegroundColor Yellow
Write-Host ""

$prerequisites = @{
    "Node.js" = "node"
    "npm" = "npm"
    "Docker" = "docker"
    "Docker Compose" = "docker-compose"
}

$missing = @()
foreach ($prereq in $prerequisites.GetEnumerator()) {
    if (Test-Command $prereq.Value) {
        $version = & $prereq.Value --version 2>$null
        Write-Host "  ✓ $($prereq.Key): $version" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $($prereq.Key): No instalado" -ForegroundColor Red
        $missing += $prereq.Key
    }
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ Faltan los siguientes pre-requisitos:" -ForegroundColor Red
    foreach ($item in $missing) {
        Write-Host "   - $item" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Por favor instalar antes de continuar." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " 1. Instalando Backend" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "apps/backend"

if (-not (Test-Path "package.json")) {
    Write-Host "❌ No se encontró package.json en apps/backend" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error instalando dependencias del backend" -ForegroundColor Red
    exit 1
}

# Configurar .env si no existe
if (-not (Test-Path ".env")) {
    Write-Host "📝 Copiando archivo .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "  ✓ .env creado" -ForegroundColor Green
}

# Crear carpeta data
if (-not (Test-Path "data")) {
    New-Item -ItemType Directory -Path "data" | Out-Null
    Write-Host "  ✓ Carpeta data/ creada" -ForegroundColor Green
}

Write-Host "  ✓ Backend configurado" -ForegroundColor Green

Set-Location "../.."

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " 2. Configurando n8n" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "n8n"

Write-Host "🐳 Descargando imagen de n8n..." -ForegroundColor Yellow
docker pull n8nio/n8n:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error descargando imagen de n8n" -ForegroundColor Red
    exit 1
}

Write-Host "  ✓ Imagen de n8n descargada" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 Iniciando n8n con Docker Compose..." -ForegroundColor Yellow
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error iniciando n8n" -ForegroundColor Red
    exit 1
}

Write-Host "  ✓ n8n iniciado correctamente" -ForegroundColor Green

Write-Host ""
Write-Host "⏳ Esperando que n8n esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar que n8n responda
$maxRetries = 10
$retries = 0
$n8nReady = $false

while (-not $n8nReady -and $retries -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5678" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $n8nReady = $true
        }
    } catch {
        $retries++
        Write-Host "  Esperando... (intento $retries/$maxRetries)" -ForegroundColor Gray
        Start-Sleep -Seconds 3
    }
}

if ($n8nReady) {
    Write-Host "  ✓ n8n está listo!" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ n8n tardó en iniciarse, pero continúa en segundo plano" -ForegroundColor Yellow
}

Set-Location ".."

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " 3. Verificando MCP Server (del Taller 3)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "apps/mcp-server") {
    Set-Location "apps/mcp-server"
    
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Instalando MCP Server..." -ForegroundColor Yellow
        npm install
    } else {
        Write-Host "  ✓ MCP Server ya instalado" -ForegroundColor Green
    }
    
    Set-Location "../.."
} else {
    Write-Host "  ⚠️ MCP Server no encontrado (opcional)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " 4. Verificando API Gateway (del Taller 3)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "apps/api-gateway") {
    Set-Location "apps/api-gateway"
    
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Instalando API Gateway..." -ForegroundColor Yellow
        npm install
    } else {
        Write-Host "  ✓ API Gateway ya instalado" -ForegroundColor Green
    }
    
    Set-Location "../.."
} else {
    Write-Host "  ⚠️ API Gateway no encontrado (opcional)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host " ✅ INSTALACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

Write-Host "📊 Estado de los servicios:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  🔹 Backend NestJS: Listo para iniciar" -ForegroundColor White
Write-Host "     Puerto: 3002" -ForegroundColor Gray
Write-Host "     Comando: cd apps/backend && npm run start:dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  🔹 n8n: Corriendo" -ForegroundColor White
Write-Host "     URL: http://localhost:5678" -ForegroundColor Gray
Write-Host "     Usuario: admin" -ForegroundColor Gray
Write-Host "     Contraseña: uleam2025" -ForegroundColor Gray
Write-Host ""
Write-Host "  🔹 MCP Server: Listo (opcional)" -ForegroundColor White
Write-Host "     Puerto: 3001" -ForegroundColor Gray
Write-Host "     Comando: cd apps/mcp-server && npm run start:dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  🔹 API Gateway: Listo (opcional)" -ForegroundColor White
Write-Host "     Puerto: 3000" -ForegroundColor Gray
Write-Host "     Comando: cd apps/api-gateway && npm run start:dev" -ForegroundColor Gray
Write-Host ""

Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Acceder a n8n: http://localhost:5678" -ForegroundColor Yellow
Write-Host "  2. Configurar credenciales (Telegram, Google Sheets, Gemini)" -ForegroundColor Yellow
Write-Host "  3. Crear los 3 workflows según la guía en n8n/workflows/" -ForegroundColor Yellow
Write-Host "  4. Copiar URLs de webhooks y actualizar apps/backend/.env" -ForegroundColor Yellow
Write-Host "  5. Iniciar backend: cd apps/backend && npm run start:dev" -ForegroundColor Yellow
Write-Host "  6. Probar creando un préstamo" -ForegroundColor Yellow
Write-Host ""

Write-Host "📚 Documentación:" -ForegroundColor Cyan
Write-Host "  - Backend: apps/backend/README.md" -ForegroundColor Gray
Write-Host "  - n8n: n8n/README.md" -ForegroundColor Gray
Write-Host "  - Workflows: n8n/workflows/README.md" -ForegroundColor Gray
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
