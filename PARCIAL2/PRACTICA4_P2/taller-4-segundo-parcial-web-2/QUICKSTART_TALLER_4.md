# Guía Rápida - Taller 4

## ⚡ Setup en 5 Minutos

### 1. Instalar Todo

**Windows:**
```powershell
.\install-taller4.ps1
```

**Linux/Mac:**
```bash
chmod +x install-taller4.sh
./install-taller4.sh
```

### 2. Configurar n8n

Acceder a: http://localhost:5678  
Usuario: `admin` / Contraseña: `uleam2025`

### 3. Crear Workflows

1. Workflow 1: Notificación Telegram
   - Seguir: `n8n/workflows/01-notificacion-telegram.md`
   - Copiar URL webhook

2. Workflow 2: Google Sheets
   - Seguir: `n8n/workflows/02-google-sheets.md`
   - Copiar URL webhook

3. Workflow 3: Alertas Críticas
   - Seguir: `n8n/workflows/03-alertas-criticas.md`
   - Copiar URL webhook

### 4. Configurar Backend

Editar `apps/backend/.env`:
```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/prestamos
```

### 5. Iniciar Backend

```bash
cd apps/backend
npm run start:dev
```

### 6. Probar

```bash
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

✅ Deberías recibir notificación en Telegram y ver registro en Google Sheets.

---

## 📊 Puertos

- Backend: 3002
- n8n: 5678
- MCP Server: 3001 (opcional)
- API Gateway: 3000 (opcional)

## 📚 Documentación Completa

- [README_TALLER_4.md](README_TALLER_4.md) - Guía completa
- [Backend README](apps/backend/README.md) - Backend
- [n8n README](n8n/README.md) - n8n
- [Workflows](n8n/workflows/README.md) - Workflows

## 🆘 Ayuda

**n8n no inicia:**
```bash
cd n8n
docker-compose down
docker-compose up -d
```

**Backend no conecta:**
```bash
# Verificar .env
cat apps/backend/.env

# Reiniciar backend
cd apps/backend
npm run start:dev
```

**Más info:** README_TALLER_4.md
