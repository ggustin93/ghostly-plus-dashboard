#!/bin/bash

# ANSI color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== GHOSTLY+ Services Health Check ===${NC}"
echo

# Check if Docker is running
echo -e "${YELLOW}Checking if Docker is running...${NC}"
if docker info >/dev/null 2>&1; then
  echo -e "${GREEN}✓ Docker is running${NC}"
else
  echo -e "${RED}✗ Docker is not running. Please start Docker first.${NC}"
  exit 1
fi

echo

# List all running containers
echo -e "${YELLOW}Running Docker containers:${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo

# Check Nginx container
echo -e "${YELLOW}Checking Nginx container...${NC}"
if docker ps | grep -q ghostly_nginx; then
  echo -e "${GREEN}✓ Nginx container is running${NC}"
  
  # Get the Nginx container ID
  NGINX_CONTAINER=$(docker ps | grep ghostly_nginx | awk '{print $1}')
  
  # Check Nginx configuration
  echo -e "${YELLOW}Checking Nginx configuration...${NC}"
  docker exec $NGINX_CONTAINER nginx -t 2>/dev/null
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Nginx configuration is valid${NC}"
  else
    echo -e "${RED}✗ Nginx configuration has errors${NC}"
    docker exec $NGINX_CONTAINER nginx -t
  fi
else
  echo -e "${RED}✗ Nginx container is not running${NC}"
fi

echo

# Check Frontend container
echo -e "${YELLOW}Checking Frontend container...${NC}"
if docker ps | grep -q ghostly_frontend; then
  echo -e "${GREEN}✓ Frontend container is running${NC}"
  
  # Get frontend container name or ID
  FRONTEND_CONTAINER=$(docker ps | grep ghostly_frontend | awk '{print $1}')
  
  # Check if frontend is responding
  echo -e "${YELLOW}Testing frontend service internally...${NC}"
  if docker exec $FRONTEND_CONTAINER curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 2>/dev/null | grep -q "200\|304"; then
    echo -e "${GREEN}✓ Frontend service is responding internally${NC}"
  else
    echo -e "${RED}✗ Frontend service is not responding internally${NC}"
    echo -e "${YELLOW}   Note: This might be normal if curl is not installed in the container${NC}"
  fi
else
  echo -e "${RED}✗ Frontend container is not running${NC}"
fi

echo

# Check Backend container
echo -e "${YELLOW}Checking Backend container...${NC}"
if docker ps | grep -q ghostly_backend; then
  echo -e "${GREEN}✓ Backend container is running${NC}"
  
  # Get backend container name or ID
  BACKEND_CONTAINER=$(docker ps | grep ghostly_backend | awk '{print $1}')
  
  # Check if backend is responding
  echo -e "${YELLOW}Testing backend service internally...${NC}"
  if docker exec $BACKEND_CONTAINER curl -s -o /dev/null -w "%{http_code}" http://localhost:8000 2>/dev/null | grep -q "200\|404"; then
    echo -e "${GREEN}✓ Backend service is responding${NC}"
  else
    echo -e "${RED}✗ Backend service is not responding internally${NC}"
    echo -e "${YELLOW}   Note: This might be normal if curl is not installed in the container${NC}"
  fi
else
  echo -e "${RED}✗ Backend container is not running${NC}"
fi

echo

# Check Docker network
echo -e "${YELLOW}Checking Docker networks...${NC}"
docker network ls

echo

# Check Nginx logs for errors
echo -e "${YELLOW}Checking Nginx error logs (last 10 lines)...${NC}"
if docker ps | grep -q ghostly_nginx; then
  docker exec $NGINX_CONTAINER tail -n 10 /var/log/nginx/error.log
else
  echo -e "${RED}✗ Cannot check Nginx logs - container not running${NC}"
fi

echo
echo -e "${YELLOW}=== Recommendations ===${NC}"
echo -e "1. Ensure all containers are running: ${GREEN}docker-compose up -d${NC}"
echo -e "2. Make sure your frontend is running on port 5173 inside its container"
echo -e "3. Make sure your backend is running on port 8000 inside its container"
echo -e "4. Ensure all services are on the same Docker network"
echo -e "5. After making changes to nginx/conf.d/default.conf, restart the Nginx container:"
echo -e "   ${GREEN}docker-compose restart nginx${NC}"
echo -e "6. Check Nginx logs for more details: ${GREEN}docker logs ghostly_nginx${NC}"
echo

# Check Docker network
echo -e "${YELLOW}Checking Docker networks...${NC}"
docker network ls

echo
echo -e "${YELLOW}=== Recommendations ===${NC}"
echo -e "1. Make sure your Docker Compose service names match the ones in nginx/conf.d/default.conf"
echo -e "2. Check that your frontend is running on port 3000 inside its container"
echo -e "3. Check that your backend is running on port 8000 inside its container"
echo -e "4. Ensure all services are on the same Docker network"
echo -e "5. After making changes to nginx/conf.d/default.conf, restart the Nginx container:"
echo -e "   ${GREEN}docker-compose restart nginx${NC}"
echo 