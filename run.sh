#!/bin/bash

# Definition of colors for the terminal
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}==========================================${NC}"
echo -e "${CYAN}    🤖 Iniciando MikuIdol Full Stack 🤖    ${NC}"
echo -e "${CYAN}==========================================${NC}"

# Iniciar Backend
echo -e "${GREEN}[Backend]${NC} Levantando servidor FastAPI..."
cd backend
if [ -d "venv" ]; then
    source venv/bin/activate
fi
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Iniciar Frontend
echo -e "${GREEN}[Frontend]${NC} Levantando servidor Vite..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "${YELLOW}==========================================${NC}"
echo -e "${YELLOW}Presiona Ctrl+C para detener ambos servers${NC}"
echo -e "${YELLOW}==========================================${NC}"

# Comando trampa para matar ambos procesos si se detiene el script
trap 'echo -e "\n${CYAN}Apagando MikuIdol...${NC}"; kill $BACKEND_PID $FRONTEND_PID; exit' SIGINT

# Esperar a los procesos
wait
