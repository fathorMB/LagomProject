using Lagom.Model.Abstracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.Model
{
    public class Contact : LagomDBEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Nick { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}
