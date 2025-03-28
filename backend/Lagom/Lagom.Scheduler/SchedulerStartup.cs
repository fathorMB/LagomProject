using Lagom.Scheduler.Jobs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Quartz;
using Quartz.AspNetCore;
using static Quartz.Logging.OperationName;

namespace Lagom.Scheduler
{
    public static class SchedulerStartup
    {
        public static void AddServices(IHostApplicationBuilder builder)
        {
            builder.Services.AddQuartz(q =>
            {
                // base Quartz scheduler, job and trigger configuration
                q.SchedulerId = "Scheduler-Core";
                q.SchedulerName = "Lagom Core Job Scheduler";

                // these are the defaults
                q.UseSimpleTypeLoader();
                //q.UseInMemoryStore();
                q.UseDefaultThreadPool(tp =>
                {
                    tp.MaxConcurrency = 5;
                });

                // Define the job and give it a unique key
                var jobKey = new JobKey("ExampleJob");
                q.AddJob<ExampleJob>(opts => opts.WithIdentity(jobKey).StoreDurably());

                // Configure the job store
                q.UsePersistentStore(s =>
                {
                    s.UseProperties = true;
                    s.UseSqlServer(sqlServer =>
                    {
                        sqlServer.ConnectionString = builder.Configuration.GetConnectionString("LagomDBConnectionString");
                        sqlServer.TablePrefix = "QRTZ_";
                    });
                    s.UseNewtonsoftJsonSerializer();
                });
            });

            // ASP.NET Core hosting
            builder.Services.AddQuartzServer(options =>
            {
                options.AwaitApplicationStarted = true;
                // when shutting down we want jobs to complete gracefully
                options.WaitForJobsToComplete = true;
            });
        }
    }
}
