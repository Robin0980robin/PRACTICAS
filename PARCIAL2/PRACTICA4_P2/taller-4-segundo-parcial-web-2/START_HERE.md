# 🎯 TODO LISTO PARA PROBAR - Guía Rápida

## ✅ TIENES TODO LO NECESARIO

### 📚 Archivos de Documentación
- ✅ [PRUEBAS_COMPLETAS_TALLER_4.md](PRUEBAS_COMPLETAS_TALLER_4.md) - Guía completa de pruebas
- ✅ [DATOS_PRUEBA_EJEMPLOS.md](DATOS_PRUEBA_EJEMPLOS.md) - Payloads listos para copiar
- ✅ [COMANDOS_RAPIDOS_TALLER_4.md](COMANDOS_RAPIDOS_TALLER_4.md) - Comandos útiles
- ✅ [RESUMEN_TALLER_4.md](RESUMEN_TALLER_4.md) - Resumen ejecutivo

### 🛠️ Scripts Automatizados
- ✅ [start-n8n.ps1](start-n8n.ps1) - Inicia n8n automáticamente
- ✅ [verify-taller4.ps1](verify-taller4.ps1) - Verifica que todo esté listo
- ✅ [test-taller4.ps1](test-taller4.ps1) - Ejecuta todas las pruebas automáticamente

### 🔄 Workflows JSON
- ✅ [01-notificacion-biblioteca-telegram.json](n8n/workflows/01-notificacion-biblioteca-telegram.json)
- ✅ [02-sincronizacion-google-sheets.json](n8n/workflows/02-sincronizacion-google-sheets.json)
- ✅ [03-alertas-criticas-biblioteca.json](n8n/workflows/03-alertas-criticas-biblioteca.json)

---

## 🚀 PROCESO EN 5 PASOS

### PASO 1: Iniciar n8n ⏱️ 2 minutos
```powershell
.\start-n8n.ps1
```
**Resultado:** n8n corriendo en http://localhost:5678

---

### PASO 2: Verificar instalación ⏱️ 1 minuto
```powershell
.\verify-taller4.ps1
```
**Resultado:** Checklist de todo lo que está listo

---

### PASO 3: Configurar credenciales ⏱️ 10 minutos

#### 3.1 Telegram Bot
```
1. @BotFather → /newbot → Copia TOKEN
2. @userinfobot → Copia Chat ID
3. n8n → Credentials → Telegram → Pega TOKEN
4. Workflows 01 y 03 → Reemplaza Chat ID
```

#### 3.2 Gemini API
```
1. https://aistudio.google.com → Get API Key
2. Workflows 01 y 03 → HTTP Request → Pega API Key
```

#### 3.3 Google Sheets
```
1. https://sheets.google.com → Nuevo
2. Primera fila: Fecha/Hora | Tipo de Evento | ID Registro | Libro | Usuario | Estado | Descripción
3. Copia ID de URL
4. n8n → Credentials → Google Sheets OAuth
5. Workflow 02 → Pega Spreadsheet ID
```

**📖 Guía detallada:** [PRUEBAS_COMPLETAS_TALLER_4.md](PRUEBAS_COMPLETAS_TALLER_4.md#-configurar-credenciales)

---

### PASO 4: Activar workflows ⏱️ 2 minutos
```
1. http://localhost:5678
2. Abrir cada workflow
3. Toggle superior derecho → Verde (Active)
4. Copiar "Production URL" de cada webhook
```

---

### PASO 5: Probar ⏱️ 5 minutos

#### Opción A: Script Automatizado (Recomendado)
```powershell
# Reemplaza las URLs con las reales
.\test-taller4.ps1 `
  -WebhookNotificacion "http://localhost:5678/webhook/biblioteca-events" `
  -WebhookSheets "http://localhost:5678/webhook/biblioteca-sheets" `
  -WebhookAlertas "http://localhost:5678/webhook/biblioteca-alerts"
```

**Resultado:** 7 pruebas automáticas + reporte de éxito/error

#### Opción B: Pruebas Manuales
Abre [DATOS_PRUEBA_EJEMPLOS.md](DATOS_PRUEBA_EJEMPLOS.md) y copia los cURL uno por uno.

---

## 📋 CHECKLIST RÁPIDO

### Pre-requisitos
```powershell
# ¿Docker corriendo?
docker ps

# ¿n8n iniciado?
.\start-n8n.ps1

# ¿Todo verificado?
.\verify-taller4.ps1
```

### Configuración
- [ ] Telegram Bot Token configurado
- [ ] Telegram Chat ID en workflows
- [ ] Gemini API Key en workflows
- [ ] Google Sheets OAuth autorizado
- [ ] Spreadsheet ID configurado
- [ ] Los 3 workflows están ACTIVOS (verde)
- [ ] URLs de webhook copiadas

### Pruebas
```powershell
# Ejecutar todas las pruebas
.\test-taller4.ps1 -WebhookNotificacion "URL1" -WebhookSheets "URL2" -WebhookAlertas "URL3"
```

### Verificación
- [ ] 7 pruebas exitosas (✅)
- [ ] Mensajes en Telegram (mínimo 2)
- [ ] Filas en Google Sheets (mínimo 2)
- [ ] Executions en n8n (ver historial)
- [ ] Sin errores en logs

---

## 🎬 PARA VIDEO DEMO

### Preparación
```
1. Limpia Telegram (borra mensajes antiguos del bot)
2. Limpia Google Sheets (deja solo encabezados)
3. Limpia Executions en n8n (opcional)
4. Abre todas las ventanas necesarias:
   - Telegram
   - Google Sheets
   - n8n (http://localhost:5678)
   - Terminal (PowerShell)
```

### Durante la Grabación (3-5 min)
```
Minuto 0-1: Introducción
→ Mostrar arquitectura
→ Explicar n8n en el proyecto
→ Mostrar n8n con 3 workflows activos

Minuto 1-2: Demo Workflow 1 (Telegram)
→ Ejecutar: curl ... (préstamo creado)
→ Mostrar mensaje en Telegram
→ Explicar que IA generó el texto

Minuto 2-3: Demo Workflow 2 (Sheets)
→ Ejecutar: curl ... (evento a sheets)
→ Mostrar Google Sheets actualizándose
→ Mostrar que hay múltiples registros

Minuto 3-4: Demo Workflow 3 (Alertas)
→ Ejecutar: curl ... (préstamo vencido)
→ Mostrar Executions → Ver análisis de IA
→ Mostrar alerta en Telegram (si HIGH)

Minuto 4-5: Cierre
→ Mostrar Executions (historial completo)
→ Mencionar arquitectura MCP + n8n
→ Conclusión
```

---

## 📸 SCREENSHOTS NECESARIOS

1. **n8n Dashboard**
   - 3 workflows con toggle verde
   
2. **Workflow 01 abierto**
   - Todos los nodos conectados
   
3. **Telegram**
   - 3-5 mensajes del bot
   
4. **Google Sheets**
   - 5-10 filas de eventos
   
5. **n8n Executions**
   - Lista de ejecuciones exitosas
   
6. **Credentials en n8n**
   - Telegram configurado
   - Google Sheets configurado

---

## 🎯 SI ALGO FALLA

### Error: n8n no inicia
```powershell
cd n8n
docker-compose down
docker-compose up -d
docker-compose logs -f
```

### Error: Workflow no se ejecuta
```
1. Verifica que esté ACTIVO (toggle verde)
2. Revisa la URL del webhook (cópiala de nuevo)
3. Desactiva y reactiva el workflow
4. Revisa Executions en n8n para ver el error
```

### Error: No llegan mensajes a Telegram
```
1. Verifica Bot Token en Credentials
2. Verifica Chat ID en el workflow
3. Inicia conversación con tu bot (/start)
4. Test en n8n: Workflow → Test workflow
```

### Error: Sheets no se actualiza
```
1. Verifica OAuth autorizado
2. Confirma Spreadsheet ID
3. Verifica encabezados (deben ser exactos)
4. Test en n8n: Workflow → Test workflow
```

### Ver logs detallados
```powershell
cd n8n
docker-compose logs -f
```

---

## 🆘 AYUDA RÁPIDA

| Problema | Solución |
|----------|----------|
| ¿Cómo inicio n8n? | `.\start-n8n.ps1` |
| ¿Cómo verifico todo? | `.\verify-taller4.ps1` |
| ¿Cómo ejecuto pruebas? | `.\test-taller4.ps1 -Webhook...` |
| ¿Dónde están los ejemplos? | [DATOS_PRUEBA_EJEMPLOS.md](DATOS_PRUEBA_EJEMPLOS.md) |
| ¿Guía completa de pruebas? | [PRUEBAS_COMPLETAS_TALLER_4.md](PRUEBAS_COMPLETAS_TALLER_4.md) |
| ¿Comandos útiles? | [COMANDOS_RAPIDOS_TALLER_4.md](COMANDOS_RAPIDOS_TALLER_4.md) |
| ¿Ver logs? | `cd n8n && docker-compose logs -f` |
| ¿Reiniciar n8n? | `cd n8n && docker-compose restart` |

---

## ✅ ENTREGA FINAL

### Antes de entregar, verifica:
- [ ] Video demo (3-5 min) grabado
- [ ] 6+ screenshots tomados
- [ ] Google Sheets con datos reales (5+ filas)
- [ ] README.md actualizado (opcional)
- [ ] Repositorio Git actualizado
- [ ] `.env` configurado (sin commitear)
- [ ] Todos los workflows funcionando

### Archivos a entregar:
```
1. Link a repositorio Git
2. Video demo (YouTube/Drive)
3. Screenshots (carpeta comprimida)
4. Link a Google Sheets (público o con acceso)
5. Documento con:
   - Arquitectura
   - Explicación de workflows
   - Resultados de pruebas
   - Conclusiones
```

---

## 🎉 ¡LISTO PARA PROBAR!

```powershell
# Ejecuta estos 3 comandos en orden:

# 1. Inicia n8n
.\start-n8n.ps1

# 2. Verifica todo
.\verify-taller4.ps1

# 3. Ejecuta pruebas (reemplaza URLs)
.\test-taller4.ps1 `
  -WebhookNotificacion "TU_URL_1" `
  -WebhookSheets "TU_URL_2" `
  -WebhookAlertas "TU_URL_3"
```

**¡Éxito en tu taller!** 🚀

---

> 💡 **Tip:** Si es tu primera vez, dedica 30 minutos a configurar todo. Luego las pruebas tomarán solo 5 minutos.
