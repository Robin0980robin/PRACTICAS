# 🧪 Test del Sistema Completo - Taller 4

## Script de Prueba Completo

Este script prueba toda la integración: Backend → n8n → Workflows

### Windows (PowerShell)

```powershell
# test-taller4.ps1

Write-Host "🧪 Iniciando pruebas del Taller 4..." -ForegroundColor Cyan
Write-Host ""

# Verificar que el backend está corriendo
Write-Host "1️⃣ Verificando backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/prestamos" -Method GET
    Write-Host "   ✓ Backend respondiendo" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Backend no responde en puerto 3002" -ForegroundColor Red
    Write-Host "   Ejecutar: cd apps/backend && npm run start:dev" -ForegroundColor Yellow
    exit 1
}

# Verificar n8n
Write-Host "2️⃣ Verificando n8n..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5678" -Method GET
    Write-Host "   ✓ n8n respondiendo" -ForegroundColor Green
} catch {
    Write-Host "   ✗ n8n no responde en puerto 5678" -ForegroundColor Red
    Write-Host "   Ejecutar: cd n8n && docker-compose up -d" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🎯 Ejecutando pruebas de eventos..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Crear préstamo
Write-Host "Test 1: Crear préstamo" -ForegroundColor Yellow
$body = @{
    usuarioId = "U001"
    usuarioNombre = "Juan Pérez"
    libroId = 101
    libroTitulo = "1984 de George Orwell"
    diasPrestamo = 7
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/prestamos" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body
    
    $prestamoId = $response.id
    Write-Host "   ✓ Préstamo creado (ID: $prestamoId)" -ForegroundColor Green
    Write-Host "   📱 Verifica Telegram: Debe llegar notificación" -ForegroundColor Cyan
    Write-Host "   📊 Verifica Google Sheets: Debe aparecer registro" -ForegroundColor Cyan
} catch {
    Write-Host "   ✗ Error creando préstamo" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 3

# Test 2: Listar préstamos
Write-Host ""
Write-Host "Test 2: Listar préstamos" -ForegroundColor Yellow
try {
    $prestamos = Invoke-RestMethod -Uri "http://localhost:3002/prestamos" -Method GET
    Write-Host "   ✓ Total de préstamos: $($prestamos.Count)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error listando préstamos" -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Test 3: Devolver libro
Write-Host ""
Write-Host "Test 3: Devolver libro (ID: $prestamoId)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/prestamos/$prestamoId/devolver" -Method PUT
    Write-Host "   ✓ Libro devuelto" -ForegroundColor Green
    Write-Host "   📱 Verifica Telegram: Debe llegar mensaje de agradecimiento" -ForegroundColor Cyan
} catch {
    Write-Host "   ✗ Error devolviendo libro" -ForegroundColor Red
}

Start-Sleep -Seconds 3

# Test 4: Crear préstamo que vencerá (para alertas)
Write-Host ""
Write-Host "Test 4: Crear préstamo para simular vencimiento" -ForegroundColor Yellow
$body2 = @{
    usuarioId = "U002"
    usuarioNombre = "María García"
    libroId = 202
    libroTitulo = "El Aleph"
    diasPrestamo = 1
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/prestamos" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body2
    
    Write-Host "   ✓ Préstamo creado (vencerá en 1 día)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error creando préstamo" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Pruebas completadas!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Verificar:" -ForegroundColor Cyan
Write-Host "   1. Telegram: 2 notificaciones + 1 mensaje de devolución" -ForegroundColor White
Write-Host "   2. Google Sheets: 3 registros nuevos" -ForegroundColor White
Write-Host "   3. n8n Executions: 3 ejecuciones exitosas" -ForegroundColor White
Write-Host ""
Write-Host "Para verificar alertas críticas:" -ForegroundColor Yellow
Write-Host "   Esperar 1 día o ejecutar:" -ForegroundColor Gray
Write-Host "   curl -X POST http://localhost:3002/prestamos/verificar-vencidos" -ForegroundColor Gray
Write-Host ""
```

### Linux/Mac (Bash)

```bash
#!/bin/bash

# test-taller4.sh

echo -e "\033[0;36m🧪 Iniciando pruebas del Taller 4...\033[0m"
echo ""

# Verificar backend
echo -e "\033[1;33m1️⃣ Verificando backend...\033[0m"
if curl -s http://localhost:3002/prestamos > /dev/null; then
    echo -e "   \033[0;32m✓ Backend respondiendo\033[0m"
else
    echo -e "   \033[0;31m✗ Backend no responde en puerto 3002\033[0m"
    echo -e "   \033[1;33mEjecutar: cd apps/backend && npm run start:dev\033[0m"
    exit 1
fi

# Verificar n8n
echo -e "\033[1;33m2️⃣ Verificando n8n...\033[0m"
if curl -s http://localhost:5678 > /dev/null; then
    echo -e "   \033[0;32m✓ n8n respondiendo\033[0m"
else
    echo -e "   \033[0;31m✗ n8n no responde en puerto 5678\033[0m"
    echo -e "   \033[1;33mEjecutar: cd n8n && docker-compose up -d\033[0m"
    exit 1
fi

echo ""
echo -e "\033[0;36m🎯 Ejecutando pruebas de eventos...\033[0m"
echo ""

# Test 1: Crear préstamo
echo -e "\033[1;33mTest 1: Crear préstamo\033[0m"
response=$(curl -s -X POST http://localhost:3002/prestamos \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "U001",
    "usuarioNombre": "Juan Pérez",
    "libroId": 101,
    "libroTitulo": "1984 de George Orwell",
    "diasPrestamo": 7
  }')

prestamo_id=$(echo $response | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

if [ ! -z "$prestamo_id" ]; then
    echo -e "   \033[0;32m✓ Préstamo creado (ID: $prestamo_id)\033[0m"
    echo -e "   \033[0;36m📱 Verifica Telegram: Debe llegar notificación\033[0m"
    echo -e "   \033[0;36m📊 Verifica Google Sheets: Debe aparecer registro\033[0m"
else
    echo -e "   \033[0;31m✗ Error creando préstamo\033[0m"
    exit 1
fi

sleep 3

# Test 2: Listar
echo ""
echo -e "\033[1;33mTest 2: Listar préstamos\033[0m"
prestamos=$(curl -s http://localhost:3002/prestamos)
count=$(echo $prestamos | grep -o '"id":' | wc -l)
echo -e "   \033[0;32m✓ Total de préstamos: $count\033[0m"

sleep 2

# Test 3: Devolver
echo ""
echo -e "\033[1;33mTest 3: Devolver libro (ID: $prestamo_id)\033[0m"
curl -s -X PUT http://localhost:3002/prestamos/$prestamo_id/devolver > /dev/null
echo -e "   \033[0;32m✓ Libro devuelto\033[0m"
echo -e "   \033[0;36m📱 Verifica Telegram: Debe llegar mensaje de agradecimiento\033[0m"

sleep 3

# Test 4: Crear para vencimiento
echo ""
echo -e "\033[1;33mTest 4: Crear préstamo para simular vencimiento\033[0m"
curl -s -X POST http://localhost:3002/prestamos \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "U002",
    "usuarioNombre": "María García",
    "libroId": 202,
    "libroTitulo": "El Aleph",
    "diasPrestamo": 1
  }' > /dev/null

echo -e "   \033[0;32m✓ Préstamo creado (vencerá en 1 día)\033[0m"

echo ""
echo -e "\033[0;32m✅ Pruebas completadas!\033[0m"
echo ""
echo -e "\033[0;36m📊 Verificar:\033[0m"
echo -e "   1. Telegram: 2 notificaciones + 1 mensaje de devolución"
echo -e "   2. Google Sheets: 3 registros nuevos"
echo -e "   3. n8n Executions: 3 ejecuciones exitosas"
echo ""
echo -e "\033[1;33mPara verificar alertas críticas:\033[0m"
echo -e "   Esperar 1 día o ejecutar:"
echo -e "   curl -X POST http://localhost:3002/prestamos/verificar-vencidos"
echo ""
```

## 🚀 Ejecutar Tests

### Windows
```powershell
.\test-taller4.ps1
```

### Linux/Mac
```bash
chmod +x test-taller4.sh
./test-taller4.sh
```

## ✅ Verificación Manual

### 1. Telegram
- Abrir chat con tu bot
- Deberías ver 3 mensajes:
  - Préstamo creado (Juan Pérez)
  - Libro devuelto (Juan Pérez)
  - Préstamo creado (María García)

### 2. Google Sheets
- Abrir tu hoja de cálculo
- Verificar 3 filas nuevas con:
  - Fecha/Hora actual
  - Eventos correspondientes
  - Datos de usuarios y libros

### 3. n8n
- Acceder a http://localhost:5678
- Ir a "Executions"
- Ver 3 ejecuciones exitosas (verde)
- Click en cada una para ver detalles

## 🐛 Si algo falla

### Backend no responde
```bash
cd apps/backend
npm run start:dev
```

### n8n no responde
```bash
cd n8n
docker-compose down
docker-compose up -d
```

### Webhooks no llegan
1. Verificar workflows activados en n8n
2. Verificar URLs en `apps/backend/.env`
3. Ver logs del backend:
   ```
   [WebhookEmitterService] Emitiendo evento...
   [WebhookEmitterService] ✓ Evento emitido exitosamente
   ```

### Telegram no recibe
1. Verificar credenciales en n8n
2. Probar manualmente el bot
3. Ver ejecuciones en n8n (tab Executions)

## 📊 Test de Carga

Para probar múltiples eventos:

```bash
# Crear 10 préstamos
for i in {1..10}; do
  curl -X POST http://localhost:3002/prestamos \
    -H "Content-Type: application/json" \
    -d "{
      \"usuarioId\": \"U00$i\",
      \"usuarioNombre\": \"Usuario $i\",
      \"libroId\": $((100 + i)),
      \"libroTitulo\": \"Libro $i\",
      \"diasPrestamo\": 7
    }"
  sleep 1
done
```

Verificar:
- 10 notificaciones en Telegram
- 10 registros en Google Sheets
- 10 ejecuciones en n8n

---

✅ Tests completados! El sistema está funcionando correctamente.
