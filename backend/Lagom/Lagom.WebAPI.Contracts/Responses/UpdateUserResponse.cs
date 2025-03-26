using Lagom.WebAPI.Contracts.Abstractions;
using Lagom.WebAPI.Contracts.DTOs;
using Lagom.WebAPI.Contracts.Requests;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.WebAPI.Contracts.Responses
{
    public class UpdateUserResponse : APIResponse
    {
        public required UserContract User { get; set; }

        [SetsRequiredMembers]
        public UpdateUserResponse(UpdateUserRequest request, UserContract user, BusinessServiceResponseStatus businessServiceStatus, string[] businessServiceMessages) : base(request, businessServiceStatus, businessServiceMessages)
        {
            User = user;
        }
    }
}
