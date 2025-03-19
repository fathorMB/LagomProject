using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.WebAPI.Contracts.DTOs.Menu
{
    public class NavigationLink : NavigationItem
    {
        public NavigationLink()
        {
            Type = "link";
        }
    }

    public class RouterLinkActiveOptions
    {
        public bool Exact { get; set; }
    }

    public class Badge
    {
        public string Value { get; set; }
        public string BgClass { get; set; }
        public string TextClass { get; set; }
    }
}
