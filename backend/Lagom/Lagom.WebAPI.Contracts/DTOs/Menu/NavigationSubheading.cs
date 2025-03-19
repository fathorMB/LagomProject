using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.WebAPI.Contracts.DTOs.Menu
{
    public class NavigationSubheading : NavigationItem
    {
        public NavigationSubheading()
        {
            Type = "subheading";
            Children = new List<NavigationItem>();
        }
    }
}
