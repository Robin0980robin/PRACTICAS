#!/bin/bash

# Script de instalación Taller 4 - n8n + Automatización
# Autor: Sistema de Talleres ULEAM
# Versión: 1.0.0

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN} TALLER 4: n8n + Automatización de Eventos${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# Función para verificar comandos
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar pre-requisitos
echo -e "${YELLOW}📋 Verificando pre-requisitos...${NC}"
echo ""

declare -A prerequisites=(
    ["Node.js"]="node"
    ["npm"]="npm"
    ["Docker"]="docker"
    ["Docker Compose"]="docker-compose"
)

missing=()
for prereq in "${!prerequisites[@]}"; do
    cmd="${prerequisites[$prereq]}"
    if command_exists "$cmd"; then
        version=$($cmd --version 2>/dev/null)
        echo -e "  ${GREEN}✓${NC} $prereq: $version"
    else
        echo -e "  ${RED}✗${NC} $prereq: No instalado"
        missing+=("$prereq")
    fi
done

if [ ${#missing[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}❌ Faltan los siguientes pre-requisitos:${NC}"
    for item in "${missing[@]}"; do
        echo -e "   ${RED}- $item${NC}"
    done
    echo ""
    echo -e "${YELLOW}Por favor instalar antes de continuar.${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN} 1. Instalando Backend${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

cd apps/backend || exit 1

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ No se encontró package.json en apps/backend${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Instalando dependencias del backend...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error instalando dependencias del backend${NC}"
    exit 1
fi

# Configurar .env si no existe
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Copiando archivo .env...${NC}"
    cp .env.example .env
    echo -e "  ${GREEN}✓${NC} .env creado"
fi

# Crear carpeta data
if [ ! -d "data" ]; then
    mkdir -p data
    echo -e "  ${GREEN}✓${NC} Carpeta data/ creada"
fi

echo -e "  ${GREEN}✓${NC} Backend configurado"

cd ../..

echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN} 2. Configurando n8n${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

cd n8n || exit 1

echo -e "${YELLOW}🐳 Descargando imagen de n8n...${NC}"
docker pull n8nio/n8n:latest

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error descargando imagen de n8n${NC}"
    exit 1
fi

echo -e "  ${GREEN}✓${NC} Imagen de n8n descargada"

echo ""
echo -e "${YELLOW}🚀 Iniciando n8n con Docker Compose...${NC}"
docker-compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error iniciando n8n${NC}"
    exit 1
fi

echo -e "  ${GREEN}✓${NC} n8n iniciado correctamente"

echo ""
echo -e "${YELLOW}⏳ Esperando que n8n esté listo...${NC}"
sleep 10

# Verificar que n8n responda
max_retries=10
retries=0
n8n_ready=false

while [ $n8n_ready = false ] && [ $retries -lt $max_retries ]; do
    if curl -s http://localhost:5678 >/dev/null 2>&1; then
        n8n_ready=true
    else
        retries=$((retries + 1))
        echo "  Esperando... (intento $retries/$max_retries)"
        sleep 3
    fi
done

if [ $n8n_ready = true ]; then
    echo -e "  ${GREEN}✓${NC} n8n está listo!"
else
    echo -e "  ${YELLOW}⚠️${NC} n8n tardó en iniciarse, pero continúa en segundo plano"
fi

cd ..

echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN} 3. Verificando MCP Server (del Taller 3)${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

if [ -d "apps/mcp-server" ]; then
    cd apps/mcp-server || exit 1
    
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Instalando MCP Server...${NC}"
        npm install
    else
        echo -e "  ${GREEN}✓${NC} MCP Server ya instalado"
    fi
    
    cd ../..
else
    echo -e "  ${YELLOW}⚠️${NC} MCP Server no encontrado (opcional)"
fi

echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN} 4. Verificando API Gateway (del Taller 3)${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

if [ -d "apps/api-gateway" ]; then
    cd apps/api-gateway || exit 1
    
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Instalando API Gateway...${NC}"
        npm install
    else
        echo -e "  ${GREEN}✓${NC} API Gateway ya instalado"
    fi
    
    cd ../..
else
    echo -e "  ${YELLOW}⚠️${NC} API Gateway no encontrado (opcional)"
fi

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN} ✅ INSTALACIÓN COMPLETADA${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

echo -e "${CYAN}📊 Estado de los servicios:${NC}"
echo ""
echo -e "  ${CYAN}🔹 Backend NestJS:${NC} Listo para iniciar"
echo -e "     Puerto: 3002"
echo -e "     Comando: cd apps/backend && npm run start:dev"
echo ""
echo -e "  ${CYAN}🔹 n8n:${NC} Corriendo"
echo -e "     URL: http://localhost:5678"
echo -e "     Usuario: admin"
echo -e "     Contraseña: uleam2025"
echo ""
echo -e "  ${CYAN}🔹 MCP Server:${NC} Listo (opcional)"
echo -e "     Puerto: 3001"
echo -e "     Comando: cd apps/mcp-server && npm run start:dev"
echo ""
echo -e "  ${CYAN}🔹 API Gateway:${NC} Listo (opcional)"
echo -e "     Puerto: 3000"
echo -e "     Comando: cd apps/api-gateway && npm run start:dev"
echo ""

echo -e "${CYAN}📝 Próximos pasos:${NC}"
echo ""
echo -e "  ${YELLOW}1.${NC} Acceder a n8n: http://localhost:5678"
echo -e "  ${YELLOW}2.${NC} Configurar credenciales (Telegram, Google Sheets, Gemini)"
echo -e "  ${YELLOW}3.${NC} Crear los 3 workflows según la guía en n8n/workflows/"
echo -e "  ${YELLOW}4.${NC} Copiar URLs de webhooks y actualizar apps/backend/.env"
echo -e "  ${YELLOW}5.${NC} Iniciar backend: cd apps/backend && npm run start:dev"
echo -e "  ${YELLOW}6.${NC} Probar creando un préstamo"
echo ""

echo -e "${CYAN}📚 Documentación:${NC}"
echo -e "  - Backend: apps/backend/README.md"
echo -e "  - n8n: n8n/README.md"
echo -e "  - Workflows: n8n/workflows/README.md"
echo ""

echo -e "${CYAN}============================================${NC}"
echo ""
