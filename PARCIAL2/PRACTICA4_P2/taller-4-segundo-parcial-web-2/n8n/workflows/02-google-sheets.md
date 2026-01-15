# Workflow 2: Sincronización con Google Sheets

## 🎯 Objetivo
Registrar automáticamente todos los eventos del sistema en una hoja de cálculo de Google Sheets para análisis y auditoría.

## 📊 Diagrama de Flujo

```
┌─────────────┐
│   Backend   │
│  (NestJS)   │
└──────┬──────┘
       │ HTTP POST
       ▼
┌──────────────────────────────────────────┐
│          Workflow n8n                     │
│                                           │
│  ┌──────────┐    ┌──────────────┐       │
│  │ Webhook  │───▶│ Transformar  │       │
│  │ Trigger  │    │    Datos     │       │
│  └──────────┘    └──────┬───────┘       │
│                           │               │
│                           ▼               │
│                  ┌─────────────────┐     │
│                  │ Google Sheets   │     │
│                  │    Append       │     │
│                  └────────┬────────┘     │
│                           │               │
│                           ▼               │
│                  ┌─────────────────┐     │
│                  │    Response     │     │
│                  └─────────────────┘     │
└──────────────────────────────────────────┘
```

## 🔧 Configuración Paso a Paso

### Pre-requisitos

#### 1. Crear Google Sheet

1. Ir a https://sheets.google.com
2. Crear nueva hoja: "Registro de Eventos - Biblioteca"
3. Configurar encabezados en la primera fila:

| Fecha/Hora | Tipo Evento | ID Registro | Usuario | Libro/Recurso | Estado | Metadata | Origen |
|------------|-------------|-------------|---------|---------------|--------|----------|--------|

#### 2. Obtener ID de la hoja

De la URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

Ejemplo:
```
URL: https://docs.google.com/spreadsheets/d/1ABC123XYZ789/edit
SHEET_ID: 1ABC123XYZ789
```

#### 3. Configurar Google Sheets API en n8n

1. Ir a https://console.cloud.google.com
2. Crear proyecto nuevo (o usar existente)
3. Habilitar "Google Sheets API"
4. Crear credenciales OAuth 2.0:
   - Tipo: Web application
   - Authorized redirect URIs: `http://localhost:5678/rest/oauth2-credential/callback`

5. Copiar Client ID y Client Secret

6. En n8n:
   - Settings → Credentials → "+ Add Credential"
   - Buscar "Google Sheets OAuth2 API"
   - Pegar Client ID y Client Secret
   - Click "Sign in with Google"
   - Autorizar permisos
   - Guardar

### Construcción del Workflow

### 1. Crear Nuevo Workflow

1. Acceder a http://localhost:5678
2. "+ Add workflow"
3. Nombrar: "02 - Sincronización Google Sheets"
4. Guardar

### 2. Nodo 1: Webhook Trigger

**Agregar nodo:**
- Click en "+" → Trigger → Webhook

**Configuración:**
```
Webhook Path: prestamos-sheets
Authentication: None
Method: POST
Response Mode: Last Node
```

**URL resultante:** `http://localhost:5678/webhook/prestamos-sheets`

### 3. Nodo 2: Set - Formatear Datos

**Agregar nodo:**
- Click en "+" → Data transformation → Set

**Configuración:**

```javascript
Keep Only Set: false

Values to Set:

1. Name: fecha_hora
   Value: {{ $json.timestamp ? new Date($json.timestamp).toLocaleString('es-EC', {timeZone: 'America/Guayaquil'}) : new Date().toLocaleString('es-EC', {timeZone: 'America/Guayaquil'}) }}

2. Name: tipo_evento
   Value: {{ $json.evento }}

3. Name: id_registro
   Value: {{ $json.data.id || 'N/A' }}

4. Name: usuario
   Value: {{ $json.data.usuarioNombre || $json.metadata?.usuario || 'Sistema' }}

5. Name: libro_recurso
   Value: {{ $json.data.libroTitulo || $json.data.titulo || 'N/A' }}

6. Name: estado
   Value: {{ $json.data.estado || 'N/A' }}

7. Name: metadata_json
   Value: {{ JSON.stringify($json.metadata || {}) }}

8. Name: origen
   Value: {{ $json.metadata?.origen || 'backend-nestjs' }}
```

### 4. Nodo 3: Google Sheets - Append Row

**Agregar nodo:**
- Click en "+" → Action → Google Sheets

**Configuración:**

```
Credential to connect with: [Seleccionar credencial OAuth2 creada]

Resource: Sheet
Operation: Append

Document:
  - By: ID
  - Document ID: TU_SHEET_ID (del paso pre-requisitos)

Sheet Name: Sheet1 (o el nombre de tu hoja)

Data to Append:
  - Data Mode: Define Below for Each Column
  
Columns:
  Column 1:
    - Name: Fecha/Hora
    - Value: {{ $json.fecha_hora }}
    
  Column 2:
    - Name: Tipo Evento
    - Value: {{ $json.tipo_evento }}
    
  Column 3:
    - Name: ID Registro
    - Value: {{ $json.id_registro }}
    
  Column 4:
    - Name: Usuario
    - Value: {{ $json.usuario }}
    
  Column 5:
    - Name: Libro/Recurso
    - Value: {{ $json.libro_recurso }}
    
  Column 6:
    - Name: Estado
    - Value: {{ $json.estado }}
    
  Column 7:
    - Name: Metadata
    - Value: {{ $json.metadata_json }}
    
  Column 8:
    - Name: Origen
    - Value: {{ $json.origen }}

Options:
  - Data Start Row: 2 (para empezar debajo de encabezados)
```

### 5. Nodo 4: Respond to Webhook

**Agregar nodo:**
- Click en "+" → Action → Respond to Webhook

**Configuración:**

```javascript
Response Body:
{
  "success": true,
  "message": "Evento registrado en Google Sheets",
  "evento": "{{ $('Formatear Datos').item.json.tipo_evento }}",
  "sheet_url": "https://docs.google.com/spreadsheets/d/TU_SHEET_ID/edit",
  "timestamp": "{{ $now.toISO() }}"
}

Response Code: 200
```

## 🔄 Configurar Backend

Actualizar el servicio webhook emitter para enviar a ambos workflows:

### Opción 1: Múltiples URLs (Recomendado)

**backend/.env:**
```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/prestamos
N8N_SHEETS_WEBHOOK_URL=http://localhost:5678/webhook/prestamos-sheets
```

**webhook-emitter.service.ts:**
```typescript
export class WebhookEmitterService {
  private readonly n8nWebhookUrl: string;
  private readonly n8nSheetsUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.n8nWebhookUrl = this.configService.get<string>('N8N_WEBHOOK_URL');
    this.n8nSheetsUrl = this.configService.get<string>('N8N_SHEETS_WEBHOOK_URL');
  }

  async emit(evento: string, payload: any, metadata?: any): Promise<void> {
    const webhookPayload = {
      evento,
      timestamp: new Date(),
      data: payload,
      metadata: { ...metadata, origen: 'backend-nestjs' },
    };

    // Enviar a ambos workflows
    const promises = [
      this.sendToWebhook(this.n8nWebhookUrl, webhookPayload),
      this.sendToWebhook(this.n8nSheetsUrl, webhookPayload),
    ];

    await Promise.allSettled(promises);
  }

  private async sendToWebhook(url: string, payload: any): Promise<void> {
    if (!url) return;
    
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      this.logger.error(`Error enviando a ${url}: ${error.message}`);
    }
  }
}
```

### Opción 2: Workflow Único con Split

Crear un workflow maestro que distribuya a otros workflows (avanzado).

## 🧪 Testing

### Test 1: Probar desde n8n

1. Abrir workflow "02 - Sincronización Google Sheets"
2. Click "Execute Workflow"
3. En nodo Webhook, click "Listen for Test Event"
4. Enviar request:

```bash
curl -X POST http://localhost:5678/webhook/prestamos-sheets \
  -H "Content-Type: application/json" \
  -d '{
    "evento": "prestamo.creado",
    "timestamp": "2026-01-11T15:30:00Z",
    "data": {
      "id": 1,
      "usuarioNombre": "Juan Pérez",
      "libroTitulo": "1984 de George Orwell",
      "estado": "activo"
    },
    "metadata": {
      "origen": "test-manual",
      "usuario": "Juan Pérez"
    }
  }'
```

5. ✅ Verificar que se agregó fila en Google Sheets

### Test 2: Integración con Backend

```bash
# Crear préstamo
curl -X POST http://localhost:3002/prestamos \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "U002",
    "usuarioNombre": "Ana Martínez",
    "libroId": 202,
    "libroTitulo": "El Principito",
    "diasPrestamo": 10
  }'

# Verificar en Google Sheets
# Debe aparecer nueva fila con el evento
```

### Test 3: Eventos Múltiples

```bash
# Script para generar varios eventos
for i in {1..5}; do
  curl -X POST http://localhost:3002/prestamos \
    -H "Content-Type: application/json" \
    -d "{
      \"usuarioId\": \"U00$i\",
      \"usuarioNombre\": \"Usuario $i\",
      \"libroId\": $((100 + i)),
      \"libroTitulo\": \"Libro Test $i\",
      \"diasPrestamo\": 7
    }"
  sleep 1
done
```

## 📊 Ejemplo de Datos en Sheet

| Fecha/Hora | Tipo Evento | ID Registro | Usuario | Libro/Recurso | Estado | Metadata | Origen |
|------------|-------------|-------------|---------|---------------|--------|----------|--------|
| 11/01/2026 15:30 | prestamo.creado | 1 | Juan Pérez | 1984 | activo | {"usuario":"Juan Pérez",...} | backend-nestjs |
| 11/01/2026 15:35 | libro.devuelto | 1 | Juan Pérez | 1984 | devuelto | {"usuario":"Juan Pérez"} | backend-nestjs |
| 11/01/2026 16:00 | prestamo.vencido | 2 | Ana García | El Aleph | vencido | {"diasRetraso":3} | backend-nestjs |

## 📈 Análisis de Datos

### Usar Fórmulas de Google Sheets

#### Contar eventos por tipo:
```excel
=COUNTIF(B:B, "prestamo.creado")
```

#### Últimos 10 eventos:
```excel
=QUERY(A2:H, "SELECT * ORDER BY A DESC LIMIT 10")
```

#### Eventos de hoy:
```excel
=QUERY(A2:H, "SELECT * WHERE A >= date '"&TEXT(TODAY(),"yyyy-mm-dd")&"'")
```

#### Usuarios más activos:
```excel
=QUERY(A2:H, "SELECT D, COUNT(D) GROUP BY D ORDER BY COUNT(D) DESC")
```

## 📊 Crear Dashboard

### Agregar Gráficos

1. **Gráfico de Líneas - Eventos por Día**
   - Seleccionar columnas A y B
   - Insertar → Gráfico → Líneas

2. **Gráfico de Pastel - Distribución de Eventos**
   - Usar COUNTIF para cada tipo
   - Insertar → Gráfico → Circular

3. **Tabla Dinámica - Análisis por Usuario**
   - Datos → Tabla dinámica
   - Filas: Usuario
   - Valores: COUNT de eventos

## 🐛 Troubleshooting

### No se agregan filas

1. **Verificar credenciales:**
   - Settings → Credentials → Google Sheets OAuth2
   - Reconectar si es necesario

2. **Verificar permisos de Sheet:**
   - El usuario OAuth debe tener permisos de edición
   - Compartir hoja con el email de OAuth

3. **Verificar nombre de hoja:**
   - En nodo Google Sheets
   - "Sheet Name" debe coincidir exactamente

4. **Verificar formato de datos:**
   - Los headers deben estar en la fila 1
   - Los datos se agregan desde la fila especificada

### Errores de formato

**Error: "Unable to parse range"**
```
Solución: Verificar que "Data Start Row" sea 2 o mayor
```

**Error: "The caller does not have permission"**
```
Solución: 
1. Verificar credenciales OAuth2
2. Re-autorizar permisos
3. Compartir Sheet con cuenta OAuth
```

### Datos duplicados

```typescript
// Agregar verificación en backend (opcional)
async emit(evento: string, payload: any): Promise<void> {
  const uniqueId = `${evento}-${payload.id}-${Date.now()}`;
  // Almacenar uniqueId para deduplicación
}
```

## 💡 Mejoras Opcionales

### 1. Agregar Validación de Datos

En Google Sheets:
- Datos → Validación de datos
- Configurar reglas para cada columna

### 2. Formateo Condicional

Resaltar eventos críticos:
```
Regla: Si "Tipo Evento" contiene "vencido"
Formato: Fondo rojo
```

### 3. Notificaciones de Sheet

Google Sheets → Herramientas → Reglas de notificación:
- Notificar cuando se agregue fila
- Enviar a email del administrador

### 4. Backup Automático

Crear script de Apps Script:
```javascript
function backupDaily() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Sheet1');
  
  // Crear copia
  ss.copy('Backup - ' + new Date().toISOString());
}

// Configurar trigger diario
```

### 5. Agregar Timestamps Adicionales

```javascript
// En nodo Set
Values to Set:
  - Name: fecha_creacion_sheet
    Value: {{ $now.toISO() }}
```

## 📚 Referencias

- [Google Sheets API](https://developers.google.com/sheets/api)
- [n8n Google Sheets Node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/)
- [OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [Google Sheets Functions](https://support.google.com/docs/table/25273)

## 📤 Exportar Datos

### CSV Export
```
Archivo → Descargar → CSV
```

### Automatizar Export con n8n
Agregar workflow que exporte CSV periódicamente:
```
Schedule Trigger → Google Sheets Read → Email (CSV adjunto)
```

---

✅ **Workflow completado!** Todos los eventos ahora se registran automáticamente en Google Sheets para análisis y auditoría.

**Próximo paso:** [Workflow 3 - Alertas Críticas](./03-alertas-criticas.md)
