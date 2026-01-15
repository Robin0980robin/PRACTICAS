# 🧪 ARCHIVO DE PRUEBAS COMPLETO - Taller 4 (n8n)

## ✅ PREPARACIÓN PRE-PRUEBAS

### 1. Verificar que n8n esté corriendo
```powershell
# Verificar estado
docker ps | findstr n8n

# Debería mostrar:
# n8n-taller4   n8nio/n8n   Up XX minutes   0.0.0.0:5678->5678/tcp
```

### 2. Verificar workflows activos
```
1. Abrir: http://localhost:5678
2. Login: admin / uleam2025
3. Verificar que aparezcan 3 workflows con toggle VERDE (activos)
```

### 3. Obtener URLs de Webhook

**Una vez que actives los workflows, n8n te dará URLs. Ejemplo:**

```
Workflow 1: http://localhost:5678/webhook-test/biblioteca-events
Workflow 2: http://localhost:5678/webhook-test/biblioteca-sheets
Workflow 3: http://localhost:5678/webhook-test/biblioteca-alerts
```

**IMPORTANTE:** Copia estas URLs para usarlas en las pruebas.

---

## 🔧 CONFIGURAR CREDENCIALES

### Telegram Bot (Para Workflows 1 y 3)

**Paso 1: Crear Bot**
```
1. Abre Telegram
2. Busca: @BotFather
3. Envía: /newbot
4. Sigue instrucciones
5. Copia el TOKEN (ej: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11)
```

**Paso 2: Obtener Chat ID**
```
1. Busca: @userinfobot
2. Envía: /start
3. Copia tu ID (ej: 123456789)
```

**Paso 3: Configurar en n8n**
```
1. n8n → Credentials → Add Credential
2. Busca: Telegram
3. Pega tu TOKEN
4. Guarda como "Telegram Bot Biblioteca"
```

**Paso 4: Configurar Chat ID en workflows**
```
1. Workflow 01 → Nodo "Enviar Telegram"
2. Reemplaza: TU_CHAT_ID_AQUI con tu ID real
3. Workflow 03 → Igual
4. Guarda ambos workflows
```

---

### Gemini API (Para Workflows 1 y 3)

**Paso 1: Obtener API Key**
```
1. Ve a: https://aistudio.google.com
2. Click en "Get API Key"
3. Copia la key (ej: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX)
```

**Paso 2: Configurar en workflows**
```
1. Workflow 01 → Nodo "Gemini IA" (HTTP Request)
2. En Query Parameters → key → Reemplaza TU_API_KEY_AQUI
3. Workflow 03 → Nodo "Gemini - Análisis IA" → Igual
4. Guarda ambos workflows
```

---

### Google Sheets (Para Workflow 2)

**Paso 1: Crear Spreadsheet**
```
1. Ve a: https://sheets.google.com
2. Click: + Nuevo
3. En la primera fila escribe EXACTAMENTE:
   Fecha/Hora | Tipo de Evento | ID Registro | Libro | Usuario | Estado | Descripción
4. Copia el ID de la URL:
   https://docs.google.com/spreadsheets/d/[COPIA_ESTE_ID]/edit
```

**Paso 2: Autorizar en n8n**
```
1. n8n → Credentials → Add Credential
2. Busca: Google Sheets OAuth2 API
3. Click en "Sign in with Google"
4. Autoriza tu cuenta
5. Guarda como "Google Sheets Biblioteca"
```

**Paso 3: Configurar en workflow**
```
1. Workflow 02 → Nodo "Agregar a Google Sheets"
2. Credentials → Selecciona "Google Sheets Biblioteca"
3. Document ID → Pega el ID que copiaste
4. Sheet → Selecciona "Sheet1" o el nombre de tu hoja
5. Guarda workflow
```

---

## 🧪 PRUEBAS MANUALES CON cURL

### ⚠️ IMPORTANTE: Reemplaza las URLs
Las URLs de abajo son ejemplos. **USA LAS URLs REALES** que te dio n8n.

---

### TEST 1: Notificación Telegram + IA ⭐

**Payload: Préstamo Creado**
```powershell
curl -X POST http://localhost:5678/webhook-test/biblioteca-events `
  -H "Content-Type: application/json" `
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

**✅ Resultado Esperado:**
- Respuesta HTTP 200
- Mensaje JSON: `{"status": "received", "message": "Event processed successfully"}`
- **MENSAJE EN TELEGRAM** con texto generado por IA
- Formato: "📚 BIBLIOTECA - NOTIFICACIÓN ..."

**🐛 Si no funciona:**
- Verifica que el Bot Token sea correcto
- Asegúrate de que el Chat ID sea tuyo
- Inicia conversación con tu bot (envíale /start)
- Revisa logs: `docker-compose logs -f n8n`

---

### TEST 2: Libro Devuelto

```powershell
curl -X POST http://localhost:5678/webhook-test/biblioteca-events `
  -H "Content-Type: application/json" `
  -d '{
    "evento": "libro.devuelto",
    "timestamp": "2026-01-12T11:00:00Z",
    "data": {
      "id": 2,
      "libroTitulo": "Don Quijote de la Mancha",
      "usuario": "María García",
      "fechaDevolucion": "2026-01-12T11:00:00Z"
    }
  }'
```

**✅ Resultado Esperado:**
- Mensaje en Telegram con tono de agradecimiento
- Gemini genera texto contextual sobre devolución

---

### TEST 3: Google Sheets Sync ⭐

```powershell
curl -X POST http://localhost:5678/webhook-test/biblioteca-sheets `
  -H "Content-Type: application/json" `
  -d '{
    "evento": "prestamo.creado",
    "timestamp": "2026-01-12T12:00:00Z",
    "data": {
      "id": 3,
      "libroTitulo": "1984",
      "usuario": "Carlos López",
      "estado": "activo",
      "descripcion": "Préstamo de 7 días"
    }
  }'
```

**✅ Resultado Esperado:**
- Respuesta HTTP 200
- **NUEVA FILA EN GOOGLE SHEETS** con:
  - Fecha/Hora formateada
  - Evento: prestamo.creado
  - ID: 3
  - Libro: 1984
  - Usuario: Carlos López
  - Estado: activo
  - Descripción: Préstamo de 7 días

**🐛 Si no funciona:**
- Verifica que Google OAuth esté autorizado
- Confirma que el Spreadsheet ID sea correcto
- Asegúrate de que los encabezados coincidan EXACTAMENTE

---

### TEST 4: Evento para Sheets (Devolución)

```powershell
curl -X POST http://localhost:5678/webhook-test/biblioteca-sheets `
  -H "Content-Type: application/json" `
  -d '{
    "evento": "libro.devuelto",
    "timestamp": "2026-01-12T13:00:00Z",
    "data": {
      "id": 4,
      "libroTitulo": "El Principito",
      "usuario": "Ana Rodríguez",
      "estado": "devuelto",
      "descripcion": "Devolución a tiempo"
    }
  }'
```

**✅ Resultado:** Nueva fila en Sheets

---

### TEST 5: Alerta Crítica (Préstamo Vencido) ⭐

```powershell
curl -X POST http://localhost:5678/webhook-test/biblioteca-alerts `
  -H "Content-Type: application/json" `
  -d '{
    "evento": "prestamo.vencido",
    "timestamp": "2026-01-12T14:00:00Z",
    "data": {
      "id": 5,
      "libroTitulo": "El Quijote",
      "usuario": "Pedro Martínez",
      "diasRetraso": 10,
      "estado": "vencido"
    }
  }'
```

**✅ Resultado Esperado:**
- Respuesta HTTP 200
- Gemini analiza y responde con JSON: `{"urgency": "HIGH", "reason": "..."}`
- **Si es HIGH:** Mensaje en Telegram con 🚨 ALERTA CRÍTICA
- **Si es MEDIUM:** Log en consola de n8n
- **Si es LOW:** Log informativo

**📊 Para ver la clasificación:**
```powershell
# Ver logs de n8n
cd n8n
docker-compose logs -f
```

---

### TEST 6: Alerta Crítica (Muchos días de retraso)

```powershell
curl -X POST http://localhost:5678/webhook-test/biblioteca-alerts `
  -H "Content-Type: application/json" `
  -d '{
    "evento": "prestamo.vencido",
    "timestamp": "2026-01-12T15:00:00Z",
    "data": {
      "id": 6,
      "libroTitulo": "Rayuela",
      "usuario": "Lucía Fernández",
      "diasRetraso": 30,
      "estado": "vencido"
    }
  }'
```

**✅ Resultado:** Gemini debería clasificar como HIGH por muchos días

---

### TEST 7: Alerta de Bajo Retraso

```powershell
curl -X POST http://localhost:5678/webhook-test/biblioteca-alerts `
  -H "Content-Type: application/json" `
  -d '{
    "evento": "prestamo.vencido",
    "timestamp": "2026-01-12T16:00:00Z",
    "data": {
      "id": 7,
      "libroTitulo": "Crónica de una Muerte Anunciada",
      "usuario": "Roberto Gómez",
      "diasRetraso": 1,
      "estado": "vencido"
    }
  }'
```

**✅ Resultado:** Probablemente LOW o MEDIUM

---

## 🎬 PRUEBA DESDE EL BACKEND

Si tu backend ya está emitiendo eventos, prueba creando un préstamo:

```powershell
# Asegúrate de que el backend esté corriendo
cd apps\backend
npm run start:dev

# En otra terminal:
curl -X POST http://localhost:3002/prestamos `
  -H "Content-Type: application/json" `
  -d '{
    "usuarioId": "U001",
    "usuarioNombre": "Usuario de Prueba",
    "libroId": 1,
    "libroTitulo": "Libro de Prueba",
    "diasPrestamo": 7
  }'
```

**✅ Resultado:**
- Backend crea el préstamo
- Backend emite evento a n8n
- n8n ejecuta los workflows
- Recibes notificación en Telegram
- Se agrega fila a Sheets

---

## 📊 VERIFICAR EJECUCIONES EN n8n

```
1. Ve a: http://localhost:5678
2. Click en "Executions" (barra lateral izquierda)
3. Verás todas las ejecuciones de tus workflows
4. Click en una ejecución para ver:
   - Qué nodos se ejecutaron
   - Datos de entrada/salida de cada nodo
   - Errores (si los hay)
   - Tiempo de ejecución
```

---

## 🐛 TROUBLESHOOTING

### ❌ No recibo mensajes en Telegram
```
1. Verifica que tu Bot Token sea correcto
2. Asegúrate de haber iniciado conversación con tu bot (/start)
3. Verifica que el Chat ID sea el correcto (tu ID personal)
4. En n8n → Credentials → Edita "Telegram Bot Biblioteca"
5. Test → Enviar mensaje de prueba
```

### ❌ Gemini retorna error 400
```
1. Verifica que la API Key sea válida
2. Ve a: https://aistudio.google.com
3. Revisa el límite de requests (gratis: 10 req/min, 50 req/día)
4. Si excediste el límite, espera 1 minuto
5. Considera usar un modelo diferente: gemini-1.5-flash
```

### ❌ Google Sheets no se actualiza
```
1. Verifica que la credencial OAuth esté autorizada
2. Confirma el Spreadsheet ID
3. Verifica que los encabezados de columna sean EXACTOS:
   Fecha/Hora | Tipo de Evento | ID Registro | Libro | Usuario | Estado | Descripción
4. Prueba agregando una fila manualmente en Sheets para confirmar acceso
```

### ❌ Workflow no se ejecuta
```
1. Verifica que el workflow esté ACTIVO (toggle verde)
2. Revisa la URL del webhook (debe ser correcta)
3. En n8n → Workflow → Settings → Verifica que esté activo
4. Intenta desactivar y reactivar el workflow
```

### ❌ Error 404 al hacer cURL
```
1. Verifica la URL del webhook
2. En n8n → Abre el workflow → Click en nodo "Webhook"
3. Copia la "Production URL" (o "Test URL" si estás en modo test)
4. Usa esa URL exacta en tus pruebas
```

---

## 📝 CHECKLIST DE PRUEBAS COMPLETO

### Pre-requisitos
- [ ] Docker corriendo
- [ ] n8n iniciado (`docker ps` muestra n8n-taller4)
- [ ] n8n accesible en http://localhost:5678
- [ ] 3 workflows importados
- [ ] 3 workflows ACTIVOS (toggle verde)

### Credenciales
- [ ] Telegram Bot Token configurado
- [ ] Telegram Chat ID configurado en workflows 01 y 03
- [ ] Gemini API Key configurada en workflows 01 y 03
- [ ] Google OAuth autorizado
- [ ] Google Spreadsheet ID configurado en workflow 02

### Pruebas de Workflows
- [ ] Test 1: Préstamo creado → Mensaje Telegram ✅
- [ ] Test 2: Libro devuelto → Mensaje Telegram ✅
- [ ] Test 3: Evento a Sheets → Nueva fila ✅
- [ ] Test 4: Devolución a Sheets → Nueva fila ✅
- [ ] Test 5: Alerta crítica → Análisis IA ✅
- [ ] Test 6: Alta urgencia → Telegram con 🚨 ✅
- [ ] Test 7: Baja urgencia → Log en consola ✅

### Verificaciones
- [ ] Todas las pruebas retornan HTTP 200
- [ ] Mensajes llegan a Telegram
- [ ] Google Sheets tiene nuevas filas
- [ ] Executions en n8n muestran ejecuciones exitosas
- [ ] Logs de n8n no muestran errores
- [ ] Backend emite eventos correctamente (si aplica)

### Documentación
- [ ] Screenshots de Telegram con mensajes
- [ ] Screenshot de Google Sheets con datos
- [ ] Screenshot de n8n Executions
- [ ] Screenshot de workflows activos
- [ ] Video demo (3-5 min) grabado

---

## 🎥 GRABAR VIDEO DEMO (3-5 min)

### Estructura Sugerida:

**Minuto 0-1: Introducción**
```
- Mostrar arquitectura (diagrama o slides)
- Explicar qué hace n8n en tu proyecto
- Mostrar n8n en el navegador (3 workflows activos)
```

**Minuto 1-2: Demostración Workflow 1 (Telegram)**
```
- Ejecutar cURL de préstamo creado
- Mostrar mensaje llegando a Telegram
- Explicar que Gemini generó el texto
```

**Minuto 2-3: Demostración Workflow 2 (Sheets)**
```
- Ejecutar cURL de evento
- Mostrar Google Sheets actualizándose en tiempo real
- Mostrar que tiene múltiples registros
```

**Minuto 3-4: Demostración Workflow 3 (Alertas)**
```
- Ejecutar cURL de préstamo vencido
- Mostrar análisis de Gemini en Executions
- Mostrar alerta en Telegram (si es HIGH)
```

**Minuto 4-5: Cierre**
```
- Mostrar Executions (historial)
- Mencionar arquitectura completa (MCP + n8n)
- Conclusión
```

---

## 📸 SCREENSHOTS REQUERIDOS

1. **n8n Dashboard**
   - Mostrar 3 workflows activos (toggle verde)

2. **Workflow 01 abierto**
   - Mostrar todos los nodos conectados

3. **Telegram**
   - Mensajes recibidos del bot

4. **Google Sheets**
   - Hoja con múltiples filas de eventos

5. **n8n Executions**
   - Lista de ejecuciones exitosas

6. **Logs del Backend**
   - Mostrando emisión de eventos

---

## 🚀 SIGUIENTE PASO

```powershell
# 1. Configura todas las credenciales siguiendo esta guía

# 2. Ejecuta TODAS las pruebas con cURL

# 3. Verifica que todo funcione

# 4. Graba el video demo

# 5. Toma screenshots

# 6. ¡Entrega el taller! 🎉
```

---

## 📞 SOPORTE ADICIONAL

Si algo no funciona:

1. **Revisa logs de n8n:**
   ```powershell
   cd n8n
   docker-compose logs -f
   ```

2. **Revisa Executions en n8n:**
   - http://localhost:5678 → Executions
   - Click en una ejecución fallida
   - Lee el error específico

3. **Prueba manualmente en n8n:**
   - Abre workflow
   - Click "Test workflow"
   - Click en cada nodo para ver datos

4. **Consulta documentación:**
   - GUIA_COMPLETA_TALLER_4.md
   - COMANDOS_RAPIDOS_TALLER_4.md

---

> 💡 **Tip Final:** Haz las pruebas en orden. Primero configura TODO, luego prueba TODO, luego documenta TODO.

¡Éxito en tu demo! 🚀
