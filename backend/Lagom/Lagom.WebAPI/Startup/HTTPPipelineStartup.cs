using Lagom.Common;

namespace Lagom.WebAPI.Startup
{
    public static class HTTPPipelineStartup
    {
        public static void AddServices(WebApplicationBuilder webApplicationBuilder, string clientURLOrigin)
        {
            webApplicationBuilder.Services.AddControllers();

            // Add CORS services
            webApplicationBuilder.Services.AddCors(options =>
            {
                if (!string.IsNullOrEmpty(clientURLOrigin))
                    options.AddPolicy("AllowSpecificOrigin",
                        builder => builder.WithOrigins(clientURLOrigin)
                                          .AllowAnyHeader()
                                          .AllowAnyMethod());
                else
                    throw new Exception("ClientURLOrigin is not set in appsettings.json");
            });
        }

        public static void AddDevelopmentServices(WebApplicationBuilder webApplicationBuilder)
        {
            webApplicationBuilder.Services.AddControllers();

            // Add CORS services
            webApplicationBuilder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.WithOrigins("http://localhost:4200", "http://localhost:3000")
                                        .AllowAnyHeader()
                                        .AllowAnyMethod()
                                        .AllowCredentials());
            });
        }
    }
}
