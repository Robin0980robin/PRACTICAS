# Sistema Completo de Microservicios con IA y Automatización

Proyecto completo que integra múltiples talleres de Aplicación para el Servidor Web - ULEAM 2025-2026.

## 📚 Talleres Implementados

### 🎯 Taller 1: Microservicios + RabbitMQ
Sistema de comparación de precios de medicamentos con arquitectura event-driven.
- **Ubicación:** `practica-1-gateway/` y `Practica_gateway/`
- Microservicios: Gateway, Productos, Comparador
- Event-Driven Architecture con RabbitMQ
- CQRS + Event Sourcing

### 📡 Taller 2: Webhooks + Serverless
Sistema de webhooks con notificaciones automáticas y Supabase Edge Functions.
- **Ubicación:** `Practica_gateway/gateway/`, `supabase/`
- HMAC signatures para seguridad
- Circuit Breaker + Exponential Backoff
- Telegram Bot Integration
- Supabase Functions (serverless)

### 🤖 Taller 3: MCP + IA (Gemini)
Integración de Model Context Protocol con Gemini AI para orquestación inteligente.
- **Ubicación:** `apps/api-gateway/`, `apps/mcp-server/`, `apps/frontend-chat/`
- 📚 **[Ver Documentación Completa](README_TALLER_3_MCP.md)**
- MCP Server con 4 Tools
- API Gateway con Gemini
- Frontend chat interactivo
- Consultas en lenguaje natural

### ⚡ Taller 4: n8n + Automatización (NUEVO)
Sistema de automatización de workflows con n8n para notificaciones y sincronización.
- **Ubicación:** `apps/backend/`, `n8n/`
- 📚 **[Ver Documentación Completa](README_TALLER_4.md)**
- Backend con emisión de webhooks
- n8n con Docker (puerto 5678)
- 3 Workflows: Telegram, Google Sheets, Alertas
- Event-Driven Architecture

---

## 🏗️ Arquitectura Global del Sistema

### Arquitectura Completa (4 Capas)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Capa 1: API Gateway + IA                     │
│              API Gateway (3000) + Gemini AI                     │
│          (Recepción de solicitudes + Decisión de Tools)         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Capa 2: MCP Server                           │
│                   MCP Server (3001)                             │
│              (Exposición de Tools - JSON-RPC 2.0)               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                Capa 3: Backend + Microservicios                 │
│   Backend NestJS (3002) │ Gateway (3000) │ Servicios           │
│    (CRUD + Emisión      │  Comparador    │  Productos          │
│     de Eventos)         │   (3002)       │   (3001)            │
└────────────────────────┬────────────┬────────────────────────────┘
                         │            │
                    Webhooks      RabbitMQ
                         │            │
                         ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│              Capa 4: Automatización y Notificaciones            │
│       n8n (5678)    │   Telegram   │   Google Sheets           │
│    (Workflows)      │     Bot      │   (Sincronización)         │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Inicio Rápido por Taller

### Taller 3 - MCP + IA (Recomendado para empezar)

```bash
# 1. Instalar dependencias
.\install-taller3.ps1

# 2. Configurar API Key de Gemini
# Editar apps/api-gateway/.env

# 3. Iniciar servicios
cd apps/mcp-server && npm run start:dev    # Terminal 1
cd apps/api-gateway && npm run start:dev   # Terminal 2

# 4. Abrir frontend
# Abrir apps/frontend-chat/index.html en navegador
```

📚 **[Guía completa del Taller 3](README_TALLER_3_MCP.md)**

### Taller 4 - n8n + Automatización (NUEVO)

```bash
# 1. Instalar todo automáticamente
.\install-taller4.ps1

# 2. Acceder a n8n
# http://localhost:5678 (admin/uleam2025)

# 3. Crear workflows según guías en n8n/workflows/

# 4. Iniciar backend
cd apps/backend && npm run start:dev

# 5. Probar
curl -X POST http://localhost:3002/prestamos ...
```

📚 **[Guía completa del Taller 4](README_TALLER_4.md)** | **[Quickstart](QUICKSTART_TALLER_4.md)**

---

## 🎯 Capacidades del Sistema Completo


### Taller 3 - Sistema MCP + IA

### ¿Qué es MCP?
Model Context Protocol permite a los modelos de IA (como Gemini) orquestar servicios de manera inteligente, decidiendo qué herramientas ejecutar basándose en la intención del usuario.

### Capacidades del Sistema IA
- 🔍 Buscar productos farmacéuticos por nombre o principio activo
- ✅ Validar disponibilidad de stock
- 💰 Crear comparaciones de precios automáticas
- 💬 Respuestas en lenguaje natural

### Ejemplo de Uso
```bash
POST /ia/query
{
  "message": "Busca ibuprofeno 400mg y verifica si hay 20 unidades disponibles"
}

# Respuesta:
{
  "response": "Encontré Ibuprofeno 400mg (ID: 8) a $3.50. 
               Hay 35 unidades disponibles, suficiente para las 20 que necesitas. ✅",
  "toolsExecuted": ["buscar_producto", "validar_stock"]
}
```

### Taller 4 - n8n + Automatización

- 📱 **Notificaciones Telegram**: Mensajes automáticos personalizados con IA
- 📊 **Sincronización Google Sheets**: Registro automático de todos los eventos
- 🚨 **Alertas Críticas**: Sistema multi-canal (Telegram + Email + Log)
- 🔄 **Event-Driven**: Emisión de webhooks desde backend hacia n8n
- 🤖 **3 Workflows**: Documentados paso a paso

**Eventos soportados:**
- `prestamo.creado` → Notificación en Telegram
- `libro.devuelto` → Mensaje de agradecimiento
- `prestamo.vencido` → Alerta crítica

---

## 📂 Estructura del Proyecto

## 📂 Estructura del Proyecto

```
practica2segundo pracial/
│
├── apps/                              # Taller 3 y 4
│   ├── api-gateway/                   # Gateway con Gemini (3000)
│   ├── mcp-server/                    # MCP Server (3001)
│   ├── backend/                       # Backend Biblioteca (3002) ⭐ NUEVO
│   └── frontend-chat/                 # Chat UI para IA
│
├── n8n/                               # Taller 4 ⭐ NUEVO
│   ├── docker-compose.yml             # n8n con Docker (5678)
│   └── workflows/                     # Guías de workflows
│       ├── 01-notificacion-telegram.md
│       ├── 02-google-sheets.md
│       └── 03-alertas-criticas.md
│
├── Practica_gateway/                  # Taller 1 y 2
│   └── gateway/
│       ├── comparador-service/        # Microservicio Comparador
│       └── productos-service/         # Microservicio Productos
│
├── practica-1-gateway/                # Versión inicial Taller 1
│   └── Gateway-serverless-practica/
│
├── supabase/                          # Taller 2
│   ├── functions/                     # Edge Functions (Serverless)
│   └── migrations/                    # Migraciones DB
│
├── README.md                          # Este archivo
├── README_TALLER_3_MCP.md            # Documentación Taller 3
├── README_TALLER_4.md                # Documentación Taller 4 ⭐
├── QUICKSTART_TALLER_4.md            # Guía rápida Taller 4 ⭐
├── TEST_TALLER_4.md                  # Tests Taller 4 ⭐
├── CHECKLIST_TALLER_4.md             # Verificación Taller 4 ⭐
├── install-taller3.ps1               # Instalador Taller 3
├── install-taller4.ps1               # Instalador Taller 4 ⭐
└── taller_*.md                       # Enunciados de talleres
```

## 🛠️ Stack Tecnológico Completo

### Backend & Microservicios
- **NestJS**: Framework principal
- **TypeScript**: Lenguaje
- **TypeORM + SQLite**: Persistencia
- **RabbitMQ**: Message broker

### IA & Automatización
- **Gemini AI**: Modelo de lenguaje (Google)
- **MCP (Model Context Protocol)**: Orquestación de herramientas
- **n8n**: Automatización de workflows (low-code)

### Integraciones
- **Telegram Bot API**: Notificaciones
- **Google Sheets API**: Sincronización de datos
- **Supabase**: Backend-as-a-Service (opcional)

### DevOps
- **Docker & Docker Compose**: Containerización
- **Git**: Control de versiones
- **PowerShell/Bash**: Scripts de automatización

---

## 📊 Puertos y Servicios

| Servicio | Puerto | Descripción | Taller |
|----------|--------|-------------|--------|
| Gateway | 3000 | API Gateway principal | 1, 3 |
| Productos Service | 3001 | Microservicio productos | 1 |
| Comparador Service | 3002 | Microservicio comparador | 1, 2 |
| Backend Biblioteca | 3002 | Backend con webhooks | 4 |
| RabbitMQ | 5672 | Message broker | 1 |
| RabbitMQ Management | 15672 | UI de administración | 1 |
| n8n | 5678 | Automatización workflows | 4 |

## ✨ Características Completas del Sistema

### 🤖 Inteligencia Artificial (Taller 3)
- **Consultas en lenguaje natural**: Interacción conversacional con el sistema
- **Orquestación inteligente**: Gemini decide qué herramientas ejecutar
- **4 Tools MCP**: buscar_producto, validar_stock, crear_comparacion, validar_prescripcion
- **JSON-RPC 2.0**: Comunicación estandarizada entre gateway y MCP server
- **Frontend interactivo**: Chat web para probar capacidades de IA

### ⚡ Automatización de Workflows (Taller 4)
- **n8n Visual Workflows**: Automatización sin código extensivo
- **Emisión de eventos**: Backend emite webhooks hacia n8n
- **3 Workflows obligatorios**:
  1. Notificaciones Telegram con IA (Gemini)
  2. Sincronización automática con Google Sheets
  3. Alertas críticas multi-canal
- **Event-Driven**: Arquitectura basada en eventos
- **Correlation IDs**: Trazabilidad de eventos


### 🔄 Sistema de Eventos (Talleres 1 y 2)
- **CQRS Pattern**: Separación de comandos y consultas
- **Event Sourcing**: Registro completo del historial de eventos
- **Idempotencia**: Prevención de procesamiento duplicado de eventos
- **Dead Letter Queue (DLQ)**: Manejo automático de eventos fallidos

### 📡 Sistema de Webhooks (Taller 2)
- **HTTP POST Notifications**: Envío de notificaciones a endpoints externos
- **HMAC Signatures**: Validación criptográfica de mensajes (SHA-256)
- **Circuit Breaker**: Protección contra servicios caídos
- **Exponential Backoff**: Reintentos inteligentes con delays incrementales
- **Delivery Tracking**: Registro de intentos de entrega y estados

### 💬 Integración con Telegram (Taller 2)
- Notificaciones en tiempo real de prescripciones registradas
- Notificaciones de comparaciones de precios completadas
- Alertas de errores del sistema
- API REST para envío de mensajes personalizados

### 📊 Sistema de Observabilidad (Taller 2)
- Dashboard de monitoreo en tiempo real
- Métricas de rendimiento (latencia, throughput, tasa de error)
- Trazabilidad distribuida (Distributed Tracing)
- Health checks de servicios
- Estadísticas de RabbitMQ

### 🗄️ Persistencia (Todos los Talleres)
- **TypeORM + SQLite**: Base de datos local para read models
- **Supabase** (Opcional): Registro de webhooks y entregas
- **Read Model**: Modelos optimizados para consultas rápidas

## 📋 Requisitos Previos (Todos los Talleres)

- **Node.js**: v18+ (probado con v22.20.0)
- **npm**: v9+
- **Docker**: Para ejecutar RabbitMQ y n8n
- **Docker Compose**: Para orchestrar contenedores
- **Gemini API Key**: Para funcionalidades de IA (Taller 3)
- **Telegram Bot** (opcional): Para notificaciones
- **Google Account** (opcional): Para Google Sheets (Taller 4)

## 🚀 Instalación Rápida

### Opción 1: Instalar Taller Específico

#### Taller 3 - MCP + IA
```powershell
.\install-taller3.ps1
```

#### Taller 4 - n8n + Automatización
```powershell
.\install-taller4.ps1
```

### Opción 2: Instalación Manual Completa

```bash
# 1. Instalar dependencias de todos los servicios
cd apps/api-gateway && npm install
cd ../mcp-server && npm install
cd ../backend && npm install

# 2. Levantar RabbitMQ (si usas Taller 1 o 2)
cd Practica_gateway/gateway
docker-compose up -d

# 3. Levantar n8n (Taller 4)
cd n8n
docker-compose up -d

# 4. Configurar variables de entorno
# Editar archivos .env en cada servicio
```

## 📖 Documentación por Taller

### 📚 Taller 1: Microservicios + RabbitMQ
- **Ubicación:** `practica-1-gateway/` y `Practica_gateway/`
- **README:** `Practica_gateway/gateway/README.md`
- Implementa CQRS, Event Sourcing, y RabbitMQ

### 📡 Taller 2: Webhooks + Serverless
- **Ubicación:** `Practica_gateway/gateway/comparador-service/`
- **README:** Ver documentos `WEBHOOK_*.md` en `Practica_gateway/`
- Implementa webhooks con HMAC, Circuit Breaker, Telegram

### 🤖 Taller 3: MCP + IA
- **README Principal:** [README_TALLER_3_MCP.md](README_TALLER_3_MCP.md)
- **Quickstart:** [QUICKSTART_TALLER_3.md](apps/README.md)
- **Implementación:** [IMPLEMENTACION.md](apps/IMPLEMENTACION.md)
- **Guía Gemini:** [GEMINI_SETUP.md](apps/GEMINI_SETUP.md)

### ⚡ Taller 4: n8n + Automatización
- **README Principal:** [README_TALLER_4.md](README_TALLER_4.md)
- **Quickstart:** [QUICKSTART_TALLER_4.md](QUICKSTART_TALLER_4.md)
- **Tests:** [TEST_TALLER_4.md](TEST_TALLER_4.md)
- **Checklist:** [CHECKLIST_TALLER_4.md](CHECKLIST_TALLER_4.md)
- **Workflows:**
  - [Notificación Telegram](n8n/workflows/01-notificacion-telegram.md)
  - [Google Sheets](n8n/workflows/02-google-sheets.md)
  - [Alertas Críticas](n8n/workflows/03-alertas-criticas.md)

---

## 🔗 Enlaces Rápidos

### Documentación
- 📘 [README Taller 3 - MCP + IA](README_TALLER_3_MCP.md)
- 📗 [README Taller 4 - n8n](README_TALLER_4.md)
- 📙 [Quickstart Taller 4](QUICKSTART_TALLER_4.md)
- 📕 [Checklist Taller 4](CHECKLIST_TALLER_4.md)

### UIs de Administración
- 🐰 [RabbitMQ Management](http://localhost:15672) - user/pass
- 🤖 [n8n Workflows](http://localhost:5678) - admin/uleam2025

### APIs
- 🌐 [API Gateway](http://localhost:3000)
- 🔧 [MCP Server](http://localhost:3001)
- 📚 [Backend Biblioteca](http://localhost:3002)
- 🏪 [Productos Service](http://localhost:3001)
- 💊 [Comparador Service](http://localhost:3002)

---

## 🧪 Testing Rápido

### Taller 3 - IA
```bash
# Abrir apps/frontend-chat/index.html
# O usar curl:
curl -X POST http://localhost:3000/ia/query \
  -H "Content-Type: application/json" \
  -d '{"message": "Busca paracetamol"}'
```

### Taller 4 - n8n
```bash
# Crear préstamo (dispara workflows)
curl -X POST http://localhost:3002/prestamos \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "U001",
    "usuarioNombre": "Test User",
    "libroId": 1,
    "libroTitulo": "Test Book",
    "diasPrestamo": 7
  }'
```

---

## 📋 Requisitos Previos (Talleres 1 y 2)

---

## 🚀 Instalación Talleres 1 y 2

### Para ejecutar los microservicios originales (Gateway + Productos + Comparador):

```bash
cd "C:\Users\RUDY PICO\Desktop\practica2segundo pracial\Practica_gateway"
```

### 2. Instalar dependencias

Instalar dependencias en cada servicio:

```bash
# Gateway
cd gateway
npm install --legacy-peer-deps

# Productos Service
cd gateway/productos-service
npm install --legacy-peer-deps

# Comparador Service
cd gateway/comparador-service
npm install --legacy-peer-deps
```

### 3. Levantar RabbitMQ

Desde el directorio `gateway/`:

```bash
docker-compose up -d
```

Esto iniciará RabbitMQ en:
- **AMQP**: `localhost:5672`
- **Management UI**: `http://localhost:15672` (usuario: `user`, contraseña: `pass`)

### 4. Configurar variables de entorno

Crear archivo `.env` en `gateway/comparador-service/`:

```env
# Puerto del servicio
PORT=3002

# RabbitMQ
RABBITMQ_URL=amqp://user:pass@localhost:5672

# Telegram Bot (Opcional)
TELEGRAM_BOT_TOKEN=tu_bot_token_aqui
TELEGRAM_CHAT_ID=tu_chat_id_aqui

# Webhook Secret para HMAC
WEBHOOK_SECRET=1841745af1a80e405b943c18fb61b18f35a9da66f8b9e8f9f57bc1009aa75083

# Supabase (Opcional)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_anon_key
```

## 🏃 Ejecución

Ejecutar cada servicio en terminales separadas:

### Terminal 1: Gateway
```bash
cd gateway
npm run start:dev
```
🌐 API Gateway: http://localhost:3000

### Terminal 2: Productos Service
```bash
cd gateway/productos-service
npm run start:dev
```
🏪 Productos API: http://localhost:3001

### Terminal 3: Comparador Service
```bash
cd gateway/comparador-service
npm run start:dev
```
💊 Comparador API: http://localhost:3002

## 📡 Endpoints Principales

### Gateway (Puerto 3000)

#### Productos
```http
POST /productos
GET /productos
GET /productos/:id
PUT /productos/:id
DELETE /productos/:id
```

#### Prescripciones
```http
POST /prescripciones
GET /prescripciones
GET /prescripciones/:id
```

#### Comparaciones
```http
POST /comparaciones
GET /comparaciones/:id
GET /comparaciones/prescripcion/:idPrescripcion
```

### Comparador Service (Puerto 3002)

#### Telegram
```http
GET  /telegram/status              # Verificar configuración
POST /telegram/test                # Enviar mensaje de prueba
POST /telegram/send                # Enviar mensaje personalizado
GET  /telegram/bot-info            # Información del bot
POST /telegram/test/prescripcion   # Simular notificación de prescripción
POST /telegram/test/comparacion    # Simular notificación de comparación
POST /telegram/test/error          # Simular notificación de error
```

#### Webhooks
```http
GET  /webhook/health               # Health check del sistema
POST /webhook/prescripcion         # Trigger manual de webhook prescripción
POST /webhook/comparacion          # Trigger manual de webhook comparación
POST /webhook/generate-signature   # Generar firma HMAC
```

#### Webhooks Admin
```http
GET  /webhook/admin/dlq                        # Ver cola de mensajes fallidos
POST /webhook/admin/dlq/:eventId/retry         # Reintentar evento fallido
GET  /webhook/admin/circuit-breakers           # Estado de circuit breakers
GET  /webhook/admin/metrics                    # Métricas del sistema
GET  /webhook/admin/dashboard                  # Dashboard HTML
```

#### Dashboard & Monitoreo
```http
GET  /webhook/dashboard            # Dashboard interactivo
GET  /webhook/dashboard/metrics    # Métricas en tiempo real
GET  /webhook/dashboard/traces     # Trazas distribuidas
GET  /webhook/dashboard/failures   # Eventos fallidos
GET  /webhook/dashboard/health     # Estado de salud del sistema
```

#### Subscripciones de Webhooks
```http
GET    /webhook/subscriptions              # Listar subscripciones
POST   /webhook/subscriptions              # Crear subscripción
GET    /webhook/subscriptions/:id          # Obtener subscripción
PUT    /webhook/subscriptions/:id          # Actualizar subscripción
DELETE /webhook/subscriptions/:id          # Eliminar subscripción
POST   /webhook/subscriptions/:id/activate # Activar subscripción
```

#### RabbitMQ Stats
```http
GET /events/rabbitmq/stats   # Estadísticas de RabbitMQ
GET /events/rabbitmq/health  # Health check de RabbitMQ
```

#### Idempotencia
```http
GET    /idempotency/stats    # Estadísticas de idempotencia
POST   /idempotency/check    # Verificar si evento fue procesado
POST   /idempotency/cleanup  # Limpiar claves antiguas
DELETE /idempotency/reset    # Resetear sistema de idempotencia
```

## 💬 Configurar Bot de Telegram

### 1. Crear Bot

1. Abre Telegram y busca `@BotFather`
2. Envía `/newbot`
3. Sigue las instrucciones y guarda el **token**

### 2. Obtener Chat ID

1. Envía un mensaje a tu bot
2. Visita: `https://api.telegram.org/bot<TU_TOKEN>/getUpdates`
3. Busca el `chat.id` en la respuesta

### 3. Configurar en .env

```env
TELEGRAM_BOT_TOKEN=8506149537:AAFe0FhVLFAfniGkGTLR70oeWgy_kuwJUcU
TELEGRAM_CHAT_ID=7269995456
```

### 4. Probar desde Postman

**POST** `http://localhost:3002/telegram/send`

Headers:
```
Content-Type: application/json
```

Body:
```json
{
  "message": "🚀 Hola desde Postman! El sistema está funcionando correctamente."
}
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "✅ Mensaje enviado a Telegram"
}
```

## 🔧 Configurar Webhooks

### Registrar una subscripción

**POST** `http://localhost:3002/webhook/subscriptions`

```json
{
  "name": "Mi Sistema de Notificaciones",
  "url": "https://mi-servidor.com/webhook/recibir",
  "events": ["prescripcion.registrada", "comparacion.realizada"],
  "secret": "mi_secreto_super_seguro",
  "active": true,
  "retryConfig": {
    "maxRetries": 5,
    "initialDelay": 1000,
    "maxDelay": 60000,
    "backoffMultiplier": 2
  }
}
```

### Validar firma HMAC en tu servidor

```javascript
const crypto = require('crypto');

function validarWebhook(body, signature, secret) {
  const calculatedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');
  
  return signature === calculatedSignature;
}

// En tu endpoint:
app.post('/webhook/recibir', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const isValid = validarWebhook(req.body, signature, 'mi_secreto_super_seguro');
  
  if (!isValid) {
    return res.status(401).json({ error: 'Firma inválida' });
  }
  
  // Procesar webhook...
  res.status(200).json({ received: true });
});
```

## 🔍 Monitoreo y Debugging

### Dashboard de Observabilidad

Abre en tu navegador: http://localhost:3002/webhook/dashboard

Incluye:
- 📊 Métricas en tiempo real
- 🔄 Estado de circuit breakers
- 📈 Gráficas de rendimiento
- 🚨 Alertas activas
- 📋 Lista de eventos recientes
- ⚠️ Eventos fallidos con detalles

### Ver estadísticas de RabbitMQ

```bash
curl http://localhost:3002/events/rabbitmq/stats
```

### Ver DLQ (Dead Letter Queue)

```bash
curl http://localhost:3002/webhook/admin/dlq
```

### Reintentar evento fallido

```bash
curl -X POST http://localhost:3002/webhook/admin/dlq/{eventId}/retry
```

## 🐛 Troubleshooting

### Puerto 3002 ya en uso

```bash
# Windows PowerShell
netstat -ano | findstr :3002
taskkill /PID <PID> /F

# O matar todos los procesos de Node
taskkill /F /IM node.exe
```

### RabbitMQ no se conecta

```bash
# Verificar que el contenedor esté corriendo
docker ps

# Ver logs de RabbitMQ
docker logs <container_id>

# Reiniciar RabbitMQ
docker-compose restart
```

### Telegram no envía mensajes

1. Verifica que el token y chat ID sean correctos
2. Prueba el endpoint de status:
   ```bash
   curl http://localhost:3002/telegram/status
   ```
3. Verifica que el bot no esté bloqueado
4. Revisa los logs del servicio

### Error: "El campo message es requerido"

Asegúrate de que en Postman:
- El método sea **POST**
- El body esté en formato **raw JSON**
- El header `Content-Type: application/json` esté presente

### Supabase no configurado (Warning)

Es normal si no tienes Supabase configurado. El sistema funciona sin él:
```
⚠️  Supabase no configurado - Variables SUPABASE_URL o SUPABASE_ANON_KEY faltantes
Los intentos de entrega no se guardarán en base de datos
```

Para desactivar el warning, configura las variables en `.env` o ignora el mensaje (no afecta la funcionalidad).

## 📚 Patrones de Diseño Implementados

- **Event-Driven Architecture**: Comunicación asíncrona entre servicios
- **CQRS**: Separación de comandos y consultas
- **Circuit Breaker**: Prevención de cascadas de fallos
- **Retry Pattern**: Exponential backoff para reintentos
- **Idempotent Consumer**: Prevención de procesamiento duplicado
- **Dead Letter Queue**: Manejo de mensajes fallidos
- **API Gateway**: Punto único de entrada al sistema
- **Microservices**: Servicios independientes y escalables
- **Observer Pattern**: Sistema de webhooks y notificaciones

## 📦 Tecnologías Utilizadas

- **Framework**: NestJS 11
- **Message Broker**: RabbitMQ
- **Database**: TypeORM + SQLite
- **Cloud DB**: Supabase (opcional)
- **HTTP Client**: Axios
- **Validation**: class-validator, class-transformer
- **Scheduling**: @nestjs/schedule
- **Containerization**: Docker & Docker Compose

## 🔐 Seguridad

- **HMAC Signatures**: Todas las entregas de webhooks están firmadas con SHA-256
- **Environment Variables**: Credenciales sensibles en archivos .env (no versionados)
- **CORS**: Configurado para prevenir accesos no autorizados
- **Input Validation**: Validación de entrada en todos los endpoints

## 📝 Estructura de Eventos

### Prescripción Registrada
```typescript
{
  eventType: 'prescripcion.registrada',
  data: {
    id_prescripcion: number,
    id_paciente: number,
    id_medico: number,
    fecha_prescripcion: Date,
    detalles: [
      {
        id_detalle_receta: number,
        id_medicamento: number,
        cantidad: number,
        dosis: string,
        frecuencia: string,
        duracion_dias: number
      }
    ]
  },
  timestamp: string,
  traceId: string
}
```

### Comparación Realizada
```typescript
{
  eventType: 'comparacion.realizada',
  data: {
    id_comparacion: number,
    id_prescripcion: number,
    fecha_comparacion: Date,
    total_medicamentos: number,
    resultados: [
      {
        id_medicamento: number,
        nombre_comercial: string,
        mejor_precio: number,
        farmacia: string,
        ahorro_potencial: number
      }
    ],
    precio_total: number
  },
  timestamp: string,
  traceId: string
}
```

## � Índice Completo de Documentación

### 📘 Taller 1: Arquitectura de Microservicios con RabbitMQ

**Ubicación**: `practica-1-gateway/Gateway-serverless-practica/`

- [INDEX.md](practica-1-gateway/Gateway-serverless-practica/INDEX.md) - Índice principal del proyecto
- [QUICKSTART.md](practica-1-gateway/Gateway-serverless-practica/QUICKSTART.md) - Inicio rápido (5 minutos)
- [COMANDOS_UTILES.md](practica-1-gateway/Gateway-serverless-practica/COMANDOS_UTILES.md) - Referencia de comandos
- [ARQUITECTURA_DIAGRAMAS.md](practica-1-gateway/Gateway-serverless-practica/ARQUITECTURA_DIAGRAMAS.md) - Diagramas de sistema
- [PRUEBAS_RESILIENCIA.md](practica-1-gateway/Gateway-serverless-practica/PRUEBAS_RESILIENCIA.md) - Tests de resiliencia
- [PROYECTO_COMPLETADO.md](practica-1-gateway/Gateway-serverless-practica/PROYECTO_COMPLETADO.md) - Estado del proyecto

### 📗 Taller 2: Webhooks y Serverless

**Ubicación**: `Practica_gateway/`

- [INDICE_DOCUMENTACION.md](Practica_gateway/INDICE_DOCUMENTACION.md) - Índice principal
- [GUIA_RAPIDA_ENDPOINTS.md](Practica_gateway/GUIA_RAPIDA_ENDPOINTS.md) - API reference rápida
- [RESUMEN_IMPLEMENTACION.md](Practica_gateway/RESUMEN_IMPLEMENTACION.md) - Resumen de implementación
- [WEBHOOK_HTTP_POST_RESUMEN.md](Practica_gateway/WEBHOOK_HTTP_POST_RESUMEN.md) - Sistema de webhooks
- [WEBHOOK_PAYLOADS.md](Practica_gateway/WEBHOOK_PAYLOADS.md) - Estructura de payloads
- [WEBHOOK_TRANSFORMATION_README.md](Practica_gateway/WEBHOOK_TRANSFORMATION_README.md) - Transformaciones
- [HMAC_SIGNATURE_IMPLEMENTATION.md](Practica_gateway/HMAC_SIGNATURE_IMPLEMENTATION.md) - Seguridad HMAC
- [HMAC_RESUMEN.md](Practica_gateway/HMAC_RESUMEN.md) - Resumen HMAC
- [EXPONENTIAL_BACKOFF_README.md](Practica_gateway/EXPONENTIAL_BACKOFF_README.md) - Estrategia de reintentos
- [IDEMPOTENT_CONSUMER_README.md](Practica_gateway/IDEMPOTENT_CONSUMER_README.md) - Idempotencia
- [RABBITMQ_LISTENERS_README.md](Practica_gateway/RABBITMQ_LISTENERS_README.md) - Listeners de RabbitMQ
- [DATABASE_DELIVERY_TRACKING.md](Practica_gateway/DATABASE_DELIVERY_TRACKING.md) - Tracking en BD
- [SISTEMA_WEBHOOK_ACTUALIZACION.md](Practica_gateway/SISTEMA_WEBHOOK_ACTUALIZACION.md) - Actualizaciones
- [SISTEMA_OBSERVABILIDAD_RESUMEN.md](Practica_gateway/SISTEMA_OBSERVABILIDAD_RESUMEN.md) - Observabilidad
- [EVENTOS_DE_NEGOCIO.md](Practica_gateway/EVENTOS_DE_NEGOCIO.md) - Eventos del dominio
- [DIAGRAMA_EVENTOS.md](Practica_gateway/DIAGRAMA_EVENTOS.md) - Diagramas de eventos
- [EVENTO_TRANSFORMACION_RESUMEN.md](Practica_gateway/EVENTO_TRANSFORMACION_RESUMEN.md) - Transformaciones
- [DIAGRAMA_TRANSFORMACION.md](Practica_gateway/DIAGRAMA_TRANSFORMACION.md) - Diagramas de transformación

### 📙 Taller 3: MCP + Integración con IA (Gemini)

**Ubicación**: `apps/`

- [README_TALLER_3_MCP.md](README_TALLER_3_MCP.md) - Documentación principal
- [TALLER_3_README.md](TALLER_3_README.md) - README específico
- [taller_3_mcp_integracion_ia.md](taller_3_mcp_integracion_ia.md) - Enunciado del taller
- [RESUMEN_TALLER_3.md](RESUMEN_TALLER_3.md) - Resumen ejecutivo
- [INDICE_DOCUMENTACION_TALLER_3.md](INDICE_DOCUMENTACION_TALLER_3.md) - Índice de documentos
- [ARQUITECTURA_MCP.md](ARQUITECTURA_MCP.md) - Arquitectura MCP
- [EJEMPLOS_CODIGO_TALLER_3.md](EJEMPLOS_CODIGO_TALLER_3.md) - Ejemplos de código
- [DIAGRAMAS_VISUALES_TALLER_3.md](DIAGRAMAS_VISUALES_TALLER_3.md) - Diagramas visuales
- [GUIA_PRUEBAS_TALLER_3.md](GUIA_PRUEBAS_TALLER_3.md) - Guía de pruebas
- [CHECKLIST_ENTREGA_TALLER_3.md](CHECKLIST_ENTREGA_TALLER_3.md) - Checklist de entrega
- [GUIA_API_KEY_GEMINI.md](GUIA_API_KEY_GEMINI.md) - Configuración de API key
- [INSTRUCCIONES_API_KEY.md](INSTRUCCIONES_API_KEY.md) - Instrucciones de configuración
- [apps/GEMINI_SETUP.md](apps/GEMINI_SETUP.md) - Setup de Gemini
- [apps/IMPLEMENTACION.md](apps/IMPLEMENTACION.md) - Detalles de implementación

### 📕 Taller 4: n8n + Automatización de Workflows con IA

**Ubicación**: `apps/backend/` y `n8n/`

- [README_TALLER_4.md](README_TALLER_4.md) - Documentación principal completa
- [taller_4_n_8_n_automatizacion.md](taller_4_n_8_n_automatizacion.md) - Enunciado del taller
- [QUICKSTART_TALLER_4.md](QUICKSTART_TALLER_4.md) - Inicio rápido
- [TEST_TALLER_4.md](TEST_TALLER_4.md) - Scripts de testing
- [CHECKLIST_TALLER_4.md](CHECKLIST_TALLER_4.md) - Verificación de completitud
- [n8n/workflows/01-notificacion-telegram.md](n8n/workflows/01-notificacion-telegram.md) - Workflow Telegram + IA
- [n8n/workflows/02-google-sheets.md](n8n/workflows/02-google-sheets.md) - Workflow Google Sheets
- [n8n/workflows/03-alertas-criticas.md](n8n/workflows/03-alertas-criticas.md) - Workflow alertas críticas

### 🛠️ Scripts de Instalación y Configuración

- [install-taller3.ps1](install-taller3.ps1) / [install-taller3.sh](install-taller3.sh) - Instalación Taller 3
- [install-taller4.ps1](install-taller4.ps1) / [install-taller4.sh](install-taller4.sh) - Instalación Taller 4
- [start-check.ps1](start-check.ps1) / [start-check.sh](start-check.sh) - Verificación de servicios
- [apps/test-quick.ps1](apps/test-quick.ps1) - Tests rápidos

### 📋 Colecciones de Postman

- [postman-collection-taller3.json](postman-collection-taller3.json) - Colección Taller 3
- [apps/Taller3-MCP-Tests.postman_collection.json](apps/Taller3-MCP-Tests.postman_collection.json) - Tests MCP

### 🗄️ Supabase Functions

**Ubicación**: `supabase/`

- [webhook-event-logger](supabase/functions/webhook-event-logger) - Logger de eventos
- [webhook-external-notifier](supabase/functions/webhook-external-notifier) - Notificador externo

## �👥 Contribución

Este proyecto es parte de la **Práctica 2 - Segundo Parcial**.

link del viodeo 1 de la práctica: https://uleam-my.sharepoint.com/:v:/r/personal/e1316318565_live_uleam_edu_ec/Documents/Datos%20adjuntos/video2426072547.mp4?csf=1&web=1&e=nYgAnv&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D
link del viodeo 2 de la práctica:https://uleam-my.sharepoint.com/:v:/r/personal/e1316318565_live_uleam_edu_ec/Documents/Datos%20adjuntos/video2426072547%201.mp4?csf=1&web=1&e=mJpZXx&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D

Proyecto educativo - Uso académico únicamente.

---

**Desarrollado con ❤️ usando NestJS y RabbitMQ por Trashprogramen**
