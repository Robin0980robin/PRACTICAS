# README - Taller 4: n8n + Automatización de Workflows

**Universidad Laica Eloy Alfaro de Manabí (ULEAM)**  
**Taller N° 4:** n8n - Automatización de Workflows con Inteligencia Artificial  
**Docente:** Ing. John Cevallos  
**Período:** 2025-2026 (2)

---

## 📋 Descripción

Extensión de la arquitectura MCP (Taller 3) con **n8n** como capa de automatización de eventos. El sistema emite webhooks desde el backend hacia n8n, que ejecuta workflows para:

- 📱 Notificaciones en Telegram
- 📊 Sincronización con Google Sheets
- 🚨 Alertas críticas inteligentes

## 🏗️ Arquitectura Completa

```
┌─────────────────────────────────────────────────────────┐
│                     Capa 1                              │
│              API Gateway + Gemini (3000)                │
│          (Recepción de solicitudes + IA)                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                     Capa 2                              │
│                 MCP Server (3001)                       │
│         (Exposición de Tools - JSON-RPC 2.0)            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                     Capa 3                              │
│              Backend NestJS (3002)                      │
│          (CRUD + Emisión de Eventos)                    │
└────────────────────┬────────────────────────────────────┘
                     │ Webhook HTTP POST
                     ▼
┌─────────────────────────────────────────────────────────┐
│                     Capa 4 ⭐ NUEVO                     │
│                    n8n (5678)                           │
│         (Automatización de Consecuencias)               │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  Telegram    │  │ Google       │  │  Alertas    │ │
│  │  Notifier    │  │ Sheets Sync  │  │  Críticas   │ │
│  └──────────────┘  └──────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Inicio Rápido

### Pre-requisitos

- ✅ Node.js 18+ y npm
- ✅ Docker y Docker Compose
- ✅ Git
- ✅ Talleres 1, 2 y 3 completados

### Instalación Automática

#### Windows (PowerShell):
```powershell
.\install-taller4.ps1
```

#### Linux/Mac:
```bash
chmod +x install-taller4.sh
./install-taller4.sh
```

### Instalación Manual

#### 1. Backend

```bash
cd apps/backend
npm install
cp .env.example .env
```

Editar `.env`:
```env
PORT=3002
N8N_WEBHOOK_URL=http://localhost:5678/webhook/prestamos
```

#### 2. n8n

```bash
cd n8n
docker-compose up -d
```

Acceder a: http://localhost:5678  
Usuario: `admin` / Contraseña: `uleam2025`

#### 3. Workflows

1. Seguir guías en `n8n/workflows/`:
   - [01-notificacion-telegram.md](n8n/workflows/01-notificacion-telegram.md)
   - [02-google-sheets.md](n8n/workflows/02-google-sheets.md)
   - [03-alertas-criticas.md](n8n/workflows/03-alertas-criticas.md)

2. Copiar URLs de webhooks creados en n8n
3. Actualizar `apps/backend/.env`

#### 4. Iniciar Backend

```bash
cd apps/backend
npm run start:dev
```

## 📡 Flujo de Demostración

### 1. Crear Préstamo

```bash
curl -X POST http://localhost:3002/prestamos \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "U001",
    "usuarioNombre": "Juan Pérez",
    "libroId": 101,
    "libroTitulo": "1984",
    "diasPrestamo": 7
  }'
```

**Resultado:**
- ✅ Préstamo creado en backend
- 📱 Notificación enviada a Telegram
- 📊 Registro agregado en Google Sheets
- 🔔 n8n ejecuta workflows automáticamente

### 2. Devolver Libro

```bash
curl -X PUT http://localhost:3002/prestamos/1/devolver
```

**Resultado:**
- ✅ Estado actualizado a "devuelto"
- 📱 Mensaje de agradecimiento en Telegram
- 📊 Evento registrado en Sheets

### 3. Verificar Vencidos

```bash
curl -X POST http://localhost:3002/prestamos/verificar-vencidos
```

**Resultado:**
- 🚨 Alerta crítica si hay vencidos
- 📧 Email de alerta (opcional)
- 📱 Notificación urgente en Telegram

## 📊 Eventos Implementados

| Evento | Trigger | Telegram | Sheets | Alertas |
|--------|---------|----------|--------|---------|
| `prestamo.creado` | POST /prestamos | ✅ | ✅ | - |
| `libro.devuelto` | PUT /prestamos/:id/devolver | ✅ | ✅ | - |
| `prestamo.vencido` | POST /verificar-vencidos | ✅ | ✅ | ✅ |

## 🗂️ Estructura del Proyecto

```
practica2segundo pracial/
├── apps/
│   ├── backend/              ⭐ NUEVO
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   ├── webhook-emitter.service.ts
│   │   │   │   └── webhook.module.ts
│   │   │   ├── prestamos/
│   │   │   │   ├── prestamos.controller.ts
│   │   │   │   ├── prestamos.service.ts
│   │   │   │   └── prestamos.module.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── data/
│   │   │   └── prestamos.json
│   │   ├── package.json
│   │   ├── .env
│   │   └── README.md
│   │
│   ├── mcp-server/           (Taller 3)
│   ├── api-gateway/          (Taller 3)
│   └── frontend-chat/        (Taller 3)
│
├── n8n/                      ⭐ NUEVO
│   ├── docker-compose.yml
│   ├── workflows/
│   │   ├── README.md
│   │   ├── 01-notificacion-telegram.md
│   │   ├── 02-google-sheets.md
│   │   └── 03-alertas-criticas.md
│   └── README.md
│
├── install-taller4.ps1       ⭐ NUEVO
├── install-taller4.sh        ⭐ NUEVO
├── README_TALLER_4.md        ⭐ NUEVO (este archivo)
└── taller_4_n_8_n_automatizacion.md
```

## 🔧 Configuración de Credenciales

### Telegram Bot

1. Buscar @BotFather en Telegram
2. Ejecutar `/newbot` y seguir pasos
3. Copiar Bot Token
4. Enviar mensaje al bot
5. Obtener Chat ID:
   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
6. Configurar en n8n → Settings → Credentials

### Google Sheets API

1. Google Cloud Console → Crear proyecto
2. Habilitar Google Sheets API
3. Crear credenciales OAuth 2.0
4. Configurar en n8n con OAuth2 flow
5. Crear hoja de cálculo
6. Copiar Sheet ID de la URL

### Gemini API

1. Ir a https://aistudio.google.com
2. Crear API Key
3. Usar en nodos HTTP Request de n8n

## 🧪 Testing

### Test Backend Individual

```bash
cd apps/backend
npm run start:dev

# En otra terminal
curl http://localhost:3002/prestamos
```

### Test n8n

1. Acceder a http://localhost:5678
2. Abrir workflow
3. Click "Execute Workflow"
4. Verificar resultados

### Test End-to-End

```bash
# Script de prueba completo
cd apps/backend

# Crear 3 préstamos
for i in {1..3}; do
  curl -X POST http://localhost:3002/prestamos \
    -H "Content-Type: application/json" \
    -d "{
      \"usuarioId\": \"U00$i\",
      \"usuarioNombre\": \"Usuario $i\",
      \"libroId\": $((100 + i)),
      \"libroTitulo\": \"Libro $i\",
      \"diasPrestamo\": 7
    }"
  sleep 2
done
```

Verificar:
- ✅ 3 mensajes en Telegram
- ✅ 3 filas nuevas en Google Sheets
- ✅ Ejecuciones exitosas en n8n

## 📝 Entregables

### 1. Repositorio Git

```
git add .
git commit -m "feat: Taller 4 - n8n + Automatización completo"
git push
```

### 2. README.md Actualizado

Incluir:
- Descripción del Taller 4
- Instrucciones de instalación
- Configuración de workflows
- Capturas de pantalla

### 3. Video Demostración (3-5 min)

Mostrar:
1. n8n corriendo (http://localhost:5678)
2. Los 3 workflows configurados
3. Backend funcionando
4. Crear préstamo desde API
5. Notificación llegando a Telegram
6. Registro en Google Sheets
7. Alerta crítica con préstamo vencido

### 4. Workflows Documentados

- Screenshots de cada workflow en n8n
- Exportar JSON de workflows
- Documentar credenciales usadas

### 5. Google Sheet Compartido

- Link a la hoja con registros
- Permisos de visualización para el docente

## 📊 Rúbrica de Evaluación

| Criterio | Puntos | Descripción |
|----------|--------|-------------|
| **Workflow 1: Notificación Telegram** | 25 | Telegram bot funcional con mensajes personalizados por IA |
| **Workflow 2: Google Sheets** | 20 | Sincronización automática de todos los eventos |
| **Workflow 3: Alertas Críticas** | 20 | Detección y envío de alertas multi-canal |
| **Integración Backend** | 15 | Emisión correcta de eventos desde NestJS |
| **Flujo End-to-End** | 10 | Demostración completa funcionando |
| **Documentación** | 10 | README, código comentado, guías |
| **TOTAL** | **100** | |

## 🐛 Troubleshooting

### n8n no inicia

```bash
cd n8n
docker-compose down
docker-compose up -d
docker-compose logs -f
```

### Backend no envía webhooks

1. Verificar `.env`:
   ```env
   N8N_WEBHOOK_URL=http://localhost:5678/webhook/prestamos
   ```

2. Verificar logs:
   ```
   [WebhookEmitterService] Emitiendo evento: prestamo.creado
   ```

3. Verificar workflows activados en n8n

### Telegram no recibe mensajes

1. Verificar Bot Token
2. Verificar Chat ID
3. Probar manualmente:
   ```bash
   curl -X POST https://api.telegram.org/bot<TOKEN>/sendMessage \
     -d chat_id=<CHAT_ID> \
     -d text="Test"
   ```

### Google Sheets no se sincroniza

1. Re-autenticar OAuth2 en n8n
2. Verificar permisos de la hoja
3. Verificar Sheet ID correcto

## 📚 Recursos

- [Documentación n8n](https://docs.n8n.io)
- [n8n Community Workflows](https://n8n.io/workflows)
- [Telegram Bot API](https://core.telegram.org/bots)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Gemini API](https://ai.google.dev)
- [NestJS](https://docs.nestjs.com)

## 💡 Mejoras Futuras

- [ ] Retry logic con exponential backoff
- [ ] Queue con RabbitMQ
- [ ] Más canales (Discord, Slack, WhatsApp)
- [ ] Dashboard de métricas en tiempo real
- [ ] Webhook signatures (HMAC)
- [ ] Rate limiting
- [ ] Backup automático de workflows
- [ ] Tests automatizados

## 👥 Autores

- **Docente:** Ing. John Cevallos
- **Institución:** ULEAM - Facultad de Ciencias Informáticas
- **Carrera:** Software - Nivel Quinto
- **Período:** 2025-2026 (2)

## 📄 Licencia

Material educativo - ULEAM 2026

---

> **"n8n extiende tu sistema sin invadirlo. El Backend hace lo suyo, n8n automatiza las consecuencias."**

---

## 🎯 Checklist Final

Antes de entregar, verificar:

- [ ] Backend instalado y funcionando (puerto 3002)
- [ ] n8n corriendo en Docker (puerto 5678)
- [ ] Workflow 1 (Telegram) configurado y probado
- [ ] Workflow 2 (Google Sheets) configurado y probado
- [ ] Workflow 3 (Alertas) configurado y probado
- [ ] Credenciales configuradas (Telegram, Sheets, Gemini)
- [ ] URLs de webhooks actualizadas en .env
- [ ] Test end-to-end exitoso
- [ ] Google Sheet con registros visible
- [ ] Video de demostración grabado
- [ ] README.md completo
- [ ] Repositorio Git actualizado
- [ ] Documentación exportada

---

**¡Éxito con el Taller 4! 🚀**
