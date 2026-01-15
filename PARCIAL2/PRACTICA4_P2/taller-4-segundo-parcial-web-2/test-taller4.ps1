# ============================================
# Script de Pruebas Automatizadas - Taller 4
# ============================================

param(
    [string]$WebhookNotificacion = "http://localhost:5678/webhook-test/biblioteca-events",
    [string]$WebhookSheets = "http://localhost:5678/webhook-test/biblioteca-sheets",
    [string]$WebhookAlertas = "http://localhost:5678/webhook-test/biblioteca-alerts"
)

Write-Host "🧪 SCRIPT DE PRUEBAS AUTOMATIZADAS - TALLER 4" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Verificar si n8n está corriendo
Write-Host "🔍 Verificando n8n..." -ForegroundColor Yellow
$n8nRunning = docker ps --filter "name=n8n-taller4" --format "{{.Names}}" 2>$null

if ($n8nRunning -ne "n8n-taller4") {
    Write-Host "❌ n8n no está corriendo. Ejecuta: .\start-n8n.ps1" -ForegroundColor Red
    exit 1
}

Write-Host "✅ n8n está corriendo" -ForegroundColor Green
Write-Host ""

# Preguntar si ya configuró las URLs
Write-Host "⚠️  IMPORTANTE: ¿Ya configuraste las URLs de webhook reales?" -ForegroundColor Yellow
Write-Host "   Las URLs por defecto son de ejemplo." -ForegroundColor Gray
Write-Host ""
Write-Host "   Puedes especificar las URLs reales así:" -ForegroundColor White
Write-Host "   .\test-taller4.ps1 -WebhookNotificacion 'URL_REAL_1' -WebhookSheets 'URL_REAL_2' -WebhookAlertas 'URL_REAL_3'" -ForegroundColor Gray
Write-Host ""

$continuar = Read-Host "¿Continuar con las pruebas? (S/N)"
if ($continuar -ne "S" -and $continuar -ne "s") {
    Write-Host "Pruebas canceladas." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "📋 URLs de Webhook configuradas:" -ForegroundColor Cyan
Write-Host "   Notificación: $WebhookNotificacion" -ForegroundColor White
Write-Host "   Sheets: $WebhookSheets" -ForegroundColor White
Write-Host "   Alertas: $WebhookAlertas" -ForegroundColor White
Write-Host ""

$testsPassed = 0
$testsFailed = 0

# Función para ejecutar test
function Test-Webhook {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Payload,
        [string]$ExpectedResult
    )
    
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    Write-Host "🧪 TEST: $Name" -ForegroundColor Yellow
    Write-Host "   URL: $Url" -ForegroundColor Gray
    Write-Host ""
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body $Payload `
            -TimeoutSec 30 `
            -ErrorAction Stop
        
        Write-Host "✅ TEST EXITOSO" -ForegroundColor Green
        Write-Host "   Respuesta: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
        Write-Host "   Resultado esperado: $ExpectedResult" -ForegroundColor Gray
        Write-Host ""
        return $true
    }
    catch {
        Write-Host "❌ TEST FALLIDO" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        return $false
    }
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🚀 INICIANDO PRUEBAS..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Start-Sleep -Seconds 1

# ==========================================
# TEST 1: Notificación - Préstamo Creado
# ==========================================
$payload1 = @"
{
  "evento": "prestamo.creado",
  "timestamp": "2026-01-12T10:30:00Z",
  "data": {
    "id": 1,
    "libroTitulo": "Cien Años de Soledad",
    "usuario": "Juan Pérez",
    "fechaDevolucion": "2026-01-26T10:30:00Z"
  }
}
"@

if (Test-Webhook -Name "Préstamo Creado (Telegram + IA)" `
                  -Url $WebhookNotificacion `
                  -Payload $payload1 `
                  -ExpectedResult "Mensaje en Telegram con IA") {
    $testsPassed++
} else {
    $testsFailed++
}

Start-Sleep -Seconds 2

# ==========================================
# TEST 2: Notificación - Libro Devuelto
# ==========================================
$payload2 = @"
{
  "evento": "libro.devuelto",
  "timestamp": "2026-01-12T11:00:00Z",
  "data": {
    "id": 2,
    "libroTitulo": "Don Quijote de la Mancha",
    "usuario": "María García",
    "fechaDevolucion": "2026-01-12T11:00:00Z"
  }
}
"@

if (Test-Webhook -Name "Libro Devuelto (Telegram + IA)" `
                  -Url $WebhookNotificacion `
                  -Payload $payload2 `
                  -ExpectedResult "Mensaje de agradecimiento en Telegram") {
    $testsPassed++
} else {
    $testsFailed++
}

Start-Sleep -Seconds 2

# ==========================================
# TEST 3: Google Sheets - Préstamo
# ==========================================
$payload3 = @"
{
  "evento": "prestamo.creado",
  "timestamp": "2026-01-12T12:00:00Z",
  "data": {
    "id": 3,
    "libroTitulo": "1984",
    "usuario": "Carlos López",
    "estado": "activo",
    "descripcion": "Préstamo de 7 días"
  }
}
"@

if (Test-Webhook -Name "Sincronización Sheets (Préstamo)" `
                  -Url $WebhookSheets `
                  -Payload $payload3 `
                  -ExpectedResult "Nueva fila en Google Sheets") {
    $testsPassed++
} else {
    $testsFailed++
}

Start-Sleep -Seconds 2

# ==========================================
# TEST 4: Google Sheets - Devolución
# ==========================================
$payload4 = @"
{
  "evento": "libro.devuelto",
  "timestamp": "2026-01-12T13:00:00Z",
  "data": {
    "id": 4,
    "libroTitulo": "El Principito",
    "usuario": "Ana Rodríguez",
    "estado": "devuelto",
    "descripcion": "Devolución a tiempo"
  }
}
"@

if (Test-Webhook -Name "Sincronización Sheets (Devolución)" `
                  -Url $WebhookSheets `
                  -Payload $payload4 `
                  -ExpectedResult "Nueva fila en Google Sheets") {
    $testsPassed++
} else {
    $testsFailed++
}

Start-Sleep -Seconds 2

# ==========================================
# TEST 5: Alerta Crítica - Retraso Alto
# ==========================================
$payload5 = @"
{
  "evento": "prestamo.vencido",
  "timestamp": "2026-01-12T14:00:00Z",
  "data": {
    "id": 5,
    "libroTitulo": "El Quijote",
    "usuario": "Pedro Martínez",
    "diasRetraso": 10,
    "estado": "vencido"
  }
}
"@

if (Test-Webhook -Name "Alerta Crítica (10 días retraso)" `
                  -Url $WebhookAlertas `
                  -Payload $payload5 `
                  -ExpectedResult "Análisis IA + posible Telegram") {
    $testsPassed++
} else {
    $testsFailed++
}

Start-Sleep -Seconds 2

# ==========================================
# TEST 6: Alerta Crítica - Retraso Extremo
# ==========================================
$payload6 = @"
{
  "evento": "prestamo.vencido",
  "timestamp": "2026-01-12T15:00:00Z",
  "data": {
    "id": 6,
    "libroTitulo": "Rayuela",
    "usuario": "Lucía Fernández",
    "diasRetraso": 30,
    "estado": "vencido"
  }
}
"@

if (Test-Webhook -Name "Alerta Crítica (30 días retraso - HIGH)" `
                  -Url $WebhookAlertas `
                  -Payload $payload6 `
                  -ExpectedResult "Clasificación HIGH + Telegram") {
    $testsPassed++
} else {
    $testsFailed++
}

Start-Sleep -Seconds 2

# ==========================================
# TEST 7: Alerta Crítica - Retraso Bajo
# ==========================================
$payload7 = @"
{
  "evento": "prestamo.vencido",
  "timestamp": "2026-01-12T16:00:00Z",
  "data": {
    "id": 7,
    "libroTitulo": "Crónica de una Muerte Anunciada",
    "usuario": "Roberto Gómez",
    "diasRetraso": 1,
    "estado": "vencido"
  }
}
"@

if (Test-Webhook -Name "Alerta Crítica (1 día retraso - LOW/MEDIUM)" `
                  -Url $WebhookAlertas `
                  -Payload $payload7 `
                  -ExpectedResult "Clasificación LOW/MEDIUM + Log") {
    $testsPassed++
} else {
    $testsFailed++
}

# ==========================================
# RESUMEN
# ==========================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 RESUMEN DE PRUEBAS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total de pruebas: $($testsPassed + $testsFailed)" -ForegroundColor White
Write-Host "✅ Exitosas: $testsPassed" -ForegroundColor Green
Write-Host "❌ Fallidas: $testsFailed" -ForegroundColor Red
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "🎉 ¡TODAS LAS PRUEBAS PASARON!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "   1. Verifica Telegram - Deberías tener 2 mensajes" -ForegroundColor White
    Write-Host "   2. Verifica Google Sheets - Deberías tener 2 filas nuevas" -ForegroundColor White
    Write-Host "   3. Revisa n8n Executions: http://localhost:5678 → Executions" -ForegroundColor White
    Write-Host "   4. Revisa logs: cd n8n && docker-compose logs -f" -ForegroundColor White
    Write-Host ""
    Write-Host "🎥 Ahora puedes grabar tu video demo!" -ForegroundColor Green
} else {
    Write-Host "⚠️  ALGUNAS PRUEBAS FALLARON" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔍 Revisa:" -ForegroundColor Cyan
    Write-Host "   1. Que las URLs de webhook sean correctas" -ForegroundColor White
    Write-Host "   2. Que los workflows estén ACTIVOS (toggle verde)" -ForegroundColor White
    Write-Host "   3. Que las credenciales estén configuradas" -ForegroundColor White
    Write-Host "   4. Los logs: cd n8n && docker-compose logs -f" -ForegroundColor White
    Write-Host "   5. Executions en n8n: http://localhost:5678 → Executions" -ForegroundColor White
    Write-Host ""
    Write-Host "📖 Consulta: PRUEBAS_COMPLETAS_TALLER_4.md (sección Troubleshooting)" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Ofrecer ver logs
$verLogs = Read-Host "¿Deseas ver los logs de n8n ahora? (S/N)"
if ($verLogs -eq "S" -or $verLogs -eq "s") {
    Write-Host ""
    Write-Host "📜 Mostrando logs (Ctrl+C para salir)..." -ForegroundColor Yellow
    Set-Location "n8n"
    docker-compose logs -f
    Set-Location ..
}
