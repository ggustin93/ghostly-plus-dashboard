# GHOSTLY+ Dashboard: Supabase API and Security Configuration

This guide provides instructions for configuring Supabase API access and security settings for the GHOSTLY+ Dashboard project's local development environment. It includes API key management, JWT configuration, CORS settings, and documentation of API endpoints.

## 1. Accessing Supabase Dashboard

The deployed Supabase services provide a web-based admin interface called Supabase Studio:

1. Open your browser and navigate to: [http://localhost:54323](http://localhost:54323)
2. Sign in with the dashboard credentials:
   - Username: `supabase`
   - Password: `this_password_is_insecure_and_should_be_updated` (as configured in `supabase_config/.env`)

## 2. API Keys and Authentication

### 2.1 Understanding API Keys

Supabase uses two types of API keys for different access levels:

1. **Anonymous Key (anon)**: Used for public client-side access with limited permissions defined by Row Level Security (RLS) policies. This key should be used in the frontend application.

2. **Service Role Key**: A "super admin" key that bypasses RLS policies. **Never expose this key in client-side code**. Only use it in secure server-side contexts (backend API).

Current API keys can be viewed in Supabase Studio by going to Project Settings > API. For local development, the keys are also defined in `supabase_config/.env`:

```
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey AgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE

SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey AgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusb
cbo7X36XVt4Q
```

### 2.2 JWT Configuration

JWT (JSON Web Token) authentication is handled by the GoTrue service within Supabase. For local development, the JWT secret is defined in `supabase_config/.env`:

```
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
JWT_EXPIRY=3600  # Token expiry time in seconds (1 hour)
```

For a more secure local setup, change the `JWT_SECRET` value to a strong 32+ character random string. You can generate one with:

```bash
openssl rand -base64 32
```

After changing the JWT secret, make sure to update the environment file:

```bash
cd supabase_config
# Edit the .env file with the new JWT_SECRET
docker-compose down
docker-compose up -d
```

## 3. Configuring CORS Settings

Cross-Origin Resource Sharing (CORS) settings determine which origins can access your Supabase API. For local development, you need to configure CORS to allow access from both:

1. The GHOSTLY+ Web Dashboard frontend (Vue.js application)
2. The GHOSTLY+ Game (OpenFeasyo/C# application)

CORS is configured in Kong, which acts as the API gateway for Supabase. To update CORS settings:

1. Edit the Kong configuration in `supabase_config/volumes/api/kong.yml`
2. Find the `plugins` section for each service and update or add the CORS configuration
3. Restart Kong to apply the changes

Example CORS configuration to allow requests from multiple origins:

```yaml
plugins:
  - name: cors
    config:
      origins:
        - "http://localhost:3000"  # Frontend development server
        - "http://localhost"       # Docker container access
        - "http://localhost:8000"  # Nginx proxy
      methods:
        - GET
        - POST
        - PUT
        - PATCH
        - DELETE
        - OPTIONS
      headers:
        - Accept
        - Authorization
        - Content-Type
        - Origin
        - X-Requested-With
      credentials: true
      max_age: 3600
```

After updating the Kong configuration, restart the Kong service:

```bash
cd supabase_config
docker-compose restart kong
```

## 4. API Endpoints Reference

Supabase provides several API endpoints through its services. Below are the key endpoints for local development:

### 4.1 Base URL

All Supabase API endpoints are accessible through:

```
http://localhost:8000
```

### 4.2 Authentication API

Authentication operations are handled by the GoTrue service:

- **Sign Up**: `POST /auth/v1/signup`
- **Sign In**: `POST /auth/v1/token?grant_type=password`
- **Sign Out**: `POST /auth/v1/logout`
- **User Information**: `GET /auth/v1/user`
- **Password Reset Request**: `POST /auth/v1/recover`
- **Update User**: `PUT /auth/v1/user`
- **Refresh Token**: `POST /auth/v1/token?grant_type=refresh_token`

### 4.3 Database API (REST)

Database operations are handled by PostgREST:

- **Base REST Endpoint**: `/rest/v1/`
- **Table Operations**: `/rest/v1/[table_name]`
- **RPC Functions**: `/rest/v1/rpc/[function_name]`

### 4.4 Storage API

File storage operations:

- **Base Storage Endpoint**: `/storage/v1/`
- **Create Bucket**: `POST /storage/v1/bucket`
- **List Buckets**: `GET /storage/v1/bucket`
- **Upload File**: `POST /storage/v1/object/[bucket]/[path]`
- **Download File**: `GET /storage/v1/object/[bucket]/[path]`
- **List Files**: `GET /storage/v1/object/list/[bucket]/[path]`

## 5. Integrating with the GHOSTLY+ Applications

### 5.1 Frontend Integration (Vue.js)

1. Create a `.env.local` file in the `frontend` directory with:

```
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=<your_anon_key>
```

2. Initialize the Supabase client in your Vue.js application:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 5.2 Backend Integration (FastAPI)

1. Add Supabase configuration to the backend environment:

```
SUPABASE_URL=http://localhost:8000
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
SUPABASE_JWT_SECRET=<your_jwt_secret>
```

2. Implement JWT verification middleware in FastAPI:

```python
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt

security = HTTPBearer()

async def verify_jwt(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication token")
```

### 5.3 GHOSTLY+ Game Integration (OpenFeasyo/C#)

For the C# application, implement REST-based authentication:

```csharp
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class SupabaseAuth
{
    private static readonly HttpClient client = new HttpClient();
    private const string BaseUrl = "http://localhost:8000";
    private const string AnonKey = "<your_anon_key>";
    
    public async Task<string> SignIn(string email, string password)
    {
        client.DefaultRequestHeaders.Clear();
        client.DefaultRequestHeaders.Add("apikey", AnonKey);
        
        var content = new StringContent(
            JsonSerializer.Serialize(new { email, password }),
            Encoding.UTF8,
            "application/json");
            
        var response = await client.PostAsync($"{BaseUrl}/auth/v1/token?grant_type=password", content);
        response.EnsureSuccessStatusCode();
        
        var jsonResponse = await response.Content.ReadAsStringAsync();
        var authResponse = JsonSerializer.Deserialize<AuthResponse>(jsonResponse);
        
        return authResponse.AccessToken;
    }
    
    // Add other authentication methods as needed
}

public class AuthResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }
    
    [JsonPropertyName("refresh_token")]
    public string RefreshToken { get; set; }
    
    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
}
```

## 6. Security Best Practices

1. **Environment Variables**: Always store API keys and secrets in environment variables or `.env` files that are not committed to version control.

2. **Key Usage**:
   - Use the anonymous key for frontend/client applications
   - Use the service role key only in secure backend contexts
   - Never expose the service role key in client-side code

3. **JWT Handling**:
   - Store JWTs securely using appropriate storage methods
   - Implement token refresh mechanisms
   - Validate tokens on the server side

4. **Row Level Security (RLS)**:
   - Implement RLS policies for all tables to restrict access
   - Test policies thoroughly with different user roles

5. **Regular Rotation**:
   - For production, regularly rotate JWT secrets and API keys

## 7. Troubleshooting

### 7.1 Common Issues

1. **CORS Errors**: If you see CORS errors in the browser console:
   - Verify that your origins are properly configured in Kong
   - Ensure the request includes the correct headers
   - Check that credentials are properly handled

2. **JWT Verification Fails**:
   - Confirm JWT_SECRET is consistent across services
   - Verify token expiration settings
   - Check token format and structure

3. **API Key Not Working**:
   - Ensure the key is correctly copied without whitespace
   - Verify it's being sent in the correct header (`apikey`)
   - Check if the key has been regenerated/changed

### 7.2 Useful Commands

**Check Supabase Services Status**:
```bash
docker ps | grep supabase
```

**View Kong Logs**:
```bash
docker logs supabase-kong
```

**Restart Individual Services**:
```bash
cd supabase_config
docker-compose restart [service_name]
```

**Reset Supabase Environment**:
```bash
cd supabase_config
./reset.sh
```

---

For additional information, refer to the [official Supabase documentation](https://supabase.com/docs). 