# 🔄 Workflows de n8n - Taller 4

Esta carpeta contiene los 3 workflows obligatorios para la automatización de eventos del sistema de biblioteca.

## 📋 Workflows Disponibles

### 1️⃣ Notificación en Tiempo Real (Telegram + IA)
**Archivo:** `01-notificacion-biblioteca-telegram.json`

**Descripción:** Recibe eventos del backend y envía notificaciones inteligentes a Telegram usando Gemini para generar mensajes personalizados.

**Eventos que procesa:**
- `prestamo.creado`
- `prestamo.vencido`
- `libro.devuelto`

**Flujo:**
```
Webhook → Validar → Transformar → Gemini IA → Extraer Mensaje → Telegram → Responder
```

**Configuración requerida:**
- ✅ API Key de Gemini
- ✅ Token de Bot de Telegram
- ✅ Chat ID de Telegram

---

### 2️⃣ Sincronización con Google Sheets
**Archivo:** `02-sincronizacion-google-sheets.json`

**Descripción:** Registra todos los eventos en una hoja de cálculo de Google Sheets para auditoría y análisis.

**Columnas que registra:**
- Fecha/Hora
- Tipo de Evento
- ID Registro
- Libro
- Usuario
- Estado
- Descripción

**Flujo:**
```
Webhook → Transformar → Google Sheets (Append) → Responder
```

**Configuración requerida:**
- ✅ Cuenta de Google conectada en n8n
- ✅ ID de la Spreadsheet
- ✅ Nombre de la hoja

---

### 3️⃣ Alertas Críticas
**Archivo:** `03-alertas-criticas-biblioteca.json`

**Descripción:** Analiza eventos críticos (préstamos vencidos) con IA y clasifica la urgencia para enviar notificaciones apropiadas.

**Eventos críticos:**
- `prestamo.vencido`

**Flujo:**
```
Webhook → ¿Crítico? → Gemini (Análisis) → Procesar → Switch → [Telegram | Log | Email]
                ↓
          (No crítico → Responder)
```

**Clasificación de urgencia:**
- **HIGH:** Telegram con alerta inmediata 🚨
- **MEDIUM:** Log en consola ⚠️
- **LOW:** Log simple ℹ️

**Configuración requerida:**
- ✅ API Key de Gemini
- ✅ Token de Bot de Telegram (para alertas HIGH)

---

## 🚀 Cómo Importar los Workflows

### Método 1: Interfaz Web de n8n

1. Inicia n8n:
   ```bash
   cd n8n
   docker-compose up -d
   ```

2. Abre n8n en el navegador: http://localhost:5678

3. Login con las credenciales:
   - Usuario: `admin`
   - Contraseña: `uleam2025`

4. Haz clic en **"Add workflow"** → **"Import from File"**

5. Selecciona cada archivo JSON y haz clic en **"Import"**

6. Configura las credenciales necesarias en cada workflow

7. Activa los workflows (toggle en la esquina superior derecha)

### Método 2: CLI (Avanzado)

```bash
# Copiar workflows al contenedor (si es necesario)
docker cp 01-notificacion-biblioteca-telegram.json n8n-taller4:/home/node/.n8n/workflows/
docker cp 02-sincronizacion-google-sheets.json n8n-taller4:/home/node/.n8n/workflows/
docker cp 03-alertas-criticas-biblioteca.json n8n-taller4:/home/node/.n8n/workflows/
```

---

## ⚙️ Configuración de Credenciales

### Telegram Bot

1. Habla con [@BotFather](https://t.me/botfather) en Telegram
2. Ejecuta `/newbot` y sigue las instrucciones
3. Guarda el **Bot Token**
4. Obtén tu **Chat ID** hablando con [@userinfobot](https://t.me/userinfobot)
5. En n8n:
   - Ve a **Credentials** → **Add Credential** → **Telegram API**
   - Pega el Bot Token
   - Guarda

### Gemini API

1. Ve a [Google AI Studio](https://aistudio.google.com)
2. Haz clic en **"Get API Key"**
3. Copia la API Key
4. En los workflows, reemplaza `TU_API_KEY_AQUI` con tu clave real

### Google Sheets

1. En n8n, ve a **Credentials** → **Add Credential** → **Google Sheets OAuth2 API**
2. Sigue el flujo de autenticación con tu cuenta de Google
3. Crea una nueva Spreadsheet en Google Sheets
4. Agrega los encabezados de columna en la primera fila:
   ```
   Fecha/Hora | Tipo de Evento | ID Registro | Libro | Usuario | Estado | Descripción
   ```
5. Copia el ID de la Spreadsheet (de la URL)
6. En el workflow 02, reemplaza `TU_SPREADSHEET_ID_AQUI` con tu ID

---

## 🔗 URLs de Webhook

Una vez que actives los workflows, obtendrás estas URLs:

```
Workflow 1 (Notificación):
http://localhost:5678/webhook/biblioteca-events

Workflow 2 (Sheets):
http://localhost:5678/webhook/biblioteca-sheets

Workflow 3 (Alertas):
http://localhost:5678/webhook/biblioteca-alerts
```

**Configura estas URLs en tu backend (.env):**

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/biblioteca-events
N8N_WEBHOOK_SHEETS_URL=http://localhost:5678/webhook/biblioteca-sheets
N8N_WEBHOOK_ALERTS_URL=http://localhost:5678/webhook/biblioteca-alerts
```

---

## 🧪 Probar los Workflows

### Test Manual con cURL

```bash
# Test Workflow 1 (Notificación)
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

# Test Workflow 2 (Sheets)
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

# Test Workflow 3 (Alertas)
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

## 📊 Monitoreo

Para ver las ejecuciones de los workflows:

1. Ve a n8n: http://localhost:5678
2. Haz clic en **"Executions"** en la barra lateral
3. Verás el historial de todas las ejecuciones
4. Haz clic en una ejecución para ver los detalles

---

## 🐛 Troubleshooting

### Workflow no se ejecuta
- ✅ Verifica que el workflow esté **activo** (toggle verde)
- ✅ Revisa que la URL del webhook sea correcta
- ✅ Chequea los logs del contenedor: `docker logs n8n-taller4`

### Telegram no envía mensajes
- ✅ Verifica que el Bot Token sea correcto
- ✅ Asegúrate de que el Chat ID sea tuyo
- ✅ El bot debe estar agregado a tu chat

### Gemini retorna error
- ✅ Verifica que la API Key sea válida
- ✅ Revisa el límite de requests (plan gratuito: 10 req/min)
- ✅ Asegúrate de que el modelo sea `gemini-2.0-flash-exp`

### Google Sheets no se actualiza
- ✅ Verifica que la cuenta de Google esté autorizada
- ✅ El ID de la Spreadsheet debe ser correcto
- ✅ El nombre de la hoja debe coincidir exactamente

---

## 📚 Recursos

- [Documentación de n8n](https://docs.n8n.io)
- [Ejemplos de Workflows](https://n8n.io/workflows)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Google Sheets API](https://developers.google.com/sheets/api)

---

## ✅ Checklist de Entrega

- [ ] Los 3 workflows están importados en n8n
- [ ] Todos los workflows están activos
- [ ] Credenciales configuradas (Telegram, Gemini, Google Sheets)
- [ ] Backend emite eventos correctamente
- [ ] Se reciben notificaciones en Telegram
- [ ] Google Sheets se actualiza con cada evento
- [ ] Alertas críticas funcionan con análisis de IA
- [ ] Video de demostración grabado (3-5 min)

---

> 💡 **Tip:** Usa el modo "Manual Execution" en n8n para probar los workflows paso a paso antes de activarlos.
