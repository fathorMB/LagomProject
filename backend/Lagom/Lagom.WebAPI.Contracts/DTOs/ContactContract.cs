using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.WebAPI.Contracts.DTOs
{
    public class ContactContract
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Nick { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}
