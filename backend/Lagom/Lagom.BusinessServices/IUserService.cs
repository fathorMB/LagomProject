﻿using Lagom.WebAPI.Contracts.DTOs;
using Lagom.WebAPI.Contracts.Requests;
using Lagom.WebAPI.Contracts.Responses;

namespace Lagom.BusinessServices
{
    public interface IUserService
    {
        Task<AuthenticateResponse> Authenticate(AuthenticateRequest request);
        Task<CreateUserResponse> AddUser(CreateUserRequest request);
        Task<BusinessServiceResponse> DeleteUser(int userId);
        Task<BusinessServiceResponse> ChangePassword(ChangePasswordRequest request);

        Task<IEnumerable<UserContract>> GetAll();
        Task<UserContract> GetById(int id);
    }
}
