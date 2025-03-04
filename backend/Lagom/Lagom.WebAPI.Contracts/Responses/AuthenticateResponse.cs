﻿using Lagom.WebAPI.Contracts.Abstractions;
using Lagom.WebAPI.Contracts.DTOs;
using System.Diagnostics.CodeAnalysis;

namespace Lagom.WebAPI.Contracts.Responses
{
    public class AuthenticateResponse : APIResponse
    {
        public required UserContract User { get; set; }
        public required string Token { get; set; }

        [SetsRequiredMembers]
        public AuthenticateResponse(APIRequest request, UserContract user, string token, BusinessServiceResponseStatus businessServiceStatus, string[] businessServiceMessages) : base(request, businessServiceStatus, businessServiceMessages)
        {
            User = user;
            Token = token;
        }
    }
}
