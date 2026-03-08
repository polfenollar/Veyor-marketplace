#!/bin/bash

# VEYOR Marketplace Startup Script
# This script ensures all services start in the correct order

set -e

echo "🚀 Starting VEYOR Marketplace..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a port is open
wait_for_port() {
    local host=$1
    local port=$2
    local service=$3
    local max_attempts=30
    local attempt=1

    echo -e "${YELLOW}⏳ Waiting for $service on $host:$port...${NC}"
    
    while ! nc -z $host $port >/dev/null 2>&1; do
        if [ $attempt -eq $max_attempts ]; then
            echo -e "${RED}❌ Timeout waiting for $service${NC}"
            return 1
        fi
        attempt=$((attempt + 1))
        sleep 2
    done
    
    echo -e "${GREEN}✅ $service is ready${NC}"
    return 0
}

# Step 1: Start Docker infrastructure
echo -e "\n${YELLOW}📦 Step 1: Starting Docker infrastructure...${NC}"
cd infra
docker-compose up -d
cd ..

# Step 2: Wait for critical services
echo -e "\n${YELLOW}⏳ Step 2: Waiting for infrastructure services...${NC}"
wait_for_port localhost 5432 "PostgreSQL"
wait_for_port localhost 6379 "Redis"
wait_for_port localhost 9092 "Kafka"
wait_for_port localhost 3000 "Carrier Simulator"
wait_for_port localhost 50051 "Quoting Service"

# Give services a bit more time to fully initialize
echo -e "${YELLOW}⏳ Waiting 5 more seconds for services to stabilize...${NC}"
sleep 5

# Step 3: Kill any existing backend processes
echo -e "\n${YELLOW}🧹 Step 3: Cleaning up old processes...${NC}"
pkill -f "gradlew bootRun" 2>/dev/null || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
sleep 2

# Step 4: Start Backend
echo -e "\n${YELLOW}☕ Step 4: Starting Java Backend...${NC}"
cd backend
rm -f backend.pid run.log
nohup ./gradlew bootRun > run.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid
cd ..

# Wait for backend to start
wait_for_port localhost 8080 "Backend API"

# Step 5: Ensure Frontend is running
echo -e "\n${YELLOW}⚛️  Step 5: Checking Frontend...${NC}"
if lsof -ti:3002 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is already running on port 3002${NC}"
else
    echo -e "${YELLOW}Starting Frontend...${NC}"
    cd frontend
    nohup npm run dev > frontend.log 2>&1 &
    cd ..
    wait_for_port localhost 3002 "Frontend"
fi

# Summary
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ All services are running!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e ""
echo -e "📊 Infrastructure:"
echo -e "   • PostgreSQL:        http://localhost:5432"
echo -e "   • Redis:             http://localhost:6379"
echo -e "   • Kafka:             http://localhost:9092"
echo -e "   • Prometheus:        http://localhost:9090"
echo -e "   • Grafana:           http://localhost:3001"
echo -e "   • Jaeger:            http://localhost:16686"
echo -e ""
echo -e "🔧 Microservices:"
echo -e "   • Carrier Simulator: http://localhost:3000"
echo -e "   • Quoting Service:   grpc://localhost:50051"
echo -e ""
echo -e "🌐 Applications:"
echo -e "   • Backend API:       http://localhost:8080"
echo -e "   • Frontend:          http://localhost:3002"
echo -e ""
echo -e "${YELLOW}📝 Logs:${NC}"
echo -e "   • Backend:  tail -f backend/run.log"
echo -e "   • Frontend: tail -f frontend/frontend.log"
echo -e ""
echo -e "${YELLOW}🛑 To stop all services:${NC}"
echo -e "   ./stop.sh"
echo -e ""
