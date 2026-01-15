#!/bin/bash

# =========================================
# Script de Inicio Rápido - Taller 4 (n8n)
# =========================================

echo "🚀 Iniciando Taller 4 - n8n Automatización..."
echo ""

# Verificar Docker
echo "1️⃣ Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor, instala Docker."
    exit 1
fi

# Verificar que Docker esté corriendo
if ! docker ps &> /dev/null; then
    echo "❌ Docker no está corriendo. Por favor, inicia Docker."
    exit 1
fi

echo "✅ Docker está corriendo"
echo ""

# Iniciar n8n
echo "2️⃣ Iniciando n8n..."
cd n8n
docker-compose up -d

if [ $? -eq 0 ]; then
    echo "✅ n8n iniciado correctamente"
else
    echo "❌ Error al iniciar n8n"
    exit 1
fi

echo ""
sleep 3

# Verificar que n8n esté corriendo
echo "3️⃣ Verificando estado de n8n..."
docker-compose ps

echo ""
echo "4️⃣ Esperando que n8n esté listo..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:5678 > /dev/null 2>&1; then
        echo "✅ n8n está listo!"
        break
    fi
    
    attempt=$((attempt + 1))
    echo "⏳ Esperando n8n... ($attempt/$max_attempts)"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "⚠️ n8n tardó mucho en iniciar, pero puede estar funcionando. Verifica manualmente."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ n8n ESTÁ CORRIENDO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Interfaz Web: http://localhost:5678"
echo "👤 Usuario: admin"
echo "🔐 Contraseña: uleam2025"
echo ""
echo "📋 SIGUIENTE PASO:"
echo "   1. Abre http://localhost:5678 en tu navegador"
echo "   2. Importa los 3 workflows desde n8n/workflows/"
echo "   3. Configura las credenciales (Telegram, Gemini, Google Sheets)"
echo "   4. Activa los workflows"
echo "   5. Copia las URLs de webhook al archivo apps/backend/.env"
echo ""
echo "📖 Documentación completa: n8n/README.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ver logs (opcional)
read -p "¿Deseas ver los logs de n8n? (S/N): " view_logs
if [ "$view_logs" = "S" ] || [ "$view_logs" = "s" ]; then
    echo ""
    echo "📜 Mostrando logs (Ctrl+C para salir)..."
    docker-compose logs -f
fi

cd ..
