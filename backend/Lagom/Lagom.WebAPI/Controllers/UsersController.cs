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
        private IMessageTranslationService _messageTranslationService;

        private string _credentialsRequiredMessageCode = "login.credentials.required";
        private string _credentialsInvalidMessageCode = "login.credentials.invalid";
        private string _userCreationErrorMessageCode = "user.creation.error";

        public UsersController(IUserService userService, IMessageTranslationService messageTranslationService)
        {
            _userService = userService;
            _messageTranslationService = messageTranslationService;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate(AuthenticateRequest request)
        {
            if (request == null)
                return BadRequest();

            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(await _messageTranslationService.GetMessageAsync(_credentialsRequiredMessageCode, request.AppLanguageId));
            }

            var response = await _userService.Authenticate(request);

            if (response == null)
                return BadRequest(await _messageTranslationService.GetMessageAsync(_credentialsInvalidMessageCode, request.AppLanguageId));

            return Ok(response);
        }

        // POST api/<CustomerController>
        [HttpPost]
        [Authorize(1)]
        [ProducesResponseType<CreateUserResponse>(200)]
        public async Task<IActionResult> Post([FromBody] CreateUserRequest request)
        {
            request.User.Id = 0;

            var createdUser = await _userService.AddUser(request);

            if (createdUser == null)
                return BadRequest(await _messageTranslationService.GetMessageAsync(_userCreationErrorMessageCode, request.AppLanguageId));

            return Ok(await _userService.AddUser(request));
        }
    }
}
