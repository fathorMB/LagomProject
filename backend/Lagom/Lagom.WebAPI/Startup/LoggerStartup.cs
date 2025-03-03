using Serilog;

namespace Lagom.WebAPI.Startup
{
    public static class LoggerStartup
    {
        public static void AddServices(WebApplicationBuilder webApplicationBuilder)
        {
            string seqEndpoint = webApplicationBuilder.Configuration.GetConnectionString("SeqEndpoint");

            var loggerConfiguration = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.Console()
                .WriteTo.File("log.txt",
                    rollingInterval: RollingInterval.Day,
                    rollOnFileSizeLimit: false);

            if (!string.IsNullOrEmpty(seqEndpoint))
                loggerConfiguration.WriteTo.Seq(seqEndpoint);

            Log.Logger = loggerConfiguration.CreateLogger();

            webApplicationBuilder.Host.UseSerilog(Log.Logger);
        }
    }
}
