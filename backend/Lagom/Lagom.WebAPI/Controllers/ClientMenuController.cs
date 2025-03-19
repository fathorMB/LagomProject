using Lagom.BusinessServices;
using Lagom.WebAPI.Contracts.DTOs;
using Lagom.WebAPI.Contracts.DTOs.Menu;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lagom.WebAPI.Controllers
{
    [Route("api/menu")]
    [ApiController]
    [Authorize]
    public class ClientMenuController : ControllerBase
    {
        private readonly IClientNavigationService _clientNavigationService;

        public ClientMenuController(IClientNavigationService clientNavigationService)
        {
            _clientNavigationService = clientNavigationService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(NavigationItem[]), StatusCodes.Status200OK)]
        public async Task<IActionResult> Get()
        {
            var user = (UserContract?)HttpContext.Items["User"];
            var userHighestClaimId = user?.Claims.Max(c => c.Id) ?? 0;

            var navigationItems = await _clientNavigationService.GetNavigationItems(userHighestClaimId);

            return Ok(navigationItems);
        }
    }
}
