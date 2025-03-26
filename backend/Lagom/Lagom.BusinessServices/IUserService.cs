using Lagom.WebAPI.Contracts.DTOs;
using Lagom.WebAPI.Contracts.Requests;
using Lagom.WebAPI.Contracts.Responses;

namespace Lagom.BusinessServices
{
    public interface IUserService
    {
        Task<AuthenticateResponse> Authenticate(AuthenticateRequest request);
        Task<CreateUserResponse> AddUser(CreateUserRequest request);
        Task<UpdateUserResponse> UpdateUser(UpdateUserRequest request);
        Task<UserToggleEnableResponse> EnableUser(int userId);
        Task<UserToggleEnableResponse> DisableUser(int userId);
        Task<BusinessServiceResponse> DeleteUser(int userId);
        Task<BusinessServiceResponse> ChangePassword(ChangePasswordRequest request);

        Task<IEnumerable<ClaimContract>> GetAllClaims();
        Task<IEnumerable<UserContract>> GetAll();
        Task<UserContract> GetById(int id);
    }
}
