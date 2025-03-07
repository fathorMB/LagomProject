using Lagom.WebAPI.Contracts.Abstractions;
using Lagom.WebAPI.Contracts.DTOs;
using Lagom.WebAPI.Contracts.Requests;
using System.Diagnostics.CodeAnalysis;

namespace Lagom.WebAPI.Contracts.Responses
{
    public class CreateFileResponse : APIResponse
    {
        public required FileContract File { get; set; }

        [SetsRequiredMembers]
        public CreateFileResponse(CreateFileRequest request, FileContract file, BusinessServiceResponseStatus businessServiceStatus, string[] businessServiceMessages)
            : base(request, businessServiceStatus, businessServiceMessages)
        {
            File = file;
        }
    }
}
