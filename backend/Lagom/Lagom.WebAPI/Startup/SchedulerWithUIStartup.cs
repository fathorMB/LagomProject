using CrystalQuartz.AspNetCore;
using Quartz;

namespace Lagom.WebAPI.Startup
{
    public static class SchedulerWithUIStartup
    {
        public static void Configure(WebApplication webApplication)
        {
            // Retrieve the scheduler instance from the DI container
            var schedulerFactory = webApplication.Services.GetRequiredService<ISchedulerFactory>();
            var scheduler = schedulerFactory.GetScheduler().Result;

            webApplication.UseCrystalQuartz(() => scheduler);
        }
    }
}
