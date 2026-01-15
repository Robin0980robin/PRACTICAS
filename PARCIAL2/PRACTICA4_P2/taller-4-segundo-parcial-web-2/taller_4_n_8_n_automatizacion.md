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
En este taller, los estudiantes extenderán su arquitectura de microservicios con MCP para integrar **n8n** como capa de automatización de eventos. El sistema MCP desarrollado en el Taller 3 seguirá siendo el orquestador principal, mientras que n8n se encargará de las consecuencias automáticas de las operaciones: **notificaciones, sincronización con servicios externos y alertas inteligentes**.

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

## 4. Eventos por Dominio

| Proyecto | Evento Principal | Evento Crítico | Evento Info |
|--------|-----------------|---------------|-------------|
| Biblioteca | prestamo.creado | prestamo.vencido | libro.devuelto |
| Inventario | egreso.creado | producto.stock_bajo | ingreso.registrado |
| Citas Médicas | cita.agendada | cita.cancelada | cita.completada |
| Reservas | reserva.confirmada | reserva.cancelada | checkin.realizado |
| Pedidos | pedido.recibido | pedido.cancelado | pedido.entregado |

---

## 5. Especificación de Workflows

### 5.1 Workflow 1 – Notificación en Tiempo Real
**Flujo:**  
Webhook → IF → Transformar → Gemini → Telegram → Respuesta

### 5.2 Workflow 2 – Sincronización con Google Sheets
**Flujo:**  
Webhook → Transformar → Google Sheets (Append)

Columnas sugeridas:
- Fecha/Hora
- Tipo de Evento
- ID Registro
- Descripción
- Usuario
- Estado

### 5.3 Workflow 3 – Alertas Críticas
**Flujo:**  
Webhook → IF → Gemini → Switch → (Telegram / Email / Log)

---

## 6. Código de Referencia

### 6.1 WebhookEmitterService (Backend)
```ts
@Injectable()
export class WebhookEmitterService {
  private readonly n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

  async emit(evento: string, payload: any) {
    if (!this.n8nWebhookUrl) return;
    await fetch(this.n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evento, timestamp: new Date(), data: payload }),
    });
  }
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
proyecto-mcp/
├── apps/
│   ├── backend/
│   │   └── src/common/webhook-emitter.service.ts
│   ├── mcp-server/
│   └── api-gateway/
├── n8n/
│   ├── docker-compose.yml
│   ├── workflows/
│   └── README.md
└── README.md
```

---

## 8. Flujo de Demostración
1. Usuario solicita operación
2. Gemini decide Tools
3. Backend registra y emite evento
4. n8n notifica, sincroniza y evalúa alertas

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

