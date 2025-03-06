using Lagom.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lagom.WebAPI.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(1)]
    public class AdminController : ControllerBase
    {
        [HttpPost("scram/activate")]
        public IActionResult ActivateScram()
        {
            ScramMode.Activate();
            return Ok("SCRAM mode activated. Database writes are now disabled.");
        }

        [HttpPost("scram/deactivate")]
        public IActionResult DeactivateScram()
        {
            ScramMode.Deactivate();
            return Ok("SCRAM mode deactivated. Database writes are now enabled.");
        }
    }

}
