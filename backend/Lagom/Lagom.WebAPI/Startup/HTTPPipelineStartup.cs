namespace Lagom.WebAPI.Startup
{
    public static class HTTPPipelineStartup
    {
        public static void AddServices(WebApplicationBuilder webApplicationBuilder)
        {
            webApplicationBuilder.Services.AddControllers();
            // Add CORS services
            webApplicationBuilder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.WithOrigins("http://localhost:4200")
                                      .AllowAnyHeader()
                                      .AllowAnyMethod());
            });
        }
    }
}
