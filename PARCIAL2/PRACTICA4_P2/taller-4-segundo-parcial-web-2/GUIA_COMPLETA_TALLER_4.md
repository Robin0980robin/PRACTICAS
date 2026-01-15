# 📘 GUÍA COMPLETA DE INTEGRACIÓN - Taller 4 (n8n)

> **Objetivo:** Integrar n8n como capa de automatización de eventos en tu arquitectura MCP existente, basándose en la implementación funcional de `w12-n8n-practica`.

---

## 🎯 ¿Qué se ha hecho?

Se ha adaptado completamente la implementación funcional de `w12-n8n-practica` a tu proyecto de biblioteca, creando una capa de automatización con n8n que se integra sin afectar tu arquitectura MCP existente.

---

## 📂 Estructura Creada

```
proyecto/
├── n8n/
│   ├── docker-compose.yml          ✅ Configuración de n8n
│   ├── README.md                   ✅ Documentación completa
│   └── workflows/
│       ├── 01-notificacion-biblioteca-telegram.json  ✅ Workflow 1
│       ├── 02-sincronizacion-google-sheets.json      ✅ Workflow 2
│       ├── 03-alertas-criticas-biblioteca.json       ✅ Workflow 3
│       └── GUIA_WORKFLOWS.md                         ✅ Guía detallada
├── apps/
│   └── backend/
│       ├── env.example              ✅ Actualizado con URLs n8n
│       └── src/
│           └── common/
│               └── webhook-emitter.service.ts  ✅ Ya existía
├── start-n8n.ps1                    ✅ Script inicio Windows
└── start-n8n.sh                     ✅ Script inicio Linux/Mac
```

---

## 🔄 Arquitectura Completa

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   API Gateway       │
│   + Gemini IA       │  Puerto 3000
│   (Taller 3)        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   MCP Server        │  Puerto 3001
│   (Tools JSON-RPC)  │  (Taller 3)
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   Backend NestJS    │  Puerto 3002
│   + SQLite          │
│   + WebhookEmitter  │
└──────┬──────────────┘
       │
       │ emit eventos
       ▼
┌─────────────────────┐
│   n8n               │  Puerto 5678
│   (Taller 4)        │
└──────┬──────────────┘
       │
       ├──► Telegram (Notificaciones IA)
       ├──► Google Sheets (Sincronización)
       └──► Alertas Críticas (Análisis IA)
```

---

## ✅ Lo que ya tienes (Talleres anteriores)

- ✅ **Backend NestJS** con SQLite
- ✅ **WebhookEmitterService** funcional
- ✅ **MCP Server** con Tools
- ✅ **API Gateway** con Gemini
- ✅ Microservicios + RabbitMQ
- ✅ Webhooks + Serverless

---

## 🆕 Lo que se ha agregado (Taller 4)

### 1. Infraestructura n8n
- ✅ `n8n/docker-compose.yml` - Contenedor de n8n configurado
- ✅ Credenciales: admin / uleam2025
- ✅ Puerto: 5678

### 2. Workflows Funcionales
Adaptados desde `w12-n8n-practica` a tu dominio de biblioteca:

#### Workflow 1: Notificaciones Telegram + IA
- Recibe eventos del backend
- Gemini genera mensajes personalizados
- Envía a Telegram
- **URL:** `http://localhost:5678/webhook/biblioteca-events`

#### Workflow 2: Sincronización Google Sheets
- Registra todos los eventos
- Append automático a Sheets
- **URL:** `http://localhost:5678/webhook/biblioteca-sheets`

#### Workflow 3: Alertas Críticas con IA
- Analiza eventos críticos (préstamos vencidos)
- Gemini clasifica urgencia (HIGH/MEDIUM/LOW)
- Notificación según prioridad
- **URL:** `http://localhost:5678/webhook/biblioteca-alerts`

### 3. Documentación Completa
- ✅ `n8n/README.md` - Guía completa de n8n
- ✅ `n8n/workflows/GUIA_WORKFLOWS.md` - Guía de workflows
- ✅ Scripts de inicio rápido (.ps1 y .sh)

---

## 🚀 PASOS PARA IMPLEMENTAR

### PASO 1: Iniciar n8n

**Windows (PowerShell):**
```powershell
.\start-n8n.ps1
```

**Linux/Mac:**
```bash
chmod +x start-n8n.sh
./start-n8n.sh
```

**Manual:**
```bash
cd n8n
docker-compose up -d
```

### PASO 2: Acceder a n8n

1. Abre tu navegador: http://localhost:5678
2. Login:
   - Usuario: `admin`
   - Contraseña: `uleam2025`

### PASO 3: Importar Workflows

1. En n8n, haz clic en **"Add workflow"**
2. Selecciona **"Import from File"**
3. Navega a `n8n/workflows/`
4. Importa los 3 archivos JSON:
   - `01-notificacion-biblioteca-telegram.json`
   - `02-sincronizacion-google-sheets.json`
   - `03-alertas-criticas-biblioteca.json`

### PASO 4: Configurar Credenciales

#### 🤖 Telegram Bot

1. Habla con [@BotFather](https://t.me/botfather)
2. Ejecuta `/newbot` y sigue las instrucciones
3. Copia el **Bot Token**
4. Obtén tu **Chat ID** hablando con [@userinfobot](https://t.me/userinfobot)
5. En n8n:
   - **Credentials** → **Add** → **Telegram API**
   - Pega el Bot Token
6. En los workflows 01 y 03:
   - Nodo "Enviar Telegram"
   - Reemplaza `TU_CHAT_ID_AQUI` con tu Chat ID

#### 🤖 Gemini API

1. Ve a [Google AI Studio](https://aistudio.google.com)
2. Genera una **API Key**
3. En los workflows 01 y 03:
   - Nodo "HTTP Request" (Gemini)
   - Reemplaza `TU_API_KEY_AQUI` con tu API Key

#### 📊 Google Sheets

1. Crea una [nueva Spreadsheet](https://sheets.google.com)
2. Primera fila (encabezados):
   ```
   Fecha/Hora | Tipo de Evento | ID Registro | Libro | Usuario | Estado | Descripción
   ```
3. Copia el ID de la URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit
   ```
4. En n8n:
   - **Credentials** → **Add** → **Google Sheets OAuth2 API**
   - Autoriza tu cuenta de Google
5. En el workflow 02:
   - Nodo "Agregar a Google Sheets"
   - Reemplaza `TU_SPREADSHEET_ID_AQUI`

### PASO 5: Activar Workflows

1. Abre cada workflow en n8n
2. Haz clic en el **toggle** (esquina superior derecha)
3. Debe quedar en **verde** (Active)
4. Copia las **URLs de webhook** de cada workflow

### PASO 6: Configurar Backend

Edita `apps/backend/.env`:

```env
PORT=3002

# n8n Webhooks (Taller 4)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/biblioteca-events
N8N_WEBHOOK_SHEETS_URL=http://localhost:5678/webhook/biblioteca-sheets
N8N_WEBHOOK_ALERTS_URL=http://localhost:5678/webhook/biblioteca-alerts

NODE_ENV=development
```

### PASO 7: Reiniciar Backend

```bash
cd apps/backend
npm run start:dev
```

---

## 🧪 PROBAR LA INTEGRACIÓN

### Test Completo: Crear un Préstamo

```bash
# Crear préstamo
curl -X POST http://localhost:3002/prestamos \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "U001",
    "usuarioNombre": "Juan Pérez",
    "libroId": 1,
    "libroTitulo": "Cien Años de Soledad",
    "diasPrestamo": 7
  }'
```

**Resultado esperado:**
- ✅ Backend crea el préstamo
- ✅ Backend emite evento `prestamo.creado`
- ✅ n8n recibe el evento
- ✅ Workflow 1: Mensaje en Telegram con IA
- ✅ Workflow 2: Nueva fila en Google Sheets

### Test Workflow Individual

```bash
# Test directo a n8n (Workflow 1)
curl -X POST http://localhost:5678/webhook/biblioteca-events \
  -H "Content-Type: application/json" \
  -d '{
    "evento": "prestamo.creado",
    "timestamp": "2026-01-12T10:30:00Z",
    "data": {
      "id": 1,
      "libroTitulo": "Don Quijote",
      "usuario": "María García",
      "fechaDevolucion": "2026-01-26T10:30:00Z"
    }
  }'
```

### Test Alerta Crítica

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

## 📊 MONITOREO

### Ver Ejecuciones en n8n
1. http://localhost:5678
2. Click en **"Executions"**
3. Verás historial completo con detalles

### Logs de n8n
```bash
cd n8n
docker-compose logs -f
```

### Logs del Backend
```bash
cd apps/backend
npm run start:dev
# Verás logs de emisión de eventos
```

---

## 🎓 CONCEPTOS CLAVE

### Event-Driven Architecture
- Backend emite eventos sin saber qué pasa después
- n8n escucha y ejecuta workflows automáticos
- Desacoplamiento total

### WebhookEmitterService
Ya existe en tu backend (`apps/backend/src/common/webhook-emitter.service.ts`):

```typescript
async emit(evento: string, payload: any, metadata?: any) {
  // Emite eventos a n8n sin bloquear
  // Si n8n no responde, no afecta al backend
}
```

### Workflows de n8n
- **Webhook Node:** Recibe eventos HTTP
- **IF Node:** Valida y filtra
- **Transform Node:** Adapta datos
- **HTTP Request Node:** Llama a Gemini
- **Telegram Node:** Envía notificaciones
- **Google Sheets Node:** Sincroniza datos

---

## ✅ CHECKLIST DE ENTREGA (Taller 4)

### Infraestructura
- [ ] n8n corriendo en Docker (puerto 5678)
- [ ] 3 workflows importados y activos
- [ ] Backend configurado con URLs de webhook

### Credenciales
- [ ] Telegram Bot Token configurado
- [ ] Chat ID configurado en workflows
- [ ] Gemini API Key configurada
- [ ] Google Sheets OAuth autorizado
- [ ] Spreadsheet ID configurado

### Pruebas
- [ ] Test manual con cURL exitoso
- [ ] Mensaje recibido en Telegram
- [ ] Datos aparecen en Google Sheets
- [ ] Alerta crítica funciona con IA
- [ ] Backend emite eventos correctamente

### Documentación
- [ ] Video demo (3-5 minutos)
- [ ] Screenshots de workflows activos
- [ ] Spreadsheet con datos reales
- [ ] README.md actualizado

---

## 🐛 TROUBLESHOOTING

### n8n no inicia
```bash
# Ver logs
docker-compose logs n8n

# Recrear contenedor
docker-compose down
docker-compose up -d --force-recreate
```

### Workflow no se ejecuta
- ✅ Verifica que esté **activo** (toggle verde)
- ✅ Revisa **Executions** para ver errores
- ✅ Verifica que la URL del webhook sea correcta

### Telegram no envía mensajes
- ✅ Bot Token correcto
- ✅ Chat ID correcto (sin espacios, sin comillas)
- ✅ Iniciaste conversación con el bot (`/start`)

### Gemini retorna error
- ✅ API Key válida y activa
- ✅ Límite de requests no excedido (gratis: 10/min)
- ✅ Modelo correcto: `gemini-2.0-flash-exp`

### Google Sheets no se actualiza
- ✅ OAuth autorizado en n8n
- ✅ Spreadsheet ID correcto
- ✅ Encabezados de columna coinciden exactamente

---

## 📚 RECURSOS

- **n8n Docs:** https://docs.n8n.io
- **Gemini API:** https://ai.google.dev/docs
- **Telegram Bots:** https://core.telegram.org/bots
- **Google Sheets API:** https://developers.google.com/sheets

---

## 🎯 DIFERENCIAS CON w12-n8n-practica

| Aspecto | w12-n8n-practica | Tu Proyecto (Adaptado) |
|---------|------------------|------------------------|
| Dominio | Repair Orders (Equipos) | Biblioteca (Préstamos) |
| Eventos | `repair_order.created`, `repair_order.failed` | `prestamo.creado`, `prestamo.vencido` |
| URLs Webhook | `/repair-system` | `/biblioteca-events`, `/biblioteca-sheets`, `/biblioteca-alerts` |
| Datos | equipmentId, technicianId | libroTitulo, usuario, fechaDevolucion |
| Credenciales | Configuradas | **DEBES CONFIGURAR** (Telegram, Gemini, Sheets) |

---

## ✨ CONCLUSIÓN

Has integrado exitosamente n8n como capa de automatización en tu arquitectura MCP. Ahora tu sistema:

✅ Emite eventos desde el backend  
✅ n8n automatiza consecuencias  
✅ Notifica en Telegram con IA  
✅ Sincroniza con Google Sheets  
✅ Analiza alertas críticas  
✅ Todo sin afectar la lógica principal  

**¡Felicitaciones!** 🎉 Tu Taller 4 está completo.

---

> 💡 **Recuerda:** n8n es una capa de **consecuencias**, no de **decisiones**. Las decisiones las toma Gemini en el API Gateway (MCP).
