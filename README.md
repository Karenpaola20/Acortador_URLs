# URL Shortener AWS Serverless

Proyecto de acortador de URLs desarrollado con arquitectura serverless utilizando AWS y Terraform.

---

# Arquitectura

Frontend (S3 + CloudFront)
↓
API Gateway
↓
AWS Lambda
↓
DynamoDB

---

# Tecnologías utilizadas

- AWS Lambda
- API Gateway
- DynamoDB
- Terraform
- AWS S3
- CloudFront
- GitHub Actions
- JavaScript
- HTML/CSS

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

# Infraestructura con Terraform

El proyecto utiliza Terraform para desplegar:

- AWS Lambda
- API Gateway
- IAM Roles
- DynamoDB
- S3 Bucket
- CloudFront

---

# CI/CD

Se implementó GitHub Actions para despliegue automático del frontend hacia AWS S3.

Workflow:

GitHub Push
↓
GitHub Actions
↓
Deploy automático a S3
↓
CloudFront actualiza frontend

---

# Despliegue Terraform

```bash
terraform init
terraform apply
```

---