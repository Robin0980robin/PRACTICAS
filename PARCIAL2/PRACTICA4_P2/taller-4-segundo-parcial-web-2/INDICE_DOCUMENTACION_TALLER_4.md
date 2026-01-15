# 📚 ÍNDICE DE DOCUMENTACIÓN - Taller 4 (n8n)

> **Guía completa de navegación por toda la documentación del Taller 4**

---

## 🚀 INICIO RÁPIDO

### Para empezar de inmediato:
1. **Lee primero:** [RESUMEN_TALLER_4.md](RESUMEN_TALLER_4.md) (5 min)
2. **Ejecuta:** `.\start-n8n.ps1` o `./start-n8n.sh`
3. **Verifica:** `.\verify-taller4.ps1`
4. **Sigue:** [GUIA_COMPLETA_TALLER_4.md](GUIA_COMPLETA_TALLER_4.md)

---

## 📖 DOCUMENTACIÓN PRINCIPAL

### 1. Resumen Ejecutivo
**Archivo:** [RESUMEN_TALLER_4.md](RESUMEN_TALLER_4.md)

**Contenido:**
- ✅ Qué se ha hecho
- ✅ Archivos creados
- ✅ Inicio rápido en 5 minutos
- ✅ Arquitectura integrada
- ✅ Checklist de entrega

**Cuándo leerlo:** PRIMERO - Para tener visión general

---

### 2. Guía Completa Paso a Paso
**Archivo:** [GUIA_COMPLETA_TALLER_4.md](GUIA_COMPLETA_TALLER_4.md)

**Contenido:**
- 🎯 Objetivos y conceptos
- 📂 Estructura completa
- 🔄 Arquitectura detallada
- 🚀 Pasos de implementación (1-7)
- 🧪 Tests completos
- 📊 Monitoreo
- 🐛 Troubleshooting
- ✅ Checklist de entrega

**Cuándo leerlo:** SEGUNDO - Para implementar todo el taller

---

### 3. Documentación de n8n
**Archivo:** [n8n/README.md](n8n/README.md)

**Contenido:**
- 🚀 Inicio rápido de n8n
- 📋 Workflows implementados (descripciones)
- 🔧 Configuración de credenciales
- 📝 Cómo importar workflows
- ⚙️ Configurar backend
- 🧪 Tests de workflows
- 🛠️ Comandos útiles (Docker)
- 🐛 Troubleshooting específico

**Cuándo leerlo:** Durante la implementación - Referencia de n8n

---

### 4. Guía de Workflows
**Archivo:** [n8n/workflows/GUIA_WORKFLOWS.md](n8n/workflows/GUIA_WORKFLOWS.md)

**Contenido:**
- 📋 Los 3 workflows detallados
- 🔄 Diagramas de flujo
- 🛠️ Configuración de cada nodo
- 🔐 Credenciales paso a paso
- 🔗 URLs de webhook
- 📊 Ejemplos de payload
- 🧪 Tests específicos por workflow
- 🐛 Troubleshooting por workflow

**Cuándo leerlo:** Durante configuración de workflows - Referencia técnica

---

## 🔧 ARCHIVOS DE CONFIGURACIÓN

### docker-compose.yml
**Ubicación:** [n8n/docker-compose.yml](n8n/docker-compose.yml)

**Contenido:**
- Imagen de n8n
- Puertos (5678)
- Variables de entorno
- Credenciales (admin/uleam2025)
- Volúmenes persistentes

---

### env.example (Backend)
**Ubicación:** [apps/backend/env.example](apps/backend/env.example)

**Contenido:**
- Puerto del backend
- URLs de webhooks de n8n (3 workflows)
- Variables de entorno

**Acción:** Copia a `.env` y ajusta las URLs reales

---

## 📦 WORKFLOWS (JSON)

### 1. Notificación Telegram + IA
**Archivo:** [n8n/workflows/01-notificacion-biblioteca-telegram.json](n8n/workflows/01-notificacion-biblioteca-telegram.json)

**Importar en n8n:** Import from File

**Configurar:**
- Gemini API Key en nodo HTTP Request
- Telegram Chat ID en nodo Telegram

---

### 2. Sincronización Google Sheets
**Archivo:** [n8n/workflows/02-sincronizacion-google-sheets.json](n8n/workflows/02-sincronizacion-google-sheets.json)

**Importar en n8n:** Import from File

**Configurar:**
- Google OAuth en n8n Credentials
- Spreadsheet ID en nodo Google Sheets

---

### 3. Alertas Críticas con IA
**Archivo:** [n8n/workflows/03-alertas-criticas-biblioteca.json](n8n/workflows/03-alertas-criticas-biblioteca.json)

**Importar en n8n:** Import from File

**Configurar:**
- Gemini API Key en nodo HTTP Request
- Telegram Chat ID en nodo Telegram

---

## 🛠️ SCRIPTS UTILITARIOS

### Inicio de n8n (Windows)
**Archivo:** [start-n8n.ps1](start-n8n.ps1)

**Uso:**
```powershell
.\start-n8n.ps1
```

**Acciones:**
- Verifica Docker
- Inicia n8n con docker-compose
- Espera a que n8n esté listo
- Muestra credenciales y próximos pasos

---

### Inicio de n8n (Linux/Mac)
**Archivo:** [start-n8n.sh](start-n8n.sh)

**Uso:**
```bash
chmod +x start-n8n.sh
./start-n8n.sh
```

**Acciones:** Igual que el script de Windows

---

### Verificación de Taller 4
**Archivo:** [verify-taller4.ps1](verify-taller4.ps1)

**Uso:**
```powershell
.\verify-taller4.ps1
```

**Verifica:**
- ✅ Docker instalado y corriendo
- ✅ Estructura de archivos completa
- ✅ Contenedor n8n corriendo
- ✅ Acceso web a n8n
- ✅ Configuración del backend
- ✅ WebhookEmitterService existe

---

## 📋 FLUJO DE LECTURA RECOMENDADO

### Para Implementación Completa:

```
1. RESUMEN_TALLER_4.md
   ↓ (Visión general - 5 min)
   
2. GUIA_COMPLETA_TALLER_4.md
   ↓ (Implementación paso a paso - 30 min)
   
3. Ejecutar: .\start-n8n.ps1
   ↓ (Inicio de n8n)
   
4. n8n/README.md
   ↓ (Referencia mientras configuras)
   
5. n8n/workflows/GUIA_WORKFLOWS.md
   ↓ (Detalles de cada workflow)
   
6. Importar workflows en n8n
   ↓ (Interfaz web)
   
7. Configurar credenciales
   ↓ (Telegram, Gemini, Sheets)
   
8. Activar workflows
   ↓ (Toggle verde)
   
9. Actualizar apps/backend/.env
   ↓ (URLs de webhook)
   
10. Ejecutar: .\verify-taller4.ps1
    ↓ (Verificación)
    
11. Probar con cURL
    ↓ (Tests)
    
12. ✅ ¡Taller 4 Completo!
```

---

### Para Referencia Rápida:

```
¿Cómo iniciar n8n?
→ n8n/README.md > Inicio Rápido

¿Cómo configurar Telegram?
→ n8n/workflows/GUIA_WORKFLOWS.md > Workflow 1 > Telegram Bot

¿Cómo probar workflows?
→ GUIA_COMPLETA_TALLER_4.md > PROBAR LA INTEGRACIÓN

¿Problemas con Gemini?
→ n8n/README.md > Troubleshooting > Gemini

¿Cómo ver logs?
→ n8n/README.md > Monitoreo y Debugging
```

---

### Para Resolución de Problemas:

```
Error general
→ GUIA_COMPLETA_TALLER_4.md > TROUBLESHOOTING

Error específico de n8n
→ n8n/README.md > Troubleshooting

Error en workflow específico
→ n8n/workflows/GUIA_WORKFLOWS.md > Troubleshooting (por workflow)

Verificar estado
→ Ejecutar: .\verify-taller4.ps1
```

---

## 🎓 DOCUMENTACIÓN POR NIVEL

### Nivel Principiante (Nunca usaste n8n)
1. [RESUMEN_TALLER_4.md](RESUMEN_TALLER_4.md) ⭐
2. [GUIA_COMPLETA_TALLER_4.md](GUIA_COMPLETA_TALLER_4.md) ⭐⭐
3. [n8n/README.md](n8n/README.md) ⭐⭐
4. Scripts: `start-n8n.ps1` y `verify-taller4.ps1`

### Nivel Intermedio (Ya conoces n8n)
1. [RESUMEN_TALLER_4.md](RESUMEN_TALLER_4.md) ⭐
2. [n8n/workflows/GUIA_WORKFLOWS.md](n8n/workflows/GUIA_WORKFLOWS.md) ⭐⭐
3. Workflows JSON directamente
4. [apps/backend/env.example](apps/backend/env.example)

### Nivel Avanzado (Solo necesitas referencia)
1. [RESUMEN_TALLER_4.md](RESUMEN_TALLER_4.md) (Checklist)
2. Workflows JSON
3. `docker-compose up -d`
4. Importar, configurar, activar

---

## 📞 SOPORTE

### Recursos Externos
- **n8n Docs:** https://docs.n8n.io
- **Gemini API:** https://ai.google.dev/docs
- **Telegram Bots:** https://core.telegram.org/bots
- **Google Sheets API:** https://developers.google.com/sheets

### Archivos de Ayuda en el Proyecto
- Troubleshooting general: [GUIA_COMPLETA_TALLER_4.md](GUIA_COMPLETA_TALLER_4.md#-troubleshooting)
- Troubleshooting n8n: [n8n/README.md](n8n/README.md#-troubleshooting)
- Troubleshooting workflows: [n8n/workflows/GUIA_WORKFLOWS.md](n8n/workflows/GUIA_WORKFLOWS.md)

---

## ✅ CHECKLIST DE DOCUMENTACIÓN

Antes de entregar el taller, verifica que tienes:

- [ ] Todos los archivos listados en este índice
- [ ] Los 3 workflows JSON funcionando
- [ ] docker-compose.yml corriendo
- [ ] Screenshots de workflows activos
- [ ] Video demo (3-5 min)
- [ ] Google Sheets con datos reales
- [ ] README.md actualizado (este archivo o principal del proyecto)

---

## 🎯 CONCLUSIÓN

Esta es toda la documentación del Taller 4. **Empieza por el RESUMEN**, luego sigue la GUÍA COMPLETA, y usa el resto como referencia durante la implementación.

**¡Éxito en tu taller!** 🚀

---

> 💡 **Tip:** Guarda este archivo como referencia. Es tu mapa de navegación por toda la documentación.
