using Quartz;
using System.Diagnostics;

namespace Lagom.Scheduler.Jobs
{
    public class ExampleJob : IJob
    {
        public Task Execute(IJobExecutionContext context)
        {
            Debug.WriteLine("RUN EXAMPLE JOB");
            return Task.CompletedTask;
        }
    }
}
