#!/bin/bash

# Script de despliegue para Dokploy
# Variables de entorno para producción

export NODE_ENV=production
export VITE_BASE_URL=https://api.test.alineadoos.com

echo "🚀 Desplegando frontend en Dokploy..."

# Construir imagen
docker build -f Dockerfile.prod -t react-frontend:latest .

# Si estás usando docker-compose en Dokploy
# docker-compose -f docker-compose.prod.yml up -d

echo "✅ Despliegue completado"
echo "🌐 URL: https://web-a.test.alineadoos.com"
