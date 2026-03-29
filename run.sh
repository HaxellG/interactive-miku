#!/bin/bash

# Terminal color definitions
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}==========================================${NC}"
echo -e "${CYAN}    ✨ Starting Interactive Miku ✨     ${NC}"
echo -e "${CYAN}==========================================${NC}"

# Start Backend
echo -e "${GREEN}[Backend]${NC} Starting FastAPI Server..."
cd backend
source .venv/bin/activate

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Start Frontend
echo -e "${GREEN}[Frontend]${NC} Starting Vite Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "${YELLOW}==========================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both servers         ${NC}"
echo -e "${YELLOW}==========================================${NC}"

# Trap command to kill both processes on script exit
trap 'echo -e "\n${CYAN}Shutting down Interactive Miku...${NC}"; kill $BACKEND_PID $FRONTEND_PID; exit' SIGINT

# Wait for processes
wait
