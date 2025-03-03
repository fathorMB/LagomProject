using SGBackend.Data;

namespace Lagom.WebAPI.AppConfiguration
{
    public static class DevAppConfiguration
    {
        public static void Configure(WebApplication webApplication)
        {
            webApplication.UseSwagger();
            webApplication.UseSwaggerUI();
        }
    }
}
