using Lagom.WebAPI.Contracts.Abstractions;
using Lagom.WebAPI.Contracts.Requests;
using System.Diagnostics.CodeAnalysis;

namespace Lagom.WebAPI.Contracts.Responses
{
    public class DeleteFilesByCorrelationResponse : APIResponse
    {
        public required string CorrelationId { get; set; }

        [SetsRequiredMembers]
        public DeleteFilesByCorrelationResponse(string correlationId, BusinessServiceResponseStatus businessServiceStatus, string[] businessServiceMessages)
            : base(businessServiceStatus, businessServiceMessages)
        {
            CorrelationId = correlationId;
        }
    }
}
