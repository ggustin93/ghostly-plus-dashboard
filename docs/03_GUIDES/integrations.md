# Supabase Authentication from C#

> **Note**: This documentation is a work in progress and may be updated with additional information and examples.

This guide explains how to implement Supabase authentication in the OpenFeasyo C# game client.

## Quick Implementation

### Option 1: Using Supabase C# Client Library

```csharp
public class SupabaseAuthService
{
    private readonly Supabase.Client _supabaseClient;

    public SupabaseAuthService(string supabaseUrl, string supabaseKey)
    {
        _supabaseClient = new Supabase.Client(
            supabaseUrl, 
            supabaseKey, 
            new SupabaseOptions { AutoConnectRealtime = false }
        );
    }

    public async Task<bool> SignInAsync(string email, string password)
    {
        try {
            var response = await _supabaseClient.Auth.SignIn(email, password);
            return response.User != null;
        } catch (Exception ex) {
            Debug.LogError($"Auth Error: {ex.Message}");
            return false;
        }
    }

    public string GetAccessToken() => _supabaseClient.Auth.CurrentSession?.AccessToken;
    public bool IsAuthenticated() => _supabaseClient.Auth.CurrentUser != null;
}
```

### Option 2: Direct API Calls (if library integration issues)

```csharp
public class SupabaseDirectAuthService
{
    private readonly string _supabaseUrl;
    private readonly string _supabaseKey;
    private string _accessToken;

    public SupabaseDirectAuthService(string supabaseUrl, string supabaseKey)
    {
        _supabaseUrl = supabaseUrl;
        _supabaseKey = supabaseKey;
    }

    public async Task<bool> SignInAsync(string email, string password)
    {
        try {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("apikey", _supabaseKey);
            client.DefaultRequestHeaders.Add("Content-Type", "application/json");

            var content = new StringContent(
                JsonConvert.SerializeObject(new { email, password }),
                Encoding.UTF8, 
                "application/json"
            );

            var response = await client.PostAsync(
                $"{_supabaseUrl}/auth/v1/token?grant_type=password",
                content
            );

            if (response.IsSuccessStatusCode)
            {
                var jsonResult = await response.Content.ReadAsStringAsync();
                var tokenData = JsonConvert.DeserializeObject<TokenResponse>(jsonResult);
                _accessToken = tokenData.AccessToken;
                return true;
            }
            return false;
        } catch (Exception ex) {
            Debug.LogError($"Direct Auth Error: {ex.Message}");
            return false;
        }
    }

    public string GetAccessToken() => _accessToken;
    public bool IsAuthenticated() => !string.IsNullOrEmpty(_accessToken);
}

public class TokenResponse
{
    [JsonProperty("access_token")]
    public string AccessToken { get; set; }
}
```

## Using in Game Client

```csharp
// Initialize service
var authService = new SupabaseAuthService(
    "http://localhost", 
    "your-anon-key-here"
);

// Login
await authService.SignInAsync("therapist@example.com", "password");

// Use the token in API requests
if (authService.IsAuthenticated())
{
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {authService.GetAccessToken()}");
    
    // Make API calls to your backend using the token for authentication
    var response = await client.GetAsync("http://localhost/api/sessions");
    // Process response...
}
```

For more comprehensive implementation details, refer to [systemPatterns.md](../../memory-bank/systemPatterns.md) in the Memory Bank's authentication section. 