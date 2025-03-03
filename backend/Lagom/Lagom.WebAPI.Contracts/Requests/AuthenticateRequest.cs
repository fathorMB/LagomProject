using Lagom.WebAPI.Contracts.Abstractions;
using System.ComponentModel;

namespace Lagom.WebAPI.Contracts.Requests
{
    public class AuthenticateRequest : APIRequest
    {
        [DefaultValue("admin")]
        public required string Username { get; set; }

        [DefaultValue("admin")]
        public required string Password { get; set; }
    }
}
