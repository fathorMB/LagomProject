using Lagom.WebAPI.Contracts.Abstractions;
using Lagom.WebAPI.Contracts.Requests;
using System.Diagnostics.CodeAnalysis;

namespace Lagom.WebAPI.Contracts.Responses
{
    public class DeleteFileResponse : APIResponse
    {
        public required int FileId { get; set; }

        [SetsRequiredMembers]
        public DeleteFileResponse(int fileId, BusinessServiceResponseStatus businessServiceStatus, string[] businessServiceMessages)
            : base(businessServiceStatus, businessServiceMessages)
        {
            FileId = fileId;
        }
    }
}
