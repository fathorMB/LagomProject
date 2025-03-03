
using Lagom.Scheduler;
using Lagom.WebAPI.AppConfiguration;
using Lagom.WebAPI.Startup;

namespace Lagom.WebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            bool dbAutoMigrateEnabled = true;

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            LoggerStartup.AddServices(builder);
            DataLayerStartup.AddServices(builder);
            HTTPPipelineStartup.AddServices(builder);
            SchedulerStartup.AddServices(builder);

            if (builder.Environment.IsDevelopment())
                DevStartup.AddServices(builder);

            var app = builder.Build();

            if (dbAutoMigrateEnabled)
                DataLayerStartup.Configure(app);

            // Configure the HTTP request pipeline.
            AuthenticationAppConfiguration.Configure(app);

            if (app.Environment.IsDevelopment())
                DevAppConfiguration.Configure(app);

            HTTPAppConfiguration.Configure(app);

            app.Run();
        }
    }
}
