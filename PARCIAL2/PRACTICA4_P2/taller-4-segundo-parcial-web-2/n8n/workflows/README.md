# Guía de Workflows de n8n

Esta carpeta contiene las plantillas y configuraciones de los 3 workflows obligatorios del Taller 4.

## 📁 Estructura

```
workflows/
├── README.md (este archivo)
├── 01-notificacion-telegram.md
├── 02-google-sheets.md
├── 03-alertas-criticas.md
└── plantillas/
    ├── telegram-template.json
    ├── sheets-template.json
    └── alertas-template.json
```

## 🎯 Workflows Obligatorios

### 1. Notificación en Tiempo Real (Telegram + IA)

**Descripción:** Recibe eventos del backend y envía notificaciones personalizadas a Telegram usando IA.

**Nodos requeridos:**
- Webhook Trigger
- IF (para evaluar tipo de evento)
- Set (transformar datos)
- HTTP Request (a Gemini API)
- Telegram
- Respond to Webhook

**Eventos soportados:**
- `prestamo.creado`
- `libro.devuelto`
- `prestamo.vencido`

**Ver guía completa:** [01-notificacion-telegram.md](./01-notificacion-telegram.md)

---

### 2. Sincronización con Google Sheets

**Descripción:** Registra automáticamente todos los eventos en una hoja de cálculo de Google Sheets.

**Nodos requeridos:**
- Webhook Trigger
- Set (formatear datos)
- Google Sheets (Append)
- Respond to Webhook

**Columnas en Sheets:**
- Fecha/Hora
- Tipo de Evento
- ID Registro
- Usuario
- Libro/Recurso
- Estado
- Metadata JSON

**Ver guía completa:** [02-google-sheets.md](./02-google-sheets.md)

---

### 3. Alertas Críticas Inteligentes

**Descripción:** Evalúa eventos críticos, usa IA para analizar contexto y envía alertas multi-canal.

**Nodos requeridos:**
- Webhook Trigger
- IF (evaluar criticidad)
- HTTP Request (Gemini para análisis)
- Switch (determinar canal)
- Telegram / Email / Log
- Respond to Webhook

**Eventos críticos:**
- `prestamo.vencido`
- Cualquier evento con metadata `critico: true`

**Ver guía completa:** [03-alertas-criticas.md](./03-alertas-criticas.md)

---

## 🚀 Cómo Importar

### Opción 1: Crear desde n8n UI (Recomendado)

1. Acceder a http://localhost:5678
2. Click en "Add workflow"
3. Seguir la guía paso a paso de cada workflow
4. Guardar y activar

### Opción 2: Importar JSON (Avanzado)

Si tienes el JSON exportado:

1. n8n → Workflows → Import from File
2. Seleccionar archivo JSON
3. Configurar credenciales
4. Activar workflow

---

## 🔧 Configuración Común

### Todas las credenciales se configuran en n8n UI:

#### Telegram Bot
```
Settings → Credentials → Add Credential → Telegram API
```

#### Google Sheets
```
Settings → Credentials → Add Credential → Google Sheets OAuth2 API
```

#### Gemini API (HTTP Request)
```
No necesita credencial en n8n, se usa API Key en headers
```

---

## 📝 Payload de Ejemplo

Todos los workflows reciben este formato desde el backend:

```json
{
  "evento": "prestamo.creado",
  "timestamp": "2026-01-11T10:30:00Z",
  "data": {
    "id": 1,
    "usuarioId": "U001",
    "usuarioNombre": "Juan Pérez",
    "libroId": 101,
    "libroTitulo": "1984",
    "fechaPrestamo": "2026-01-11T10:30:00Z",
    "fechaDevolucion": "2026-01-18T10:30:00Z",
    "estado": "activo",
    "diasRestantes": 7
  },
  "metadata": {
    "origen": "backend-nestjs",
    "usuario": "Juan Pérez",
    "correlationId": "1736594400000-abc123"
  }
}
```

---

## 🧪 Testing

### Test Individual por Workflow

Cada workflow tiene un botón "Execute Workflow" en n8n:

1. Abrir workflow
2. Click en "Execute Workflow"
3. En "Webhook" node, click "Listen for Test Event"
4. Enviar request de prueba:

```bash
curl -X POST http://localhost:5678/webhook/prestamos \
  -H "Content-Type: application/json" \
  -d @test-payload.json
```

### Test End-to-End

```bash
# Desde el backend
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

## 📊 Monitoreo

### Ver Ejecuciones
```
n8n → Executions (menú lateral)
```

Información disponible:
- Estado (Success/Error)
- Tiempo de ejecución
- Datos de entrada/salida
- Logs de cada nodo

### Métricas Importantes

- **Tasa de éxito:** % de ejecuciones exitosas
- **Tiempo promedio:** ms por ejecución
- **Errores comunes:** revisar logs

---

## 🐛 Debugging

### Workflow no se ejecuta
1. ✅ Verificar que está activado (toggle ON)
2. ✅ Confirmar URL del webhook
3. ✅ Revisar logs de Docker
4. ✅ Probar con "Execute Workflow"

### Nodo falla
1. Click en el nodo con error
2. Ver "Input" y "Output"
3. Revisar configuración
4. Probar conexión (Telegram, Sheets, etc)

### Tips de Debug

- **Usar nodo "Set"** para inspeccionar datos
- **Agregar nodo "Sticky Note"** con explicaciones
- **Probar paso a paso** con "Execute Node"
- **Revisar expresiones** con `{{ $json.campo }}`

---

## 💡 Buenas Prácticas

### 1. Nombrar Nodos Descriptivamente
❌ `Webhook`, `IF`, `Set`  
✅ `Recibir Evento`, `Evaluar Tipo`, `Formatear para Telegram`

### 2. Usar Sticky Notes
Documenta secciones del workflow con notas adhesivas.

### 3. Manejo de Errores
Agrega nodos "Error Trigger" para capturar fallos.

### 4. Logs Informativos
Usa "Set" para agregar logs intermedios.

### 5. Versionado
Exporta workflows periódicamente a JSON.

---

## 📚 Recursos

- [n8n Docs - Workflows](https://docs.n8n.io/workflows/)
- [n8n Community Workflows](https://n8n.io/workflows)
- [Expressions Reference](https://docs.n8n.io/code-examples/expressions/)
- [Error Handling](https://docs.n8n.io/workflows/error-handling/)

---

## 📤 Exportar Workflows

Para compartir o hacer backup:

1. Abrir workflow
2. Menú (⋮) → Download
3. Guardar JSON en `workflows/plantillas/`

---

## ✅ Checklist de Implementación

- [ ] Workflow 1: Notificación Telegram configurado
- [ ] Workflow 2: Google Sheets configurado
- [ ] Workflow 3: Alertas Críticas configurado
- [ ] Credenciales de Telegram agregadas
- [ ] Credenciales de Google Sheets agregadas
- [ ] API Key de Gemini configurada
- [ ] URLs de webhook actualizadas en backend
- [ ] Tests manuales exitosos
- [ ] Test end-to-end exitoso
- [ ] Workflows exportados a JSON

---

> **Próximos pasos:** Sigue las guías individuales de cada workflow para configuración detallada.
