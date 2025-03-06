using Lagom.BusinessServices;
using Lagom.WebAPI.Contracts.Requests;
using Lagom.WebAPI.Contracts.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Lagom.WebAPI.Controllers
{
    [Route("api/users")] //    /api/Users
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IUserService _userService;

        private string _credentialsRequiredMessageCode = "login.credentials.required";
        private string _credentialsInvalidMessageCode = "login.credentials.invalid";
        private string _userCreationErrorMessageCode = "user.creation.error";

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate(AuthenticateRequest request)
        {
            if (request == null)
                return BadRequest();

            return Ok(await _userService.Authenticate(request));
        }

        // POST api/<CustomerController>
        [HttpPost]
        [Authorize(1)]
        [ProducesResponseType<CreateUserResponse>(200)]
        public async Task<IActionResult> Post([FromBody] CreateUserRequest request)
        {
            request.User.Id = 0;

            return Ok(await _userService.AddUser(request));
        }
    }
}
