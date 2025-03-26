using Lagom.WebAPI.Contracts.Abstractions;
using Lagom.WebAPI.Contracts.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.WebAPI.Contracts.Requests
{
    public class UpdateUserRequest : APIRequest
    {
        public required UserContract User { get; set; }
    }
}
