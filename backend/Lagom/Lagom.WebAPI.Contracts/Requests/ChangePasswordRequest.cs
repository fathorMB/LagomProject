using Lagom.WebAPI.Contracts.Abstractions;
using System.ComponentModel.DataAnnotations;

namespace Lagom.WebAPI.Contracts.Requests
{
    public class ChangePasswordRequest : APIRequest
    {
        [Required]
        public required int UserId { get; set; }

        [Required]
        public required string NewPassword { get; set; }
    }
}
