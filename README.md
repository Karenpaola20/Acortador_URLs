# URL Shortener

Acortador de URLs con Node.js + Express. Corre en local, sin AWS.

> La versión original (parcial) se desplegó en AWS serverless (Lambda + API Gateway + DynamoDB + S3/CloudFront). Ese código de infraestructura se conserva en `terraform/` como referencia, pero ya no se usa.

---

# Cómo correrlo

Requisitos: Node.js 18 o superior.

```bash
cd backend
npm install
npm start
```

Abrir http://localhost:3000

Pruebas automáticas:

```bash
cd backend
npm test
```

Los enlaces se guardan en `backend/data/urls.json` (se crea solo).

---

# Estructura

```
backend/
  app.js        Endpoints /shorten, /{codigo} y /stats/{codigo}
  store.js      Almacenamiento en archivo JSON (reemplaza a DynamoDB)
  server.js     Arranque del servidor
  app.test.js   Pruebas
frontend/       HTML/CSS/JS (lo sirve el backend)
terraform/      Infraestructura AWS anterior (solo referencia)
```

---

# Arquitectura

Frontend (HTML/JS)
↓
Express (Node.js)
↓
Archivo JSON

---

# Tecnologías utilizadas

- Node.js + Express
- JavaScript
- HTML/CSS
- node:test (pruebas)

---

# Funcionalidades

## Acortamiento de URLs

Permite enviar una URL larga y generar una URL corta.

### Endpoint

POST /shorten

### Ejemplo

```json
{
  "url": "https://youtube.com"
}
```

---

## Redirección

Permite redireccionar automáticamente utilizando HTTP 302.

### Endpoint

GET /{codigo}

---

## Estadísticas

Permite visualizar estadísticas de visitas del enlace.

### Endpoint

GET /stats/{codigo}

Filtro opcional por fecha: GET /stats/{codigo}?date=2026-10-28

### Información mostrada

- Total de visitas
- Fechas de acceso
- Historial de visitas

---

# Frontend

El proyecto incluye:

- Formulario para generar URLs cortas
- Copiar enlace automáticamente
- Página de estadísticas
- Navegación entre vistas

---
