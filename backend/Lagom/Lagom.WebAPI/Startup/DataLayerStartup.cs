﻿using Lagom.BusinessServices;
using Lagom.BusinessServices.EFCore;
using Lagom.Common;
using Lagom.Common.Providers;
using Lagom.ModelMapping;
using Microsoft.EntityFrameworkCore;
using SGBackend.Data;

namespace Lagom.WebAPI.Startup
{
    public static class DataLayerStartup
    {
        public static void AddServices(WebApplicationBuilder webApplicationBuilder)
        {
            webApplicationBuilder.Services.AddAutoMapper(typeof(GlobalMappingProfile).Assembly);
            webApplicationBuilder.Services.AddDbContext<LagomDbContext>(options =>
            {
                options.UseSqlServer(webApplicationBuilder.Configuration.GetConnectionString("LagomDBConnectionString"));
            });
            webApplicationBuilder.Services.Configure<AppSettings>(webApplicationBuilder.Configuration.GetSection("AppSettings"));
            webApplicationBuilder.Services.AddScoped<IUserService, UserService>();
            webApplicationBuilder.Services.AddScoped<IContactService, ContactService>();
            webApplicationBuilder.Services.AddScoped<IFileService, FileService>();
            webApplicationBuilder.Services.AddScoped<IClientNavigationService, ClientNavigationService>();
            webApplicationBuilder.Services.AddSingleton<ILagomDateTimeProvider, LagomDateTimeProvider>();
        }

        public static void Configure(WebApplication webApplication)
        {
            // Automatically apply pending migrations
            using (var scope = webApplication.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<LagomDbContext>();
                dbContext.Database.Migrate();
            }
        }
    }
}
