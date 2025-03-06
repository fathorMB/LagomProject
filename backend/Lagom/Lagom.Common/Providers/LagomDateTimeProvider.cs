using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.Common.Providers
{
    public class LagomDateTimeProvider : ILagomDateTimeProvider
    {
        private readonly AppSettings _appSettings;

        public LagomDateTimeProvider(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        public DateTime Now => DateTime.Now.AddHours(_appSettings.DateTimeProviderHoursOffset);
    }
}
