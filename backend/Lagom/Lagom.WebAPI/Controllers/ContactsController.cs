using Lagom.BusinessServices;
using Lagom.WebAPI.Contracts.Requests;
using Lagom.WebAPI.Contracts.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lagom.WebAPI.Controllers
{
    [Route("api/contacts")]
    [ApiController]
    [Authorize(3)]
    public class ContactsController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactsController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _contactService.GetAll());
        }

        [HttpGet]
        public async Task<IActionResult> Get(int id)
        {
            if (id == default)
                return BadRequest();

            return Ok(await _contactService.GetById(id));
        }

        [HttpPost]
        [ProducesResponseType<CreateContactResponse>(200)]
        public async Task<IActionResult> Create(CreateContactRequest request)
        {
            if (request == null)
                return BadRequest();

            return Ok(await _contactService.CreateContact(request));
        }

        [HttpPut]
        [ProducesResponseType<UpdateContactResponse>(200)]
        public async Task<IActionResult> Update(UpdateContactRequest request)
        {
            if (request == null)
                return BadRequest();

            return Ok(await _contactService.UpdateContact(request));
        }

        [HttpDelete]
        [ProducesResponseType<BusinessServiceResponse>(200)]
        public async Task<IActionResult> Update(int id)
        {
            if (id == default)
                return BadRequest();

            return Ok(await _contactService.DeleteContact(id));
        }
    }
}
