# TALLER N° 4 – n8n: Automatización de Workflows con Inteligencia Artificial

**Universidad Laica Eloy Alfaro de Manabí (ULEAM)**  
**Facultad:** Ciencias Informáticas  
**Carrera:** Software – Nivel Quinto  
**Asignatura:** Aplicación para el Servidor Web  
**Paralelos:** A – B  
**Docente:** Ing. John Cevallos  
**Período:** 2025–2022026 (2)  
**Duración:** 6 horas (3h no presencial + 3h presencial)  
**Modalidad:** Grupal  
**Prerrequisito:** Talleres 1, 2 y 3 completados  
**Entrega:** Un día antes de la clase

---

## 1. Descripción General
En este taller, los estudiantes extenderán su arquitectura de microservicios con MCP para integrar **n8n** como capa de automatización de eventos en el **sistema de gestión de prescripciones médicas y comparación de precios de medicamentos**. El sistema MCP desarrollado en el Taller 3 seguirá siendo el orquestador principal, mientras que n8n se encargará de las consecuencias automáticas de las operaciones: **notificaciones a pacientes/médicos, sincronización de prescripciones con Google Sheets, y alertas sobre stock bajo de medicamentos**.

### 1.1 ¿Qué es n8n?
n8n ("nodemation") es una plataforma de automatización de workflows basada en nodos, **open-source y self-hosteable**, que permite crear flujos visuales sin escribir código extensivo.

**Características:**
- Visual & Low-Code (drag-and-drop)
- Open Source (licencia fair-code)
- Self-Hosteable
- Extensible (400+ integraciones + nodos custom)

### 1.2 Evolución desde Talleres Anteriores
- **Taller 1:** Microservicios + RabbitMQ
- **Taller 2:** Webhooks + Serverless
- **Taller 3:** MCP + IA
- **Taller 4 (Actual):** n8n + Event-Driven

### 1.3 Arquitectura del Proyecto (4 Capas)

| Capa | Componente | Responsabilidad |
|-----|-----------|----------------|
| 1 | API Gateway + Gemini (3000) | Recepción de solicitudes, decisión de Tools |
| 2 | MCP Server (3001) | Exposición de Tools, JSON-RPC 2.0 |
| 3 | Backend NestJS (3002) | CRUD + emisión de eventos |
| 4 | **n8n (5678)** | Automatización de consecuencias |

**Principio clave:** El Backend no conoce qué sucede después de emitir el evento.

---

## 2. Objetivos de Aprendizaje
1. Comprender **Event-Driven Architecture**
2. Dominar **n8n** y workflows visuales
3. Integrar **IA (Gemini)** en workflows
4. Conectar servicios externos (Telegram, Google Sheets)
5. Extender el sistema sin afectar la lógica MCP

---

## 3. Requisitos del Sistema

### 3.1 Base desde Talleres Anteriores
- Backend NestJS + SQLite
- MCP Server con 3 Tools
- API Gateway con Gemini funcional

### 3.2 Nuevos Componentes

#### A) Backend – Emisor de Webhooks
Servicio independiente que emite eventos HTTP hacia n8n.

#### B) n8n con Docker
Instancia auto-hospedada de n8n ejecutándose en Docker.

#### C) Workflows Obligatorios
1. Notificación (Telegram + IA)
2. Sincronización (Google Sheets)
3. Alertas (condiciones críticas)

---

## 4. Eventos del Sistema Farmacéutico

### Eventos Obligatorios para Implementar

| Evento | Tipo | Descripción | Payload Incluye |
|--------|------|-------------|----------------|
| **prescripcion.registrada** | Principal | Nueva prescripción médica registrada | id_prescripcion, id_paciente, medicamentos[], fecha |
| **comparacion.realizada** | Info | Comparación de precios completada | id_prescripcion, mejor_precio, farmacia, ahorro |
| **medicamento.stock_bajo** | Crítico | Stock bajo en inventario | id_medicamento, stock_actual, stock_minimo |
| **prescripcion.vencida** | Crítico | Prescripción expirada sin surtir | id_prescripcion, dias_vencidos, paciente |
| **precio.actualizado** | Info | Precio de medicamento actualizado | id_medicamento, precio_anterior, precio_nuevo |

### Eventos Opcionales (Extensiones)

| Evento | Tipo | Descripción |
|--------|------|-------------|
| medicamento.agregado | Info | Nuevo medicamento en catálogo |
| farmacia.registrada | Info | Nueva farmacia añadida |
| alerta.interaccion | Crítico | Interacción medicamentosa detectada |

---

## 5. Especificación de Workflows

### 5.1 Workflow 1 – Notificación en Tiempo Real (Telegram + IA)

**Evento Disparador:** `prescripcion.registrada`

**Flujo:**  
Webhook → IF (¿es prescripción?) → Transformar → Gemini (personalizar mensaje) → Telegram → Respuesta

**Ejemplo de Mensaje Personalizado:**
```
🏥 Nueva Prescripción #1234

Paciente: Juan Pérez
Medicamentos:
  • Paracetamol 500mg - 20 tabletas
  • Ibuprofeno 400mg - 15 tabletas

Comparación: Farmacia Cruz Verde - Ahorro: $5.20

✅ Prescripción lista para recoger
```

**Configuración Gemini:**
- Prompt: "Genera un mensaje amigable para notificar al paciente sobre su prescripción"
- Model: gemini-2.0-flash-exp
- Temperature: 0.7

### 5.2 Workflow 2 – Sincronización con Google Sheets

**Evento Disparador:** `prescripcion.registrada` o `comparacion.realizada`

**Flujo:**  
Webhook → Transformar Datos → Google Sheets (Append Row)

**Columnas de la Hoja:**
- Fecha/Hora
- Tipo de Evento
- ID Prescripción
- Paciente
- Medicamentos (lista)
- Mejor Precio
- Farmacia Recomendada
- Ahorro Total
- Estado (Pendiente/Surtida/Vencida)

**Ejemplo de Fila:**
```
2025-01-11 14:30 | prescripcion.registrada | 1234 | Juan Pérez | Paracetamol, Ibuprofeno | $25.50 | Cruz Verde | $5.20 | Pendiente
```

**Configuración:**
- Spreadsheet: "Prescripciones 2025"
- Sheet: "Registro"
- Autenticación: OAuth2 Google Service Account

### 5.3 Workflow 3 – Alertas Críticas

**Eventos Disparadores:** `medicamento.stock_bajo`, `prescripcion.vencida`

**Flujo:**  
Webhook → IF (¿es crítico?) → Gemini (analizar severidad) → Switch (por nivel) → Canales de Notificación

**Niveles de Severidad:**

| Nivel | Condición | Canal |
|-------|-----------|-------|
| 🔴 CRÍTICO | Stock = 0 o prescripción vencida >7 días | Telegram + Email |
| 🟡 ADVERTENCIA | Stock < 10 unidades | Telegram |
| 🟢 INFO | Stock < 50 unidades | Log |

**Ejemplo de Alerta Crítica:**
```
🚨 ALERTA CRÍTICA - STOCK AGOTADO

Medicamento: Paracetamol 500mg
Stock Actual: 0 unidades
Stock Mínimo: 50 unidades

Acción Requerida: Reabastecimiento urgente
Proveedor: Farmacorp - Tel: 098-765-4321
```

**Configuración Gemini:**
- Prompt: "Analiza la severidad del evento y genera una alerta apropiada"
- Entrada: evento, stock_actual, stock_minimo
- Salida: nivel_severidad (CRÍTICO/ADVERTENCIA/INFO), mensaje

---

## 6. Código de Referencia

### 6.1 WebhookEmitterService (Backend)
```ts
@Injectable()
export class WebhookEmitterService {
  private readonly logger = new Logger(WebhookEmitterService.name);
  private readonly n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  async emit(evento: string, payload: any, metadata?: any) {
    if (!this.n8nWebhookUrl) {
      this.logger.warn('N8N_WEBHOOK_URL no configurada');
      return;
    }

    const webhookPayload = {
      evento,
      timestamp: new Date().toISOString(),
      data: payload,
      metadata: {
        source: 'backend-farmacia',
        version: '1.0.0',
        correlationId: this.generateCorrelationId(),
        ...metadata,
      },
    };

    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.logger.log(`Evento ${evento} emitido exitosamente`);
    } catch (error) {
      this.logger.error(`Error emitiendo evento ${evento}:`, error);
    }
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async emitBatch(eventos: Array<{ evento: string; payload: any }>) {
    return Promise.all(
      eventos.map(({ evento, payload }) => this.emit(evento, payload)),
    );
  }
}
```

**Ejemplo de Uso:**
```ts
// En PrescripcionesService
async crearPrescripcion(dto: CreatePrescripcionDto) {
  const prescripcion = await this.repo.save(dto);

  // Emitir evento a n8n
  await this.webhookEmitter.emit('prescripcion.registrada', {
    id_prescripcion: prescripcion.id,
    id_paciente: prescripcion.pacienteId,
    fecha: prescripcion.fecha,
    medicamentos: prescripcion.detalles.map(d => ({
      id: d.medicamentoId,
      nombre: d.medicamento.nombre,
      cantidad: d.cantidad,
      dosis: d.dosis,
    })),
  });

  return prescripcion;
}
```

### 6.2 Docker Compose para n8n
```yml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=uleam2025
    volumes:
      - n8n_data:/home/node/.n8n
volumes:
  n8n_data:
```

---

## 7. Estructura de Archivos
```text
proyecto-farmacia-mcp/
├── apps/
│   ├── backend/
│   │   └── src/
│   │       ├── common/
│   │       │   ├── webhook-emitter.service.ts  ← NUEVO
│   │       │   └── webhook.module.ts           ← NUEVO
│   │       ├── prescripciones/
│   │       │   ├── prescripciones.service.ts   (emite eventos)
│   │       │   └── prescripciones.controller.ts
│   │       ├── productos/
│   │       │   └── productos.service.ts        (emite eventos)
│   │       └── comparador/
│   │           └── comparador.service.ts       (emite eventos)
│   ├── mcp-server/
│   │   └── src/tools/
│   │       ├── buscar-producto.tool.ts
│   │       ├── validar-stock.tool.ts
│   │       └── crear-comparacion.tool.ts
│   └── api-gateway/
│       └── src/ia/
│           ├── gemini.service.ts
│           └── ia.controller.ts
├── n8n/
│   ├── docker-compose.yml
│   ├── .env
│   ├── workflows/
│   │   ├── 01-notificacion-telegram.md
│   │   ├── 02-google-sheets.md
│   │   └── 03-alertas-criticas.md
│   └── README.md
├── .env (N8N_WEBHOOK_URL=http://localhost:5678/webhook/...)
└── README_TALLER_4.md
```

---

## 8. Flujo de Demostración End-to-End

**Escenario:** Paciente solicita prescripción de Paracetamol

```
1. 👤 Usuario → API Gateway (3000)
   POST /ia/query
   { "message": "Busca paracetamol 500mg y crea una prescripción para Juan Pérez" }

2. 🤖 Gemini AI → MCP Server (3001)
   Function Call: buscar_producto({ query: "paracetamol 500mg" })
   Function Call: validar_stock({ productoId: 15, cantidad: 20 })

3. 🏥 Backend (3002) → Base de Datos
   INSERT INTO prescripciones (...)
   INSERT INTO detalles_prescripcion (...)

4. 📡 Backend → n8n (5678)
   POST /webhook/prescripcion
   {
     "evento": "prescripcion.registrada",
     "data": {
       "id_prescripcion": 1234,
       "paciente": "Juan Pérez",
       "medicamentos": [{ "nombre": "Paracetamol 500mg", "cantidad": 20 }]
     }
   }

5. 🔄 n8n → Workflows Paralelos
   ├── Workflow 1: Telegram ("🏥 Prescripción #1234 lista")
   ├── Workflow 2: Google Sheets (agregar fila)
   └── Workflow 3: Evaluar alertas (stock OK, no crítico)

6. 📱 Telegram → Paciente
   "Hola Juan, tu prescripción #1234 está lista.
   Paracetamol 500mg (20 tabletas) - $12.50
   Retira en Farmacia Cruz Verde. ✅"

7. 📊 Google Sheets → Registro Actualizado
   Nueva fila con todos los datos de la prescripción

8. ✅ API Gateway → Usuario
   {
     "success": true,
     "response": "Prescripción #1234 creada exitosamente. 
                  Paracetamol disponible en 3 farmacias.",
     "toolsExecuted": ["buscar_producto", "validar_stock", "crear_prescripcion"],
     "notificaciones": ["telegram", "sheets"]
   }
```

**Tiempo Total:** ~3-5 segundos (incluye procesamiento IA + notificaciones)

---

## 9. Stack Tecnológico
- Backend: NestJS + SQLite
- MCP: TypeScript + JSON-RPC
- IA: Gemini API
- Automatización: n8n + Docker

---

## 10. Entregables
1. Repositorio Git completo
2. README.md actualizado
3. Video demo (3–5 min)
4. Workflows documentados
5. Google Sheets con registros

---

## 11. Rúbrica
| Criterio | Puntos |
|--------|--------|
| Workflow Notificación | 25 |
| Workflow Sincronización | 20 |
| Workflow Alertas | 20 |
| Integración Backend | 15 |
| Flujo End-to-End | 10 |
| Documentación | 10 |
| **TOTAL** | **100** |

---

## 12. Recursos
- https://docs.n8n.io
- https://n8n.io/workflows
- https://core.telegram.org/bots
- https://developers.google.com/sheets/api
- https://aistudio.google.com

> *"n8n extiende tu sistema sin invadirlo. El Backend hace lo suyo, n8n automatiza las consecuencias."*

