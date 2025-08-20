# 🐳 Guía de Docker para React + Vite + Bun + TanStack Router

## 📋 Requisitos Previos
- Docker Desktop instalado
- Docker Compose (incluido con Docker Desktop)

## 🚀 Opciones de Despliegue

### 1. **Producción (con Nginx)**

#### Usando Docker Compose (Recomendado)
```bash
# Construir y ejecutar
bun run docker:compose

# Parar contenedores
bun run docker:compose-down
```

#### Usando Docker directamente
```bash
# Construir imagen
bun run docker:build

# Ejecutar contenedor
bun run docker:run
```

**Acceder a:** http://localhost:5290

---

### 2. **Desarrollo (con Hot Reload)**

#### Usando Docker Compose (Recomendado)
```bash
# Construir y ejecutar en modo desarrollo
bun run docker:compose-dev

# Parar contenedores
bun run docker:compose-down-dev
```

#### Usando Docker directamente
```bash
# Construir imagen de desarrollo
bun run docker:build-dev

# Ejecutar con volúmenes para hot reload
bun run docker:run-dev
```

**Acceder a:** http://localhost:5291

---

## 🔧 Configuración de Variables de Entorno

### Para Producción
Crea un archivo `.env.production`:
```bash
VITE_BASE_URL=https://tu-api-production.com
```

### Para Desarrollo
El archivo `.env` existente:
```bash
VITE_BASE_URL=http://localhost:5000
```

---

## 📁 Estructura de Archivos Docker

```
├── Dockerfile              # Imagen de producción (multi-stage)
├── Dockerfile.dev          # Imagen de desarrollo
├── docker-compose.yml      # Orquestación para producción
├── docker-compose.dev.yml  # Orquestación para desarrollo
├── nginx.conf              # Configuración de Nginx para SPA
└── .dockerignore           # Archivos excluidos del contexto
```

---

## 🎯 Características de la Configuración

### ✅ **Imagen de Producción**
- **Multi-stage build** para optimizar tamaño
- **Nginx Alpine** para servir archivos estáticos
- **Configuración SPA** para TanStack Router
- **Compresión Gzip** habilitada
- **Cache headers** para assets estáticos
- **Security headers** incluidos

### ✅ **Imagen de Desarrollo**
- **Hot reload** habilitado
- **Volúmenes** para desarrollo en tiempo real
- **Puerto 5173** (puerto por defecto de Vite)
- **Variables de entorno** de desarrollo

### ✅ **Optimizaciones**
- **.dockerignore** para excluir archivos innecesarios
- **Frozen lockfile** para builds reproducibles
- **Nginx optimizado** para SPAs
- **Scripts npm** predefinidos

---

## 🔍 Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Reconstruir solo si hay cambios
docker-compose up --build

# Ejecutar en background
docker-compose up -d

# Ver contenedores activos
docker ps

# Limpiar imágenes no utilizadas
docker image prune

# Limpiar todo (cuidado!)
docker system prune -a
```

---

## 🌐 Integración con Backend

Si tienes un backend, descomenta la sección `backend` en `docker-compose.yml`:

```yaml
backend:
  image: tu-backend-image:latest
  ports:
    - "5000:5000"
  environment:
    - NODE_ENV=production
  networks:
    - app-network
```

---

## 🚨 Troubleshooting

### **Puerto ya en uso**
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "5292:80"  # Cambiar 5290 por 5292
```

### **Problemas con volúmenes en Windows**
```bash
# Asegurar que Docker Desktop tenga acceso a la unidad C:
# Settings > Resources > File Sharing
```

### **Variables de entorno no se cargan**
```bash
# Verificar que el archivo .env existe
# Reconstruir la imagen
docker-compose up --build --force-recreate
```

---

## 📦 Despliegue en Producción

### **Docker Hub**
```bash
# Tag de la imagen
docker tag react-tanstack-app:latest usuario/react-tanstack-app:latest

# Push a Docker Hub
docker push usuario/react-tanstack-app:latest
```

### **Servidor**
```bash
# En el servidor
docker pull usuario/react-tanstack-app:latest
docker run -d -p 80:80 usuario/react-tanstack-app:latest
```

¡Tu aplicación React con TanStack Router está lista para Docker! 🎉
