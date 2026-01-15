# Workflow 3: Alertas Críticas Inteligentes

## 🎯 Objetivo
Detectar eventos críticos, analizarlos con IA y enviar alertas multi-canal según la severidad y contexto.

## 📊 Diagrama de Flujo

```
┌─────────────┐
│   Backend   │
│  (NestJS)   │
└──────┬──────┘
       │ HTTP POST
       ▼
┌───────────────────────────────────────────────────────────┐
│                  Workflow n8n                             │
│                                                           │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐      │
│  │ Webhook  │───▶│   IF     │───▶│ Transformar  │      │
│  │ Trigger  │    │¿Crítico? │    │    Datos     │      │
│  └──────────┘    └────┬─────┘    └──────┬───────┘      │
│                       │ false             │              │
│                       │                   ▼              │
│                       │          ┌─────────────────┐    │
│                       │          │  Gemini API     │    │
│                       │          │ (Análisis IA)   │    │
│                       │          └────────┬────────┘    │
│                       │                   │              │
│                       │                   ▼              │
│                       │          ┌─────────────────┐    │
│                       │          │    Switch       │    │
│                       │          │ (Determinar     │    │
│                       │          │   Canal)        │    │
│                       │          └────┬───┬───┬────┘    │
│                       │               │   │   │          │
│                       │          ┌────┘   │   └────┐    │
│                       │          ▼        ▼        ▼    │
│                       │      ┌────┐  ┌────┐  ┌────┐   │
│                       │      │Tele│  │Email│  │ Log│   │
│                       │      │gram│  │     │  │    │   │
│                       │      └────┘  └────┘  └────┘   │
│                       │          │        │        │     │
│                       │          └────┬───┴────┬───┘    │
│                       │               ▼        │         │
│                       │          ┌─────────────┘        │
│                       │          │                      │
│                       │          ▼                      │
│                       │     ┌─────────┐                │
│                       └────▶│Response │                │
│                             └─────────┘                │
└───────────────────────────────────────────────────────────┘
```

## 🚨 Niveles de Criticidad

| Nivel | Condición | Canal | Ejemplo |
|-------|-----------|-------|---------|
| 🔴 CRÍTICO | prestamo.vencido | Telegram + Email | Préstamo vencido hace 5+ días |
| 🟠 ALTO | metadata.critico = true | Telegram | Stock muy bajo |
| 🟡 MEDIO | Condiciones específicas | Email | Múltiples préstamos mismo usuario |
| 🟢 INFO | Resto de eventos | Log | Eventos normales |

## 🔧 Configuración Paso a Paso

### 1. Crear Nuevo Workflow

1. n8n → "+ Add workflow"
2. Nombre: "03 - Alertas Críticas"
3. Guardar

### 2. Nodo 1: Webhook Trigger

**Agregar:**
- Click "+" → Trigger → Webhook

**Configuración:**
```
Webhook Path: alertas-criticas
Authentication: None
Method: POST
Response Mode: Last Node
```

**URL:** `http://localhost:5678/webhook/alertas-criticas`

### 3. Nodo 2: IF - Evaluar Criticidad

**Agregar:**
- Click "+" → Logic → IF

**Configuración:**

```javascript
Conditions (Mode: ANY - OR):

1. Condition 1 - Evento Vencido:
   Field: {{ $json.evento }}
   Operation: Equal
   Value: prestamo.vencido

2. Condition 2 - Metadata Crítico:
   Field: {{ $json.metadata?.critico }}
   Operation: Equal
   Value: true

3. Condition 3 - Días Retraso:
   Field: {{ $json.metadata?.diasRetraso }}
   Operation: Larger
   Value: 3
```

### 4. Nodo 3: Set - Transformar para Análisis

**Conectar desde:** IF (rama "true")

**Configuración:**

```javascript
Keep Only Set: false

Values to Set:

1. Name: evento_tipo
   Value: {{ $json.evento }}

2. Name: severidad
   Value: {{ 
     $json.evento === 'prestamo.vencido' ? 'CRÍTICO' :
     $json.metadata?.critico ? 'ALTO' :
     'MEDIO'
   }}

3. Name: usuario
   Value: {{ $json.data?.usuarioNombre || 'Desconocido' }}

4. Name: recurso
   Value: {{ $json.data?.libroTitulo || 'N/A' }}

5. Name: id_registro
   Value: {{ $json.data?.id }}

6. Name: dias_retraso
   Value: {{ $json.metadata?.diasRetraso || 0 }}

7. Name: contexto_completo
   Value: {{ JSON.stringify($json) }}

8. Name: timestamp
   Value: {{ $json.timestamp || new Date().toISOString() }}
```

### 5. Nodo 4: HTTP Request - Gemini (Análisis IA)

**Agregar:**
- Click "+" → Action → HTTP Request

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
      "text": "Analiza esta alerta crítica del sistema de biblioteca y genera:\n1. Un mensaje de alerta conciso (máx 150 caracteres)\n2. Acción recomendada\n3. Nivel de urgencia (1-5)\n\nEvento: {{ $json.evento_tipo }}\nSeveridad: {{ $json.severidad }}\nUsuario: {{ $json.usuario }}\nRecurso: {{ $json.recurso }}\nDías de retraso: {{ $json.dias_retraso }}\n\nRespuesta en formato JSON:\n{\n  \"mensaje\": \"texto del mensaje\",\n  \"accion\": \"acción recomendada\",\n  \"urgencia\": 1-5,\n  \"canal_sugerido\": \"telegram|email|log\"\n}"
    }]
  }]
}
```

**Query Parameters:**
- Name: `key`
- Value: `TU_GEMINI_API_KEY`

### 6. Nodo 5: Code - Procesar Respuesta Gemini

**Agregar:**
- Click "+" → Data transformation → Code

**Configuración:**

```javascript
// Mode: Run Once for All Items

const items = $input.all();
const outputs = [];

for (const item of items) {
  try {
    // Extraer respuesta de Gemini
    const geminiText = item.json.candidates[0].content.parts[0].text;
    
    // Intentar parsear JSON
    let analisis;
    try {
      // Buscar JSON en la respuesta
      const jsonMatch = geminiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analisis = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback si no hay JSON
        analisis = {
          mensaje: geminiText.substring(0, 150),
          accion: "Revisar manualmente",
          urgencia: 3,
          canal_sugerido: "telegram"
        };
      }
    } catch (parseError) {
      // Fallback
      analisis = {
        mensaje: "Alerta crítica detectada - Requiere atención inmediata",
        accion: "Contactar al usuario",
        urgencia: 4,
        canal_sugerido: "telegram"
      };
    }
    
    // Combinar con datos originales
    const transformadoItem = $('Transformar para Análisis').item.json;
    
    outputs.push({
      json: {
        ...transformadoItem,
        analisis_ia: analisis,
        mensaje_alerta: analisis.mensaje,
        accion_recomendada: analisis.accion,
        urgencia: analisis.urgencia,
        canal: analisis.canal_sugerido
      }
    });
    
  } catch (error) {
    // En caso de error, crear alerta genérica
    outputs.push({
      json: {
        ...item.json,
        mensaje_alerta: "Error procesando alerta - Revisar sistema",
        canal: "log",
        urgencia: 5
      }
    });
  }
}

return outputs;
```

### 7. Nodo 6: Switch - Determinar Canal

**Agregar:**
- Click "+" → Logic → Switch

**Configuración:**

```
Mode: Expression

Value: {{ $json.canal || 'log' }}

Routing Rules:

  Output 0 - Telegram:
    Value: telegram
    
  Output 1 - Email:
    Value: email
    
  Output 2 - Log:
    Value: log
    
Fallback Output: 2 (Log)
```

### 8A. Nodo 7A: Telegram (Canal Crítico)

**Conectar desde:** Switch Output 0

**Configuración:**

```
Credential: [Tu credencial Telegram]

Resource: Message
Operation: Send Message

Chat ID: TU_CHAT_ID

Text:
🚨 *ALERTA CRÍTICA*

{{ $json.mensaje_alerta }}

📋 *Detalles:*
• Usuario: {{ $json.usuario }}
• Recurso: {{ $json.recurso }}
• Evento: {{ $json.evento_tipo }}
• Urgencia: {{ '⭐'.repeat($json.urgencia) }} ({{ $json.urgencia }}/5)

⚡ *Acción Recomendada:*
{{ $json.accion_recomendada }}

🕐 Timestamp: {{ $json.timestamp }}
🆔 ID: {{ $json.id_registro }}

Additional Fields:
  - Parse Mode: Markdown
```

### 8B. Nodo 7B: Email (Canal Alto)

**Conectar desde:** Switch Output 1

**Agregar:**
- Click "+" → Action → Email (Send)

**Pre-requisito:** Configurar credenciales SMTP

**Configuración:**

```
Credential: [SMTP credential]

From Email: alertas@biblioteca.com
To Email: admin@biblioteca.com

Subject: [ALERTA] {{ $json.evento_tipo }} - {{ $json.usuario }}

Email Type: HTML

HTML:
```

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .header { background: #ff6b6b; color: white; padding: 20px; }
    .content { padding: 20px; }
    .detail { margin: 10px 0; }
    .footer { background: #f1f1f1; padding: 10px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>⚠️ Alerta del Sistema de Biblioteca</h2>
  </div>
  <div class="content">
    <p><strong>{{ $json.mensaje_alerta }}</strong></p>
    
    <div class="detail">
      <strong>Usuario:</strong> {{ $json.usuario }}<br>
      <strong>Recurso:</strong> {{ $json.recurso }}<br>
      <strong>Evento:</strong> {{ $json.evento_tipo }}<br>
      <strong>Severidad:</strong> {{ $json.severidad }}<br>
      <strong>Urgencia:</strong> {{ $json.urgencia }}/5
    </div>
    
    <div class="detail">
      <strong>Acción Recomendada:</strong><br>
      {{ $json.accion_recomendada }}
    </div>
    
    <div class="detail">
      <strong>Timestamp:</strong> {{ $json.timestamp }}<br>
      <strong>ID Registro:</strong> {{ $json.id_registro }}
    </div>
  </div>
  <div class="footer">
    Sistema de Alertas Automáticas - Biblioteca ULEAM
  </div>
</body>
</html>
```

### 8C. Nodo 7C: Function (Log)

**Conectar desde:** Switch Output 2

**Agregar:**
- Click "+" → Data transformation → Code

**Configuración:**

```javascript
// Registrar en consola de n8n
console.log('=== ALERTA REGISTRADA ===');
console.log('Evento:', $json.evento_tipo);
console.log('Usuario:', $json.usuario);
console.log('Mensaje:', $json.mensaje_alerta);
console.log('Urgencia:', $json.urgencia);
console.log('========================');

return {
  json: {
    logged: true,
    message: 'Alerta registrada en logs',
    ...item.json
  }
};
```

### 9. Nodo 8: Merge - Unificar Canales

**Agregar:**
- Click "+" → Data transformation → Merge

**Configuración:**

```
Mode: Append
Input 1: Telegram (Output 0)
Input 2: Email (Output 1)
Input 3: Log (Output 2)
```

### 10. Nodo 9: Respond to Webhook

**Agregar:**
- Click "+" → Action → Respond to Webhook

**Configuración:**

```javascript
Response Body:
{
  "success": true,
  "message": "Alerta procesada",
  "evento": "{{ $('Transformar para Análisis').item.json.evento_tipo }}",
  "severidad": "{{ $('Transformar para Análisis').item.json.severidad }}",
  "canal_utilizado": "{{ $json.canal || 'log' }}",
  "urgencia": {{ $json.urgencia || 0 }},
  "timestamp": "{{ $now.toISO() }}"
}

Response Code: 200
```

### 11. Nodo 10: Respond (Rama False de IF)

**Conectar desde:** IF (rama "false")

**Configuración:**

```javascript
Response Body:
{
  "success": true,
  "message": "Evento no requiere alerta",
  "evento": "{{ $json.evento }}",
  "nivel": "INFO"
}

Response Code: 200
```

## 🧪 Testing

### Test 1: Alerta Crítica (Vencido)

```bash
curl -X POST http://localhost:5678/webhook/alertas-criticas \
  -H "Content-Type: application/json" \
  -d '{
    "evento": "prestamo.vencido",
    "timestamp": "2026-01-11T10:00:00Z",
    "data": {
      "id": 123,
      "usuarioNombre": "Carlos Ramírez",
      "libroTitulo": "Don Quijote de la Mancha",
      "estado": "vencido"
    },
    "metadata": {
      "origen": "backend-nestjs",
      "usuario": "Carlos Ramírez",
      "diasRetraso": 5,
      "critico": true
    }
  }'
```

**Resultado esperado:** Notificación en Telegram

### Test 2: Alerta Alta (Metadata crítico)

```bash
curl -X POST http://localhost:5678/webhook/alertas-criticas \
  -H "Content-Type: application/json" \
  -d '{
    "evento": "stock.bajo",
    "timestamp": "2026-01-11T11:00:00Z",
    "data": {
      "id": 456,
      "recurso": "Copias de El Aleph",
      "cantidad": 1
    },
    "metadata": {
      "origen": "inventario",
      "critico": true
    }
  }'
```

**Resultado esperado:** Email de alerta

### Test 3: Evento Normal (No crítico)

```bash
curl -X POST http://localhost:5678/webhook/alertas-criticas \
  -H "Content-Type: application/json" \
  -d '{
    "evento": "prestamo.creado",
    "timestamp": "2026-01-11T12:00:00Z",
    "data": {
      "id": 789,
      "usuarioNombre": "María López",
      "libroTitulo": "Cien Años de Soledad"
    }
  }'
```

**Resultado esperado:** Solo log, sin alertas

## 📊 Monitoreo de Alertas

### Crear Dashboard de Alertas

1. **En Google Sheets** (del Workflow 2):
   - Filtrar eventos críticos
   - Crear gráfico de alertas por día

2. **En n8n**:
   - Executions → Filter by "03 - Alertas Críticas"
   - Ver tasa de éxito

### Métricas Clave

```
- Total alertas generadas
- Alertas por canal (Telegram vs Email vs Log)
- Tiempo promedio de procesamiento
- Tasa de urgencia (promedio)
```

## 🐛 Troubleshooting

### Gemini no analiza correctamente

```javascript
// En nodo Code, agregar validación robusta
if (!geminiText || geminiText.length < 10) {
  throw new Error('Respuesta de Gemini inválida');
}
```

### Switch no enruta correctamente

Verificar expresión:
```javascript
// Debe ser exactamente:
{{ $json.canal }}

// No:
{{ $json.canal_sugerido }}
```

### Email no se envía

1. Verificar credenciales SMTP
2. Probar con servicio conocido (Gmail, SendGrid)
3. Revisar logs de ejecución

## 💡 Mejoras Avanzadas

### 1. Rate Limiting para Alertas

```javascript
// Nodo Code antes de Switch
const lastAlert = $('nombre_key_value_store').get('last_alert_time');
const now = Date.now();

if (lastAlert && (now - lastAlert) < 60000) { // 1 minuto
  return { json: { ...item.json, canal: 'log' } }; // Downgrade a log
}

$('nombre_key_value_store').set('last_alert_time', now);
return item;
```

### 2. Escalado de Alertas

```javascript
// Si urgencia > 4, enviar a múltiples canales
if ($json.urgencia >= 4) {
  // Enviar a Telegram Y Email
}
```

### 3. Historial de Alertas

Agregar nodo que guarde en base de datos:
```
Switch → Postgres (Insert)
```

### 4. Integración con PagerDuty

Para alertas críticas en producción:
```
Switch → HTTP Request → PagerDuty API
```

### 5. Agregar Webhooks de Respuesta

Permitir que usuarios respondan a alertas:
```
Telegram → Inline Buttons → Webhook Callback
```

## 📚 Referencias

- [n8n Switch Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch/)
- [n8n Code Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/)
- [n8n Email Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.emailsend/)
- [Gemini Safety Settings](https://ai.google.dev/docs/safety_setting_gemini)

---

## ✅ Checklist de Validación

- [ ] Workflow activado
- [ ] Gemini API key configurada
- [ ] Telegram bot configurado
- [ ] SMTP/Email configurado (opcional)
- [ ] Test con evento crítico exitoso
- [ ] Test con evento normal exitoso
- [ ] Logs verificados
- [ ] Switch enrutando correctamente
- [ ] Mensajes legibles y formatados
- [ ] Tiempos de respuesta aceptables

---

✅ **Workflow completado!** El sistema ahora detecta automáticamente eventos críticos y envía alertas inteligentes por el canal apropiado.

**Felicidades, has completado los 3 workflows obligatorios del Taller 4! 🎉**
