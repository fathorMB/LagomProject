using AutoMapper;
using Azure.Core;
using Lagom.BusinessServices.EFCore.DataValidation;
using Lagom.BusinessServices.EFCore.DataValidation.Abstracts;
using Lagom.BusinessServices.EFCore.DataValidation.Validators;
using Lagom.Common;
using Lagom.Common.Helpers;
using Lagom.Model;
using Lagom.WebAPI.Contracts.Abstractions;
using Lagom.WebAPI.Contracts.DTOs;
using Lagom.WebAPI.Contracts.Requests;
using Lagom.WebAPI.Contracts.Responses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SGBackend.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Claim = Lagom.Model.Claim;

namespace Lagom.BusinessServices.EFCore
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;
        private readonly LagomDbContext _db;

        public UserService(IOptions<AppSettings> appSettings, LagomDbContext db, IMapper mapper)
        {
            _appSettings = appSettings.Value;
            _db = db;
            _mapper = mapper;
        }

        public async Task<BusinessServiceResponse> ChangePassword(ChangePasswordRequest request)
        {
            var user = await _db.Users.FindAsync(request.UserId);

            if (user == null)
            {
                return new BusinessServiceResponse(request, BusinessServiceResponseStatus.Error, new string[] { "User not found." });
            }

            user.AccessKeyHash = HashPassword(request.NewPassword);
            await _db.SaveChangesAsync();

            return new BusinessServiceResponse(request, BusinessServiceResponseStatus.Completed, new string[] { "Password changed successfully." });
        }

        public async Task<BusinessServiceResponse> DeleteUser(int userId)
        {
            var user = await _db.Users.FindAsync(userId);

            if (user == null)
            {
                return new BusinessServiceResponse(BusinessServiceResponseStatus.Error, new string[] { "User not found." });
            }

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            return new BusinessServiceResponse(BusinessServiceResponseStatus.Completed, new string[] { "User deleted successfully." });
        }

        public async Task<AuthenticateResponse> Authenticate(AuthenticateRequest model)
        {
            string passwordHash = HashPassword(model.Password);

            var user = await _db.Users.SingleOrDefaultAsync(x => x.Username == model.Username && x.AccessKeyHash == passwordHash);

            if (user == null) return new AuthenticateResponse(model, null, string.Empty, BusinessServiceResponseStatus.Error, new string[] { "Authentication failed." });

            var token = await GenerateJwtToken(user);
            var mapUser = await GetByIdInternal(user.Id);

            if (mapUser == null) return new AuthenticateResponse(model, null, string.Empty, BusinessServiceResponseStatus.CompletedWithErrors, new string[] { "Something went wrong. Please contact system administrator." });

            return new AuthenticateResponse(model, mapUser, token, BusinessServiceResponseStatus.Completed, new string[] { "Authentication successful." });
        }

        public async Task<IEnumerable<UserContract>> GetAll()
        {
            var users = await _db.Users.Include(u => u.UsersClaims).ThenInclude(uc => uc.Claim).ToListAsync();
            return _mapper.Map<IEnumerable<UserContract>>(users);
        }

        public async Task<UserContract> GetById(int id)
        {
            return await GetByIdInternal(id);
        }

        public async Task<UpdateUserResponse> UpdateUser(UpdateUserRequest request)
        {
            var userEntity = await _db.Users.Include(u => u.UsersClaims).FirstOrDefaultAsync(u => u.Id == request.User.Id);

            if (userEntity == null)
                return new UpdateUserResponse(request, new UserContract(), BusinessServiceResponseStatus.Error, new string[] { "User not found." });

            userEntity.UsersClaims.Clear();

            if (request.User.Claims.Any())
            {
                userEntity.UsersClaims = request.User.Claims.Select(claim => new UsersClaims
                {
                    ClaimId = claim.Id,
                    UserId = userEntity.Id
                }).ToList();
            }

            _db.Users.Update(userEntity);
            await _db.SaveChangesAsync();

            var mapUser = await GetByIdInternal(userEntity.Id);

            return new UpdateUserResponse(request, mapUser, BusinessServiceResponseStatus.Completed, new string[] { "User updated." });
        }

        public async Task<CreateUserResponse> AddUser(CreateUserRequest request)
        {
            var userEntity = new User
            {
                AccessKeyHash = HashPassword(request.Password),
                Username = request.User.Username,
                FirstName = request.User.FirstName,
                LastName = request.User.LastName,
                IsActive = request.User.IsActive
            };

            var userValidator = new UserValidator();
            var userValidationResult = await userValidator.Validate(DataValidationContext.EntityCreation, userEntity, _db);

            if (userValidationResult.Status != LagomDBDataValidatorResultStatus.Success)
                return new CreateUserResponse(request, new UserContract(), BusinessServiceResponseStatus.Error, new string[] { userValidationResult.ValidationMessage });

            try
            {
                if (request.User.Claims.Any())
                {
                    userEntity.UsersClaims = request.User.Claims.Select(claim => new UsersClaims
                    {
                        ClaimId = claim.Id,
                        UserId = userEntity.Id
                    }).ToList();
                }

                await _db.Users.AddAsync(userEntity);
                await _db.SaveChangesAsync();

                var mapUser = await GetByIdInternal(userEntity.Id);

                return new CreateUserResponse(request, mapUser, BusinessServiceResponseStatus.Completed, new string[] { $"A User with username {request.User.Username} has been created." });
            }
            catch (Exception ex)
            {
                return new CreateUserResponse(request, new UserContract(), BusinessServiceResponseStatus.Error, new string[] { "An error occurred while creating the User.", ex.Message });
            }
        }

        private async Task<string> GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.JWTSecret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new System.Security.Claims.Claim("id", user.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddMinutes(_appSettings.JWTTokenExpirationInMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _appSettings.JWTIssuer,
                Audience = _appSettings.JWTAudience
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private async Task<UserContract?> GetByIdInternal(int id)
        {
            var dbUser = await _db.Users.Include(u => u.UsersClaims).ThenInclude(uc => uc.Claim).FirstOrDefaultAsync(x => x.Id == id);

            if (dbUser != null)
            {
                var user = _mapper.Map<UserContract>(dbUser);
                return user;
            }

            return null;
        }

        private async Task<UserContract> MapUser(User user)
        {
            var userContract = _mapper.Map<UserContract>(user);
            return userContract;
        }

        public async Task<IEnumerable<ClaimContract>> GetAllClaims()
        {
            return _mapper.Map<IEnumerable<ClaimContract>>(await _db.Claims.ToListAsync());
        }

        public async Task<UserToggleEnableResponse> EnableUser(int userId)
        {
            var userEntity = await _db.Users.FindAsync(userId);

            if (userEntity == null)
                return new UserToggleEnableResponse(new UserContract(), BusinessServiceResponseStatus.Error, new string[] { "User not found." });

            if (userEntity.IsActive)
                return new UserToggleEnableResponse(await MapUser(userEntity), BusinessServiceResponseStatus.Error, new string[] { "User is already enabled." });

            userEntity.IsActive = true;

            _db.Users.Update(userEntity);
            await _db.SaveChangesAsync();

            return new UserToggleEnableResponse(await GetByIdInternal(userId), BusinessServiceResponseStatus.Completed, new string[] { "User enabled successfully." });
        }

        public async Task<UserToggleEnableResponse> DisableUser(int userId)
        {
            var userEntity = await _db.Users.FindAsync(userId);

            if (userEntity == null)
                return new UserToggleEnableResponse(new UserContract(), BusinessServiceResponseStatus.Error, new string[] { "User not found." });

            if (!userEntity.IsActive)
                return new UserToggleEnableResponse(await MapUser(userEntity), BusinessServiceResponseStatus.Error, new string[] { "User is already disabled." });

            userEntity.IsActive = false;

            _db.Users.Update(userEntity);
            await _db.SaveChangesAsync();

            return new UserToggleEnableResponse(await GetByIdInternal(userId), BusinessServiceResponseStatus.Completed, new string[] { "User disabled successfully." });
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }
    }
}
