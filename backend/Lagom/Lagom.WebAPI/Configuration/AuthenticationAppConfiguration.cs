using Lagom.WebAPI.Middleware;

namespace Lagom.WebAPI.AppConfiguration
{
    public static class AuthenticationAppConfiguration
    {
        public static void Configure(WebApplication webApplication)
        {
            webApplication.UseMiddleware<JwtMiddleware>();
        }
    }
}
