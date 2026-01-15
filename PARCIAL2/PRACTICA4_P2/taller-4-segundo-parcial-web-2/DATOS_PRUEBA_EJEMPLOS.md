# 📦 DATOS DE PRUEBA - Ejemplos Listos para Usar

## 🎯 COPIAR Y PEGAR - Ejemplos de Payloads

### Ejemplo 1: Préstamo de Libro Clásico
```json
{
  "evento": "prestamo.creado",
  "timestamp": "2026-01-12T10:30:00Z",
  "data": {
    "id": 101,
    "libroTitulo": "Cien Años de Soledad",
    "usuario": "Juan Pérez García",
    "fechaDevolucion": "2026-01-19T10:30:00Z"
  }
}
```

### Ejemplo 2: Préstamo de Libro Técnico
```json
{
  "evento": "prestamo.creado",
  "timestamp": "2026-01-12T11:00:00Z",
  "data": {
    "id": 102,
    "libroTitulo": "Fundamentos de Programación en Python",
    "usuario": "María Rodríguez",
    "fechaDevolucion": "2026-01-26T11:00:00Z"
  }
}
```

### Ejemplo 3: Préstamo de Novela
```json
{
  "evento": "prestamo.creado",
  "timestamp": "2026-01-12T12:00:00Z",
  "data": {
    "id": 103,
    "libroTitulo": "El Código Da Vinci",
    "usuario": "Carlos López Mendoza",
    "fechaDevolucion": "2026-01-22T12:00:00Z"
  }
}
```

### Ejemplo 4: Devolución a Tiempo
```json
{
  "evento": "libro.devuelto",
  "timestamp": "2026-01-12T13:00:00Z",
  "data": {
    "id": 201,
    "libroTitulo": "Don Quijote de la Mancha",
    "usuario": "Ana María Torres",
    "fechaDevolucion": "2026-01-12T13:00:00Z"
  }
}
```

### Ejemplo 5: Devolución Anticipada
```json
{
  "evento": "libro.devuelto",
  "timestamp": "2026-01-12T14:00:00Z",
  "data": {
    "id": 202,
    "libroTitulo": "1984",
    "usuario": "Pedro Sánchez",
    "fechaDevolucion": "2026-01-12T14:00:00Z"
  }
}
```

### Ejemplo 6: Préstamo Vencido - Retraso Leve
```json
{
  "evento": "prestamo.vencido",
  "timestamp": "2026-01-12T15:00:00Z",
  "data": {
    "id": 301,
    "libroTitulo": "El Principito",
    "usuario": "Lucía Fernández",
    "diasRetraso": 2,
    "estado": "vencido"
  }
}
```

### Ejemplo 7: Préstamo Vencido - Retraso Moderado
```json
{
  "evento": "prestamo.vencido",
  "timestamp": "2026-01-12T16:00:00Z",
  "data": {
    "id": 302,
    "libroTitulo": "Rayuela",
    "usuario": "Roberto Gómez",
    "diasRetraso": 7,
    "estado": "vencido"
  }
}
```

### Ejemplo 8: Préstamo Vencido - Retraso Grave
```json
{
  "evento": "prestamo.vencido",
  "timestamp": "2026-01-12T17:00:00Z",
  "data": {
    "id": 303,
    "libroTitulo": "Crónica de una Muerte Anunciada",
    "usuario": "Isabel Martínez",
    "diasRetraso": 15,
    "estado": "vencido"
  }
}
```

### Ejemplo 9: Préstamo Vencido - Retraso Crítico
```json
{
  "evento": "prestamo.vencido",
  "timestamp": "2026-01-12T18:00:00Z",
  "data": {
    "id": 304,
    "libroTitulo": "La Casa de los Espíritus",
    "usuario": "Diego Ramírez",
    "diasRetraso": 30,
    "estado": "vencido"
  }
}
```

### Ejemplo 10: Préstamo con Descripción Completa
```json
{
  "evento": "prestamo.creado",
  "timestamp": "2026-01-12T19:00:00Z",
  "data": {
    "id": 105,
    "libroTitulo": "El Señor de los Anillos: La Comunidad del Anillo",
    "usuario": "Carmen Flores",
    "fechaDevolucion": "2026-02-02T19:00:00Z",
    "estado": "activo",
    "descripcion": "Préstamo extendido de 21 días por solicitud especial"
  }
}
```

---

## 🎬 COMANDOS cURL LISTOS PARA COPIAR

⚠️ **IMPORTANTE:** Reemplaza `TU_URL_AQUI` con la URL real de tu webhook de n8n.

### Para Workflow 1 (Notificaciones Telegram)

```powershell
# Test 1: Préstamo Creado
curl -X POST TU_URL_AQUI `
  -H "Content-Type: application/json" `
  -d '{
    "evento": "prestamo.creado",
    "timestamp": "2026-01-12T10:30:00Z",
    "data": {
      "id": 101,
      "libroTitulo": "Cien Años de Soledad",
      "usuario": "Juan Pérez García",
      "fechaDevolucion": "2026-01-19T10:30:00Z"
    }
  }'
```

```powershell
# Test 2: Libro Devuelto
curl -X POST TU_URL_AQUI `
  -H "Content-Type: application/json" `
  -d '{
    "evento": "libro.devuelto",
    "timestamp": "2026-01-12T13:00:00Z",
    "data": {
      "id": 201,
      "libroTitulo": "Don Quijote de la Mancha",
      "usuario": "Ana María Torres",
      "fechaDevolucion": "2026-01-12T13:00:00Z"
    }
  }'
```

### Para Workflow 2 (Google Sheets)

```powershell
# Test 3: Registro en Sheets - Préstamo
curl -X POST TU_URL_AQUI `
  -H "Content-Type: application/json" `
  -d '{
    "evento": "prestamo.creado",
    "timestamp": "2026-01-12T12:00:00Z",
    "data": {
      "id": 103,
      "libroTitulo": "1984",
      "usuario": "Carlos López",
      "estado": "activo",
      "descripcion": "Préstamo de 14 días"
    }
  }'
```

```powershell
# Test 4: Registro en Sheets - Devolución
curl -X POST TU_URL_AQUI `
  -H "Content-Type: application/json" `
  -d '{
    "evento": "libro.devuelto",
    "timestamp": "2026-01-12T14:00:00Z",
    "data": {
      "id": 202,
      "libroTitulo": "El Principito",
      "usuario": "Pedro Sánchez",
      "estado": "devuelto",
      "descripcion": "Devolución a tiempo"
    }
  }'
```

### Para Workflow 3 (Alertas Críticas)

```powershell
# Test 5: Alerta - Retraso Leve (espera LOW/MEDIUM)
curl -X POST TU_URL_AQUI `
  -H "Content-Type: application/json" `
  -d '{
    "evento": "prestamo.vencido",
    "timestamp": "2026-01-12T15:00:00Z",
    "data": {
      "id": 301,
      "libroTitulo": "El Principito",
      "usuario": "Lucía Fernández",
      "diasRetraso": 2,
      "estado": "vencido"
    }
  }'
```

```powershell
# Test 6: Alerta - Retraso Grave (espera HIGH)
curl -X POST TU_URL_AQUI `
  -H "Content-Type: application/json" `
  -d '{
    "evento": "prestamo.vencido",
    "timestamp": "2026-01-12T17:00:00Z",
    "data": {
      "id": 303,
      "libroTitulo": "Crónica de una Muerte Anunciada",
      "usuario": "Isabel Martínez",
      "diasRetraso": 15,
      "estado": "vencido"
    }
  }'
```

```powershell
# Test 7: Alerta - Retraso Crítico (espera HIGH)
curl -X POST TU_URL_AQUI `
  -H "Content-Type: application/json" `
  -d '{
    "evento": "prestamo.vencido",
    "timestamp": "2026-01-12T18:00:00Z",
    "data": {
      "id": 304,
      "libroTitulo": "La Casa de los Espíritus",
      "usuario": "Diego Ramírez",
      "diasRetraso": 30,
      "estado": "vencido"
    }
  }'
```

---

## 📝 PLANTILLA PARA TUS PROPIOS DATOS

### Plantilla de Préstamo Creado
```json
{
  "evento": "prestamo.creado",
  "timestamp": "FECHA_ISO_8601",
  "data": {
    "id": NUMERO_ID,
    "libroTitulo": "TITULO_DEL_LIBRO",
    "usuario": "NOMBRE_COMPLETO_USUARIO",
    "fechaDevolucion": "FECHA_ISO_8601"
  }
}
```

### Plantilla de Libro Devuelto
```json
{
  "evento": "libro.devuelto",
  "timestamp": "FECHA_ISO_8601",
  "data": {
    "id": NUMERO_ID,
    "libroTitulo": "TITULO_DEL_LIBRO",
    "usuario": "NOMBRE_COMPLETO_USUARIO",
    "fechaDevolucion": "FECHA_ISO_8601"
  }
}
```

### Plantilla de Préstamo Vencido
```json
{
  "evento": "prestamo.vencido",
  "timestamp": "FECHA_ISO_8601",
  "data": {
    "id": NUMERO_ID,
    "libroTitulo": "TITULO_DEL_LIBRO",
    "usuario": "NOMBRE_COMPLETO_USUARIO",
    "diasRetraso": NUMERO_DIAS,
    "estado": "vencido"
  }
}
```

---

## 📚 LISTA DE LIBROS SUGERIDOS (para variedad)

### Clásicos de Literatura
- Cien Años de Soledad (Gabriel García Márquez)
- Don Quijote de la Mancha (Miguel de Cervantes)
- 1984 (George Orwell)
- El Principito (Antoine de Saint-Exupéry)
- Rayuela (Julio Cortázar)
- Crónica de una Muerte Anunciada (Gabriel García Márquez)
- La Casa de los Espíritus (Isabel Allende)
- El Amor en los Tiempos del Cólera (Gabriel García Márquez)

### Literatura Moderna
- Harry Potter y la Piedra Filosofal (J.K. Rowling)
- El Código Da Vinci (Dan Brown)
- Los Juegos del Hambre (Suzanne Collins)
- El Señor de los Anillos (J.R.R. Tolkien)
- Crepúsculo (Stephenie Meyer)

### Libros Técnicos
- Fundamentos de Programación en Python
- Clean Code (Robert C. Martin)
- Diseño de Sistemas Distribuidos
- Inteligencia Artificial: Un Enfoque Moderno
- Estructuras de Datos y Algoritmos en Java

---

## 👥 NOMBRES DE USUARIOS SUGERIDOS

- Juan Pérez García
- María Rodríguez López
- Carlos López Mendoza
- Ana María Torres Ruiz
- Pedro Sánchez Gómez
- Lucía Fernández Castro
- Roberto Gómez Díaz
- Isabel Martínez Serrano
- Diego Ramírez Morales
- Carmen Flores Ortiz
- Andrés Silva Herrera
- Patricia Ramos Vega
- Fernando Jiménez Cruz
- Sofía Moreno Delgado
- Miguel Ángel Guerrero

---

## 🎲 GENERADOR RÁPIDO

### Para generar timestamps actuales en PowerShell:
```powershell
Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
```

### Para generar ID aleatorio:
```powershell
Get-Random -Minimum 100 -Maximum 999
```

### Ejemplo completo con generación:
```powershell
$timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
$id = Get-Random -Minimum 100 -Maximum 999

$payload = @"
{
  "evento": "prestamo.creado",
  "timestamp": "$timestamp",
  "data": {
    "id": $id,
    "libroTitulo": "Libro Aleatorio",
    "usuario": "Usuario de Prueba",
    "fechaDevolucion": "$(Get-Date (Get-Date).AddDays(7) -Format 'yyyy-MM-ddTHH:mm:ssZ')"
  }
}
"@

curl -X POST TU_URL_AQUI `
  -H "Content-Type: application/json" `
  -d $payload
```

---

## ✅ CHECKLIST DE USO

Para cada prueba, verifica:

### Workflow 1 (Telegram)
- [ ] Recibes mensaje en Telegram
- [ ] El mensaje está personalizado por IA
- [ ] Incluye emojis apropiados
- [ ] Muestra datos del libro y usuario

### Workflow 2 (Sheets)
- [ ] Se agrega nueva fila en Sheets
- [ ] Fecha/Hora está formateada correctamente
- [ ] Todos los campos están completos
- [ ] No hay errores de formato

### Workflow 3 (Alertas)
- [ ] Gemini analiza el evento
- [ ] Se clasifica como HIGH/MEDIUM/LOW
- [ ] Si es HIGH: Llega alerta a Telegram
- [ ] Si es MEDIUM/LOW: Aparece en logs

---

> 💡 **Tip:** Guarda este archivo para reutilizar los ejemplos. Puedes copiar y pegar directamente en tus pruebas.
