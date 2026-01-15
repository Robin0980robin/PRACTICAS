# Workflow 1: Notificación en Tiempo Real (Telegram + IA)

## 🎯 Objetivo
Enviar notificaciones personalizadas a Telegram cuando ocurren eventos en el sistema, usando Gemini para generar mensajes contextuales.

## 📊 Diagrama de Flujo

```
┌─────────────┐
│   Backend   │
│  (NestJS)   │
└──────┬──────┘
       │ HTTP POST
       ▼
┌─────────────────────────────────────────────────────┐
│              Workflow n8n                            │
│                                                      │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐ │
│  │ Webhook  │───▶│   IF     │───▶│ Transformar  │ │
│  │ Trigger  │    │ Evaluar  │    │    Datos     │ │
│  └──────────┘    └──────────┘    └──────┬───────┘ │
│                                           │         │
│                                           ▼         │
│                                  ┌─────────────┐   │
│                                  │   Gemini    │   │
│                                  │  API Call   │   │
│                                  └──────┬──────┘   │
│                                           │         │
│                                           ▼         │
│                                  ┌─────────────┐   │
│                                  │  Telegram   │   │
│                                  │    Bot      │   │
│                                  └──────┬──────┘   │
│                                           │         │
│                                           ▼         │
│                                  ┌─────────────┐   │
│                                  │  Response   │   │
│                                  └─────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 🔧 Configuración Paso a Paso

### 1. Crear Nuevo Workflow

1. Acceder a http://localhost:5678
2. Click en "+ Add workflow"
3. Nombrar: "01 - Notificación Telegram"
4. Guardar

### 2. Nodo 1: Webhook Trigger

**Agregar nodo:**
- Click en "+" → Trigger → Webhook

**Configuración:**
- **Webhook Path:** `prestamos` (o personalizar)
- **Authentication:** None
- **Method:** POST
- **Response Mode:** Last Node

**Resultado:** URL webhook: `http://localhost:5678/webhook/prestamos`

### 3. Nodo 2: IF - Evaluar Tipo de Evento

**Agregar nodo:**
- Click en "+" → Logic → IF

**Configuración:**
```
Conditions:
  - Condition 1:
    Field: {{ $json.evento }}
    Operation: Equal
    Value: prestamo.creado
    
  - Condition 2:
    Field: {{ $json.evento }}
    Operation: Equal
    Value: libro.devuelto
    
  - Condition 3:
    Field: {{ $json.evento }}
    Operation: Equal
    Value: prestamo.vencido
```

**Modo:** Any condition matches (OR)

### 4. Nodo 3: Set - Transformar Datos

**Conectar desde:** IF (rama "true")

**Agregar nodo:**
- Click en "+" → Data transformation → Set

**Configuración:**

```javascript
// Keep Only Set: false (mantener todos los datos)

Values to Set:
  - Name: evento_tipo
    Value: {{ $json.evento }}
    
  - Name: usuario
    Value: {{ $json.data.usuarioNombre }}
    
  - Name: libro
    Value: {{ $json.data.libroTitulo }}
    
  - Name: fecha_devolucion
    Value: {{ $json.data.fechaDevolucion }}
    
  - Name: dias_restantes
    Value: {{ $json.data.diasRestantes }}
    
  - Name: estado
    Value: {{ $json.data.estado }}
```

### 5. Nodo 4: HTTP Request - Gemini API

**Agregar nodo:**
- Click en "+" → Action → HTTP Request

**Configuración:**

```
Method: POST
URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent

Authentication: None

Headers:
  - Name: Content-Type
    Value: application/json

Body:
Send Body: true
Body Content Type: JSON

JSON Body:
```

```json
{
  "contents": [{
    "parts": [{
      "text": "Genera un mensaje breve y amigable para notificar este evento de biblioteca:\n\nTipo: {{ $json.evento_tipo }}\nUsuario: {{ $json.usuario }}\nLibro: {{ $json.libro }}\nFecha devolución: {{ $json.fecha_devolucion }}\nDías restantes: {{ $json.dias_restantes }}\n\nEl mensaje debe ser cordial, incluir emojis apropiados y ser menor a 200 caracteres. Si es vencido, debe ser urgente."
    }]
  }]
}
```

**Query Parameters:**
- Name: `key`
- Value: `TU_GEMINI_API_KEY` (reemplazar con tu API key real)

### 6. Nodo 5: Set - Extraer Mensaje de Gemini

**Agregar nodo:**
- Click en "+" → Data transformation → Set

**Configuración:**

```javascript
Values to Set:
  - Name: mensaje_ia
    Value: {{ $json.candidates[0].content.parts[0].text }}
    
  - Name: evento_original
    Value: {{ $('Transformar Datos').item.json.evento_tipo }}
    
  - Name: usuario
    Value: {{ $('Transformar Datos').item.json.usuario }}
```

### 7. Nodo 6: Telegram

**Agregar nodo:**
- Click en "+" → Action → Telegram

**Pre-requisito:** Configurar credenciales de Telegram

#### Obtener Bot Token:
1. Buscar @BotFather en Telegram
2. Enviar `/newbot`
3. Seguir instrucciones
4. Copiar el token

#### Obtener Chat ID:
```bash
# 1. Enviar mensaje al bot
# 2. Visitar (reemplazar TOKEN):
https://api.telegram.org/bot<TOKEN>/getUpdates

# 3. Buscar "chat":{"id":123456}
```

#### Configurar en n8n:
1. n8n → Settings → Credentials
2. "+ Add Credential" → Telegram API
3. Pegar Bot Token
4. Guardar

**Configuración del nodo:**

```
Credential to connect with: [Seleccionar la credencial creada]

Resource: Message
Operation: Send Message

Chat ID: TU_CHAT_ID (número obtenido antes)

Text: 
📚 {{ $json.mensaje_ia }}

---
👤 Usuario: {{ $json.usuario }}
🔖 Evento: {{ $json.evento_original }}
```

**Opcional - Formato Markdown:**
```
Additional Fields:
  - Parse Mode: Markdown
```

### 8. Nodo 7: Respond to Webhook

**Agregar nodo:**
- Click en "+" → Action → Respond to Webhook

**Configuración:**

```
Response Body:
{
  "success": true,
  "message": "Notificación enviada a Telegram",
  "evento": "{{ $('Transformar Datos').item.json.evento_tipo }}",
  "timestamp": "{{ $now.toISO() }}"
}

Response Code: 200
```

### 9. Manejo de Errores (Opcional pero Recomendado)

**Agregar nodo desde IF (rama "false"):**
- Click en "+" → Action → Respond to Webhook

**Configuración:**
```
Response Body:
{
  "success": false,
  "message": "Evento no soportado",
  "evento_recibido": "{{ $json.evento }}"
}

Response Code: 400
```

## 🧪 Testing

### Test 1: Probar desde n8n

1. Click en "Execute Workflow"
2. En nodo "Webhook", click "Listen for Test Event"
3. Enviar request de prueba:

```bash
curl -X POST http://localhost:5678/webhook/prestamos \
  -H "Content-Type: application/json" \
  -d '{
    "evento": "prestamo.creado",
    "timestamp": "2026-01-11T10:00:00Z",
    "data": {
      "id": 1,
      "usuarioNombre": "Juan Pérez",
      "libroTitulo": "1984",
      "fechaDevolucion": "2026-01-18T10:00:00Z",
      "diasRestantes": 7,
      "estado": "activo"
    }
  }'
```

### Test 2: Integración con Backend

1. Asegurar que el backend esté corriendo
2. Actualizar `.env` del backend:
```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/prestamos
```

3. Crear préstamo:
```bash
curl -X POST http://localhost:3002/prestamos \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "U001",
    "usuarioNombre": "María García",
    "libroId": 101,
    "libroTitulo": "Cien Años de Soledad",
    "diasPrestamo": 14
  }'
```

4. ✅ Deberías recibir notificación en Telegram

## 📊 Ejemplo de Salida

### Telegram - Préstamo Creado
```
📚 ¡Hola María! Tu préstamo de "Cien Años de Soledad" está confirmado. 
Tienes 14 días para disfrutarlo. ¡Feliz lectura! 📖✨

---
👤 Usuario: María García
🔖 Evento: prestamo.creado
```

### Telegram - Libro Devuelto
```
📚 Gracias por devolver "Cien Años de Soledad", María. 
¡Esperamos verte pronto en la biblioteca! 🎉

---
👤 Usuario: María García
🔖 Evento: libro.devuelto
```

### Telegram - Préstamo Vencido
```
⚠️ URGENTE: María, el préstamo de "Cien Años de Soledad" está vencido. 
Por favor devuélvelo lo antes posible. 🚨

---
👤 Usuario: María García
🔖 Evento: prestamo.vencido
```

## 🐛 Troubleshooting

### No recibo notificaciones

1. **Verificar workflow activado:**
   - Toggle debe estar en ON (verde)

2. **Verificar URL webhook:**
   ```bash
   # En backend .env
   N8N_WEBHOOK_URL=http://localhost:5678/webhook/prestamos
   ```

3. **Verificar Bot Token:**
   - Settings → Credentials → Telegram API
   - Probar token manualmente:
   ```bash
   curl https://api.telegram.org/bot<TOKEN>/getMe
   ```

4. **Verificar Chat ID:**
   - Enviar mensaje al bot
   - Obtener actualizaciones y confirmar ID

### Gemini no responde

1. **Verificar API Key:**
   - Debe ser válida en https://aistudio.google.com
   
2. **Verificar quota:**
   - Revisar límites de uso gratuito

3. **Probar API manualmente:**
   ```bash
   curl -X POST \
     'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=TU_KEY' \
     -H 'Content-Type: application/json' \
     -d '{"contents":[{"parts":[{"text":"Hola"}]}]}'
   ```

### Errores en ejecución

1. Ver logs en n8n:
   - Executions → Click en ejecución fallida
   - Revisar nodo con error rojo
   
2. Verificar datos de entrada:
   - Click en nodo con error
   - Ver tab "Input"
   
3. Probar nodo individual:
   - Click derecho en nodo → "Execute Node"

## 💡 Mejoras Opcionales

### 1. Agregar Más Eventos
Duplicar la rama del IF para eventos como:
- `prestamo.renovado`
- `prestamo.cancelado`
- `multa.aplicada`

### 2. Personalizar por Criticidad
```javascript
// En nodo Set antes de Gemini
Values to Set:
  - Name: urgencia
    Value: {{ $json.evento === 'prestamo.vencido' ? 'URGENTE' : 'INFO' }}
```

### 3. Agregar Botones Interactivos
```javascript
// En nodo Telegram
Reply Markup:
{
  "inline_keyboard": [[
    {"text": "✅ Renovar", "callback_data": "renovar_{{ $json.prestamo_id }}"},
    {"text": "📞 Contactar", "callback_data": "contacto"}
  ]]
}
```

### 4. Rate Limiting
Agregar nodo "Wait" para evitar spam:
```
Wait: 2 seconds between messages
```

## 📚 Referencias

- [n8n Webhook Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [n8n Telegram Node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.telegram/)
- [Gemini API Docs](https://ai.google.dev/tutorials/rest_quickstart)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

✅ **Workflow completado!** Ahora deberías recibir notificaciones en Telegram cada vez que ocurra un evento en el sistema.
