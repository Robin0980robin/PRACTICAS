# ⚡ COMANDOS RÁPIDOS - Taller 4 (n8n)

> **Cheat sheet de comandos más usados**

---

## 🚀 INICIO

```powershell
# Iniciar n8n (Windows)
.\start-n8n.ps1

# Iniciar n8n (Linux/Mac)
chmod +x start-n8n.sh
./start-n8n.sh

# Inicio manual
cd n8n
docker-compose up -d
cd ..

# Verificar instalación
.\verify-taller4.ps1
```

---

## 🐳 DOCKER

```bash
# Ver contenedores corriendo
docker ps

# Ver logs de n8n
cd n8n
docker-compose logs -f

# Reiniciar n8n
docker-compose restart

# Detener n8n
docker-compose down

# Ver estado
docker-compose ps

# Eliminar todo (¡cuidado!)
docker-compose down -v

# Recrear contenedor
docker-compose down
docker-compose up -d --force-recreate
```

---

## 🌐 ACCESO WEB

```
URL: http://localhost:5678
Usuario: admin
Contraseña: uleam2025
```

---

## 🧪 TESTS DE WORKFLOWS

### Test Workflow 1 (Notificación Telegram)
```bash
curl -X POST http://localhost:5678/webhook/biblioteca-events \
  -H "Content-Type: application/json" \
  -d '{
    "evento": "prestamo.creado",
    "timestamp": "2026-01-12T10:30:00Z",
    "data": {
      "id": 1,
      "libroTitulo": "Cien Años de Soledad",
      "usuario": "Juan Pérez",
      "fechaDevolucion": "2026-01-26T10:30:00Z"
    }
  }'
```

### Test Workflow 2 (Google Sheets)
```bash
curl -X POST http://localhost:5678/webhook/biblioteca-sheets \
  -H "Content-Type: application/json" \
  -d '{
    "evento": "libro.devuelto",
    "timestamp": "2026-01-12T11:00:00Z",
    "data": {
      "id": 2,
      "libroTitulo": "Don Quijote",
      "usuario": "María García",
      "estado": "devuelto"
    }
  }'
```

### Test Workflow 3 (Alertas Críticas)
```bash
curl -X POST http://localhost:5678/webhook/biblioteca-alerts \
  -H "Content-Type: application/json" \
  -d '{
    "evento": "prestamo.vencido",
    "timestamp": "2026-01-12T12:00:00Z",
    "data": {
      "id": 3,
      "libroTitulo": "El Principito",
      "usuario": "Carlos López",
      "diasRetraso": 7,
      "estado": "vencido"
    }
  }'
```

---

## 🔧 BACKEND

```bash
# Crear .env desde ejemplo
cd apps/backend
copy env.example .env  # Windows
cp env.example .env    # Linux/Mac

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run start:dev

# Ver logs
# (Los verás en la terminal donde corriste start:dev)
```

---

## 📝 CONFIGURACIÓN

### Archivo: apps/backend/.env
```env
PORT=3002

# n8n Webhooks
N8N_WEBHOOK_URL=http://localhost:5678/webhook/biblioteca-events
N8N_WEBHOOK_SHEETS_URL=http://localhost:5678/webhook/biblioteca-sheets
N8N_WEBHOOK_ALERTS_URL=http://localhost:5678/webhook/biblioteca-alerts

NODE_ENV=development
```

---

## 🔍 VERIFICACIÓN

```powershell
# Verificar todo
.\verify-taller4.ps1

# Verificar solo Docker
docker ps | findstr n8n

# Verificar acceso web
curl http://localhost:5678

# Verificar contenedor
docker inspect n8n-taller4
```

---

## 📊 MONITOREO

```bash
# Ver logs en tiempo real
cd n8n
docker-compose logs -f

# Ver últimas 50 líneas
docker-compose logs --tail=50

# Ver logs de backend
cd apps/backend
# (En la terminal donde corre npm run start:dev)

# Ver ejecuciones en n8n
# http://localhost:5678 → Executions (barra lateral)
```

---

## 🐛 TROUBLESHOOTING

### n8n no inicia
```bash
cd n8n
docker-compose down
docker-compose up -d
docker-compose logs -f
```

### n8n no responde
```bash
# Reiniciar
docker-compose restart

# Recrear
docker-compose down
docker-compose up -d --force-recreate
```

### Ver errores
```bash
# Logs detallados
docker-compose logs n8n | grep -i error

# Estado del contenedor
docker inspect n8n-taller4 --format='{{.State.Status}}'

# Recursos del contenedor
docker stats n8n-taller4
```

### Limpiar y empezar de cero
```bash
cd n8n
docker-compose down -v
docker-compose up -d
```

---

## 📦 BACKUP & RESTORE

### Backup de workflows
```bash
# Backup
docker cp n8n-taller4:/home/node/.n8n ./backup-n8n

# Restore
docker cp ./backup-n8n n8n-taller4:/home/node/.n8n
docker-compose restart
```

### Backup de workflows (manual)
1. n8n → Cada workflow → Export
2. Guarda los JSON

---

## 🔄 ACTUALIZACIÓN

```bash
cd n8n

# Actualizar imagen
docker-compose pull

# Reiniciar con nueva imagen
docker-compose up -d

# Verificar versión
docker inspect n8n-taller4 | grep -i version
```

---

## 📋 IMPORTAR WORKFLOWS

### Desde interfaz web
1. http://localhost:5678
2. Add workflow → Import from File
3. Selecciona JSON de `n8n/workflows/`
4. Import

### Desde CLI (avanzado)
```bash
# Copiar al contenedor
docker cp n8n/workflows/01-notificacion-biblioteca-telegram.json n8n-taller4:/tmp/
docker cp n8n/workflows/02-sincronizacion-google-sheets.json n8n-taller4:/tmp/
docker cp n8n/workflows/03-alertas-criticas-biblioteca.json n8n-taller4:/tmp/
```

---

## 🎯 WORKFLOW ESPECÍFICO

### Activar/Desactivar workflow
```
http://localhost:5678
→ Abrir workflow
→ Toggle (esquina superior derecha)
```

### Ver URL de webhook
```
Abrir workflow → Nodo "Webhook" → Ver "Production URL"
```

### Test workflow manualmente
```
Abrir workflow → "Test workflow" (arriba)
```

---

## 🔐 CREDENCIALES

### Telegram Bot
```
1. @BotFather → /newbot → Copiar token
2. @userinfobot → Copiar Chat ID
3. n8n → Credentials → Telegram API → Pegar token
4. Workflows 01 y 03 → Reemplazar Chat ID
```

### Gemini API
```
1. https://aistudio.google.com → Get API Key
2. Workflows 01 y 03 → HTTP Request → Reemplazar API Key
```

### Google Sheets
```
1. n8n → Credentials → Google Sheets OAuth2 → Autorizar
2. Crear Spreadsheet → Copiar ID
3. Workflow 02 → Reemplazar Spreadsheet ID
```

---

## 📁 NAVEGACIÓN RÁPIDA

```bash
# Ir a n8n
cd n8n

# Ir a workflows
cd n8n/workflows

# Ir al backend
cd apps/backend

# Volver a raíz
cd c:\Users\RUDY PICO\Desktop\practica2segundo pracial
```

---

## 🚨 COMANDOS DE EMERGENCIA

### Todo dejó de funcionar
```bash
# 1. Detener todo
cd n8n
docker-compose down

# 2. Verificar Docker
docker ps

# 3. Reiniciar Docker Desktop (si es necesario)

# 4. Iniciar n8n nuevamente
docker-compose up -d

# 5. Verificar
docker-compose ps
docker-compose logs -f
```

### Reinicio completo
```bash
# Detener
cd n8n
docker-compose down -v

# Limpiar
docker system prune -f

# Iniciar
docker-compose up -d

# Reimportar workflows (interfaz web)
```

---

## 📚 AYUDA RÁPIDA

```bash
# Documentación completa
code GUIA_COMPLETA_TALLER_4.md

# Resumen
code RESUMEN_TALLER_4.md

# Índice
code INDICE_DOCUMENTACION_TALLER_4.md

# Workflows
code n8n/workflows/GUIA_WORKFLOWS.md
```

---

## ✅ CHECKLIST PRE-ENTREGA

```bash
# 1. Verificar instalación
.\verify-taller4.ps1

# 2. Verificar contenedor
docker ps | findstr n8n

# 3. Verificar acceso web
start http://localhost:5678

# 4. Verificar workflows
# → Interfaz web → Ver 3 workflows activos

# 5. Test rápido
# → Ejecutar uno de los cURL de arriba

# 6. Ver logs
cd n8n
docker-compose logs --tail=50
```

---

## 🎓 COMANDOS DE APRENDIZAJE

```bash
# Ver estructura de imagen
docker inspect n8n-taller4

# Ver variables de entorno
docker exec n8n-taller4 env

# Acceder al contenedor (shell)
docker exec -it n8n-taller4 sh

# Ver archivos de n8n
docker exec n8n-taller4 ls -la /home/node/.n8n

# Ver workflows guardados
docker exec n8n-taller4 ls -la /home/node/.n8n/workflows
```

---

> 💡 **Tip:** Guarda este archivo para tenerlo a mano durante el desarrollo.
