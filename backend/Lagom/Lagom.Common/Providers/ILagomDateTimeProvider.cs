using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.Common.Providers
{
    public interface ILagomDateTimeProvider
    {
        DateTime Now { get; }
    }
}
