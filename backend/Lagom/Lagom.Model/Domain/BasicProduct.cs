using Lagom.Model.Abstracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.Model.Domain
{
    public class BasicProduct : LagomDBEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Unit { get; set; } // e.g., kg, liter, piece
        public decimal Quantity { get; set; }
    }
}
