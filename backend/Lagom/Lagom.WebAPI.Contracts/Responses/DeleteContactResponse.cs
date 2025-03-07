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
    public class DeleteContactResponse : APIResponse
    {
        public required int ContactId { get; set; }

        [SetsRequiredMembers]
        public DeleteContactResponse(int contactId, BusinessServiceResponseStatus businessServiceStatus, string[] businessServiceMessages) : base(businessServiceStatus, businessServiceMessages)
        {
            ContactId = contactId;
        }
    }
}
