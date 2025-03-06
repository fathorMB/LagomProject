using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.WebAPI.Contracts.HubMessages
{
    public class ProbeMessage
    {
        public bool ScramActive { get; set; }
        public DateTime ServerDateTime { get; set; }
        public string APIVersion { get; set; }
    }
}
