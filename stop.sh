#!/bin/bash

# VEYOR Marketplace Stop Script

echo "🛑 Stopping VEYOR Marketplace..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Stop Backend
echo -e "${RED}Stopping Backend...${NC}"
if [ -f backend/backend.pid ]; then
    kill $(cat backend/backend.pid) 2>/dev/null || true
    rm -f backend/backend.pid
fi
pkill -f "gradlew bootRun" 2>/dev/null || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true

# Stop Frontend
echo -e "${RED}Stopping Frontend...${NC}"
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Stop Agent and Flask API
echo -e "${RED}Stopping Agent and Flask API...${NC}"
if [ -f agents/agent.pid ]; then
    kill $(cat agents/agent.pid) 2>/dev/null || true
    rm -f agents/agent.pid
fi
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
pkill -f "python.*api_server.py" 2>/dev/null || true
pkill -f "python.*tools.py" 2>/dev/null || true

# Stop Docker services
echo -e "${RED}Stopping Docker services...${NC}"
cd infra
docker-compose down
cd ..

echo -e "${GREEN}✅ All services stopped${NC}"
