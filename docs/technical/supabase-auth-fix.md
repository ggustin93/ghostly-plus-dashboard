# Supabase Authentication Fix Documentation

## Problem

Authentication through the Nginx proxy to Supabase was failing with a 401 Unauthorized error. Specifically, login attempts from the frontend resulted in:

```
Request URL: http://localhost/auth/v1/token?grant_type=password
Status Code: 401 Unauthorized
```

This was happening despite:
- Direct requests to `http://localhost:8000/auth/v1/token` working correctly
- The correct API key being used in the requests
- Proper authentication credentials (email/password) being sent

## Root Cause Analysis

After investigation, multiple issues were identified:

1. **Header Handling**: The Nginx proxy wasn't correctly passing headers to the Supabase Kong gateway
2. **Host Header Issues**: Kong was expecting a specific Host header that wasn't being preserved
3. **Environment Configuration**: The frontend `.env` file had trailing characters in the Supabase URL
4. **CORS Configuration**: Proper CORS headers weren't being set consistently

## Solution Implemented

### 1. Simplified Nginx Configuration

The `/auth/v1/` location block in `nginx/conf.d/default.conf` was simplified to:

```nginx
location /auth/v1/ {
    # We're going to simply proxy everything through
    proxy_pass http://supabase-kong:8000/auth/v1/;
    
    # Pass all headers unchanged
    proxy_pass_request_headers on;
    
    # Add CORS headers
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH' always;
    add_header 'Access-Control-Allow-Headers' '*' always;
    
    # Handle OPTIONS requests (CORS preflight)
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE, PATCH';
        add_header 'Access-Control-Allow-Headers' '*';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain charset=UTF-8';
        add_header 'Content-Length' 0;
        return 204;
    }
}
```

Key changes:
- Removed explicit Host header setting
- Used `proxy_pass_request_headers on` to preserve all original headers
- Added proper CORS handling for OPTIONS and other requests

### 2. Fixed Environment Variables

The frontend `.env` file was updated to ensure proper URLs without trailing characters:

```
VITE_API_BASE_URL=http://localhost/api
VITE_SUPABASE_URL=http://localhost
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiZXhwIjoyMDYyMjkyNjY5fQ.d6vrflZp0t-UiselJIUtzQ4xez6xxAVg_9UA352TOts
```

### 3. Added Debugging to Authentication Store

Added debugging logs in `frontend/src/stores/authStore.ts` to track request parameters:

```typescript
// Add debug logs
console.log('[authStore] DEBUG - supabaseUrl:', supabaseUrl);
console.log('[authStore] DEBUG - Auth URL:', authUrl);
console.log('[authStore] DEBUG - apikey length:', supabaseKey.length);
console.log('[authStore] DEBUG - apikey first 10 chars:', supabaseKey.substring(0, 10));
console.log('[authStore] DEBUG - apikey last 10 chars:', supabaseKey.substring(supabaseKey.length - 10));
```

## Testing & Verification

After implementing the changes, the authentication was tested with:

1. **Curl Request Test**: 
```bash
curl -X POST "http://localhost/auth/v1/token?grant_type=password" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiZXhwIjoyMDYyMjkyNjY5fQ.d6vrflZp0t-UiselJIUtzQ4xez6xxAVg_9UA352TOts" \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@test.be","password":"test"}'
```

This returned a successful response with:
- 200 status code
- Valid access token
- User information
- Refresh token

2. **Frontend Testing**:
The frontend application was able to successfully authenticate using the updated configuration.

## Additional Notes

1. **Supabase Configuration**:
   - Signups are disabled in the Supabase configuration (`DISABLE_SIGNUP=true` in `supabase_config/.env`)
   - Users must be created via the admin API or through the Supabase Studio

2. **Authentication Flow**:
   - Frontend sends authentication request to `http://localhost/auth/v1/token?grant_type=password`
   - Nginx proxies to `http://supabase-kong:8000/auth/v1/token?grant_type=password`
   - Supabase Kong receives the request with all headers intact
   - Authentication succeeds and returns JWT tokens

3. **Available Test User**:
   - Email: `test2@test.be` 
   - Password: `test`

## Lessons Learned

1. When proxying authentication services, preserving all headers is critical
2. Kong API gateways may have specific expectations about Host headers
3. For debugging authentication issues, direct curl tests are invaluable
4. Trailing characters in environment variables can cause difficult-to-diagnose issues

This fix ensures that authentication works properly through the Nginx proxy to Supabase, allowing the application to function as expected. 