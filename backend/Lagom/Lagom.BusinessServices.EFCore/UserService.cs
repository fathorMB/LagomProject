using AutoMapper;
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
using System.Text;

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

        public async Task<AuthenticateResponse> Authenticate(AuthenticateRequest model)
        {
            string passwordHash = MD5Encoder.CreateMD5(model.Password);

            var user = await _db.Users.SingleOrDefaultAsync(x => x.Username == model.Username && x.AccessKeyHash == passwordHash);

            // return null if user not found
            if (user == null) return new AuthenticateResponse(model, null, string.Empty, BusinessServiceResponseStatus.Error, new string[] { "Authentication failed." });

            // authentication successful so generate jwt token
            var token = await GenerateJwtToken(user);
            var mapUser = await GetByIdInternal(user.Id);

            if (mapUser == null) return new AuthenticateResponse(model, null, string.Empty, BusinessServiceResponseStatus.CompletedWithErrors, new string[] { "Something went wrong. Please contact system administrator." });

            return new AuthenticateResponse(model, mapUser, token, BusinessServiceResponseStatus.Completed, new string[] {"Authentication successful."});
        }

        public async Task<IEnumerable<UserContract>> GetAll()
        {
            List<UserContract> result = new List<UserContract>();

            foreach (var userId in _db.Users.Select(u => u.Id))
            {
                result.Add(await GetByIdInternal(userId));
            }

            return result;
        }

        public async Task<UserContract> GetById(int id)
        {
            return await GetByIdInternal(id);
        }

        public async Task<CreateUserResponse> AddUser(CreateUserRequest request)
        {
            var duplicate = await _db.Users.FirstOrDefaultAsync(x => x.Username == request.User.Username);

            if (duplicate != null)
            {
                return new CreateUserResponse(request, new UserContract(), BusinessServiceResponseStatus.Error, new string[] { $"A User with username {request.User.Username} already exists." }); ;
            }

            try
            {
                await _db.Users.AddAsync(new User()
                {
                    AccessKeyHash = MD5Encoder.CreateMD5(request.Password),
                    FirstName = request.User.FirstName,
                    LastName = request.User.LastName,
                    Username = request.User.Username,
                    IsActive = true
                });

                await _db.SaveChangesAsync();

                return new CreateUserResponse(request, _mapper.Map<UserContract>(await _db.Users.FirstOrDefaultAsync(x => x.Username == request.User.Username)), BusinessServiceResponseStatus.Completed, new string[] { $"A User with username {request.User.Username} has been created." });
            }
            catch (Exception ex)
            {
                return new CreateUserResponse(request, new UserContract(), BusinessServiceResponseStatus.Error, new string[] { "An error occurred while creating the User.", ex.Message });
            }
        }
        // helper methods
        private async Task<string> GenerateJwtToken(User user)
        {
            //Generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = await Task.Run(() =>
            {
                var key = Encoding.ASCII.GetBytes(_appSettings.JWTSecret);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[] { new System.Security.Claims.Claim("id", user.Id.ToString()) }),
                    Expires = DateTime.UtcNow.AddMinutes(_appSettings.JWTTokenExpirationInMinutes),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                    Issuer = _appSettings.JWTIssuer,
                    Audience = _appSettings.JWTAudience
                };
                return tokenHandler.CreateToken(tokenDescriptor);
            });

            return tokenHandler.WriteToken(token);
        }

        private async Task<UserContract?> GetByIdInternal(int id)
        {
            var dbUser = await _db.Users.Include(u => u.UsersClaims).FirstOrDefaultAsync(x => x.Id == id);

            if (dbUser != null)
            {
                var user = _mapper.Map<UserContract>(dbUser);

                user.Claims = new List<ClaimContract>();

                var dbUserClaims = _db.Claims.Where(c => dbUser.UsersClaims.Select(uc => uc.ClaimId).Contains(c.Id));

                await dbUserClaims.ForEachAsync(uc => user.Claims.Add(_mapper.Map<ClaimContract>(uc)));

                return user;
            }

            return null;
        }
    }
}
