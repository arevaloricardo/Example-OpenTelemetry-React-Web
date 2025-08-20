# Dockerfile para aplicación React con Vite y Bun
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Instalar dependencias
FROM base AS install
# Copiar archivos de dependencias
COPY package.json bun.lock ./
# Instalar todas las dependencias
RUN bun install --frozen-lockfile

# Build de la aplicación
FROM base AS build
COPY --from=install /usr/src/app/node_modules node_modules
COPY . .

# Variables de entorno para el build
ENV NODE_ENV=production

# Build de la aplicación
RUN bun run build

# Servir con nginx
FROM nginx:alpine AS release
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Configuración de nginx para SPA
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
