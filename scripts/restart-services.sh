#!/bin/bash

# ANSI color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== GHOSTLY+ Services Restart ===${NC}"
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

# Restart Nginx container
echo -e "${YELLOW}Restarting Nginx container...${NC}"
docker-compose restart nginx
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Nginx container restarted successfully${NC}"
else
  echo -e "${RED}✗ Failed to restart Nginx container${NC}"
fi

echo

# Check if we need to restart other services
read -p "Do you want to restart all services (y/n)? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Restarting all services...${NC}"
  docker-compose down
  docker-compose up -d
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ All services restarted successfully${NC}"
  else
    echo -e "${RED}✗ Failed to restart all services${NC}"
  fi
fi

echo

# Check service status
echo -e "${YELLOW}Checking service status...${NC}"
docker-compose ps

echo
echo -e "${YELLOW}=== Next Steps ===${NC}"
echo -e "1. Run ${GREEN}./scripts/check-services.sh${NC} to verify services are working correctly"
echo -e "2. Check Nginx logs for errors: ${GREEN}docker logs ghostly_nginx${NC}"
echo -e "3. Access your application at ${GREEN}http://localhost${NC}"
echo 