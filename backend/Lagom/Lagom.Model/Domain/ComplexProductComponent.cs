using Lagom.Model.Abstracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.Model.Domain
{
    public class ComplexProductComponent : LagomDBEntity
    {
        public int ComplexProductId { get; set; }
        public ComplexProduct ComplexProduct { get; set; }

        public int BasicProductId { get; set; }
        public BasicProduct BasicProduct { get; set; }

        public decimal Quantity { get; set; } // Quantity of the basic product in the complex product
    }
}
