using Lagom.WebAPI.Contracts.Abstractions;

namespace Lagom.WebAPI.Contracts.Requests
{
    public class CreateFileRequest : APIRequest
    {
        public required string CorrelationId { get; set; }
    }
}
