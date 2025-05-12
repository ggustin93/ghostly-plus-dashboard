#!/bin/bash

# Script to update CORS configuration for Supabase Kong API gateway

# Define paths
KONG_CONFIG_PATH="supabase_config/volumes/api/kong.yml"
KONG_CONFIG_BACKUP="supabase_config/volumes/api/kong.yml.bak"

# Make a backup of the current configuration
echo "Creating backup of Kong configuration at $KONG_CONFIG_BACKUP"
cp "$KONG_CONFIG_PATH" "$KONG_CONFIG_BACKUP"

# Update CORS configuration in Kong
echo "Updating CORS configuration in Kong..."

# Create a temporary file for the modified configuration
TMP_FILE=$(mktemp)

# Read kong.yml line by line
while IFS= read -r line; do
  # Write the unchanged line to the temp file
  echo "$line" >> "$TMP_FILE"
  
  # After each 'name: cors' line, add the CORS configuration
  if [[ "$line" =~ name:[[:space:]]*cors$ ]]; then
    echo "    config:" >> "$TMP_FILE"
    echo "      origins:" >> "$TMP_FILE"
    echo "        - \"http://localhost:3000\"  # Frontend development server" >> "$TMP_FILE"
    echo "        - \"http://localhost\"       # Docker container access" >> "$TMP_FILE"
    echo "        - \"http://localhost:8000\"  # Nginx proxy" >> "$TMP_FILE"
    echo "        - \"http://localhost:8080\"  # Alternative development port" >> "$TMP_FILE"
    echo "      methods:" >> "$TMP_FILE"
    echo "        - GET" >> "$TMP_FILE"
    echo "        - POST" >> "$TMP_FILE"
    echo "        - PUT" >> "$TMP_FILE"
    echo "        - PATCH" >> "$TMP_FILE"
    echo "        - DELETE" >> "$TMP_FILE"
    echo "        - OPTIONS" >> "$TMP_FILE"
    echo "      headers:" >> "$TMP_FILE"
    echo "        - Accept" >> "$TMP_FILE"
    echo "        - Authorization" >> "$TMP_FILE"
    echo "        - Content-Type" >> "$TMP_FILE"
    echo "        - Origin" >> "$TMP_FILE"
    echo "        - X-Requested-With" >> "$TMP_FILE"
    echo "      credentials: true" >> "$TMP_FILE"
    echo "      max_age: 3600" >> "$TMP_FILE"
  fi
done < "$KONG_CONFIG_PATH"

# Replace the original file with the modified one
cp "$TMP_FILE" "$KONG_CONFIG_PATH"
rm "$TMP_FILE"

echo "CORS configuration updated. Restarting Kong..."

# Restart Kong to apply the changes
cd supabase_config
docker-compose restart kong

echo "Kong restarted. CORS configuration has been updated."
echo "The frontend and game applications should now be able to access the Supabase API."
echo "To revert changes, run: cp $KONG_CONFIG_BACKUP $KONG_CONFIG_PATH && cd supabase_config && docker-compose restart kong" 