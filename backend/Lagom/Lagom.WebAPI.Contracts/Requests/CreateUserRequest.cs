using Lagom.WebAPI.Contracts.Abstractions;
using Lagom.WebAPI.Contracts.DTOs;

namespace Lagom.WebAPI.Contracts.Requests
{
    public class CreateUserRequest : APIRequest
    {
        public required UserContract User { get; set; }

        public required string Password { get; set; }
    }
}
