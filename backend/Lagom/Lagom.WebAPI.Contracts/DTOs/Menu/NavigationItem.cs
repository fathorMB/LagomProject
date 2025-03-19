using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.WebAPI.Contracts.DTOs.Menu
{
    public class NavigationItem
    {
        public string Type { get; set; }
        public string Label { get; set; }
        public string Icon { get; set; }
        public string Route { get; set; }
        public List<NavigationItem> Children { get; set; }
    }
}
