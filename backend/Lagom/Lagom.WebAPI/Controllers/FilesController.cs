using Lagom.BusinessServices;
using Lagom.WebAPI.Contracts.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Lagom.WebAPI.Controllers
{
    [Route("api/files")]
    [ApiController]
    [Authorize(3)]
    public class FilesController : ControllerBase
    {
        private readonly IFileService _fileService;

        public FilesController(IFileService fileService)
        {
            _fileService = fileService;
        }

        // GET: api/files/{id}
        [HttpGet]
        public async Task<IActionResult> Download(int id)
        {
            var fileContract = await _fileService.GetFileById(id);
            if (fileContract == null)
                return NotFound("File not found.");

            // Stream the blob content directly. You might consider adding caching or range support.
            var blobClient = new Azure.Storage.Blobs.BlobClient(fileContract.BlobUrl);
            var downloadInfo = await blobClient.DownloadAsync();

            return File(downloadInfo.Value.Content, fileContract.ContentType, fileContract.FileName);
        }

        // GET: api/files/byCorrelation/{correlationId}
        [HttpGet("byCorrelation")]
        public async Task<IActionResult> GetByCorrelation(string correlationId)
        {
            var files = await _fileService.GetFilesByCorrelationId(correlationId);
            if (files == null || !files.Any())
                return NotFound("No files found with the given correlation id.");

            return Ok(files);
        }

        // POST: api/files/upload
        // This endpoint expects multipart/form-data with a file and a correlationId field.
        [HttpPost("upload")]
        [ProducesResponseType(typeof(CreateFileResponse), 200)]
        public async Task<IActionResult> Upload(IFormFile file, string correlationId)
        {
            if (file == null || string.IsNullOrWhiteSpace(correlationId))
                return BadRequest("File and correlationId are required.");

            var response = await _fileService.UploadFile(file, correlationId);
            return Ok(response);
        }

        // DELETE: api/files/{id}
        [HttpDelete]
        [ProducesResponseType(typeof(BusinessServiceResponse), 200)]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _fileService.DeleteFile(id);
            return Ok(response);
        }

        // DELETE: api/files/byCorrelation/{correlationId}
        [HttpDelete("byCorrelation")]
        [ProducesResponseType(typeof(BusinessServiceResponse), 200)]
        public async Task<IActionResult> DeleteByCorrelation(string correlationId)
        {
            var response = await _fileService.DeleteFilesByCorrelationId(correlationId);
            return Ok(response);
        }
    }
}
