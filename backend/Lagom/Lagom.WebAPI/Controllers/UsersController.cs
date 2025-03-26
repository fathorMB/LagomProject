using Lagom.BusinessServices;
using Lagom.BusinessServices.EFCore;
using Lagom.WebAPI.Contracts.Abstractions;
using Lagom.WebAPI.Contracts.Requests;
using Lagom.WebAPI.Contracts.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Lagom.WebAPI.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IUserService _userService;

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

        [HttpPost("change-password")]
        [Authorize(1)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (request == null)
                return BadRequest();

            return Ok(await _userService.ChangePassword(request));
        }

        [HttpGet("all")]
        [Authorize(1)]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _userService.GetAll());
        }

        [HttpDelete]
        [Authorize(1)]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (id == default)
                return BadRequest();

            return Ok(await _userService.DeleteUser(id));
        }

        [HttpPost]
        [Authorize(1)]
        [ProducesResponseType<CreateUserResponse>(200)]
        public async Task<IActionResult> AddUser([FromBody] CreateUserRequest request)
        {
            request.User.Id = 0;

            return Ok(await _userService.AddUser(request));
        }

        [HttpPut]
        [Authorize(1)]
        [ProducesResponseType<UpdateUserResponse>(200)]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest request)
        {
            if (request == null)
                return BadRequest();

            return Ok(await _userService.UpdateUser(request));
        }

        [HttpGet("claims")]
        [Authorize(1)]
        public async Task<IActionResult> GetAllClaims()
        {
            return Ok(await _userService.GetAllClaims());
        }

        [HttpGet("enable")]
        [Authorize(1)]
        [ProducesResponseType<UserToggleEnableResponse>(200)]
        public async Task<IActionResult> EnableUser(int id)
        {
            if (id == default)
                return BadRequest();

            return Ok(await _userService.EnableUser(id));
        }

        [HttpGet("disable")]
        [Authorize(1)]
        [ProducesResponseType<UserToggleEnableResponse>(200)]
        public async Task<IActionResult> DisableUser(int id)
        {
            if (id == default)
                return BadRequest();

            return Ok(await _userService.DisableUser(id));
        }
    }
}
