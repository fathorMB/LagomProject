using Lagom.Model.Abstracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.Model.Domain
{
    public class ComplexProduct : LagomDBEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<ComplexProductComponent> Components { get; set; }
    }
}
