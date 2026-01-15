# n8n - Automatización de Workflows (Taller 4)

> **n8n** es la capa de automatización de tu arquitectura MCP. Escucha eventos del backend y ejecuta workflows automáticos sin afectar la lógica principal.

## 🎯 ¿Qué hace n8n en este proyecto?

n8n actúa como una **capa de consecuencias** que:
- ✅ Escucha eventos emitidos por el backend
- ✅ Envía notificaciones inteligentes con IA (Gemini)
- ✅ Sincroniza datos con Google Sheets
- ✅ Analiza y clasifica alertas críticas
- ✅ **NO bloquea** las operaciones del backend

## 🏗️ Arquitectura

```
Usuario → API Gateway (Gemini) → MCP Server → Backend (NestJS)
                                                    ↓
                                               Emit Event
                                                    ↓
                                            n8n (localhost:5678)
                                                    ↓
                                    ┌───────────────┼───────────────┐
                                    ↓               ↓               ↓
                             Telegram          Google Sheets    Alertas IA
```

---

## 🚀 Inicio Rápido

### 1. Levantar n8n con Docker

```bash
cd n8n
docker-compose up -d
```

### 2. Acceder a n8n

- **URL:** http://localhost:5678
- **Usuario:** `admin`
- **Contraseña:** `uleam2025`

### 3. Verificar que está corriendo

```bash
docker-compose ps
# Debería mostrar: n8n-taller4 (Up)

docker-compose logs -f
# Ver logs en tiempo real
```

---

## 📋 Workflows Implementados

### ✅ Workflow 1: Notificación en Tiempo Real (Telegram + IA)
**Archivo:** `workflows/01-notificacion-biblioteca-telegram.json`

**Webhook URL:** `http://localhost:5678/webhook/biblioteca-events`

**Flujo:**
```
Webhook → Validar → Transformar → Gemini IA → Telegram → Responder
```

**Eventos soportados:**
- `prestamo.creado` → Mensaje de confirmación 📚
- `libro.devuelto` → Mensaje de agradecimiento ✅
- `prestamo.vencido` → Alerta urgente ⚠️

**Configuración requerida:**
- API Key de Gemini
- Token de Bot de Telegram
- Chat ID

---

### ✅ Workflow 2: Sincronización con Google Sheets
**Archivo:** `workflows/02-sincronizacion-google-sheets.json`

**Webhook URL:** `http://localhost:5678/webhook/biblioteca-sheets`

**Flujo:**
```
Webhook → Transformar → Google Sheets (Append) → Responder
```

**Columnas:**
- Fecha/Hora
- Tipo de Evento
- ID Registro
- Libro
- Usuario
- Estado
- Descripción

**Configuración requerida:**
- Cuenta de Google autorizada
- ID de la Spreadsheet

---

### ✅ Workflow 3: Alertas Críticas (IA)
**Archivo:** `workflows/03-alertas-criticas-biblioteca.json`

**Webhook URL:** `http://localhost:5678/webhook/biblioteca-alerts`

**Flujo:**
```
Webhook → ¿Crítico? → Gemini (Análisis) → Clasificar → [Telegram | Log]
```

**Eventos críticos:**
- `prestamo.vencido` (analiza urgencia con IA)

**Clasificación:**
- **HIGH:** Telegram inmediato 🚨
- **MEDIUM:** Log de advertencia ⚠️
- **LOW:** Log informativo ℹ️

**Configuración requerida:**
- API Key de Gemini
- Token de Bot de Telegram

---

## 🔧 Configuración de Credenciales

### 1️⃣ Telegram Bot

**Obtener Bot Token:**
1. Habla con [@BotFather](https://t.me/botfather) en Telegram
2. Ejecuta `/newbot` y sigue las instrucciones
3. Copia el Bot Token
4. Guarda tu bot como contacto

**Obtener Chat ID:**
1. Habla con [@userinfobot](https://t.me/userinfobot)
2. Copia tu Chat ID (será un número como `123456789`)

**Configurar en n8n:**
1. Ve a **Credentials** → **Add Credential**
2. Busca **Telegram API**
3. Pega el Bot Token
4. Guarda

**Configurar en workflows:**
1. Abre el workflow 01 o 03
2. Busca el nodo "Enviar Telegram"
3. Reemplaza `TU_CHAT_ID_AQUI` con tu Chat ID real

---

### 2️⃣ Gemini API

**Obtener API Key:**
1. Ve a [Google AI Studio](https://aistudio.google.com)
2. Haz clic en **"Get API Key"**
3. Crea un nuevo proyecto o usa uno existente
4. Copia la API Key

**Configurar en workflows:**
1. Abre los workflows 01 y 03
2. Busca el nodo "HTTP Request" (Gemini)
3. En los parámetros de Query, reemplaza `TU_API_KEY_AQUI` con tu API Key real

---

### 3️⃣ Google Sheets

**Crear Spreadsheet:**
1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. En la primera fila, agrega estos encabezados:
   ```
   Fecha/Hora | Tipo de Evento | ID Registro | Libro | Usuario | Estado | Descripción
   ```
4. Copia el ID de la Spreadsheet (de la URL):
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
   ```

**Configurar en n8n:**
1. Ve a **Credentials** → **Add Credential**
2. Busca **Google Sheets OAuth2 API**
3. Sigue el flujo de OAuth para autorizar tu cuenta de Google
4. Guarda la credencial

**Configurar en workflow:**
1. Abre el workflow 02
2. Busca el nodo "Agregar a Google Sheets"
3. Selecciona tu credencial de Google
4. Reemplaza `TU_SPREADSHEET_ID_AQUI` con tu ID de Spreadsheet

---

## 📝 Importar Workflows

### Método Recomendado: Interfaz Web

1. **Inicia n8n:**
   ```bash
   cd n8n
   docker-compose up -d
   ```

2. **Accede a n8n:**
   - URL: http://localhost:5678
   - Usuario: `admin`
   - Contraseña: `uleam2025`

3. **Importa cada workflow:**
   - Haz clic en **"Add workflow"** → **"Import from File"**
   - Selecciona: `01-notificacion-biblioteca-telegram.json`
   - Click en **"Import"**
   - Repite con los workflows 02 y 03

4. **Configura credenciales** en cada workflow (ver sección anterior)

5. **Obtén las URLs de webhook:**
   - Abre cada workflow
   - Haz clic en el nodo **"Webhook"**
   - Copia la **Production URL**
   - Ejemplo: `http://localhost:5678/webhook/biblioteca-events`

6. **Activa los workflows:**
   - Toggle en la esquina superior derecha de cada workflow
   - Debe estar en verde (Active)

---

## ⚙️ Configurar Backend

Una vez que tengas las URLs de webhook, configúralas en tu backend:

**Archivo:** `apps/backend/.env`

```env
# n8n Webhooks (Taller 4)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/biblioteca-events
N8N_WEBHOOK_SHEETS_URL=http://localhost:5678/webhook/biblioteca-sheets
N8N_WEBHOOK_ALERTS_URL=http://localhost:5678/webhook/biblioteca-alerts
```

**Reinicia el backend:**
```bash
cd apps/backend
npm run start:dev
```

---

## 🧪 Probar los Workflows

### Test 1: Notificación (Telegram + IA)

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

**Resultado esperado:**
- ✅ Mensaje en Telegram con texto generado por IA
- ✅ Respuesta HTTP 200

---

### Test 2: Google Sheets

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

**Resultado esperado:**
- ✅ Nueva fila en Google Sheets
- ✅ Respuesta HTTP 200

---

### Test 3: Alerta Crítica

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

**Resultado esperado:**
- ✅ Gemini analiza y clasifica urgencia
- ✅ Si es HIGH: mensaje en Telegram 🚨
- ✅ Si es MEDIUM/LOW: log en consola
- ✅ Respuesta HTTP 200

---

## 📊 Monitoreo y Debugging

### Ver Ejecuciones en n8n
1. Ve a http://localhost:5678
2. Click en **"Executions"** (barra lateral)
3. Verás el historial completo
4. Click en una ejecución para ver detalles paso a paso

### Ver Logs de Docker
```bash
docker-compose logs -f n8n
```

### Ver Logs del Backend
```bash
cd apps/backend
npm run start:dev
# Verás los logs de emisión de eventos
```

---

## 🛠️ Comandos Útiles

```bash
# Iniciar n8n
cd n8n
docker-compose up -d

# Ver estado
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar n8n
docker-compose restart

# Detener n8n
docker-compose down

# Backup de workflows
docker cp n8n-taller4:/home/node/.n8n ./backup-n8n

# Restaurar workflows
docker cp ./backup-n8n n8n-taller4:/home/node/.n8n

# Actualizar n8n a última versión
docker-compose pull
docker-compose up -d
```

---

## 🐛 Troubleshooting

### ❌ Workflow no se ejecuta
- ✅ Verifica que el workflow esté **activo** (toggle verde)
- ✅ Revisa que la URL del webhook sea correcta
- ✅ Chequea los logs: `docker-compose logs n8n`

### ❌ Telegram no envía mensajes
- ✅ Verifica que el Bot Token sea correcto
- ✅ Asegúrate de que el Chat ID sea el tuyo
- ✅ Inicia conversación con tu bot (envíale `/start`)

### ❌ Gemini retorna error
- ✅ Verifica que la API Key sea válida y activa
- ✅ Revisa el límite de requests (gratis: 10 req/min)
- ✅ Asegúrate de usar `gemini-2.0-flash-exp`

### ❌ Google Sheets no se actualiza
- ✅ Verifica que la cuenta de Google esté autorizada
- ✅ El ID de Spreadsheet debe ser correcto
- ✅ Los encabezados de columna deben coincidir exactamente

---

## 📚 Recursos Adicionales

- **n8n Docs:** https://docs.n8n.io
- **Workflows Community:** https://n8n.io/workflows
- **Gemini API:** https://ai.google.dev/docs
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **Google Sheets API:** https://developers.google.com/sheets/api

---

## ✅ Checklist de Implementación

- [ ] Docker Compose corriendo (`docker-compose ps`)
- [ ] n8n accesible en http://localhost:5678
- [ ] 3 workflows importados
- [ ] Credenciales configuradas:
  - [ ] Telegram Bot Token + Chat ID
  - [ ] Gemini API Key
  - [ ] Google Sheets OAuth
- [ ] Workflows activados (toggle verde)
- [ ] Backend `.env` configurado con URLs
- [ ] Tests manuales exitosos con cURL
- [ ] Google Sheets recibe datos
- [ ] Telegram envía notificaciones

---

> 💡 **Tip:** Usa el botón "Test Workflow" en n8n para probar cada nodo individualmente antes de activar el workflow completo.
- **Telegram Bot API:** https://core.telegram.org/bots
- **Google Sheets API:** https://developers.google.com/sheets/api
- **Gemini API:** https://ai.google.dev

## 🐛 Troubleshooting

### n8n no inicia
```bash
# Ver logs completos
docker-compose logs

# Verificar puertos
netstat -ano | findstr :5678

# Recrear contenedor
docker-compose down
docker-compose up -d
```

### Webhook no recibe eventos
1. Verificar que n8n está corriendo
2. Confirmar URL del webhook en `.env`
3. Verificar que el workflow está activado
4. Revisar logs del backend

### Telegram no envía mensajes
1. Verificar Bot Token
2. Verificar Chat ID
3. Probar manualmente el bot
4. Revisar ejecuciones en n8n

### Google Sheets no se sincroniza
1. Verificar credenciales OAuth2
2. Confirmar permisos de la hoja
3. Verificar formato de datos
4. Revisar logs de n8n

## 💡 Mejoras Futuras

- [ ] Agregar retry logic en webhooks
- [ ] Implementar queue con RabbitMQ
- [ ] Agregar más canales (Discord, Slack)
- [ ] Dashboard de métricas
- [ ] Alertas por email con plantillas HTML
- [ ] Integración con calendar para recordatorios
- [ ] Backup automático de workflows
