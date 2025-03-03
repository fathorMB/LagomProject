using Microsoft.AspNetCore.Mvc;

namespace Lagom.WebAPI.Controllers
{
    [Route("api/example")]
    [ApiController]
    [Authorize(2)]
    public class ExampleController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Hello World");
        }
    }
}
