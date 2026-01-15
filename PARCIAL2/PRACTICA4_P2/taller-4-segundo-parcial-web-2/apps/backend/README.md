# Backend - Sistema Farmacéutico con Webhooks

Backend NestJS que gestiona prescripciones médicas y emite eventos automáticamente a n8n para procesamiento de workflows de notificaciones, sincronización y alertas.

## 🏗️ Arquitectura

```
Cliente/API Gateway
       ↓
  Backend NestJS (3002)
       ↓
  Emite Webhooks (prescripcion.*, medicamento.*)
       ↓
    n8n (5678)
       ↓
  [Telegram, Sheets, Email]
```

## 📦 Instalación

### 1. Instalar dependencias

```bash
cd apps/backend
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env`:
```env
PORT=3002
N8N_WEBHOOK_URL=http://localhost:5678/webhook/prescripciones
N8N_SHEETS_WEBHOOK_URL=http://localhost:5678/webhook/prescripciones-sheets
N8N_ALERTAS_WEBHOOK_URL=http://localhost:5678/webhook/alertas-criticas
NODE_ENV=development
```

**Nota:** Las URLs de webhook se obtienen después de crear los workflows en n8n.

### 3. Compilar

```bash
npm run build
```

## 🚀 Ejecución

### Modo desarrollo (con hot-reload)

```bash
npm run start:dev
```

### Modo producción

```bash
npm run build
npm run start:prod
```

El servidor estará disponible en: http://localhost:3002

## 📡 API Endpoints

### Prescripciones Médicas

#### Crear prescripción

```bash
POST /prescripciones
Content-Type: application/json

{
  "pacienteId": "PAC001",
  "pacienteNombre": "Juan Pérez",
  "medicoId": "MED123",
  "medicoNombre": "Dra. María González",
  "medicamentos": [
    {
      "id": 15,
      "nombre": "Paracetamol 500mg",
      "cantidad": 20,
      "dosis": "500mg",
      "frecuencia": "Cada 8 horas",
      "duracionDias": 5
    }
  ],
  "diasValidez": 30
}
```

**Respuesta:**
```json
{
  "id": 1,
  "pacienteId": "PAC001",
  "pacienteNombre": "Juan Pérez",
  "medicoId": "MED123",
  "medicoNombre": "Dra. María González",
  "fechaPrescripcion": "2026-01-11T10:00:00Z",
  "fechaVencimiento": "2026-02-10T10:00:00Z",
  "medicamentos": [...],
  "estado": "pendiente"
}
```

**Evento emitido:** `prescripcion.registrada`

#### Listar prescripciones

```bash
GET /prescripciones
```

#### Obtener prescripción por ID

```bash
GET /prescripciones/:id
```

#### Surtir prescripción

```bash
PUT /prescripciones/:id/surtir
Content-Type: application/json

{
  "farmacia": "Farmacia Cruz Verde",
  "precioTotal": 25.50
}
```

**Evento emitido:** `prescripcion.surtida`

#### Verificar prescripciones vencidas

```bash
POST /prescripciones/verificar-vencidas
```

**Evento emitido (si hay vencidas):** `prescripcion.vencida`

## 🔔 Eventos Emitidos

| Evento | Trigger | Payload |
|--------|---------|---------|
| `prescripcion.registrada` | POST /prescripciones | Datos de la prescripción + medicamentos |
| `prescripcion.surtida` | PUT /prescripciones/:id/surtir | Prescripción + farmacia + precio |
| `prescripcion.vencida` | POST /prescripciones/verificar-vencidas | Prescripción + días vencidos |

### Estructura de Payload

```typescript
{
  evento: string;              // Nombre del evento
  timestamp: string;           // ISO8601 fecha/hora
  data: {                      // Datos del dominio
    id: number;
    pacienteNombre: string;
    medicoNombre: string;
    medicamentos: Medicamento[];
    estado: string;
    farmaciaRecomendada?: string;
    precioTotal?: number;
    // ... más campos
  };
  metadata: {                  // Metadata adicional
    source: 'backend-farmacia';
    version: '1.0.0';
    correlationId: string;
    paciente?: string;
    medico?: string;
    diasVencidos?: number;     // Solo en vencidos
    cantidadMedicamentos?: number;
  };
}
```

## 🧪 Testing

### Pruebas unitarias

```bash
npm test
```

### Pruebas con curl

**Crear préstamo:**
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

**Listar:**
```bash
curl http://localhost:3002/prestamos
```

**Devolver:**
```bash
curl -X PUT http://localhost:3002/prestamos/1/devolver
```

**Verificar vencidos:**
```bash
curl -X POST http://localhost:3002/prestamos/verificar-vencidos
```

## 🗂️ Estructura de Archivos

```
apps/backend/
├── src/
│   ├── common/
│   │   ├── webhook-emitter.service.ts  # Servicio de emisión
│   │   └── webhook.module.ts           # Módulo global
│   ├── prestamos/
│   │   ├── prestamos.controller.ts     # Endpoints REST
│   │   ├── prestamos.service.ts        # Lógica de negocio
│   │   └── prestamos.module.ts
│   ├── app.module.ts
│   └── main.ts
├── data/
│   └── prestamos.json                   # Persistencia simple
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env
```

## 🔧 Configuración del WebhookEmitterService

### Uso básico

```typescript
import { WebhookEmitterService } from './common/webhook-emitter.service';

@Injectable()
export class MiServicio {
  constructor(
    private readonly webhookEmitter: WebhookEmitterService
  ) {}

  async miMetodo() {
    // Emitir evento único
    await this.webhookEmitter.emit('mi.evento', {
      id: 1,
      dato: 'valor'
    });

    // Emitir múltiples eventos
    await this.webhookEmitter.emitBatch([
      { evento: 'evento1', payload: { ... } },
      { evento: 'evento2', payload: { ... } }
    ]);
  }
}
```

### Características

- ✅ No bloquea el flujo principal (fire-and-forget)
- ✅ Manejo de errores silencioso
- ✅ Logs informativos
- ✅ Correlation IDs automáticos
- ✅ Soporte para múltiples URLs

## 🔄 Integración con n8n

### Flujo completo

1. Backend recibe request
2. Ejecuta lógica de negocio
3. Emite webhook(s) a n8n
4. n8n procesa workflows:
   - Notificación Telegram
   - Sincronización Google Sheets
   - Alertas críticas

### Configurar URLs múltiples

**Opción 1: Una URL, n8n distribuye**
```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/distribuidor
```

**Opción 2: URLs separadas (actual)**
```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/prestamos
N8N_SHEETS_WEBHOOK_URL=http://localhost:5678/webhook/prestamos-sheets
N8N_ALERTAS_WEBHOOK_URL=http://localhost:5678/webhook/alertas-criticas
```

Para usar múltiples URLs, modificar `webhook-emitter.service.ts`.

## 📊 Persistencia de Datos

Los datos se almacenan en `data/prestamos.json`:

```json
[
  {
    "id": 1,
    "usuarioId": "U001",
    "usuarioNombre": "Juan Pérez",
    "libroId": 101,
    "libroTitulo": "1984",
    "fechaPrestamo": "2026-01-11T10:00:00.000Z",
    "fechaDevolucion": "2026-01-18T10:00:00.000Z",
    "estado": "activo",
    "diasRestantes": 7
  }
]
```

**Nota:** En producción, usar base de datos real (PostgreSQL, MySQL, MongoDB).

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Linting
npm run lint

# Formateo
npm run format

# Tests
npm test
```

## 🐛 Troubleshooting

### Puerto 3002 ocupado

```bash
# Windows
netstat -ano | findstr :3002
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3002
kill -9 <PID>
```

### n8n no recibe webhooks

1. Verificar que n8n está corriendo: http://localhost:5678
2. Verificar URLs en `.env`
3. Verificar workflows activados
4. Ver logs del backend:
   ```
   [WebhookEmitterService] Emitiendo evento: prestamo.creado
   [WebhookEmitterService] ✓ Evento emitido exitosamente
   ```

### Datos no persisten

- Verificar que existe carpeta `data/`
- Permisos de escritura
- Ver logs de error

## 📈 Mejoras Futuras

- [ ] Base de datos real (PostgreSQL + TypeORM)
- [ ] Autenticación JWT
- [ ] Rate limiting
- [ ] Paginación en listados
- [ ] Validación con class-validator
- [ ] DTOs tipados
- [ ] Tests e2e
- [ ] Swagger/OpenAPI docs
- [ ] Docker Compose con BD
- [ ] Retry logic en webhooks
- [ ] Queue con RabbitMQ

## 📚 Recursos

- [NestJS Docs](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [n8n Integration](https://docs.n8n.io/)

---

✅ Backend configurado y listo para emitir eventos a n8n!
