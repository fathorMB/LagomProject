﻿using Lagom.BusinessServices;
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
            var response = await _userService.ChangePassword(request);

            if (response.BusinessServiceStatus == BusinessServiceResponseStatus.Error)
            {
                return BadRequest(response.BusinessServiceMessages);
            }

            return Ok(response.BusinessServiceMessages);
        }

        [HttpDelete]
        [Authorize(1)]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var response = await _userService.DeleteUser(userId);

            if (response.BusinessServiceStatus == BusinessServiceResponseStatus.Error)
            {
                return BadRequest(response.BusinessServiceMessages);
            }

            return Ok(response.BusinessServiceMessages);
        }

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
