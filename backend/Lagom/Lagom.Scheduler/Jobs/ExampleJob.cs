using Quartz;

namespace Lagom.Scheduler.Jobs
{
    public class ExampleJob : IJob
    {
        public Task Execute(IJobExecutionContext context)
        {
            throw new NotImplementedException();
        }
    }
}
