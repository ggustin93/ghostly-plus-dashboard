# Supabase Authentication from C#

This guide explains how to implement Supabase authentication in the OpenFeasyo C# game client.

## Approach Options

### Option 1: Use the Official Supabase C# Library (Recommended)

The [Supabase C# SDK](https://github.com/supabase-community/supabase-csharp) provides a native way to interact with Supabase services.

#### Installation

```shell
# Via NuGet Package Manager Console
Install-Package supabase-csharp

# Or via .NET CLI
dotnet add package supabase-csharp
```

#### Basic Authentication Implementation

```csharp
using Supabase;
using Supabase.Gotrue;
using Supabase.Gotrue.Interfaces;

namespace OpenFeasyo.Authentication
{
    public class SupabaseAuthService
    {
        private readonly Client _supabaseClient;
        private readonly string _supabaseUrl;
        private readonly string _supabaseKey;
        
        public SupabaseAuthService(string supabaseUrl, string supabaseKey)
        {
            _supabaseUrl = supabaseUrl;
            _supabaseKey = supabaseKey;
            
            // Initialize Supabase client
            var options = new SupabaseOptions
            {
                AutoRefreshToken = true,
                PersistSession = true
            };
            
            _supabaseClient = new Client(_supabaseUrl, _supabaseKey, options);
        }
        
        public async Task<Session> SignInAsync(string email, string password)
        {
            try
            {
                var response = await _supabaseClient.Auth.SignIn(email, password);
                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Authentication error: {ex.Message}");
                throw;
            }
        }
        
        public async Task<Session> SignUpAsync(string email, string password)
        {
            try
            {
                var response = await _supabaseClient.Auth.SignUp(email, password);
                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Registration error: {ex.Message}");
                throw;
            }
        }
        
        public async Task SignOutAsync()
        {
            await _supabaseClient.Auth.SignOut();
        }
        
        public string GetCurrentToken()
        {
            return _supabaseClient.Auth.CurrentSession?.AccessToken;
        }
        
        public bool IsAuthenticated()
        {
            return _supabaseClient.Auth.CurrentUser != null;
        }
    }
}
```

#### Using the Auth Service in Game

```csharp
// Initialize the service
var authService = new SupabaseAuthService(
    "https://your-supabase-url.supabase.co",
    "your-supabase-anon-key"
);

// Login
async Task LoginUser(string email, string password)
{
    try
    {
        var session = await authService.SignInAsync(email, password);
        // Store user information or proceed with game initialization
        Console.WriteLine($"Logged in as: {session.User.Email}");
        
        // When making API calls, use the token
        string token = authService.GetCurrentToken();
        // Add token to your HTTP requests
    }
    catch (Exception ex)
    {
        // Handle login error
    }
}
```

### Option 2: Use HttpClient with REST API

If you prefer not to use the SDK, you can directly call the Supabase REST API endpoints:

```csharp
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text;

public class SupabaseDirectAuthService
{
    private readonly HttpClient _httpClient;
    private readonly string _supabaseUrl;
    private readonly string _supabaseKey;
    private string _currentToken;
    
    public SupabaseDirectAuthService(string supabaseUrl, string supabaseKey)
    {
        _supabaseUrl = supabaseUrl;
        _supabaseKey = supabaseKey;
        
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Add("apikey", _supabaseKey);
    }
    
    public async Task<string> SignInAsync(string email, string password)
    {
        var payload = new 
        {
            email,
            password
        };
        
        var content = new StringContent(
            JsonSerializer.Serialize(payload),
            Encoding.UTF8,
            "application/json"
        );
        
        var response = await _httpClient.PostAsync(
            $"{_supabaseUrl}/auth/v1/token?grant_type=password",
            content
        );
        
        response.EnsureSuccessStatusCode();
        
        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        _currentToken = result.GetProperty("access_token").GetString();
        
        return _currentToken;
    }
    
    // Other methods would follow a similar pattern
}
```

## Persisting Authentication State

For the game client, you'll need to persist the auth state between sessions:

```csharp
// Simple persistence example
private void SaveAuthState(string token, string refreshToken, DateTime expiry)
{
    // Store securely - consider using a more secure approach in production
    PlayerPrefs.SetString("AuthToken", token);
    PlayerPrefs.SetString("RefreshToken", refreshToken);
    PlayerPrefs.SetString("TokenExpiry", expiry.ToString("o"));
}

private bool TryRestoreAuthState()
{
    var token = PlayerPrefs.GetString("AuthToken", null);
    var refreshToken = PlayerPrefs.GetString("RefreshToken", null);
    var expiryStr = PlayerPrefs.GetString("TokenExpiry", null);
    
    if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(refreshToken) || 
        string.IsNullOrEmpty(expiryStr))
        return false;
        
    // Implement token restoration logic
    return true;
}
```

## API Calls with Authentication

Once authenticated, include the JWT token in API calls:

```csharp
public async Task<Stream> UploadC3DFile(string filePath)
{
    using var request = new HttpRequestMessage(HttpMethod.Post, 
        $"{_baseApiUrl}/upload-c3d");
    
    // Add the auth token
    request.Headers.Authorization = 
        new System.Net.Http.Headers.AuthenticationHeaderValue(
            "Bearer", 
            _authService.GetCurrentToken());
    
    // Create the form content with the file
    using var content = new MultipartFormDataContent();
    using var fileStream = File.OpenRead(filePath);
    content.Add(new StreamContent(fileStream), "file", Path.GetFileName(filePath));
    request.Content = content;
    
    // Send the request
    var response = await _httpClient.SendAsync(request);
    response.EnsureSuccessStatusCode();
    
    return await response.Content.ReadAsStreamAsync();
}
```

## Security Considerations

1. **Store tokens securely** - Use secure storage methods appropriate for your target platform
2. **Implement token refresh** - Handle token expiration and refresh
3. **Handle network issues** - Have fallback mechanisms for authentication when offline
4. **Validate JWT server-side** - Ensure your backend validates tokens properly

## Troubleshooting

- **CORS issues**: Ensure your Supabase project has the appropriate CORS configuration
- **Token validation errors**: Check clock synchronization between client and server
- **401 Unauthorized**: Ensure credentials are correct and token hasn't expired 