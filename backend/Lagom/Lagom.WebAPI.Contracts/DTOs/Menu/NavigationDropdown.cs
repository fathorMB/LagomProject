using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.WebAPI.Contracts.DTOs.Menu
{
    public class NavigationDropdown : NavigationItem
    {
        public string Label { get; set; }
        public string? Icon { get; set; }
        public List<NavigationItem> Children { get; set; }
        public Badge? Badge { get; set; }

        public NavigationDropdown()
        {
            Type = "dropdown";
            Children = new List<NavigationItem>();
        }
    }
}
