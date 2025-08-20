# Instrucciones de Deploy con Dokploy

## Variables de Entorno Requeridas

En Dokploy, configura las siguientes variables de entorno para tu aplicación:

```bash
# URL del API (puerto 8080 en el mismo proyecto)
VITE_BASE_URL=https://web-a.test.alineadoos.com:8080

# URL del dominio web (opcional)
VITE_WEB_URL=https://web-a.test.alineadoos.com

# Entorno
NODE_ENV=production
```

## Configuración en Dokploy

1. **Crear una nueva aplicación en Dokploy**
   - Selecciona "Docker" como tipo de aplicación
   - Conecta tu repositorio Git

2. **Configurar el dominio**
   - Dominio: `web-a.test.alineadoos.com`
   - Puerto interno: `80` (el contenedor expone nginx en el puerto 80)

3. **Variables de entorno**
   - Agrega las variables mencionadas arriba en la sección de Environment Variables

4. **Build y Deploy**
   - Dokploy automáticamente detectará el Dockerfile
   - El build process instalará dependencias y construirá la aplicación
   - Nginx servirá los archivos estáticos

## Notas importantes

- **Cloudflare**: Como tu dominio está gestionado por Cloudflare con proxy y SSL, asegúrate de que:
  - El SSL/TLS mode esté en "Full (strict)" o "Full"
  - El proxy esté habilitado (nube naranja)

- **API Connection**: El API en el puerto 8080 debe estar accesible desde el mismo proyecto en Dokploy

- **Health Check**: El contenedor incluye un endpoint `/health` para verificación de estado

## Comandos de desarrollo local

### Con Docker Compose (Recomendado)

Para usar Docker Compose necesitas definir las variables de entorno en tu sistema:

**En Windows (PowerShell):**
```powershell
# Para producción
$env:VITE_BASE_URL="https://web-a.test.alineadoos.com:8080"
$env:VITE_WEB_URL="https://web-a.test.alineadoos.com"
$env:NODE_ENV="production"
npm run docker:compose

# Para desarrollo
$env:VITE_BASE_URL="http://localhost:8080"
$env:VITE_WEB_URL="http://localhost:3000"
$env:NODE_ENV="development"
npm run docker:compose-dev
```

**En Linux/Mac (bash):**
```bash
# Para producción
export VITE_BASE_URL="https://web-a.test.alineadoos.com:8080"
export VITE_WEB_URL="https://web-a.test.alineadoos.com"
export NODE_ENV="production"
npm run docker:compose

# Para desarrollo
export VITE_BASE_URL="http://localhost:8080"
export VITE_WEB_URL="http://localhost:3000"
export NODE_ENV="development"
npm run docker:compose-dev
```

**Usando archivo .env (alternativa):**
```bash
# Cargar variables desde .env y ejecutar
docker-compose --env-file .env up --build
docker-compose --env-file .env.dev -f docker-compose.dev.yml up --build
```

```bash
# Detener los contenedores
npm run docker:compose-down
npm run docker:compose-down-dev
```

### Con Docker directo

```bash
# Build de la imagen
npm run docker:build

# Ejecutar con configuración de producción
npm run docker:run

# Ejecutar con configuración local
npm run docker:run-local

# Test rápido (se elimina el contenedor al terminar)
npm run docker:test
```

## Troubleshooting

- Si hay problemas de CORS, verifica la configuración del API
- Para problemas de SSL, revisa la configuración de Cloudflare
- Los logs de nginx están disponibles en `/var/log/nginx/` dentro del contenedor
