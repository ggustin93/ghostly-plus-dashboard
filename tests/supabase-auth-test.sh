#!/bin/bash

# API Key - replace with your actual Supabase anon key
API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiZXhwIjoyMDYyMjkyNjY5fQ.d6vrflZp0t-UiselJIUtzQ4xez6xxAVg_9UA352TOts"

# Function to print section headers
print_header() {
  echo -e "\n========== $1 ==========\n"
}

# Main supabase test - auth via token endpoint
print_header "SUPABASE AUTH TEST: Token Endpoint"
curl -v "http://localhost/auth/v1/token?grant_type=password" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@test.be","password":"test"}'

# Health endpoint test - useful for checking basic connectivity
print_header "SUPABASE AUTH TEST: Health Endpoint"
curl -v "http://localhost/auth/v1/health" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $API_KEY"

# Direct connection test - helpful for debugging Nginx issues
print_header "SUPABASE DIRECT TEST: Direct Connection (Bypassing Nginx)"
curl -v "http://localhost:8000/auth/v1/token?grant_type=password" \
  -H "apikey: $API_KEY" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -H "Host: supabase-kong" \
  -d '{"email":"test2@test.be","password":"test"}'

print_header "Tests Completed"
echo "If the token endpoint returns a valid access_token, authentication is working correctly!"
echo "If only the direct test works, there might be an issue with the Nginx proxy configuration." 