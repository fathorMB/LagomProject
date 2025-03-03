using Lagom.WebAPI.Contracts.Abstractions;
using Lagom.WebAPI.Contracts.DTOs;
using Lagom.WebAPI.Contracts.Requests;
using System.Diagnostics.CodeAnalysis;

namespace Lagom.WebAPI.Contracts.Responses
{
    public class CreateUserResponse : APIResponse
    {
        public required UserContract User { get; set; }

        [SetsRequiredMembers]
        public CreateUserResponse(CreateUserRequest request, UserContract user) : base(request)
        {
            User = user;
        }
    }
}
