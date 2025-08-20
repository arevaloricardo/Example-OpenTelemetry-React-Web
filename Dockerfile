# Dockerfile para aplicación React con Vite y Bun
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Instalar dependencias
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json ./
COPY bun.lock* ./
RUN cp package.json /temp/dev/ && cp bun.lock* /temp/dev/ 2>/dev/null || true
RUN cd /temp/dev && bun install --frozen-lockfile

# Instalar solo dependencias de producción
RUN mkdir -p /temp/prod
RUN cp package.json /temp/prod/ && cp bun.lock* /temp/prod/ 2>/dev/null || true
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Build de la aplicación
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
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
