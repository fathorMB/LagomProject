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
    public class UpdateContactResponse : APIResponse
    {
        public required ContactContract Contact { get; set; }

        [SetsRequiredMembers]
        public UpdateContactResponse(UpdateContactRequest request, ContactContract contact, BusinessServiceResponseStatus businessServiceStatus, string[] businessServiceMessages) : base(request, businessServiceStatus, businessServiceMessages)
        {
            Contact = contact;
        }
    }
}
