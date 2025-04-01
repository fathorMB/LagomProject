
using CrystalQuartz.Application;
using CrystalQuartz.AspNetCore;
using Lagom.Scheduler;
using Lagom.WebAPI.AppConfiguration;
using Lagom.WebAPI.Hubs;
using Lagom.WebAPI.Services;
using Lagom.WebAPI.Startup;
using Microsoft.AspNetCore.Builder;
using Quartz;
using SGBackend.Data;

namespace Lagom.WebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            bool dbAutoMigrateEnabled = true;
            bool isDevelopment = false;

            var builder = WebApplication.CreateBuilder(args);

            isDevelopment = builder.Environment.IsDevelopment();

            // Add services to the container.
            LoggerStartup.AddServices(builder);
            DataLayerStartup.AddServices(builder);
            SchedulerStartup.AddServices(builder);

            if (isDevelopment)
                HTTPPipelineStartup.AddDevelopmentServices(builder);
            else
                HTTPPipelineStartup.AddServices(builder);

            // Trigger BE pipeline 6
            // Add SignalR services and the background hosted service
            builder.Services.AddSignalR();
            builder.Services.AddHostedService<SignalRProbeService>();

            if (isDevelopment)
                DevStartup.AddServices(builder);

            var app = builder.Build();

            if (dbAutoMigrateEnabled)
                DataLayerStartup.Configure(app);

            SchedulerWithUIStartup.Configure(app);

            // Configure the HTTP request pipeline.
            AuthenticationAppConfiguration.Configure(app);

            if (isDevelopment)
                DevAppConfiguration.Configure(app);

            HTTPAppConfiguration.Configure(app);

            // Map the SignalR hubs
            app.MapHub<ProbeHub>("/probeHub");

            app.Run();
        }
    }
}
